import express, { Request, Response } from 'express';
import { wrapAsync } from '../utils';
import { User, UserStatus } from '../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserToken, UserTokenStatus } from '../entity/UserToken';

const authRouter = express.Router();

const accessTokenCookieName = "timeit_accessToken";

// Authenticates (creates JWT)
authRouter.post('/authenticate', wrapAsync(async (req: Request, res: Response) => {
  const { emailAddress, password } = req.body;

  const user = await User.findOneOrFail({
    where: { emailAddress }
  });

  const correctPassword = await bcrypt.compare(
    password,
    user.passwordHash,
  );

  if (!correctPassword) {
    return res.status(401).send({
      error: "Incorrect password"
    });
  }

  if (user.status !== UserStatus.ACTIVE) {
    return res.status(401).send({
      error: "Account not active"
    });
  }

  const token = new UserToken();
  token.status = UserTokenStatus.ACTIVE;
  token.user = user;
  await token.save();

  const accessToken = jwt.sign(
    {
      userId: user.id,
      tokenId: token.id,
    },
    process.env.TIMEIT_JWT_SECRET,
    { expiresIn: '180 days' },
  );

  res.cookie(
    accessTokenCookieName,
    accessToken,
    {
      path: "/",
      httpOnly: true,
      domain: process.env.TIMEIT_COOKIE_DOMAIN,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
    }
  );

  res.status(201).send({
    accessToken
  });
}));

// Deauthenticate (revokes JWT)
authRouter.post('/deauthenticate', wrapAsync(async (req: Request, res: Response) => {
  const accessToken = req.cookies[accessTokenCookieName];

  const tokenPayload = await jwt.verify(
    accessToken,
    process.env.TIMEIT_JWT_SECRET,
    { ignoreExpiration: true }
  );

  const token = await UserToken.findOneOrFail(
    tokenPayload["tokenId"]
  );

  await token.remove();

  res.sendStatus(201);
}));

// Create account
// TODO: Sends email to the user, that will have to be confirmed
authRouter.post('/create-account', wrapAsync(async (req: Request, res: Response) => {
  const {
    emailAddress, password, firstName,
    lastName, dateOfBirth
  } = req.body;

  const user = new User();
  user.emailAddress = emailAddress;
  user.firstName = firstName;
  user.lastName = lastName;
  user.dateOfBirth = new Date(dateOfBirth);

  // TODO: user.status = UserStatus.NOT_CONFIRMED;
  user.status = UserStatus.ACTIVE;
  user.passwordHash = await bcrypt.hash(
    password,
    parseInt(process.env.TIMEIT_CRYPT_ROUNDS)
  );

  await user.save();

  res.sendStatus(200);
}));

// Verify authentication
authRouter.post('/verify-auth', wrapAsync(async (req: Request, res: Response) => {
  const accessToken = req.cookies[accessTokenCookieName];

  const tokenPayload = await jwt.verify(
    accessToken,
    process.env.TIMEIT_JWT_SECRET,
  );

  const token = await UserToken.findOneOrFail(
    tokenPayload["tokenId"],
    { loadEagerRelations: false }
  );

  if (token.status !== UserTokenStatus.ACTIVE) {
    return res.status(401).send({
      error: `Token is no longer active`
    })
  }

  res.status(201).send(token);
}));

// Confirm account
authRouter.post('/confirm-account', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

// Creates password reset request (sends the email)
authRouter.post('/request-password-reset', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

// Resets the password
authRouter.post('/reset-password', wrapAsync(async (req: Request, res: Response) => {
  res.sendStatus(200);
}));

export default authRouter;