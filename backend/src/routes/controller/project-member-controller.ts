import { isMemberPrivileged } from "../../utils";
import { Request, Response } from "express";
import {
  ProjectMember,
  ProjectMemberRole,
  ProjectMemberRoleLevel,
  ProjectMemberStatus
} from "../../entity/ProjectMember";
import HttpStatus from "http-status-codes";
import {
  accountNotFoundError,
  alreadyProjectMemberError,
  couldNotSendEmailError,
  inactiveAccountError,
  insufficientPrivilegesError,
  mailTokenNotFoundError,
  resourceNotFoundError
} from "../errors";
import { MailRequestType, MailToken, ProjectInvitationPayload } from "../../entity/MailToken";
import { User, UserStatus } from "../../entity/User";
import { TokenPayload } from "../middleware/auth-middleware";
import Mail from "nodemailer/lib/mailer";
import { Project } from "../../entity/Project";

async function sendProjectInvitationMail(
  mailer: Mail,
  mailToken: MailToken,
  inviter: ProjectMember
) {
  const invitationCallbackUrl =
    process.env.TIMEIT_FRONTEND_URL +
    `/project/${inviter.project.id}/accept-invite/${mailToken.id}`;
  return await mailer.sendMail({
    from: "\"Jaime de TimeIt\" <jaime@jamezrin.name>",
    to: mailToken.emailAddress,
    subject: `Invitación al proyecto ${inviter.project.name}`,
    text: `
    Te han invitado al proyecto ${inviter.project.name}, accede a ${invitationCallbackUrl} para aceptar la invitación.
    Si no quieres aceptar esta invitación, simplemente ignora este correo electrónico.`,
    html: `
    <p>Te han invitado al proyecto ${inviter.project.name}, puedes <a href="${invitationCallbackUrl}">aceptar la invitación</a>.</p>
    <p>Si no quieres aceptar esta invitación, simplemente ignora este correo electrónico</p>`
  });
}

async function checkProjectMember(project: Project, emailAddress: string): Promise<boolean> {
  const projectMember = await ProjectMember.createQueryBuilder("projectMember")
    .leftJoin("projectMember.user", "user")
    .where("projectMember.project = :projectId", { projectId: project.id })
    .andWhere("user.emailAddress = :emailAddress", { emailAddress })
    .getOne();

  return !!projectMember;
}

