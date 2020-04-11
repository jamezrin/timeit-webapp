import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { User } from './entity/User';

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

async function startExpress() {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cors());
  app.use(morgan('combined'));

  app.get('/ping', function (req: Request, res: Response) {
    const numeroAleatorio = Math.floor(Math.random() * 1000);
    return res.send(`Numero ${numeroAleatorio}`);
  });

  app.listen(process.env.PORT || 7001);
}

async function testTypeORM(connection: Connection) {
  console.log('Inserting a new user into the database...');
  const user = new User();
  user.firstName = 'Jaime';
  user.lastName = 'Martínez Rincón';
  user.dateOfBirth = new Date(2020, 4, 11, 20, 30, 0);
  user.passwordHash = 'some password hash';
  user.emailAddress = 'jaime@jamezrin.name';
  await connection.manager.save(user);
  console.log('Saved a new user with id: ' + user.id);

  console.log('Loading users from the database...');
  const users = await connection.manager.find(User);

  console.log('Loaded users: ', users);
}

createConnection()
  .then(async (connection) => {
    await testTypeORM(connection);
    await startExpress();
  })
  .catch((error) => console.log(error));
