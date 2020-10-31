import { Request, Response } from "express";

import { ProjectMember, ProjectMemberRole, ProjectMemberStatus } from "../../entity/ProjectMember";
import { Project } from "../../entity/Project";
import { AuthToken } from "../../entity/AuthToken";
import HttpStatus from "http-status-codes";
import { insufficientPrivilegesError, resourceNotFoundError } from "../errors";
import { TokenPayload } from "../middleware/auth-middleware";
import { isMemberPrivileged } from "../../utils";

const projectController = {
  async listProjects(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;

    const projects = await Project.createQueryBuilder("project")
      .loadRelationCountAndMap("project.memberCount", "project.members")
      .leftJoinAndMapOne(
        "project.projectMember",
        "project.members",
        "member",
        "member.user = :currentUserId",
        { currentUserId }
      )
      .where("member.user = :currentUserId", { currentUserId })
      .andWhere("member.status = :status", {
        status: ProjectMemberStatus.ACTIVE
      })
      .getMany();

    res.status(HttpStatus.OK).json(projects);
  },
  async createProject(req: Request, res: Response) {
    const tokenInfo = res.locals.tokenInfo as AuthToken;
    const projectName = req.body["name"];

    const project = new Project();
    project.name = projectName;
    await project.save();

    const projectMember = new ProjectMember();
    projectMember.project = project;
    projectMember.status = ProjectMemberStatus.ACTIVE;
    projectMember.role = ProjectMemberRole.ADMIN;
    projectMember.user = tokenInfo.user;

    await projectMember.save();

    res.status(HttpStatus.ACCEPTED).json({
      id: project.id,
      createdAt: project.createdAt,
      name: project.name,
      projectMember: {
        id: projectMember.id,
        createdAt: projectMember.createdAt,
        role: projectMember.role,
        status: projectMember.status
      }
    });
  },
  async getProject(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { projectId } = req.params;

    const project = await Project.createQueryBuilder("project")
      .where("project.id = :projectId", { projectId })
      .andWhere("member.user = :currentUserId", { currentUserId })
      .loadRelationCountAndMap("project.memberCount", "project.members")
      .leftJoinAndMapOne(
        "project.projectMember",
        "project.members",
        "member",
        "member.user = :currentUserId",
        { currentUserId }
      )
      .getOne();

    if (!project) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(project);
  },
  async updateProject(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const projectName = req.body["name"];
    const { projectId } = req.params;

    const currentProjectMember = await ProjectMember.createQueryBuilder("projectMember")
      .leftJoinAndSelect("projectMember.project", "project")
      .where("projectMember.project = :projectId", { projectId })
      .andWhere("projectMember.user = :currentUserId", { currentUserId })
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    if (!isMemberPrivileged(currentProjectMember)) {
      return insufficientPrivilegesError(req, res);
    }

    const project = currentProjectMember.project;
    if (!project) {
      return resourceNotFoundError(req, res);
    }

    project.name = projectName || project.name;

    await project.save();

    res.sendStatus(HttpStatus.ACCEPTED);
  },
  async deleteProject(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { projectId } = req.params;

    const currentProjectMember = await ProjectMember.createQueryBuilder("projectMember")
      .leftJoinAndSelect("projectMember.project", "project")
      .where("projectMember.project = :projectId", { projectId })
      .andWhere("projectMember.user = :currentUserId", { currentUserId })
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    if (!isMemberPrivileged(currentProjectMember)) {
      return insufficientPrivilegesError(req, res);
    }

    const project = currentProjectMember.project;
    if (!project) {
      return resourceNotFoundError(req, res);
    }

    // Deletion cascades to ProjectMember, Session, SessionAppEvent and SessionNote
    await project.remove();

    res.sendStatus(HttpStatus.OK);
  }
};

export default projectController;
