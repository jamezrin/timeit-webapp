import { Request, Response } from 'express';
import { Session } from '../../entity/Session';
import { ProjectMember, ProjectUserRole } from '../../entity/ProjectMember';
import HttpStatus from 'http-status-codes';
import { Project } from '../../entity/Project';

const projectSessionControler = {
  async listSessions(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { projectId } = req.params;
    const { memberIds } = req.query;

    const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
      .where('projectMember.user = :currentUserId', { currentUserId: currentUserId })
      .andWhere('projectMember.project = :projectId', { projectId: projectId })
      .getOne();

    if (!currentProjectMember) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          type: 'RESOURCE_NOT_FOUND',
          message: 'Could not find any project member',
        },
      });
    }

    const sessionQueryBuilder = Session.createQueryBuilder('session')
      .leftJoin('session.projectMember', 'projectMember')
      .leftJoin('projectMember.project', 'project')
      .where('project.id = :projectId', {
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
    res.status(200).json(sessions);
  },
  async createSession(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { projectId } = req.params;

    const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
      .where('projectMember.user = :currentUserId', { currentUserId: currentUserId })
      .andWhere('projectMember.project = :projectId', { projectId: projectId })
      .getOne();

    if (!currentProjectMember) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: {
          type: 'RESOURCE_NOT_FOUND',
          message: 'Could not find any project member',
        },
      });
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

    // El usuario actual tiene que estar en el mismo proyecto
    // Si el usuario no es administrador, la sesión que comprueba tiene que ser una de la que sea dueño
    // Pero si es admin, se devuelve y ya esta
    /*
    const session = Session.createQueryBuilder('session')
      .where('session.id = :sessionId', {
        sessionId: sessionId,
      })
      .leftJoin('session.projectMember', 'projectMember')
      .leftJoin('projectMember.project', 'project')
      .leftJoin('projectMember.user', 'user')
      .leftJoin(ProjectMember, 'requesterProjectMember', 'requester.project');

    res.status(200).json(await session.getOne());
    */
    /*
    const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
      .innerJoinAndSelect('projectMember.project', 'project')
      .innerJoinAndSelect('project.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .where('user.id = :currentUserId', { currentUserId: currentUserId })
      .leftJoinAndSelect('member.sessions', 'session')
      .andWhere('session.id = :sessionId', { sessionId: sessionId })
      .getMany();
      */
    // TODO NO BORRAR
    const test = await Project.createQueryBuilder('project')
      .leftJoinAndSelect('project.members', 'members')
      .leftJoinAndSelect('members.sessions', 'sessions')
      .where('sessions.id = :sessionId', { sessionId: sessionId })
      .leftJoinAndSelect('members.user', 'users')
      .andWhere('users.id = :currentUserId', { currentUserId: currentUserId })
      .getMany();

    const test2 = await ProjectMember.createQueryBuilder('currentMember')
      .leftJoinAndSelect('currentMember.user', 'currentUser')
      .where('currentUser.id = :currentUserId', { currentUserId: currentUserId })
      .leftJoinAndSelect('currentMember.project', 'project')
      .leftJoinAndSelect('project.members', 'otherMembers')
      .leftJoinAndSelect('otherMembers.sessions', 'sessions')
      .andWhere('sessions.id = :sessionId', { sessionId: sessionId })
      .getMany();

    const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember').getMany();

    res.status(200).json([test2]);
  },
  async updateSession(req: Request, res: Response) {},
  async deleteSession(req: Request, res: Response) {},
  async sessionEnd(req: Request, res: Response) {},
};

export default projectSessionControler;
