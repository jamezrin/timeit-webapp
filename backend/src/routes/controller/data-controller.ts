import { Request, Response } from 'express';
import { TokenPayload } from '../middleware/auth-middleware';
import { ProjectMember } from '../../entity/ProjectMember';
import { resourceNotFoundError } from '../errors';
import HttpStatus from 'http-status-codes';
import { Connection } from 'typeorm';
import { Session } from '../../entity/Session';
import { isMemberPrivileged } from '../../utils';
import { start } from 'repl';

const dataController = {
  projectStats(conn: Connection) {
    return async function (req: Request, res: Response) {
      const tokenPayload = res.locals.tokenPayload as TokenPayload;
      const currentUserId = tokenPayload.userId;
      const { projectId } = req.params;
      const { memberIds, startDate, endDate } = req.query;

      // Current user as a member of the current project
      const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
        .where('projectMember.project = :projectId', { projectId })
        .andWhere('projectMember.user = :currentUserId', { currentUserId })
        .getOne();

      if (!currentProjectMember) {
        return resourceNotFoundError(req, res);
      }

      /*
      if (isMemberPrivileged(currentProjectMember)) {
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
      */

      /*
      AND project_member.id IN ($2)
      AND project.id = $1
      */

      // TODO Also add members below
      const allStats = await conn.query(
        `
        WITH allSessionsCte AS (
          SELECT session.*,
            EXTRACT(EPOCH FROM (
                COALESCE(
                  session."endedAt",
                  session."updatedAt"
                ) - session."createdAt"
            )) AS "durationSeconds"
            FROM session 
            LEFT JOIN project_member
              ON project_member.id = session."projectMemberId"
            LEFT JOIN project
              ON project.id = project_member."projectId"
            WHERE session."createdAt" BETWEEN $1 AND $2
              AND project.id = $3
              AND project_member.id = ANY($4::int[])
        )
        SELECT currentPeriodStats.*,
          lastMonthStats.*
          FROM (
            WITH currentPeriodSessionsCte AS (
              SELECT allSessionsCte.*,
                FLOOR(allSessionsCte."durationSeconds" / 60)
                  AS "durationMinutes"
              FROM allSessionsCte
            ) 
            SELECT 
              COALESCE(SUM("durationMinutes"), 0) 
                AS "currentPeriodStatsMinuteSum",
              COALESCE(AVG("durationMinutes"), 0) 
                AS "currentPeriodStatsMinuteAvg",
              COALESCE(MIN("durationMinutes"), 0) 
                AS "currentPeriodStatsMinuteMin",
              COALESCE(MAX("durationMinutes"), 0) 
                AS "currentPeriodStatsMinuteMax",
              COUNT(currentPeriodSessionsCte.id)::integer 
                AS "currentPeriodStatsCount"
            FROM currentPeriodSessionsCte
          ) AS currentPeriodStats, (
            WITH lastMonthSessionsCte AS (
              SELECT allSessionsCte.*,
                FLOOR(allSessionsCte."durationSeconds" / 3600)
                  AS "durationHours"
              FROM allSessionsCte
            )
            SELECT 
              SUM(allSessionsCte.id) AS "lastMonthStatsHourSum",
              AVG(allSessionsCte.id) AS "lastMonthStatsHourAvg",
              MIN(allSessionsCte.id) AS "lastMonthStatsHourMin",
              MAX(allSessionsCte.id) AS "lastMonthStatsHourMax"
            FROM allSessionsCte
          ) AS lastMonthStats
        `,
        [startDate, endDate, projectId, [].concat(memberIds)],
      );

      res.status(HttpStatus.OK).json(allStats[0]);
    };
  },
  sessionEvents(conn: Connection) {
    // TODO: This should be paginated
    // TODO: Include from/to period
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
    // TODO: Include from/to period
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
