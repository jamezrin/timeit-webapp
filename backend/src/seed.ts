import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import './env';

import { User, UserStatus } from './entity/User';
import { hashPassword } from './utils';
import {
  ProjectUser,
  ProjectUserRole,
  ProjectUserStatus,
} from './entity/ProjectUser';
import { Project } from './entity/Project';
import { Session } from './entity/Session';
import { SessionAppEvent } from './entity/SessionAppEvent';
import { SessionNote } from './entity/SessionNote';
import { MailRequestType, MailToken } from './entity/MailToken';
import { UserToken, UserTokenStatus } from './entity/UserToken';

async function up(conn: Connection) {
  // Users
  const user1 = await createUser();
  await user1.save();

  const user2 = await createUser();
  await user2.save();

  // Projects
  const project1 = await createProject();
  await project1.save();

  const project2 = await createProject();
  await project2.save();

  // Project relation with first user
  const projectUser1 = await createProjectUser(user1, project1);
  await projectUser1.save();

  const projectUser2 = await createProjectUser(user1, project2);
  await projectUser2.save();

  // Project relation with second user
  const projectUser3 = await createProjectUser(user2, project1);
  await projectUser3.save();

  const projectUser4 = await createProjectUser(user2, project2);
  await projectUser4.save();

  // Session relation with first user and first project
  const session1 = await createSession(projectUser1);
  await session1.save();

  // Session relation with second user and first project
  const session2 = await createSession(projectUser3);
  await session2.save();

  // App event in first session
  const sessionAppEvent1 = await createSessionAppEvent(session1);
  await sessionAppEvent1.save();

  // Note in second session
  const sessionNote1 = await createSessionNote(session2);
  await sessionNote1.save();

  // Mail token in first user
  const mailToken = await createMailToken(user1);
  await mailToken.save();

  // User token in second user
  const userToken = await createUserToken(user2);
  await userToken.save();

  await testInsertAppEvent(conn, project1.id, session1.id);
}

function randomNumber() {
  return Math.ceil(Math.random() * 100);
}

async function createUserToken(user: User) {
  const userToken = new UserToken();
  userToken.status = UserTokenStatus.ACTIVE;
  userToken.user = user;
  return userToken;
}

async function createMailToken(user: User) {
  const mailToken = new MailToken();
  mailToken.type = MailRequestType.PASSWORD_RESET;
  mailToken.expiresIn = -1;
  mailToken.user = user;
  return mailToken;
}

async function createSessionNote(session: Session) {
  const sessionNote = new SessionNote();
  sessionNote.noteText = `Sample note ${randomNumber()}`;
  sessionNote.session = session;
  return sessionNote;
}

async function createSessionAppEvent(session: Session) {
  const sessionAppEvent = new SessionAppEvent();
  sessionAppEvent.session = session;
  sessionAppEvent.windowPid = randomNumber();
  sessionAppEvent.windowName = `Sample window ${randomNumber()}`;
  sessionAppEvent.windowClass = `Sample window class ${randomNumber()}`;
  return sessionAppEvent;
}

async function createUser() {
  const user = new User();
  user.emailAddress = `jaime${randomNumber()}@jamezrin.name`;
  user.firstName = 'Jaime';
  user.lastName = 'Martínez Rincón';
  user.passwordHash = await hashPassword('superpass');
  user.status = UserStatus.ACTIVE;
  return user;
}

async function createProject() {
  const project = new Project();
  project.name = `Project ${randomNumber()}`;
  return project;
}

async function createSession(projectUser: ProjectUser) {
  const session = new Session();
  session.projectUser = projectUser;
  return session;
}

async function createProjectUser(user: User, project: Project) {
  const projectUser = new ProjectUser();
  projectUser.role = ProjectUserRole.ADMIN;
  projectUser.status = ProjectUserStatus.ACTIVE;
  projectUser.project = project;
  projectUser.user = user;
  return projectUser;
}

async function testInsertAppEvent(
  conn: Connection,
  projectId: number,
  sessionId: number,
) {
  // /projects/:projectId/sessions/:sessionId/app-events
  const testAppEvent = new SessionAppEvent();
  testAppEvent.windowName = 'test window name';
  testAppEvent.windowClass = 'test window class';
  testAppEvent.windowPid = 1337;
}

async function down(conn: Connection) {
  await Project.delete({});
  await User.delete({});
}

createConnection()
  .then(async (connection) => {
    await up(connection);
    //await down(connection);
  })
  .catch((error) => console.log(error));
