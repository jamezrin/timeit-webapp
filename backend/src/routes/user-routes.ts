import express, { Request, Response } from 'express';
import { wrapAsync } from '../utils';

const userRouter = express.Router();

// Get current user
userRouter.get('/user', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

// Update current user
userRouter.patch('/user', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

export default userRouter;