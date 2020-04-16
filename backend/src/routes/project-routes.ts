import express, { Request, Response } from 'express';
import { wrapAsync } from '../utils';
import projectSessionRouter from './project-session-routes';
import projectMemberRouter from './project-member-routes';

const projectRouter = express.Router();

// List projects
projectRouter.get('/projects', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

// Get project
projectRouter.get('/projects/:projectId', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

// Create project
projectRouter.post('/projects', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

// Update project
projectRouter.patch('/projects/:projectId', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

// Delete project
projectRouter.delete('/projects/:projectId', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

projectRouter.use('/project/:projectId', projectMemberRouter);
projectRouter.use('/project/:projectId', projectSessionRouter);

export default projectRouter;