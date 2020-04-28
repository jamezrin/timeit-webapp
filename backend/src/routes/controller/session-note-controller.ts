import { Request, Response } from 'express';
import { Session } from '../../entity/Session';
import HttpStatus from 'http-status-codes';
import { SessionNote } from '../../entity/SessionNote';
import { ProjectMember } from '../../entity/ProjectMember';
import { resourceNotFoundError } from '../errors';

// TODO Aplicar roles a esto
const sessionNoteController = {
  async listNotes(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { sessionId } = req.params;

    const session = await Session.createQueryBuilder('session')
      .where('session.id = :currentSessionId', {
        currentSessionId: sessionId,
      })
      .leftJoinAndSelect('session.sessionNotes', 'sessionNotes')
      .leftJoin('session.projectMember', 'projectMember')
      .leftJoin('projectMember.user', 'user')
      .andWhere('user.id = :currentUserId', {
        currentUserId: currentUserId,
      })
      .getOne();

    if (!session) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(session.sessionNotes);
  },
  async createNote(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { sessionId } = req.params;
    const { noteText } = req.body;

    const session = await Session.createQueryBuilder('session')
      .where('session.id = :currentSessionId', {
        currentSessionId: sessionId,
      })
      .leftJoin('session.projectMember', 'projectMember')
      .leftJoin('projectMember.user', 'user')
      .andWhere('user.id = :currentUserId', {
        currentUserId: currentUserId,
      })
      .getOne();

    if (!session) {
      return resourceNotFoundError(req, res);
    }

    const sessionNote = new SessionNote();
    sessionNote.noteText = noteText;
    sessionNote.session = session;
    await sessionNote.save();

    res.sendStatus(HttpStatus.ACCEPTED);
  },
  async getNote(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { noteId } = req.params;

    const sessionNote = await SessionNote.createQueryBuilder('sessionNote')
      .where('sessionNote.id = :currentNoteId', {
        currentNoteId: noteId,
      })
      .leftJoin('sessionNote.session', 'session')
      .leftJoin('session.projectMember', 'projectMember')
      .leftJoin('projectMember.user', 'user')
      .andWhere('user.id = :currentUserId', {
        currentUserId: currentUserId,
      })
      .getOne();

    if (!sessionNote) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(sessionNote);
  },
  async updateNote(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { noteId } = req.params;
    const { noteText } = req.body;

    const sessionNote = await SessionNote.createQueryBuilder('sessionNote')
      .where('sessionNote.id = :currentNoteId', {
        currentNoteId: noteId,
      })
      .leftJoin('sessionNote.session', 'session')
      .leftJoin('session.projectMember', 'projectMember')
      .leftJoin('projectMember.user', 'user')
      .andWhere('user.id = :currentUserId', {
        currentUserId: currentUserId,
      })
      .getOne();

    if (!sessionNote) {
      return resourceNotFoundError(req, res);
    }

    sessionNote.noteText = noteText || sessionNote.noteText;
    await sessionNote.save();

    res.status(HttpStatus.OK).json(sessionNote);
  },
  async deleteNote(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const currentUserId = tokenPayload['userId'];
    const { noteId } = req.params;

    const sessionNote = await SessionNote.createQueryBuilder('sessionNote')
      .where('sessionNote.id = :currentNoteId', {
        currentNoteId: noteId,
      })
      .leftJoin('sessionNote.session', 'session')
      .leftJoin('session.projectMember', 'projectMember')
      .leftJoin('projectMember.user', 'user')
      .andWhere('user.id = :currentUserId', {
        currentUserId: currentUserId,
      })
      .getOne();

    if (!sessionNote) {
      return resourceNotFoundError(req, res);
    }

    await sessionNote.remove();

    res.sendStatus(HttpStatus.OK);
  },
};

export default sessionNoteController;
