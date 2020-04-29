// List project members
import { wrapAsync } from '../../utils';
import express, { Request, Response } from 'express';
import { ProjectMember } from '../../entity/ProjectMember';
import HttpStatus from 'http-status-codes';
import { accountNotFoundError, resourceNotFoundError } from '../errors';
import { MailRequestType, MailToken } from '../../entity/MailToken';
import { User } from '../../entity/User';
import { TokenPayload } from '../middleware/auth-middleware';

const projectMemberController = {
  async listMembers(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { projectId } = req.params;

    const projectUser = await ProjectMember.findOne({
      where: {
        project: projectId,
        user: currentUserId,
      },
    });

    if (!projectUser) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(projectUser.project.members);
  },
  // TODO Check permissions for this
  async getMember(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { memberId } = req.params;

    const projectUser = await ProjectMember.findOne({
      where: {
        user: currentUserId,
        id: memberId,
      },
    });

    if (!projectUser) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(projectUser);
  },
  async inviteMember(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { projectId } = req.params;
    const { emailAddress } = req.body;

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

    res.sendStatus(HttpStatus.OK);
  },
  async updateMember(req: Request, res: Response) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  },
  async deleteMember(req: Request, res: Response) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  },
};

export default projectMemberController;
