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

      // TODO: Include from/to period

      // Current user as a member of the current project
      const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
        .where('projectMember.project = :projectId', { projectId })
        .andWhere('projectMember.user = :currentUserId', { currentUserId })
        .getOne();

      if (!currentProjectMember) {
        return resourceNotFoundError(req, res);
      }

      // TODO: Actually implement all these types of stats
      /*
      const allStats = await conn.query(
        `
         SELECT 
           (SELECT 1 AS x) AS "lastMonthStats_hoursSum",
           (SELECT 1 AS x) AS "lastMonthStats_hoursAvg",
           (SELECT 1 AS x) AS "lastMonthStats_hoursMin",
           (SELECT 1 AS x) AS "lastMonthStats_hoursMax",
           (SELECT 1 AS x) AS "lastWeekStats_hoursSum",
           (SELECT 1 AS x) AS "lastWeekStats_hoursAvg",
           (SELECT 1 AS x) AS "lastWeekStats_hoursMin",
           (SELECT 1 AS x) AS "lastWeekStats_hoursMax",
           (SELECT 1 AS x) AS "lastDayStats_hoursSum",
           (SELECT 1 AS x) AS "lastDayStats_hoursAvg",
           (SELECT 1 AS x) AS "lastDayStats_hoursMin",
           (SELECT 1 AS x) AS "lastDayStats_hoursMax",
           (SELECT 1 AS x) AS "periodStats_hoursSum",
           (SELECT 1 AS x) AS "periodStats_periodDays",
           (SELECT 1 AS x) AS "periodStats_daysWithTracking";
      `,
        //[projectId, memberIds],
      );
      */

      /*
      SUM(session.id) AS theSum,
      AVG(session.id) AS theAvg,
      MIN(session.id) AS theMin,
      MAX(session.id) AS theMax
      */

      const allStats = await conn.query(
        `
        SELECT lastMonthStats.*, 
          lastWeekStats.*, 
          lastDayStats.*, 
          periodStats.*
        FROM (
          SELECT 
            SUM(session."endedAt" - session."createdAt") AS "lastMonthStats_hoursSum",
            AVG(session."endedAt" - session."createdAt") AS "lastMonthStats_hoursAvg",
            MIN(session."endedAt" - session."createdAt") AS "lastMonthStats_hoursMin",
            MAX(session."endedAt" - session."createdAt") AS "lastMonthStats_hoursMax"
          FROM session
          WHERE session."createdAt" BETWEEN $1 AND $2
        ) AS lastMonthStats, (
          SELECT 
            SUM(session.id) AS "lastWeekStats_hoursSum",
            AVG(session.id) AS "lastWeekStats_hoursAvg",
            MIN(session.id) AS "lastWeekStats_hoursMin",
            MAX(session.id) AS "lastWeekStats_hoursMax"
          FROM session
          WHERE session."createdAt" BETWEEN $1 AND $2
        ) AS lastWeekStats, (
          SELECT 
            SUM(session.id) AS "lastDayStats_hoursSum",
            AVG(session.id) AS "lastDayStats_hoursAvg",
            MIN(session.id) AS "lastDayStats_hoursMin",
            MAX(session.id) AS "lastDayStats_hoursMax"
          FROM session
          WHERE session."createdAt" BETWEEN $1 AND $2
        ) AS lastDayStats, (
          SELECT 
            SUM(session.id) AS "periodStats_hoursSum",
            AVG(session.id) AS "periodStats_hoursAvg",
            MIN(session.id) AS "periodStats_hoursMin",
            MAX(session.id) AS "periodStats_hoursMax"
          FROM session
          WHERE session."createdAt" BETWEEN $1 AND $2
        ) AS periodStats;
        `,
        [startDate, endDate],
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
