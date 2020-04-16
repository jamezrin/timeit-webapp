import { wrapAsync } from '../utils';
import express, { Request, Response } from 'express';

const sessionNoteRouter = express.Router();

// List notes
sessionNoteRouter.get('/notes', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

// Create note
sessionNoteRouter.post('/notes', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

// Delete note
sessionNoteRouter.delete('/notes/:noteId', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

export default sessionNoteRouter;