import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import './env';

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan('combined'));

app.post('/set-cookie', (req, res) => {
  return res.cookie("some_cookie", "blablabla",
    { path: "/", httpOnly: true, secure: true }
    ).sendStatus(200)
});

app.post('/see-cookie', (req, res) => {
  console.log(req.cookies)
  res.send(req.cookies)
});

app.listen(process.env.PORT || 7001);
