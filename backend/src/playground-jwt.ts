import express from 'express';
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

app.post('/authenticate', (req, res) => {
  const { username, password } = req.body;

  if (username === 'testuser' && password === 'testpass') {
    return res.status(200).send(
      jwt.sign(
        {
          user: username,
        },
        process.env.TIMEIT_JWT_SECRET,
        { expiresIn: '1m' },
      ),
    );
  } else {
    return res.sendStatus(401);
  }
});

app.post('/protected', (req, res) => {
  console.log(
    jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.TIMEIT_JWT_SECRET,
    ),
  );

  return res.sendStatus(200);
});

app.listen(process.env.PORT || 7001);
