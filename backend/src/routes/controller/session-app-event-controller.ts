import { Request, Response } from 'express';
import { SessionAppEvent } from '../../entity/SessionAppEvent';
import { Session } from '../../entity/Session';
import HttpStatus from 'http-status-codes';
import { resourceNotFoundError } from '../errors';
import { TokenPayload } from '../middleware/auth-middleware';
import { ProjectMember } from '../../entity/ProjectMember';
import { isMemberPrivileged } from '../../utils';

const sessionAppEventController = {
  async listAppEvents(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { sessionId } = req.params;
    const { memberIds } = req.query;

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

    const sessionQueryBuilder = Session.createQueryBuilder('session')
      .where('session.id = :sessionId', { sessionId })
      .leftJoinAndSelect('session.sessionAppEvents', 'sessionAppEvents');

    // Add an additional condition so that regular members can only see their stuff
    // and so that admin-like members can see all or choose which user(s) to filter
    if (isMemberPrivileged(currentProjectMember)) {
      if (memberIds) {
        sessionQueryBuilder.andWhere('session.projectMember IN (:...memberIds)', {
          memberIds: [].concat(memberIds),
        });
      }
    } else {
      sessionQueryBuilder.andWhere('session.projectMember = :currentProjectMemberId', {
        currentProjectMemberId: currentProjectMember.id,
      });
    }

    const session = await sessionQueryBuilder.getOne();

    if (!session) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(session.sessionAppEvents);
  },
  async createAppEvent(req: Request, res: Response) {
    const { windowName, windowClass, windowPid } = req.body;
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { sessionId } = req.params;

    const session = await Session.createQueryBuilder('session')
      .where('session.id = :sessionId', { sessionId })
      .leftJoin('session.projectMember', 'projectMember')
      .andWhere('projectMember.user = :currentUserId', { currentUserId })
      .getOne();

    if (!session) {
      return resourceNotFoundError(req, res);
    }

    const sessionAppEvent = new SessionAppEvent();
    sessionAppEvent.windowName = windowName;
    sessionAppEvent.windowClass = windowClass;
    sessionAppEvent.windowPid = windowPid;
    sessionAppEvent.session = session;
    await sessionAppEvent.save();

    res.sendStatus(HttpStatus.ACCEPTED);
  },
  async getAppEvent(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { appEventId } = req.params;

    // Current user as a member of the project that has this app event
    const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
      .where('projectMember.user = :currentUserId', { currentUserId })
      .leftJoin('projectMember.project', 'project')
      .leftJoin('project.members', 'otherMembers')
      .leftJoin('otherMembers.sessions', 'otherMemberSessions')
      .leftJoin('otherMemberSessions.sessionAppEvents', 'otherSessionAppEvents')
      .andWhere('otherSessionAppEvents.id = :appEventId', { appEventId })
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    // prettier-ignore
    const appEventQueryBuilder = SessionAppEvent.createQueryBuilder('appEvent')
      .where('appEvent.id = :appEventId', { appEventId });

    // Ensure the app event session being looked up is owned by the current member
    if (!isMemberPrivileged(currentProjectMember)) {
      appEventQueryBuilder.leftJoin('appEvent.session', 'session');
      appEventQueryBuilder.andWhere('session.projectMember = :currentProjectMemberId', {
        currentProjectMemberId: currentProjectMember.id,
      });
    }

    const appEvent = await appEventQueryBuilder.getOne();
    if (!appEvent) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(appEvent);
  },
  async updateAppEvent(req: Request, res: Response) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  },
  async deleteAppEvent(req: Request, res: Response) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  },
};

export default sessionAppEventController;
