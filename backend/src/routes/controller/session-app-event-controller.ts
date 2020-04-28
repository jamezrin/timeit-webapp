import { Request, Response } from 'express';
import { SessionAppEvent } from '../../entity/SessionAppEvent';
import { Session } from '../../entity/Session';
import HttpStatus from 'http-status-codes';

const sessionAppEventController = {
  async listAppEvents(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { sessionId } = req.params;

    const session = await Session.createQueryBuilder('session')
      .where('session.id = :currentSessionId', {
        currentSessionId: sessionId,
      })
      .leftJoinAndSelect('session.sessionAppEvents', 'sessionAppEvents')
      .leftJoin('session.projectMember', 'projectMember')
      .leftJoin('projectMember.user', 'user')
      .andWhere('user.id = :currentUserId', {
        currentUserId: currentUserId,
      })
      .getOne();

    if (!session) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          type: 'RESOURCE_NOT_FOUND',
          message: 'Could not find any session',
        },
      });
    }

    res.status(HttpStatus.OK).json(session.sessionAppEvents);
  },
  async createAppEvent(req: Request, res: Response) {
    const { windowName, windowClass, windowPid } = req.body;
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { sessionId } = req.params;

    const session = await Session.createQueryBuilder('session')
      .where('session.id = :currentSessionId', {
        currentSessionId: sessionId,
      })
      .leftJoin('session.projectMember', 'projectMember')
      .leftJoin('projectMember.user', 'user')
      .andWhere('user.id = :currentUserId', {
        currentUserId: currentUserId,
      })
      .getOne();

    if (!session) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          type: 'RESOURCE_NOT_FOUND',
          message: 'Could not find any session',
        },
      });
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
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { appEventId } = req.params;

    const sessionAppEvent = await SessionAppEvent.createQueryBuilder('sessionAppEvent')
      .where('sessionAppEvent.id = :currentAppEventId', {
        currentAppEventId: appEventId,
      })
      .leftJoin('sessionAppEvent.session', 'session')
      .leftJoin('session.projectMember', 'projectMember')
      .leftJoin('projectMember.user', 'user')
      .andWhere('user.id = :currentUserId', {
        currentUserId: currentUserId,
      })
      .getOne();

    if (!sessionAppEvent) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          type: 'RESOURCE_NOT_FOUND',
          message: 'Could not find any app event',
        },
      });
    }

    res.status(HttpStatus.OK).json(sessionAppEvent);
  },
  async updateAppEvent(req: Request, res: Response) {
    const { windowName, windowClass, windowPid } = req.body;
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { appEventId } = req.params;

    const sessionAppEvent = await SessionAppEvent.createQueryBuilder('sessionAppEvent')
      .where('sessionAppEvent.id = :currentAppEventId', {
        currentAppEventId: appEventId,
      })
      .leftJoin('sessionAppEvent.session', 'session')
      .leftJoin('session.projectMember', 'projectMember')
      .leftJoin('projectMember.user', 'user')
      .andWhere('user.id = :currentUserId', {
        currentUserId: currentUserId,
      })
      .getOne();

    if (!sessionAppEvent) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          type: 'RESOURCE_NOT_FOUND',
          message: 'Could not find any app event',
        },
      });
    }

    sessionAppEvent.windowName = windowName || sessionAppEvent.windowName;
    sessionAppEvent.windowClass = windowClass || sessionAppEvent.windowClass;
    sessionAppEvent.windowPid = windowPid || sessionAppEvent.windowPid;
    await sessionAppEvent.save();

    res.status(HttpStatus.OK).json(sessionAppEvent);
  },
  async deleteAppEvent(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { appEventId } = req.params;

    const sessionAppEvent = await SessionAppEvent.createQueryBuilder('sessionAppEvent')
      .where('sessionAppEvent.id = :currentAppEventId', {
        currentAppEventId: appEventId,
      })
      .leftJoin('sessionAppEvent.session', 'session')
      .leftJoin('session.projectMember', 'projectMember')
      .leftJoin('projectMember.user', 'user')
      .andWhere('user.id = :currentUserId', {
        currentUserId: currentUserId,
      })
      .getOne();

    if (!sessionAppEvent) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          type: 'RESOURCE_NOT_FOUND',
          message: 'Could not find any app event',
        },
      });
    }

    await sessionAppEvent.remove();

    res.sendStatus(HttpStatus.OK);
  },
};

export default sessionAppEventController;
