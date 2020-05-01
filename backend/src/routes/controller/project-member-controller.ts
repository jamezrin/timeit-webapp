// List project members
import { isMemberPrivileged } from '../../utils';
import { Request, Response } from 'express';
import { ProjectMember } from '../../entity/ProjectMember';
import HttpStatus from 'http-status-codes';
import { accountNotFoundError, forbiddenError, resourceNotFoundError } from '../errors';
import { MailRequestType, MailToken } from '../../entity/MailToken';
import { User } from '../../entity/User';
import { TokenPayload } from '../middleware/auth-middleware';

const projectMemberController = {
  async listMembers(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { projectId } = req.params;

    const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
      .leftJoinAndSelect('projectMember.project', 'project')
      .where('projectMember.project = :projectId', { projectId })
      .andWhere('projectMember.user = :currentUserId', { currentUserId })
      .leftJoinAndSelect('project.members', 'members')
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(currentProjectMember.project.members);
  },
  async inviteMember(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { projectId } = req.params;
    const { emailAddress } = req.body;

    // Current user as a member of the current project
    const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
      .where('projectMember.project = :projectId', { projectId })
      .andWhere('projectMember.user = :currentUserId', { currentUserId })
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    if (!isMemberPrivileged(currentProjectMember)) {
      return forbiddenError(req, res);
    }

    const user = await User.findOne({
      emailAddress,
    });

    if (!user) {
      return accountNotFoundError(req, res);
    }

    const mailToken = new MailToken();
    mailToken.type = MailRequestType.PROJECT_INVITE;
    mailToken.expiresIn = -1;
    mailToken.user = user;
    mailToken.payload = {
      projectId: projectId,
      invitedBy: currentUserId,
    };

    await mailToken.save();

    // TODO Send email with token link and whatever
    // This has to wait until we have the frontend more or less ready

    res.sendStatus(HttpStatus.ACCEPTED);
  },
  async getMember(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { memberId } = req.params;

    const projectMember = await ProjectMember.createQueryBuilder('projectMember')
      .where('projectMember.user = :memberId', { memberId })
      .leftJoin('projectMember.project', 'project')
      .leftJoin('project.members', 'otherMembers')
      .andWhere('otherMembers.user = :currentUserId', { currentUserId })
      .getOne();

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
