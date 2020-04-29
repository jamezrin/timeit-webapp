import { Request, Response } from 'express';
import { hashPassword } from '../../utils';
import { User, UserStatus } from '../../entity/User';
import { UserToken, UserTokenStatus } from '../../entity/UserToken';
import { accessTokenCookieName } from '../middleware/auth-middleware';
import { MailRequestType, MailToken } from '../../entity/MailToken';
import HttpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  accountNotFoundError,
  inactiveAccountError,
  invalidCredentialsError,
  unknownServerError,
} from '../errors';

const authController = {
  async authenticate(req: Request, res: Response) {
    const { emailAddress, password } = req.body;

    const user = await User.findOne({
      where: { emailAddress },
    });

    if (!user) {
      return invalidCredentialsError(req, res);
    }

    const correctPassword = await bcrypt.compare(password, user.passwordHash);

    if (!correctPassword) {
      return invalidCredentialsError(req, res);
    }

    if (user.status !== UserStatus.ACTIVE) {
      return inactiveAccountError(req, res);
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

    res.cookie(accessTokenCookieName, accessToken, {
      path: '/',
      httpOnly: true,
      domain: process.env.TIMEIT_COOKIE_DOMAIN,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 180, // 180 days
    });

    res.status(HttpStatus.ACCEPTED).json({
      accessToken,
    });
  },
  async deauthenticate(req: Request, res: Response) {
    const tokenInfo = res.locals.tokenInfo as UserToken;

    if (!tokenInfo) {
      return unknownServerError(req, res);
    }

    await tokenInfo.remove();

    res.sendStatus(HttpStatus.ACCEPTED);
  },
  // TODO: Sends email to the user, that will have to be confirmed
  async createAccount(req: Request, res: Response) {
    const { emailAddress, password, firstName, lastName } = req.body;

    const user = new User();
    user.emailAddress = emailAddress;
    user.firstName = firstName;
    user.lastName = lastName;

    // TODO: user.status = UserStatus.NOT_CONFIRMED;
    user.status = UserStatus.ACTIVE;
    user.passwordHash = await hashPassword(password);

    await user.save();

    res.sendStatus(HttpStatus.ACCEPTED);
  },
  async confirmAccount(req: Request, res: Response) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  },
  // TODO: Sends email to the user, that will have to be confirmed
  async requestPasswordReset(req: Request, res: Response) {
    const { emailAddress } = req.body;

    const user = await User.findOne({
      where: { emailAddress },
    });

    if (!user) {
      return accountNotFoundError(req, res);
    }

    const mailToken = new MailToken();
    mailToken.type = MailRequestType.PASSWORD_RESET;
    mailToken.expiresIn = 12 * 60; // 12 hours
    mailToken.user = user;
    await mailToken.save();

    res.status(HttpStatus.OK).json({
      expiresIn: mailToken.expiresIn,
      uuid: mailToken.id,
    });
  },
  async performPasswordReset(req: Request, res: Response) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  },
};

export default authController;
