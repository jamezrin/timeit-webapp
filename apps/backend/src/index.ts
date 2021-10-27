import 'reflect-metadata';
import { Connection, createConnection, ConnectionOptionsReader } from 'typeorm';
import fs from 'fs/promises';
import path from 'path';

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import HttpStatus from 'http-status-codes';
import mountRoutes from './routes/routes';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

// Very important for getting env populated
import './env';

function createMailTransport() {
  const mailOptions = {
    host: process.env.TIMEIT_EMAIL_HOST,
    port: parseInt(process.env.TIMEIT_EMAIL_PORT),
    secure: parseInt(process.env.TIMEIT_EMAIL_PORT) === 465,
    auth: {
      user: process.env.TIMEIT_EMAIL_USER,
      pass: process.env.TIMEIT_EMAIL_PASS,
    },
  };

  return nodemailer.createTransport(mailOptions);
}

async function startExpress(connection: Connection, mailer: Mail) {
  const app = express();

  // Security middlewares
  app.use(helmet());
  app.use(
    cors({
      maxAge: 86400,
      credentials: true,
      origin: (process.env.TIMEIT_CORS_ORIGINS || '').split(','),
    }),
  );

  // Parsers middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());

  // Logging middleware
  app.use(morgan('combined'));

  app.all('/', (req, res) => {
    res.sendStatus(HttpStatus.OK);
  });

  // From now on, there are only protected routes
  mountRoutes(app, connection, mailer);

  // Start the app on the env port or the default 8080
  app.listen(process.env.PORT || 8080);
}

async function findPackageRoot(): Promise<string | null> {
  for (const dir of module.paths) {
    if (await fs.stat(dir).catch((e) => null)) {
      return path.dirname(dir);
    }
  }

  return null;
}

async function startApp() {
  // read connection options from ormconfig file (or ENV variables)
  const connectionOptionsReader = new ConnectionOptionsReader({
    root: await findPackageRoot(),
  });

  // do something with connectionOptions,
  // for example append a custom naming strategy or a custom logger
  // Object.assign(connectionOptions, { namingStrategy: new MyNamingStrategy() });
  const connectionOptions = await connectionOptionsReader.get('default');

  // create a connection using modified connection options
  const connection = await createConnection(connectionOptions);

  // TODO: move the timezone to env vars
  // setting the application timezone
  connection
    .query(`SET timezone TO 'Europe/Madrid'`)
    .then(() => console.log('Successfully set the timezone to Europe/Madrid'))
    .catch(() => console.warn('Could not set the timezone'));

  // create mail transport for mail routes
  const mailer = createMailTransport();

  // start the HTTP server
  await startExpress(connection, mailer);
}

startApp().catch((err) => console.log('Failure starting app', err));
