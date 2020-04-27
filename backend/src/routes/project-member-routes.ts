// List project members
import { wrapAsync } from '../utils';
import express, { Request, Response } from 'express';
import { ProjectUser } from '../entity/ProjectUser';

const projectMemberRouter = express.Router();

// List project members
projectMemberRouter.get(
  '/members',
  wrapAsync(async (req: Request, res: Response) => {
    const tokenPayload = req['tokenPayload'];

    try {
      const projectUser = await ProjectUser.findOneOrFail({
        where: {
          project: req.params['projectId'],
          user: tokenPayload['userId'],
        },
      });

      res.status(200).json(projectUser.project.users);
    } catch (err) {
      return res.status(404).json({
        error: {
          type: 'PROJECT_NOT_FOUND',
          message: 'Could not find any project with the provided projectId',
        },
      });
    }

    res.sendStatus(200);
  }),
);

// Get project member
projectMemberRouter.get(
  '/members/:memberId',
  wrapAsync(async (req: Request, res: Response) => {
    const tokenPayload = req['tokenPayload'];

    try {
      const projectUser = await ProjectUser.findOneOrFail({
        where: {
          project: req.params['projectId'],
          user: tokenPayload['userId'],
          id: req.params['memberId'],
        },
      });

      res.status(200).json(projectUser);
    } catch (err) {
      return res.status(404).json({
        error: {
          type: 'PROJECT_NOT_FOUND',
          message: 'Could not find any project with the provided projectId',
        },
      });
    }
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
