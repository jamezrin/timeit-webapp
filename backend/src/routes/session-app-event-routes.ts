import { wrapAsync } from '../utils';
import express, { Request, Response } from 'express';
import { Session } from '../entity/Session';
import { SessionAppEvent } from '../entity/SessionAppEvent';

const sessionAppEventRouter = express.Router();

// List app events
sessionAppEventRouter.get(
  '/app-events',
  wrapAsync(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
);

// Create app event
sessionAppEventRouter.post(
  '/app-events',
  wrapAsync(async (req: Request, res: Response) => {
    const { projectId, sessionId } = req.params;
    const { windowName, windowClass, windowPid } = req.body;

    const session = await Session.findOneOrFail(sessionId);

    const sessionAppEvent = new SessionAppEvent();
    sessionAppEvent.windowName = windowName;
    sessionAppEvent.windowClass = windowClass;
    sessionAppEvent.windowPid = windowPid;
    sessionAppEvent.session = session;
    await sessionAppEvent.save();

    res.sendStatus(201);
  }),
);

// Delete app event
sessionAppEventRouter.delete(
  '/app-events/:eventId',
  wrapAsync(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
);

export default sessionAppEventRouter;
