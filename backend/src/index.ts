import 'reflect-metadata';
import {createConnection} from 'typeorm';

import express, {Request, Response} from 'express';
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

createConnection()
  .then(async (connection) => {
    await startExpress();
    await connection.close()
  })
  .catch((error) => console.log(error));
