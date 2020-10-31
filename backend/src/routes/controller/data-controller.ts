import { Request, Response } from "express";
import { TokenPayload } from "../middleware/auth-middleware";
import { ProjectMember } from "../../entity/ProjectMember";
import { resourceNotFoundError, unknownServerError } from "../errors";
import HttpStatus from "http-status-codes";
import { Connection } from "typeorm";
import { Session } from "../../entity/Session";
import { isMemberPrivileged } from "../../utils";

const dataController = {
  summaryStatistics(conn: Connection) {
    return async function(req: Request, res: Response) {
      const tokenPayload = res.locals.tokenPayload as TokenPayload;
      const currentUserId = tokenPayload.userId;
      const { projectId } = req.params;
      const { memberIds, startDate, endDate } = req.query;

      // Current user as a member of the current project
      const currentProjectMember = await ProjectMember.createQueryBuilder("projectMember")
        .where("projectMember.project = :projectId", { projectId })
        .andWhere("projectMember.user = :currentUserId", { currentUserId })
        .getOne();

      if (!currentProjectMember) {
        return resourceNotFoundError(req, res);
      }

      const filteredMemberIds = [].concat(memberIds).filter((memberId) => {
        // Query all member ids specified if the member that makes the request is privileged
        if (isMemberPrivileged(currentProjectMember)) {
          return true;
        }

        // Otherwise, only let the id of the member that makes the request through
        return memberId === currentProjectMember.id;
      });

      const allStats = await conn.query(
        `
        WITH allSessionsCte AS (
          SELECT session.*,
            FLOOR(EXTRACT(EPOCH FROM (
                COALESCE(
                  session."endedAt",
                  session."updatedAt"
                ) - session."createdAt"
            )) / 60) AS "durationMinutes"
            FROM session 
            LEFT JOIN project_member
              ON project_member.id = session."projectMemberId"
            LEFT JOIN project
              ON project.id = project_member."projectId"
            WHERE session."createdAt" BETWEEN $1 AND DATE($2) + interval '1 day'
              AND project.id = $3
              AND project_member.id = ANY($4::int[])
        )
        SELECT currentPeriodStats.*,
          lastDayStats.*,
          lastWeekStats.*,
          lastMonthStats.*
          FROM (
            SELECT 
              COALESCE(SUM("durationMinutes"), 0) 
                AS "currentPeriodStatsMinuteSum",
              COALESCE(ROUND(AVG("durationMinutes")), 0)
                AS "currentPeriodStatsMinuteAvg",
              COALESCE(MIN("durationMinutes"), 0) 
                AS "currentPeriodStatsMinuteMin",
              COALESCE(MAX("durationMinutes"), 0) 
                AS "currentPeriodStatsMinuteMax",
              COUNT(allSessionsCte.id)::integer 
                AS "currentPeriodSessionCount"
            FROM allSessionsCte
          ) AS currentPeriodStats, (
            SELECT 
              COALESCE(SUM("durationMinutes"), 0) 
                AS "lastDayStatsMinuteSum",
              COALESCE(ROUND(AVG("durationMinutes")), 0)
                AS "lastDayStatsMinuteAvg",
              COALESCE(MIN("durationMinutes"), 0) 
                AS "lastDayStatsMinuteMin",
              COALESCE(MAX("durationMinutes"), 0) 
                AS "lastDayStatsMinuteMax"
            FROM allSessionsCte
            WHERE DATE("createdAt") = DATE($2)
          ) AS lastDayStats, (
            SELECT 
              COALESCE(SUM("durationMinutes"), 0) 
                AS "lastWeekStatsMinuteSum",
              COALESCE(ROUND(AVG("durationMinutes")), 0)
                AS "lastWeekStatsMinuteAvg",
              COALESCE(MIN("durationMinutes"), 0) 
                AS "lastWeekStatsMinuteMin",
              COALESCE(MAX("durationMinutes"), 0) 
                AS "lastWeekStatsMinuteMax"
            FROM allSessionsCte
            WHERE EXTRACT(WEEK FROM "createdAt") = 
              EXTRACT(WEEK FROM $2)
            AND EXTRACT(YEAR FROM "createdAt") =
              EXTRACT(YEAR FROM $2)
          ) AS lastWeekStats, (
            SELECT 
              COALESCE(SUM("durationMinutes"), 0) 
                AS "lastMonthStatsMinuteSum",
              COALESCE(ROUND(AVG("durationMinutes")), 0)
                AS "lastMonthStatsMinuteAvg",
              COALESCE(MIN("durationMinutes"), 0) 
                AS "lastMonthStatsMinuteMin",
              COALESCE(MAX("durationMinutes"), 0) 
                AS "lastMonthStatsMinuteMax"
            FROM allSessionsCte
            WHERE EXTRACT(MONTH FROM "createdAt") = 
              EXTRACT(MONTH FROM $2)
            AND EXTRACT(YEAR FROM "createdAt") =
              EXTRACT(YEAR FROM $2)
          ) AS lastMonthStats
        `,
        [startDate, endDate, projectId, filteredMemberIds]
      );

      // More than one row, wth?
      if (allStats.length > 1) {
        return unknownServerError(req, res);
      }

      res.status(HttpStatus.OK).json(allStats[0]);
    };
  },
  historyStatistics(conn: Connection) {
    return async function(req: Request, res: Response) {
      const tokenPayload = res.locals.tokenPayload as TokenPayload;
      const currentUserId = tokenPayload.userId;
      const { projectId } = req.params;
      const { memberId, startDate, endDate } = req.query;

      // Current user as a member of the current project
      const currentProjectMember = await ProjectMember.createQueryBuilder("projectMember")
        .where("projectMember.project = :projectId", { projectId })
        .andWhere("projectMember.user = :currentUserId", { currentUserId })
        .getOne();

      if (!currentProjectMember) {
        return resourceNotFoundError(req, res);
      }

      if (
        !isMemberPrivileged(currentProjectMember) &&
        currentProjectMember.id !== parseInt(memberId as string)
      ) {
        return resourceNotFoundError(req, res);
      }

      const allHistory = await conn.query(
        `
        SELECT period_date AS day, (
          SELECT COALESCE(SUM(
            EXTRACT(EPOCH FROM (
              COALESCE(
                session."endedAt",
                session."updatedAt"
              ) - session."createdAt"
            )) / 60
          ), 0)
          FROM session
          LEFT JOIN project_member
            ON project_member.id = session."projectMemberId"
          LEFT JOIN project
            ON project.id = project_member."projectId"
          WHERE DATE(session."createdAt") = period_date
            AND project.id = $3
            AND project_member.id = $4
        ) AS "minuteSum"
        FROM (
          SELECT DATE(GENERATE_SERIES(
            $1,
            $2,
            interval '1 day'
          )) AS period_date
        ) AS period_date_series
        ORDER BY period_date DESC;
      `,
        [startDate, endDate, projectId, memberId]
      );

      res.status(HttpStatus.OK).json(allHistory);
    };
  },
  sessionEvents(conn: Connection) {
    // TODO: This should be paginated
    // TODO: Include from/to period
    return async function(req: Request, res: Response) {
      const tokenPayload = res.locals.tokenPayload as TokenPayload;
      const currentUserId = tokenPayload.userId;
      const { sessionId } = req.params;

      // Current user as a member of the project that has this session
      const currentProjectMember = await ProjectMember.createQueryBuilder("projectMember")
        .where("projectMember.user = :currentUserId", { currentUserId })
        .leftJoin("projectMember.project", "project")
        .leftJoin("project.members", "otherMembers")
        .leftJoin("otherMembers.sessions", "otherMemberSessions")
        .andWhere("otherMemberSessions.id = :sessionId", { sessionId })
        .getOne();

      if (!currentProjectMember) {
        return resourceNotFoundError(req, res);
      }

      // prettier-ignore
      const sessionQueryBuilder = Session.createQueryBuilder("session")
        .where("session.id = :sessionId", { sessionId });

      // Ensure the session being looked up is owned by the current member
      if (!isMemberPrivileged(currentProjectMember)) {
        sessionQueryBuilder.andWhere("session.projectMember = :currentProjectMemberId", {
          currentProjectMemberId: currentProjectMember.id
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
        [sessionId]
      );

      res.status(HttpStatus.OK).json(allEvents);
    };
  },
  rawSessionEvents(conn: Connection) {
    // TODO: This should be paginated
    // TODO: Include from/to period
    return async function(req: Request, res: Response) {
      const tokenPayload = res.locals.tokenPayload as TokenPayload;
      const currentUserId = tokenPayload.userId;
      const { sessionId } = req.params;

      // Current user as a member of the project that has this session
      const currentProjectMember = await ProjectMember.createQueryBuilder("projectMember")
        .where("projectMember.user = :currentUserId", { currentUserId })
        .leftJoin("projectMember.project", "project")
        .leftJoin("project.members", "otherMembers")
        .leftJoin("otherMembers.sessions", "otherMemberSessions")
        .andWhere("otherMemberSessions.id = :sessionId", { sessionId })
        .getOne();

      if (!currentProjectMember) {
        return resourceNotFoundError(req, res);
      }

      // prettier-ignore
      const sessionQueryBuilder = Session.createQueryBuilder("session")
        .where("session.id = :sessionId", { sessionId });

      // Ensure the session being looked up is owned by the current member
      if (!isMemberPrivileged(currentProjectMember)) {
        sessionQueryBuilder.andWhere("session.projectMember = :currentProjectMemberId", {
          currentProjectMemberId: currentProjectMember.id
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
        [sessionId]
      );

      res.status(HttpStatus.OK).json(allEvents);
    };
  }
};

export default dataController;
