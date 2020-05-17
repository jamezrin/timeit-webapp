import { Request, Response } from 'express';
import { TokenPayload } from '../middleware/auth-middleware';
import { ProjectMember } from '../../entity/ProjectMember';
import { resourceNotFoundError } from '../errors';
import HttpStatus from 'http-status-codes';

const dataController = {
  async projectStatistics(req: Request, res: Response) {
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
  },
};

export default dataController;
