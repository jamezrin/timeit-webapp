import { Request, Response } from 'express';
import { Session } from '../../entity/Session';
import HttpStatus from 'http-status-codes';
import { SessionNote } from '../../entity/SessionNote';
import { ProjectMember } from '../../entity/ProjectMember';
import { resourceNotFoundError, sessionEndedError } from '../errors';
import { TokenPayload } from '../middleware/auth-middleware';
import { isMemberPrivileged } from '../../utils';

const sessionNoteController = {
  async listNotes(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { sessionId } = req.params;
    const { memberIds } = req.query;

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

    const sessionQueryBuilder = Session.createQueryBuilder('session')
      .where('session.id = :sessionId', { sessionId })
      .leftJoinAndSelect('session.sessionNotes', 'sessionNotes');

    // Add an additional condition so that regular members can only see their stuff
    // and so that admin-like members can see all or choose which user(s) to filter
    if (isMemberPrivileged(currentProjectMember)) {
      if (memberIds) {
        sessionQueryBuilder.andWhere('session.projectMember IN (:...memberIds)', {
          memberIds: [].concat(memberIds),
        });
      }
    } else {
      sessionQueryBuilder.andWhere('session.projectMember = :currentProjectMemberId', {
        currentProjectMemberId: currentProjectMember.id,
      });
    }

    const session = await sessionQueryBuilder.getOne();

    if (!session) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(session.sessionNotes);
  },
  async createNote(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { sessionId } = req.params;
    const { noteText } = req.body;

    const session = await Session.createQueryBuilder('session')
      .where('session.id = :currentSessionId', {
        currentSessionId: sessionId,
      })
      .leftJoin('session.projectMember', 'projectMember')
      .andWhere('projectMember.user = :currentUserId', {
        currentUserId: currentUserId,
      })
      .getOne();

    if (!session) {
      return resourceNotFoundError(req, res);
    }

    if (session.endedAt) {
      return sessionEndedError(req, res);
    }

    const sessionNote = new SessionNote();
    sessionNote.noteText = noteText;
    sessionNote.session = session;
    await sessionNote.save();

    // Update the session updatedAt date
    await Session.update(session.id, {});

    res.sendStatus(HttpStatus.ACCEPTED);
  },
  async getNote(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;
    const { noteId } = req.params;

    // Current user as a member of the project that has this note
    const currentProjectMember = await ProjectMember.createQueryBuilder('projectMember')
      .where('projectMember.user = :currentUserId', { currentUserId })
      .leftJoin('projectMember.project', 'project')
      .leftJoin('project.members', 'otherMembers')
      .leftJoin('otherMembers.sessions', 'otherMemberSessions')
      .leftJoin('otherMemberSessions.sessionNotes', 'otherSessionNotes')
      .andWhere('otherSessionNotes.id = :noteId', { noteId })
      .getOne();

    if (!currentProjectMember) {
      return resourceNotFoundError(req, res);
    }

    // prettier-ignore
    const sessionNoteQueryBuilder = SessionNote.createQueryBuilder('sessionNote')
      .where('sessionNote.id = :noteId', { noteId });

    // Ensure the note session being looked up is owned by the current member
    if (!isMemberPrivileged(currentProjectMember)) {
      sessionNoteQueryBuilder.leftJoin('sessionNote.session', 'session');
      sessionNoteQueryBuilder.andWhere('session.projectMember = :currentProjectMemberId', {
        currentProjectMemberId: currentProjectMember.id,
      });
    }

    const sessionNote = await sessionNoteQueryBuilder.getOne();
    if (!sessionNote) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(sessionNote);
  },
  async updateNote(req: Request, res: Response) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  },
  async deleteNote(req: Request, res: Response) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  },
};

export default sessionNoteController;