const projectMemberController = {
  async listMembers(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { projectId } = req.params;
    const { exclude } = req.query;

    const currentProjectMember = await ProjectMember.createQueryBuilder("projectMember")
      .where("projectMember.project = :projectId", { projectId })
      .andWhere("projectMember.user = :currentUserId", { currentUserId })
      .leftJoinAndSelect("projectMember.project", "project")
      .leftJoinAndSelect("project.members", "members")
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    const allProjectMembersQueryBuilder = ProjectMember.createQueryBuilder("projectMember")
      .where("projectMember.project = :projectId", { projectId })
      .leftJoinAndSelect("projectMember.user", "user")
      .select(["projectMember"]);

    const exclusions = [].concat(exclude);
    if (!exclusions.includes("user")) {
      allProjectMembersQueryBuilder.addSelect([
        "user.id",
        "user.createdAt",
        "user.firstName",
        "user.lastName",
        "user.emailAddress"
      ]);
    }

    const allProjectMembers = await allProjectMembersQueryBuilder.getMany();

    res.status(HttpStatus.OK).json(allProjectMembers);
  },
  inviteMember(mailer: Mail) {
    return async function(req: Request, res: Response) {
      const tokenPayload = res.locals.tokenPayload as TokenPayload;
      const currentUserId = tokenPayload.userId;
      const { projectId } = req.params;
      const { emailAddress } = req.body;

      // Current user as a member of the current project
      const inviterProjectMember = await ProjectMember.createQueryBuilder("projectMember")
        .leftJoinAndSelect("projectMember.project", "project")
        .where("projectMember.project = :projectId", { projectId })
        .andWhere("projectMember.user = :currentUserId", { currentUserId })
        .getOne();

      if (!inviterProjectMember) {
        return resourceNotFoundError(req, res);
      }

      if (!isMemberPrivileged(inviterProjectMember)) {
        return insufficientPrivilegesError(req, res);
      }

      const invitedUser = await User.findOne({
        emailAddress
      });

      if (!invitedUser) {
        return accountNotFoundError(req, res);
      }

      if (invitedUser.status !== UserStatus.ACTIVE) {
        return inactiveAccountError(req, res);
      }

      if (await checkProjectMember(inviterProjectMember.project, emailAddress)) {
        return alreadyProjectMemberError(req, res);
      }

      const inviteeProjectMember = new ProjectMember();
      inviteeProjectMember.status = ProjectMemberStatus.INVITED;
      inviteeProjectMember.project = inviterProjectMember.project;
      inviteeProjectMember.role = ProjectMemberRole.EMPLOYEE;
      inviteeProjectMember.user = invitedUser;
      await inviteeProjectMember.save();

      const mailToken = new MailToken();
      mailToken.type = MailRequestType.PROJECT_INVITE;
      mailToken.emailAddress = emailAddress;
      mailToken.expiresIn = -1;
      mailToken.payload = {
        projectId: inviterProjectMember.project.id,
        inviterId: inviterProjectMember.id,
        inviteeId: inviteeProjectMember.id
      };

      await mailToken.save();

      // Sends the actual project invite email with the token
      try {
        await sendProjectInvitationMail(mailer, mailToken, inviterProjectMember);
      } catch (err) {
        console.log(err);
        return couldNotSendEmailError(req, res);
      }

      res.sendStatus(HttpStatus.ACCEPTED);
    };
  },
  async acceptInvite(req: Request, res: Response) {
    const { token } = req.params;

    const mailToken = await MailToken.findOne({
      where: {
        id: token,
        type: MailRequestType.PROJECT_INVITE
      }
    });

    if (!mailToken) {
      return mailTokenNotFoundError(req, res);
    }

    const mailTokenPayload = mailToken.payload as ProjectInvitationPayload;
    const projectMember = await ProjectMember.createQueryBuilder("projectMember")
      .leftJoin("projectMember.user", "user")
      .where("user.emailAddress = :emailAddress", {
        emailAddress: mailToken.emailAddress
      })
      .andWhere("projectMember.id = :memberId", {
        memberId: mailTokenPayload.inviteeId
      })
      .andWhere("projectMember.project = :projectId", {
        projectId: mailTokenPayload.projectId
      })
      .getOne();

    // Member was kicked out or the project was deleted
    if (!projectMember) {
      // Remove this mail token as its no longer valid
      await mailToken.remove();

      return accountNotFoundError(req, res);
    }

    // Member no longer has a status of invited
    if (projectMember.status !== ProjectMemberStatus.INVITED) {
      // Remove this mail token as its no longer valid
      await mailToken.remove();

      return alreadyProjectMemberError(req, res);
    }

    projectMember.status = ProjectMemberStatus.ACTIVE;

    await projectMember.save();
    await mailToken.remove();

    res.sendStatus(HttpStatus.ACCEPTED);
  },
  async getMember(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { memberId } = req.params;
    const { exclude } = req.query;

    const projectMemberQueryBuilder = ProjectMember.createQueryBuilder("projectMember")
      .where("projectMember.user = :memberId", { memberId })
      .leftJoin("projectMember.project", "project")
      .leftJoin("project.members", "otherMembers")
      .andWhere("otherMembers.user = :currentUserId", { currentUserId })
      .leftJoinAndSelect("projectMember.user", "user")
      .select(["projectMember"]);

    const exclusions = [].concat(exclude);
    if (!exclusions.includes("user")) {
      projectMemberQueryBuilder.addSelect([
        "user.id",
        "user.createdAt",
        "user.firstName",
        "user.lastName",
        "user.emailAddress"
      ]);
    }

    const projectMember = await projectMemberQueryBuilder.getOne();
    if (!projectMember) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(projectMember);
  },
  async promoteMember(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { memberId } = req.params;

    // Current user as a member of the project with the member specified
    const currentProjectMember = await ProjectMember.createQueryBuilder("projectMember")
      .where("projectMember.user = :currentUserId", { currentUserId })
      .leftJoin("projectMember.project", "project")
      .leftJoin("project.members", "otherMembers")
      .andWhere("otherMembers.id = :memberId", { memberId })
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    // Member to delete that is a member of the project the current user is in
    const targetProjectMember = await ProjectMember.createQueryBuilder("projectMember")
      .where("projectMember.id = :targetMemberId", { targetMemberId: memberId })
      .leftJoinAndSelect("projectMember.user", "user")
      .leftJoin("projectMember.project", "project")
      .leftJoin("project.members", "otherMembers")
      .andWhere("otherMembers.id = :currentMemberId", { currentMemberId: currentProjectMember.id })
      .getOne();

    if (!targetProjectMember) {
      return resourceNotFoundError(req, res);
    }

    if (currentProjectMember.role === ProjectMemberRole.EMPLOYEE) {
      return insufficientPrivilegesError(req, res);
    }

    // prettier-ignore
    if (currentProjectMember.role === ProjectMemberRole.ADMIN &&
      targetProjectMember.role === ProjectMemberRole.EMPLOYEE) {
      targetProjectMember.role = ProjectMemberRole.MANAGER;
      await targetProjectMember.save();
      res.sendStatus(HttpStatus.ACCEPTED);
    }

    res.sendStatus(HttpStatus.EXPECTATION_FAILED);
  },
  async demoteMember(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { memberId } = req.params;

    // Current user as a member of the project with the member specified
    const currentProjectMember = await ProjectMember.createQueryBuilder("projectMember")
      .where("projectMember.user = :currentUserId", { currentUserId })
      .leftJoin("projectMember.project", "project")
      .leftJoin("project.members", "otherMembers")
      .andWhere("otherMembers.id = :memberId", { memberId })
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    // Member to delete that is a member of the project the current user is in
    const targetProjectMember = await ProjectMember.createQueryBuilder("projectMember")
      .where("projectMember.id = :targetMemberId", { targetMemberId: memberId })
      .leftJoinAndSelect("projectMember.user", "user")
      .leftJoin("projectMember.project", "project")
      .leftJoin("project.members", "otherMembers")
      .andWhere("otherMembers.id = :currentMemberId", { currentMemberId: currentProjectMember.id })
      .getOne();

    if (!targetProjectMember) {
      return resourceNotFoundError(req, res);
    }

    if (currentProjectMember.role === ProjectMemberRole.EMPLOYEE) {
      return insufficientPrivilegesError(req, res);
    }

    // prettier-ignore
    if (currentProjectMember.role === ProjectMemberRole.ADMIN &&
      targetProjectMember.role === ProjectMemberRole.MANAGER) {
      targetProjectMember.role = ProjectMemberRole.EMPLOYEE;
      await targetProjectMember.save();
      res.sendStatus(HttpStatus.ACCEPTED);
    }

    res.sendStatus(HttpStatus.EXPECTATION_FAILED);
  },
  async kickMember(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { memberId } = req.params;

    // Current user as a member of the project with the member specified
    const currentProjectMember = await ProjectMember.createQueryBuilder("projectMember")
      .where("projectMember.user = :currentUserId", { currentUserId })
      .leftJoin("projectMember.project", "project")
      .leftJoin("project.members", "otherMembers")
      .andWhere("otherMembers.id = :memberId", { memberId })
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    // Member to delete that is a member of the project the current user is in
    const targetProjectMember = await ProjectMember.createQueryBuilder("projectMember")
      .where("projectMember.id = :targetMemberId", { targetMemberId: memberId })
      .leftJoinAndSelect("projectMember.user", "user")
      .leftJoin("projectMember.project", "project")
      .leftJoin("project.members", "otherMembers")
      .andWhere("otherMembers.id = :currentMemberId", { currentMemberId: currentProjectMember.id })
      .getOne();

    if (!targetProjectMember) {
      return resourceNotFoundError(req, res);
    }

    const currentProjectMemberLevel = ProjectMemberRoleLevel.get(currentProjectMember.role);
    const targetProjectMemberLevel = ProjectMemberRoleLevel.get(targetProjectMember.role);

    if (currentProjectMemberLevel < 10) {
      return insufficientPrivilegesError(req, res);
    }

    if (currentProjectMemberLevel <= targetProjectMemberLevel) {
      return insufficientPrivilegesError(req, res);
    }

    await targetProjectMember.remove();

    res.sendStatus(HttpStatus.ACCEPTED);
  }
};

export default projectMemberController;
