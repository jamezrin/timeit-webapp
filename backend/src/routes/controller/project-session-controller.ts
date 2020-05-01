import { Request, Response } from 'express';
import { ProjectMember } from '../../entity/ProjectMember';
import HttpStatus from 'http-status-codes';
import { Session } from '../../entity/Session';
import { resourceNotFoundError } from '../errors';
import { TokenPayload } from '../middleware/auth-middleware';
import { isMemberPrivileged } from '../../utils';

const projectSessionControler = {
  async listSessions(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { projectId } = req.params;
    const { memberIds } = req.query;

    // Current user as a member of the current project
    const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
      .where('projectMember.project = :projectId', { projectId })
      .andWhere('projectMember.user = :currentUserId', { currentUserId })
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    const sessionQueryBuilder = Session.createQueryBuilder('session')
      .leftJoin('session.projectMember', 'projectMember')
      .where('projectMember.project = :projectId', { projectId });

    if (isMemberPrivileged(currentProjectMember)) {
      if (memberIds) {
        sessionQueryBuilder.andWhere('projectMember.id IN (:...memberIds)', {
          memberIds: [].concat(memberIds),
        });
      }
    } else {
      sessionQueryBuilder.andWhere('projectMember.id = :currentProjectMemberId', {
        currentProjectMemberId: currentProjectMember.id,
      });
    }

    const sessions = await sessionQueryBuilder.getMany();
    res.status(HttpStatus.OK).json(sessions);
  },
  async createSession(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { projectId } = req.params;

    // Current user as a member of the current project
    const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
      .where('projectMember.project = :projectId', { projectId })
      .andWhere('projectMember.user = :currentUserId', { currentUserId })
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    const session = new Session();
    session.projectMember = currentProjectMember;
    await session.save();

    res.sendStatus(HttpStatus.ACCEPTED);
  },
  async getSession(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { sessionId } = req.params;

    // Current user as a member of the project that has this session
    const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
      .where('projectMember.user = :currentUserId', { currentUserId })
      .leftJoin('projectMember.project', 'project')
      .leftJoin('project.members', 'otherMembers')
      .leftJoin('otherMembers.sessions', 'otherMemberSessions')
      .andWhere('otherMemberSessions.id = :sessionId', { sessionId })
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    // prettier-ignore
    const sessionQueryBuilder = Session.createQueryBuilder('session')
      .where('session.id = :sessionId', { sessionId });

    // Ensure the session being looked up is owned by the current member
    if (!isMemberPrivileged(currentProjectMember)) {
      sessionQueryBuilder.andWhere('session.projectMember = :currentProjectMemberId', {
        currentProjectMemberId: currentProjectMember.id,
      });
    }

    const session = await sessionQueryBuilder.getOne();

    if (!session) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(session);
  },
  async sessionEnd(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { sessionId } = req.params;

    // Current user as a member of the project that has this session
    const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
      .where('projectMember.user = :currentUserId', { currentUserId })
      .leftJoin('projectMember.project', 'project')
      .leftJoin('project.members', 'otherMembers')
      .leftJoin('otherMembers.sessions', 'otherMemberSessions')
      .andWhere('otherMemberSessions.id = :sessionId', { sessionId })
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    // prettier-ignore
    const sessionQueryBuilder = Session.createQueryBuilder('session')
      .where('session.id = :sessionId', { sessionId });

    // Add an additional condition to only query their own sessions
    if (!isMemberPrivileged(currentProjectMember)) {
      sessionQueryBuilder.andWhere('session.projectMember = :currentProjectMemberId', {
        currentProjectMemberId: currentProjectMember.id,
      });
    }

    const session = await sessionQueryBuilder.getOne();

    if (!session) {
      return resourceNotFoundError(req, res);
    }

    // Set the date the session ends to right now
    session.endedAt = new Date(Date.now());

    await session.save();

    res.status(HttpStatus.OK).json(session);
  },
  async updateSession(req: Request, res: Response) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  },
  async deleteSession(req: Request, res: Response) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  },
};

export default projectSessionControler;
