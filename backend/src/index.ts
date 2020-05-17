import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import HttpStatus from 'http-status-codes';
import mountRoutes from './routes/routes';
// Very important for getting env populated
import './env';

async function startExpress(conn: Connection) {
  const app = express();

  // Security middlewares
  app.use(helmet());
  app.use(
    cors({
      credentials: true,
      origin: process.env.TIMEIT_CORS_ORIGINS.split(','),
    }),
  );

  // Parsers middlewares
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  // Logging middleware
  app.use(morgan('combined'));

  app.all('/', (req, res) => {
    res.status(HttpStatus.OK).send('API server is functioning normally');
  });

  // From now on, there are only protected routes
  mountRoutes(app, conn);

  app.listen(process.env.PORT || 7001);
}

createConnection()
  .then(async (connection) => {
    await startExpress(connection);
  })
  .catch((error) => console.log(error));
