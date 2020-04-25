// List project members
import { wrapAsync } from '../utils';
import express, { Request, Response } from 'express';

const projectMemberRouter = express.Router();

// List project members
projectMemberRouter.get(
  '/members',
  wrapAsync(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
);

// Get project member
projectMemberRouter.get(
  '/members/:memberId',
  wrapAsync(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
);

// Create project member
projectMemberRouter.post(
  '/members',
  wrapAsync(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
);

// Delete project member
projectMemberRouter.delete(
  '/members/:memberId',
  wrapAsync(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
);

// Update project member
projectMemberRouter.patch(
  '/members/:memberId',
  wrapAsync(async (req: Request, res: Response) => {
    res.sendStatus(200);
  }),
);

export default projectMemberRouter;
