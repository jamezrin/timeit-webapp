import { wrapAsync } from '../utils';
import express, { Request, Response } from 'express';
import { Session } from '../entity/Session';
import { SessionAppEvent } from '../entity/SessionAppEvent';

const sessionAppEventRouter = express.Router();

// List app events
sessionAppEventRouter.get('/app-events', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

// Create app event
sessionAppEventRouter.post('/app-events', wrapAsync(async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const { projectId, sessionId } = req.params;
  const { windowName, windowClass, windowPid } = req.body;

  console.log(req.headers);
  console.log(req.params);
  console.log(req.body);

  console.log({
    projectId,
    sessionId,
    authorization,
    windowName,
    windowClass,
    windowPid,
  });

  const session = await Session.findOneOrFail(sessionId);
  const appEvent = new SessionAppEvent();
  appEvent.windowName = windowName;
  appEvent.windowClass = windowClass;
  appEvent.windowPid = windowPid;
  appEvent.session = session;
  await appEvent.save();

  res.sendStatus(201);
}));

// Delete app event
sessionAppEventRouter.delete('/app-events/:eventId', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

export default sessionAppEventRouter;