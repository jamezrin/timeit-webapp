import { Request, Response } from 'express';
import { ProjectMember, ProjectUserRole, ProjectUserStatus } from '../../entity/ProjectMember';
import HttpStatus from 'http-status-codes';
import { Session } from '../../entity/Session';
import { resourceNotFoundError } from '../errors';

const projectSessionControler = {
  async listSessions(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { projectId } = req.params;
    const { memberIds } = req.query;

    const currentProjectMember = await ProjectMember.findOne({
      where: {
        user: currentUserId,
        project: projectId,
      },
    });

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    const sessionQueryBuilder = Session.createQueryBuilder('session')
      .leftJoin('session.projectMember', 'projectMember')
      .where('projectMember.project = :projectId', {
        projectId: projectId,
      });

    if (
      currentProjectMember.role === ProjectUserRole.ADMIN ||
      currentProjectMember.role === ProjectUserRole.EMPLOYER
    ) {
      if (memberIds) {
        sessionQueryBuilder.andWhere('projectMember.id IN (:...memberIds)', {
          memberIds: [].concat(memberIds),
        });
      }
    } else {
      sessionQueryBuilder.andWhere('projectMember.id = :currentProjectMemberId', {
        currentProjectMemberId: currentProjectMember.id,
      });
    }

    const sessions = await sessionQueryBuilder.getMany();
    res.status(HttpStatus.OK).json(sessions);
  },
  async createSession(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { projectId } = req.params;

    const currentProjectMember = await ProjectMember.findOne({
      where: {
        user: currentUserId,
        project: projectId,
      },
    });

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    const session = new Session();
    session.projectMember = currentProjectMember;
    await session.save();

    res.sendStatus(HttpStatus.ACCEPTED);
  },
  async getSession(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { sessionId } = req.params;

    const currentProjectMember = await ProjectMember.createQueryBuilder('currentMember')
      .leftJoin('currentMember.user', 'currentUser')
      .where('currentUser.id = :currentUserId', { currentUserId: currentUserId })
      .andWhere('currentMember.status = :status', { status: ProjectUserStatus.ACTIVE })
      .leftJoin('currentMember.project', 'project')
      .leftJoin('project.members', 'otherMembers')
      .leftJoin('otherMembers.sessions', 'sessions')
      .andWhere('sessions.id = :sessionId', { sessionId: sessionId })
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    // prettier-ignore
    const sessionQueryBuilder = Session.createQueryBuilder('session')
      .where('session.id = :sessionId', { sessionId: sessionId });

    if (
      currentProjectMember.role !== ProjectUserRole.ADMIN &&
      currentProjectMember.role !== ProjectUserRole.EMPLOYER
    ) {
      sessionQueryBuilder.leftJoin('session.projectMember', 'projectMember');
      sessionQueryBuilder.andWhere('projectMember.id = :currentProjectMemberId', {
        currentProjectMemberId: currentProjectMember.id,
      });
    }

    const session = await sessionQueryBuilder.getOne();
    res.status(HttpStatus.OK).json(session);
  },
  async updateSession(req: Request, res: Response) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  },
  async deleteSession(req: Request, res: Response) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  },
  async sessionEnd(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { sessionId } = req.params;

    const currentProjectMember = await ProjectMember.createQueryBuilder('currentMember')
      .leftJoin('currentMember.user', 'currentUser')
      .where('currentUser.id = :currentUserId', { currentUserId: currentUserId })
      .andWhere('currentMember.status = :status', { status: ProjectUserStatus.ACTIVE })
      .leftJoin('currentMember.project', 'project')
      .leftJoin('project.members', 'otherMembers')
      .leftJoin('otherMembers.sessions', 'sessions')
      .andWhere('sessions.id = :sessionId', { sessionId: sessionId })
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    // prettier-ignore
    const sessionQueryBuilder = Session.createQueryBuilder('session')
      .where('session.id = :sessionId', { sessionId: sessionId });

    if (
      currentProjectMember.role !== ProjectUserRole.ADMIN &&
      currentProjectMember.role !== ProjectUserRole.EMPLOYER
    ) {
      sessionQueryBuilder.andWhere('session.projectMember = :currentProjectMemberId', {
        currentProjectMemberId: currentProjectMember.id,
      });
    }

    const session = await sessionQueryBuilder.getOne();
    session.endedAt = new Date(Date.now());
    await session.save();

    res.status(HttpStatus.OK).json(session);
  },
};

export default projectSessionControler;
