import { isMemberPrivileged } from '../../utils';
import { Request, Response } from 'express';
import { ProjectMember, ProjectMemberRole, ProjectMemberStatus } from '../../entity/ProjectMember';
import HttpStatus from 'http-status-codes';
import {
  accountNotFoundError,
  alreadyProjectMemberError,
  inactiveAccountError,
  incorrectMailTokenError,
  insufficientPrivilegesError,
  mailTokenNotFoundError,
  resourceNotFoundError,
} from '../errors';
import { MailRequestType, MailToken, ProjectInvitationPayload } from '../../entity/MailToken';
import { User, UserStatus } from '../../entity/User';
import { TokenPayload } from '../middleware/auth-middleware';
import Mail from 'nodemailer/lib/mailer';
import { Project } from '../../entity/Project';

async function sendProjectInvitationMail(
  mailer: Mail,
  mailToken: MailToken,
  inviter: ProjectMember,
) {
  const invitationCallbackUrl =
    process.env.TIMEIT_FRONTEND_URL +
    `/project/${inviter.project.id}/accept-invite/${mailToken.id}`;
  return await mailer.sendMail({
    from: '"Jaime de TimeIt" <jaime@jamezrin.name>',
    to: mailToken.emailAddress,
    subject: `Invitación al proyecto ${inviter.project.name}`,
    text: `
    Te han invitado al proyecto ${inviter.project.name}, accede a ${invitationCallbackUrl} para aceptar la invitación.
    Si no quieres aceptar esta invitación, simplemente ignora este correo electrónico.`,
    html: `
    <p>Te han invitado al proyecto ${inviter.project.name}, puedes <a href="${invitationCallbackUrl}">aceptar la invitación</a>.</p>
    <p>Si no quieres aceptar esta invitación, simplemente ignora este correo electrónico</p>`,
  });
}

async function checkProjectMember(project: Project, emailAddress: string): Promise<boolean> {
  const projectMember = await ProjectMember.createQueryBuilder('projectMember')
    .leftJoin('projectMember.user', 'user')
    .where('projectMember.project = :projectId', { projectId: project.id })
    .andWhere('user.emailAddress = :emailAddress', { emailAddress })
    .getOne();

  return !!projectMember;
}

const projectMemberController = {
  async listMembers(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { projectId } = req.params;
    const { exclude } = req.query;

    const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
      .where('projectMember.project = :projectId', { projectId })
      .andWhere('projectMember.user = :currentUserId', { currentUserId })
      .leftJoinAndSelect('projectMember.project', 'project')
      .leftJoinAndSelect('project.members', 'members')
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    const allProjectMembersQueryBuilder = ProjectMember.createQueryBuilder('projectMember')
      .where('projectMember.project = :projectId', { projectId })
      .leftJoinAndSelect('projectMember.user', 'user')
      .select(['projectMember']);

    const exclusions = [].concat(exclude);
    if (!exclusions.includes('user')) {
      allProjectMembersQueryBuilder.addSelect([
        'user.id',
        'user.createdAt',
        'user.firstName',
        'user.lastName',
        'user.emailAddress',
      ]);
    }

    const allProjectMembers = await allProjectMembersQueryBuilder.getMany();

    res.status(HttpStatus.OK).json(allProjectMembers);
  },
  inviteMember(mailer: Mail) {
    return async function (req: Request, res: Response) {
      const tokenPayload = res.locals.tokenPayload as TokenPayload;
      const currentUserId = tokenPayload.userId;
      const { projectId } = req.params;
      const { emailAddress } = req.body;

      // Current user as a member of the current project
      const inviterProjectMember = await ProjectMember.createQueryBuilder('projectMember')
        .leftJoinAndSelect('projectMember.project', 'project')
        .where('projectMember.project = :projectId', { projectId })
        .andWhere('projectMember.user = :currentUserId', { currentUserId })
        .getOne();

      if (!inviterProjectMember) {
        return resourceNotFoundError(req, res);
      }

      if (!isMemberPrivileged(inviterProjectMember)) {
        return insufficientPrivilegesError(req, res);
      }

      const invitedUser = await User.findOne({
        emailAddress,
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
        inviteeId: inviteeProjectMember.id,
      };

      await mailToken.save();

      // Sends the actual project invite email with the token
      await sendProjectInvitationMail(mailer, mailToken, inviterProjectMember);

      res.sendStatus(HttpStatus.ACCEPTED);
    };
  },
  async acceptInvite(req: Request, res: Response) {
    const { token } = req.body;

    const mailToken = await MailToken.findOne(token);

    if (!mailToken) {
      return mailTokenNotFoundError(req, res);
    }

    if (mailToken.type !== MailRequestType.PROJECT_INVITE) {
      return incorrectMailTokenError(req, res);
    }

    const mailTokenPayload = mailToken.payload as ProjectInvitationPayload;
    const projectMember = await ProjectMember.createQueryBuilder('projectMember')
      .leftJoin('projectMember.user', 'user')
      .where('user.emailAddress = :emailAddress', {
        emailAddress: mailToken.emailAddress,
      })
      .andWhere('projectMember.id = :memberId', {
        memberId: mailTokenPayload.inviteeId,
      })
      .andWhere('projectMember.project = :projectId', {
        projectId: mailTokenPayload.projectId,
      })
      .getOne();

    if (!projectMember) {
      return accountNotFoundError(req, res);
    }

    if (projectMember.status !== ProjectMemberStatus.INVITED) {
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

    const projectMemberQueryBuilder = ProjectMember.createQueryBuilder('projectMember')
      .where('projectMember.user = :memberId', { memberId })
      .leftJoin('projectMember.project', 'project')
      .leftJoin('project.members', 'otherMembers')
      .andWhere('otherMembers.user = :currentUserId', { currentUserId })
      .leftJoinAndSelect('projectMember.user', 'user')
      .select(['projectMember']);

    const exclusions = [].concat(exclude);
    if (!exclusions.includes('user')) {
      projectMemberQueryBuilder.addSelect([
        'user.id',
        'user.createdAt',
        'user.firstName',
        'user.lastName',
        'user.emailAddress',
      ]);
    }

    const projectMember = await projectMemberQueryBuilder.getOne();
    if (!projectMember) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(projectMember);
  },
  async updateMember(req: Request, res: Response) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  },
  async deleteMember(req: Request, res: Response) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  },
};

export default projectMemberController;
