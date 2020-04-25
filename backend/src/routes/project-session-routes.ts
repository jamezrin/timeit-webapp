import express, { Request, Response } from 'express';
import { wrapAsync } from '../utils';
import sessionNoteRouter from './session-note-routes';
import sessionAppEventRouter from './session-app-event-routes';

const projectSessionRouter = express.Router();

projectSessionRouter.get(
  '/sessions',
  wrapAsync(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
);

projectSessionRouter.get(
  '/sessions/:sessionId',
  wrapAsync(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
);

projectSessionRouter.post(
  '/sessions',
  wrapAsync(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
);

projectSessionRouter.patch(
  '/sessions/:sessionId',
  wrapAsync(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
);

projectSessionRouter.delete(
  '/sessions/:sessionId',
  wrapAsync(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
);

projectSessionRouter.use('/sessions/:sessionId', sessionAppEventRouter);
projectSessionRouter.use('/sessions/:sessionId', sessionNoteRouter);

export default projectSessionRouter;
