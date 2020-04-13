import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';

import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import { SessionAppEvent } from './entity/SessionAppEvent';
import { Session } from './entity/Session';
import { Project } from './entity/Project';
import * as fs from 'fs';


// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
const wrapAsync = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next)
}

async function startExpress(connection: Connection) {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cors());
  app.use(morgan('combined'));

  app.get('/user');
  app.patch('/user');
  app.post('/login');
  app.post('/register');
  app.post('/register_confirmation_request');
  app.post('/recover_password');
  app.post('/recover_password_request');

  app.get('/projects');
  app.post('/project');
  app.get('/project/:projectId');
  app.delete('/project/:projectId');
  app.patch('/project/:projectId');

  app.get('/project/:projectId/members');
  app.post('/project/:projectId/members');
  app.delete('/project/:projectId/members/:memberId');
  app.patch('/project/:projectId/members/:memberId');

  app.get('/project/:projectId/sessions');
  app.post('/project/:projectId/session');
  app.get('/project/:projectId/session/:sessionId');
  app.patch('/project/:projectId/session/:sessionId');
  app.delete('/project/:projectId/session/:sessionId');

  app.get('/project/:projectId/session/:sessionId/app_events');
  app.delete('/project/:projectId/session/:sessionId/app_event/:eventId');
  app.post('/project/:projectId/session/:sessionId/app_event', wrapAsync(async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const { projectId, sessionId } = req.params;
    const { windowName, windowClass, windowPid } = req.body;

    console.log(req.headers)
    console.log(req.params)
    console.log(req.body)

    console.log({
      projectId, sessionId, authorization,
      windowName, windowClass, windowPid
    });

    const session = await Session.findOneOrFail(sessionId);
    const appEvent = new SessionAppEvent();
    appEvent.windowName = windowName;
    appEvent.windowClass = windowClass;
    appEvent.windowPid = windowPid;
    appEvent.session = session;
    await appEvent.save();

    res.sendStatus(201);
  }));

  app.get('/project/:projectId/session/:sessionId/notes');
  app.delete('/project/:projectId/session/:sessionId/note/:noteId');
  app.post('/project/:projectId/session/:sessionId/note', wrapAsync(async(req: Request, res: Response) => {
    console.log(req)
  }));

  app.get('/ping', function (req: Request, res: Response) {
    const numeroAleatorio = Math.floor(Math.random() * 1000);
    return res.send(`Number ${numeroAleatorio}`);
  });

  app.get('/', function(req: Request, res: Response) {
    throw new Error("Some error")
  })

  fs.writeFile(
    "routes.json",
    JSON.stringify(
      app._router.stack
        .filter(x => !!x.route)
        .map(x => x.route.path)
    ),
    (err) => {
      if (err) console.log("Writing file", err);
  });

  app.listen(process.env.PORT || 7001);
}

createConnection()
  .then(async (connection) => {
    await startExpress(connection);
    //await connection.close()
  })
  .catch((error) => console.log(error));
