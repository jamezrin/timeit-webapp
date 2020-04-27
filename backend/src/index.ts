import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import authRouter from './routes/auth-routes';
import userRouter from './routes/user-routes';
import projectRouter from './routes/project-routes';
import defaultAuthMiddleware from './auth-middleware';

// Very important for getting env populated
import './env';

async function startExpress(connection: Connection) {
  const app = express();

  // Security middlewares
  app.use(helmet());
  app.use(
    cors({
      credentials: true,
      origin: process.env.TIMEIT_CORS_ORIGIN,
    }),
  );

  // Parsers middlewares
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  // Logging middleware
  app.use(morgan('combined'));

  // Routes
  app.use(authRouter);
  app.use(userRouter);
  app.use(projectRouter);

  app.listen(process.env.PORT || 7001);
}

createConnection()
  .then(async (connection) => {
    await startExpress(connection);
  })
  .catch((error) => console.log(error));
