import express from 'express';
import { wrapAsync } from '../utils';

import defaultAuthMiddleware, {
  authMiddleware,
} from './middleware/auth-middleware';
import authController from './controller/auth-controller';
import userController from './controller/user-controller';
import projectController from './controller/project-controller';
import projectSessionController from './controller/project-session-controller';
import sessionNoteController from './controller/session-note-controller';
import sessionAppEventController from './controller/session-app-event-controller';
import projectMemberController from './controller/project-member-controller';
import dataController from './controller/data-controller';
import Mail from 'nodemailer/lib/mailer';
import { Connection } from 'typeorm';

// prettier-ignore
export default function mountRoutes(app: express.Application, connection: Connection, mailer: Mail) {
  const apiRouter = express.Router();
  apiRouter.post('/authenticate', wrapAsync(authController.authenticate));

  apiRouter.post('/create-account', wrapAsync(authController.createAccount(mailer)));
  apiRouter.post('/confirm-account/:token', wrapAsync(authController.confirmAccount));

  apiRouter.post('/request-password-reset', wrapAsync(authController.requestPasswordReset(mailer)));
  apiRouter.post('/perform-password-reset/:token', wrapAsync(authController.performPasswordReset(mailer)));

  // Special route for deauthentication
  apiRouter.post(
    '/deauthenticate',
    [authMiddleware(true)],
    wrapAsync(authController.deauthenticate),
  );

  // Protected routes
  const protectedRouter = express.Router();
  protectedRouter.use(defaultAuthMiddleware);

  protectedRouter.get('/current-user', wrapAsync(userController.currentUser));
  protectedRouter.patch('/update-user', wrapAsync(userController.updateUser));

  protectedRouter.get('/projects', wrapAsync(projectController.listProjects));
  protectedRouter.post('/projects', wrapAsync(projectController.createProject));
  protectedRouter.get('/projects/:projectId', wrapAsync(projectController.getProject));
  protectedRouter.patch('/projects/:projectId', wrapAsync(projectController.updateProject));
  protectedRouter.delete('/projects/:projectId', wrapAsync(projectController.deleteProject));

  protectedRouter.get('/projects/:projectId/members', wrapAsync(projectMemberController.listMembers));
  protectedRouter.post('/projects/:projectId/invite', wrapAsync(projectMemberController.inviteMember(mailer)));
  protectedRouter.post('/projects/:projectId/accept-invite/:token', wrapAsync(projectMemberController.acceptInvite));
  protectedRouter.get('/project_members/:memberId', wrapAsync(projectMemberController.getMember));
  protectedRouter.post('/project_members/:memberId/demote', wrapAsync(projectMemberController.demoteMember));
  protectedRouter.post('/project_members/:memberId/promote', wrapAsync(projectMemberController.promoteMember));
  protectedRouter.post('/project_members/:memberId/kick', wrapAsync(projectMemberController.kickMember));

  protectedRouter.get('/projects/:projectId/sessions', wrapAsync(projectSessionController.listSessions));
  protectedRouter.post('/projects/:projectId/sessions', wrapAsync(projectSessionController.createSession));
  protectedRouter.get('/sessions/:sessionId', wrapAsync(projectSessionController.getSession));
  protectedRouter.patch('/sessions/:sessionId', wrapAsync(projectSessionController.updateSession));
  protectedRouter.delete('/sessions/:sessionId', wrapAsync(projectSessionController.deleteSession));
  protectedRouter.post('/sessions/:sessionId/end', wrapAsync(projectSessionController.sessionEnd));

  protectedRouter.get('/sessions/:sessionId/notes', wrapAsync(sessionNoteController.listNotes));
  protectedRouter.post('/sessions/:sessionId/notes', wrapAsync(sessionNoteController.createNote));
  protectedRouter.get('/session_notes/:noteId', wrapAsync(sessionNoteController.getNote));
  protectedRouter.patch('/session_notes/:noteId', wrapAsync(sessionNoteController.updateNote));
  protectedRouter.delete('/session_notes/:noteId', wrapAsync(sessionNoteController.deleteNote));

  protectedRouter.get('/sessions/:sessionId/app_events', wrapAsync(sessionAppEventController.listAppEvents));
  protectedRouter.post('/sessions/:sessionId/app_events', wrapAsync(sessionAppEventController.createAppEvent));
  protectedRouter.get('/session_app_events/:appEventId', wrapAsync(sessionAppEventController.getAppEvent));
  protectedRouter.patch('/session_app_events/:appEventId', wrapAsync(sessionAppEventController.updateAppEvent));
  protectedRouter.delete('/session_app_events/:appEventId', wrapAsync(sessionAppEventController.deleteAppEvent));

  protectedRouter.get('/data_query/summary_statistics/:projectId', wrapAsync(dataController.summaryStatistics(connection)));
  protectedRouter.get('/data_query/history_statistics/:projectId', wrapAsync(dataController.historyStatistics(connection)));
  protectedRouter.get('/data_query/session_events/:sessionId', wrapAsync(dataController.sessionEvents(connection)));
  protectedRouter.get('/data_query/session_events_raw/:sessionId', wrapAsync(dataController.rawSessionEvents(connection)));

  apiRouter.use(protectedRouter);
  app.use('/', apiRouter);
}
