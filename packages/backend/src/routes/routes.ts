import express from 'express';
import asyncHandler from 'express-async-handler';

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
  apiRouter.post('/authenticate', asyncHandler(authController.authenticate));

  apiRouter.post('/create-account', asyncHandler(authController.createAccount(mailer)));
  apiRouter.post('/confirm-account/:token', asyncHandler(authController.confirmAccount));

  apiRouter.post('/request-password-reset', asyncHandler(authController.requestPasswordReset(mailer)));
  apiRouter.post('/perform-password-reset/:token', asyncHandler(authController.performPasswordReset(mailer)));

  // Special route for deauthentication
  apiRouter.post(
    '/deauthenticate',
    [authMiddleware(true)],
    asyncHandler(authController.deauthenticate),
  );

  // Protected routes
  const protectedRouter = express.Router();
  protectedRouter.use(defaultAuthMiddleware);

  protectedRouter.get('/current-user', asyncHandler(userController.currentUser));
  protectedRouter.patch('/update-user', asyncHandler(userController.updateUser));

  protectedRouter.get('/projects', asyncHandler(projectController.listProjects));
  protectedRouter.post('/projects', asyncHandler(projectController.createProject));
  protectedRouter.get('/projects/:projectId', asyncHandler(projectController.getProject));
  protectedRouter.patch('/projects/:projectId', asyncHandler(projectController.updateProject));
  protectedRouter.delete('/projects/:projectId', asyncHandler(projectController.deleteProject));

  protectedRouter.get('/projects/:projectId/members', asyncHandler(projectMemberController.listMembers));
  protectedRouter.post('/projects/:projectId/invite', asyncHandler(projectMemberController.inviteMember(mailer)));
  protectedRouter.post('/projects/:projectId/accept-invite/:token', asyncHandler(projectMemberController.acceptInvite));
  protectedRouter.get('/project_members/:memberId', asyncHandler(projectMemberController.getMember));
  protectedRouter.post('/project_members/:memberId/demote', asyncHandler(projectMemberController.demoteMember));
  protectedRouter.post('/project_members/:memberId/promote', asyncHandler(projectMemberController.promoteMember));
  protectedRouter.post('/project_members/:memberId/kick', asyncHandler(projectMemberController.kickMember));

  protectedRouter.get('/projects/:projectId/sessions', asyncHandler(projectSessionController.listSessions));
  protectedRouter.post('/projects/:projectId/sessions', asyncHandler(projectSessionController.createSession));
  protectedRouter.get('/sessions/:sessionId', asyncHandler(projectSessionController.getSession));
  protectedRouter.patch('/sessions/:sessionId', asyncHandler(projectSessionController.updateSession));
  protectedRouter.delete('/sessions/:sessionId', asyncHandler(projectSessionController.deleteSession));
  protectedRouter.post('/sessions/:sessionId/end', asyncHandler(projectSessionController.sessionEnd));

  protectedRouter.get('/sessions/:sessionId/notes', asyncHandler(sessionNoteController.listNotes));
  protectedRouter.post('/sessions/:sessionId/notes', asyncHandler(sessionNoteController.createNote));
  protectedRouter.get('/session_notes/:noteId', asyncHandler(sessionNoteController.getNote));
  protectedRouter.patch('/session_notes/:noteId', asyncHandler(sessionNoteController.updateNote));
  protectedRouter.delete('/session_notes/:noteId', asyncHandler(sessionNoteController.deleteNote));

  protectedRouter.get('/sessions/:sessionId/app_events', asyncHandler(sessionAppEventController.listAppEvents));
  protectedRouter.post('/sessions/:sessionId/app_events', asyncHandler(sessionAppEventController.createAppEvent));
  protectedRouter.get('/session_app_events/:appEventId', asyncHandler(sessionAppEventController.getAppEvent));
  protectedRouter.patch('/session_app_events/:appEventId', asyncHandler(sessionAppEventController.updateAppEvent));
  protectedRouter.delete('/session_app_events/:appEventId', asyncHandler(sessionAppEventController.deleteAppEvent));

  protectedRouter.get('/data_query/summary_statistics/:projectId', asyncHandler(dataController.summaryStatistics(connection)));
  protectedRouter.get('/data_query/history_statistics/:projectId', asyncHandler(dataController.historyStatistics(connection)));
  protectedRouter.get('/data_query/session_events/:sessionId', asyncHandler(dataController.sessionEvents(connection)));
  protectedRouter.get('/data_query/session_events_raw/:sessionId', asyncHandler(dataController.rawSessionEvents(connection)));

  apiRouter.use(protectedRouter);
  app.use('/', apiRouter);
}
