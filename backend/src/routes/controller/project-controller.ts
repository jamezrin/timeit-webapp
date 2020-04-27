import { Request, Response } from 'express';

import {
  ProjectMember,
  ProjectUserRole,
  ProjectUserStatus,
} from '../../entity/ProjectMember';

import { User } from '../../entity/User';
import { Project } from '../../entity/Project';
import { UserToken } from '../../entity/UserToken';

const projectController = {
  async listProjects(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const user = await User.findOne(tokenPayload['userId']);
    const projects = user.projects || [];
    res.status(200).json(projects);
  },
  async createProject(req: Request, res: Response) {
    const tokenInfo = req['tokenInfo'] as UserToken;
    const projectName = req.body['name'];

    const project = new Project();
    project.name = projectName;
    await project.save();

    const projectUser = new ProjectMember();
    projectUser.project = project;
    projectUser.status = ProjectUserStatus.ACTIVE;
    projectUser.role = ProjectUserRole.ADMIN;
    projectUser.user = tokenInfo.user;
    await projectUser.save();

    res.status(202).json({
      project: {
        id: project.id,
        name: project.name,
        projectUser: {
          id: projectUser.id,
          relatedUserId: projectUser.user.id,
          status: projectUser.status,
          role: projectUser.role,
        },
      },
    });
  },
  async getProject(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];

    try {
      const projectUser = await ProjectMember.findOneOrFail({
        where: {
          project: req.params['projectId'],
          user: tokenPayload['userId'],
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
  async updateProject(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];

    try {
      const projectUser = await ProjectMember.findOneOrFail({
        where: {
          project: req.params['projectId'],
          user: tokenPayload['userId'],
        },
      });

      const project = projectUser.project;
      const projectName = req.body['name'];
      project.name = projectName || project.name;
      await project.save();

      res.sendStatus(202);
    } catch (err) {
      return res.status(404).json({
        error: {
          type: 'PROJECT_NOT_FOUND',
          message: 'Could not find any project with the provided projectId',
        },
      });
    }
  },
  async deleteProject(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];

    try {
      const projectUser = await ProjectMember.findOneOrFail({
        where: {
          project: req.params['projectId'],
          user: tokenPayload['userId'],
        },
      });

      if (projectUser.role !== ProjectUserRole.ADMIN) {
        return res.status(403).json({
          error: {
            type: 'INSUFFICIENT_PRIVILEGES',
            message: 'Insufficient permissions to perform this operation',
          },
        });
      }

      const project = projectUser.project;
      await project.remove(); // Cascades to ProjectMember and other entities

      res.sendStatus(200);
    } catch (err) {
      return res.status(404).json({
        error: {
          type: 'PROJECT_NOT_FOUND',
          message: 'Could not find any project with the provided projectId',
        },
      });
    }
  },
  async projectInvite(req: Request, res: Response) {
    res.sendStatus(200);
  },
};

export default projectController;
