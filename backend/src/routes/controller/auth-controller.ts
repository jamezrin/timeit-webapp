import { Request, Response } from 'express';
import { hashPassword } from '../../utils';
import { User, UserStatus } from '../../entity/User';
import { UserToken, UserTokenStatus } from '../../entity/UserToken';
import { accessTokenCookieName } from '../auth-middleware';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MailRequestType, MailToken } from '../../entity/MailToken';

const authController = {
  async authenticate(req: Request, res: Response) {
    const { emailAddress, password } = req.body;

    const user = await User.findOne({
      where: { emailAddress },
    });

    if (!user) {
      return res.status(401).send({
        error: {
          type: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials',
        },
      });
    }

    const correctPassword = await bcrypt.compare(password, user.passwordHash);

    if (!correctPassword) {
      return res.status(401).send({
        error: {
          type: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials',
        },
      });
    }

    if (user.status !== UserStatus.ACTIVE) {
      return res.status(401).send({
        error: {
          type: 'INACTIVE_ACCOUNT',
          message: 'Account not active',
        },
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

    res.cookie(accessTokenCookieName, accessToken, {
      path: '/',
      httpOnly: true,
      domain: process.env.TIMEIT_COOKIE_DOMAIN,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 180, // 180 days
    });

    res.status(201).json({
      accessToken,
    });
  },
  async deauthenticate(req: Request, res: Response) {
    const tokenInfo = req['tokenInfo'] as UserToken;

    if (!tokenInfo) {
      return res.status(500).json({
        error: {
          type: 'UNKNOWN_SERVER_ERROR',
          message: 'Unknown server error',
        },
      });
    }

    await tokenInfo.remove();

    res.sendStatus(201);
  },
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

    res.sendStatus(200);
  },
  // TODO: Sends email to the user, that will have to be confirmed
  async confirmAccount(req: Request, res: Response) {
    res.sendStatus(200);
  },
  async requestPasswordReset(req: Request, res: Response) {
    const { emailAddress } = req.body;

    try {
      const user = await User.findOneOrFail({
        where: { emailAddress },
      });

      const mailRequest = new MailToken();
      mailRequest.type = MailRequestType.PASSWORD_RESET;
      mailRequest.expiresIn = 12 * 60; // 12 hours
      mailRequest.user = user;
      await mailRequest.save();

      res.status(200).json({
        expiresIn: mailRequest.expiresIn,
        uuid: mailRequest.id,
      });
    } catch (err) {
      res.status(404).json({
        error: {
          type: 'ACCOUNT_NOT_FOUND',
          message: 'Could not find an account with the provided email address',
        },
      });
    }
  },
  // TODO: Sends email to the user, that will have to be confirmed
  async performPasswordReset(req: Request, res: Response) {
    res.sendStatus(200);
  },
};

export default authController;
