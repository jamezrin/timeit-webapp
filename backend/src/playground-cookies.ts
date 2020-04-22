import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import './env';

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000" // from .env
}));

app.use(morgan('combined'));

app.post('/set-cookie', (req, res) => {
  res.cookie("some_cookie", "blablabla", {
    path: "/",
    httpOnly: true,
    domain: "localhost",
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax'
  }).send(200)
});

app.post('/see-cookie', (req, res) => {
  console.log(req.cookies)
  res.send(req.cookies)
});

app.listen(process.env.PORT || 7001);
