import { Request, Response } from 'express';
import { TokenPayload } from '../middleware/auth-middleware';
import { ProjectMember } from '../../entity/ProjectMember';
import { resourceNotFoundError } from '../errors';
import HttpStatus from 'http-status-codes';
import { Connection } from 'typeorm';
import { Session } from '../../entity/Session';
import { isMemberPrivileged } from '../../utils';

const dataController = {
  projectStats(conn: Connection) {
    return async function (req: Request, res: Response) {
      const tokenPayload = res.locals.tokenPayload as TokenPayload;
      const currentUserId = tokenPayload.userId;
      const { projectId } = req.params;
      const { memberIds } = req.query;

      // Current user as a member of the current project
      const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
        .where('projectMember.project = :projectId', { projectId })
        .andWhere('projectMember.user = :currentUserId', { currentUserId })
        .getOne();

      if (!currentProjectMember) {
        return resourceNotFoundError(req, res);
      }

      /* TODO
      const sampleResponse = {
        timeSpentTotal: 0,
        timeSpentPerDayAvg: 0,
        timeSpentLastMonth: 0,
        timeSpentLastDay: 0,
        sessions: [
          {
            memberId: 0,
            sessionId: 0,
            timestampStart: 0,
            timestampEnd: 0,
            appEventCount: 0,
            appEventVariety: 0,
            noteCount: 0,
          },
        ],
      };
      */

      res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
    };
  },
  sessionEvents(conn: Connection) {
    // TODO: This should be paginated
    return async function (req: Request, res: Response) {
      const tokenPayload = res.locals.tokenPayload as TokenPayload;
      const currentUserId = tokenPayload.userId;
      const { sessionId } = req.params;

      // Current user as a member of the project that has this session
      const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
        .where('projectMember.user = :currentUserId', { currentUserId })
        .leftJoin('projectMember.project', 'project')
        .leftJoin('project.members', 'otherMembers')
        .leftJoin('otherMembers.sessions', 'otherMemberSessions')
        .andWhere('otherMemberSessions.id = :sessionId', { sessionId })
        .getOne();

      if (!currentProjectMember) {
        return resourceNotFoundError(req, res);
      }

      // prettier-ignore
      const sessionQueryBuilder = Session.createQueryBuilder('session')
        .where('session.id = :sessionId', { sessionId });

      // Ensure the session being looked up is owned by the current member
      if (!isMemberPrivileged(currentProjectMember)) {
        sessionQueryBuilder.andWhere('session.projectMember = :currentProjectMemberId', {
          currentProjectMemberId: currentProjectMember.id,
        });
      }

      const session = await sessionQueryBuilder.getOne();

      if (!session) {
        return resourceNotFoundError(req, res);
      }

      const allEvents = await conn.query(
        `
        SELECT id, type, "createdAt", data FROM (
            SELECT MAX(id) as id, 
                'app_event' AS type, 
                MAX("createdAt") AS "createdAt",
                "sessionId",
                json_build_object(
                    'windowName', "windowName", 
                    'windowClass', "windowClass", 
                    'windowPid', "windowPid",
                    'eventCount', COUNT(id),
                    'firstEventId', MIN(id),
                    'firstEventTime', MIN("createdAt")
                ) AS data
            FROM session_app_event
                GROUP BY "windowName", "windowClass", "windowPid", "sessionId"
            UNION ALL
            SELECT id,
                'note' AS type, 
                "createdAt",
                "sessionId",
                json_build_object(
                    'text', "noteText"
                ) AS data
            FROM session_note
        ) AS session_update
        WHERE "sessionId" = $1
        ORDER BY "createdAt" DESC
      `,
        [sessionId],
      );

      res.status(HttpStatus.OK).json(allEvents);
    };
  },
  rawSessionEvents(conn: Connection) {
    // TODO: This should be paginated
    return async function (req: Request, res: Response) {
      const tokenPayload = res.locals.tokenPayload as TokenPayload;
      const currentUserId = tokenPayload.userId;
      const { sessionId } = req.params;

      // Current user as a member of the project that has this session
      const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
        .where('projectMember.user = :currentUserId', { currentUserId })
        .leftJoin('projectMember.project', 'project')
        .leftJoin('project.members', 'otherMembers')
        .leftJoin('otherMembers.sessions', 'otherMemberSessions')
        .andWhere('otherMemberSessions.id = :sessionId', { sessionId })
        .getOne();

      if (!currentProjectMember) {
        return resourceNotFoundError(req, res);
      }

      // prettier-ignore
      const sessionQueryBuilder = Session.createQueryBuilder('session')
        .where('session.id = :sessionId', { sessionId });

      // Ensure the session being looked up is owned by the current member
      if (!isMemberPrivileged(currentProjectMember)) {
        sessionQueryBuilder.andWhere('session.projectMember = :currentProjectMemberId', {
          currentProjectMemberId: currentProjectMember.id,
        });
      }

      const session = await sessionQueryBuilder.getOne();

      if (!session) {
        return resourceNotFoundError(req, res);
      }

      const allEvents = await conn.query(
        `
        SELECT id, type, "createdAt", data FROM (
            SELECT id, 
                'app_event' AS type, 
                "createdAt",
                "sessionId",
                json_build_object(
                    'windowName', "windowName", 
                    'windowClass', "windowClass", 
                    'windowPid', "windowPid"
                ) AS data
            FROM session_app_event
            UNION ALL
            SELECT id,
                'note' AS type, 
                "createdAt",
                "sessionId",
                json_build_object(
                    'text', "noteText"
                ) AS data
            FROM session_note
        ) AS session_update
        WHERE "sessionId" = $1
        ORDER BY "createdAt" DESC;
      `,
        [sessionId],
      );

      res.status(HttpStatus.OK).json(allEvents);
    };
  },
};

export default dataController;
