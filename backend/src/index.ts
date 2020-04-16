import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import authRouter from './routes/auth-routes';
import userRouter from './routes/user-routes';
import projectRouter from './routes/project-routes';
import './env';

async function startExpress(connection: Connection) {
  const app = express();

  // Security middlewares
  app.use(helmet());

  // Parsers middlewares
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cors({
    credentials: true,
    origin: process.env.TIMEIT_CORS_ORIGIN
  }));

  // Logging middleware
  app.use(morgan('combined'));

  // Routes
  app.use(authRouter);
  app.use(userRouter);
  app.use(projectRouter);

  app.get('/ping', function (req: Request, res: Response) {
    const numeroAleatorio = Math.floor(Math.random() * 1000);
    return res.send(`Number ${numeroAleatorio}`);
  });

  app.listen(process.env.PORT || 7001);
}

createConnection()
  .then(async (connection) => {
    await startExpress(connection);
    //await connection.close()
  })
  .catch((error) => console.log(error));
