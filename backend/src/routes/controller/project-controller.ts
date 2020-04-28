import { Request, Response } from 'express';

import { ProjectMember, ProjectUserRole, ProjectUserStatus } from '../../entity/ProjectMember';

import { User } from '../../entity/User';
import { Project } from '../../entity/Project';
import { UserToken } from '../../entity/UserToken';
import HttpStatus from 'http-status-codes';
import { insufficientPermissionsError, resourceNotFoundError } from '../errors';

const projectController = {
  async listProjects(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const user = await User.findOne(tokenPayload['userId']);

    if (!user) {
      return resourceNotFoundError(req, res);
    }

    const projects = user.projects || [];
    res.status(HttpStatus.OK).json(projects);
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

    res.status(HttpStatus.ACCEPTED).json({
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
    const currentUserId = tokenPayload['userId'];
    const { projectId } = req.params;

    const projectUser = await ProjectMember.findOne({
      where: {
        user: currentUserId,
        project: projectId,
      },
    });

    if (!projectUser) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(projectUser);
  },
  async updateProject(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const projectName = req.body['name'];
    const { projectId } = req.params;

    const projectUser = await ProjectMember.findOne({
      where: {
        project: projectId,
        user: currentUserId,
      },
    });

    if (!projectUser) {
      return resourceNotFoundError(req, res);
    }

    const project = projectUser.project;
    project.name = projectName || project.name;
    await project.save();

    res.sendStatus(HttpStatus.ACCEPTED);
  },
  async deleteProject(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { projectId } = req.params;

    const projectUser = await ProjectMember.findOne({
      where: {
        project: projectId,
        user: currentUserId,
      },
    });

    if (!projectUser || !projectUser.project) {
      return resourceNotFoundError(req, res);
    }

    if (projectUser.role !== ProjectUserRole.ADMIN) {
      return insufficientPermissionsError(req, res);
    }

    await projectUser.project.remove(); // Cascades to ProjectMember and other entities

    res.sendStatus(HttpStatus.OK);
  },
};

export default projectController;
