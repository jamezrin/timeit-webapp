import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { User, UserStatus } from './entity/User';
import { Project } from './entity/Project';

import {
  ProjectUser,
  ProjectUserRole,
  ProjectUserStatus,
} from './entity/ProjectUser';

import { Session } from './entity/Session';

async function createEntities(connection: Connection) {
  await User.delete({});
  await Project.delete({});

  console.log('Testing inserts...');
  const user = new User();
  user.dateOfBirth = new Date(2020, 4, 11, 22, 30, 15);
  user.firstName = 'Jaime';
  user.lastName = 'Martínez Rincón';
  user.passwordHash = 'some random hash';
  user.emailAddress = 'jaime@jamezrin.name';
  user.status = UserStatus.ACTIVE;
  await user.save();

  const project = new Project();
  project.name = 'Un proyecto muy bueno';
  await project.save();

  const projectUser = new ProjectUser();
  projectUser.user = user;
  projectUser.project = project;
  projectUser.role = ProjectUserRole.ADMIN;
  projectUser.status = ProjectUserStatus.ACTIVE;
  await projectUser.save();

  const session = new Session();
  session.projectUser = projectUser;
  await session.save();
}

async function findEntities(connection: Connection) {
  console.log('Testing selects...');

  const userRepository = await connection.getRepository(User);
  const user = await userRepository.findOne();
  console.log({
    user,
    projects: user.projects,
  });
}

createConnection()
  .then(async (connection) => {
    console.log('Connected to the database');

    await createEntities(connection);
    await findEntities(connection);

    await connection.close();
  })
  .catch((error) => console.log(error));
