// List project members
import { wrapAsync } from '../../utils';
import express, { Request, Response } from 'express';
import { ProjectMember } from '../../entity/ProjectMember';

const projectMemberController = {
  async listMembers(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];

    try {
      const projectUser = await ProjectMember.findOneOrFail({
        where: {
          project: req.params['projectId'],
          user: tokenPayload['userId'],
        },
      });

      res.status(200).json(projectUser.project.members);
    } catch (err) {
      return res.status(404).json({
        error: {
          type: 'PROJECT_NOT_FOUND',
          message: 'Could not find any project with the provided projectId',
        },
      });
    }

    res.sendStatus(200);
  },
  async createMember(req: Request, res: Response) {},
  // TODO Check permissions for this
  async getMember(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];

    try {
      const projectUser = await ProjectMember.findOneOrFail({
        where: {
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
  },
  async updateMember(req: Request, res: Response) {},
  async deleteMember(req: Request, res: Response) {},
};

export default projectMemberController;
