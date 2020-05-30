import { Request, Response } from 'express';
import { hashPassword, hasMailTokenExpired } from '../../utils';
import { User, UserStatus } from '../../entity/User';
import { AuthToken, AuthTokenStatus } from '../../entity/AuthToken';
import { accessTokenCookieName } from '../middleware/auth-middleware';
import { MailRequestType, MailToken } from '../../entity/MailToken';
import HttpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  accountAlreadyExistsError,
  accountNotFoundError,
  expiredMailTokenError,
  inactiveAccountError,
  incorrectMailTokenError,
  invalidCredentialsError,
  mailTokenNotFoundError,
  unknownServerError,
} from '../errors';
import { nanoid } from 'nanoid';
import Mail from 'nodemailer/lib/mailer';
import { ProjectMember, ProjectMemberStatus } from '../../entity/ProjectMember';

async function sendPasswordResetEmail(mailer: Mail, mailToken: MailToken) {
  // TODO In the frontend call the form page request-password
  const passwordResetCallback =
    process.env.TIMEIT_FRONTEND_URL + `/recover-password?token=${mailToken.id}`;
  return await mailer.sendMail({
    from: '"Jaime de TimeIt" <jaime@jamezrin.name>',
    to: mailToken.emailAddress,
    subject: `Restablecimiento de tu contraseña`,
    text: `
    Has hecho una petición de restablecimiento de la contraseña de tu cuenta.
    Accede a ${passwordResetCallback} para elegir una nueva contraseña.
    Si no has hecho esta petición, simplemente ignora este correo electrónico.`,
    html: `
    <p>Has hecho una petición de restablecimiento de la contraseña de tu cuenta.</p> 
    <p>Si has hecho esta petición, puedes <a href="${passwordResetCallback}">restablecer tu contraseña</a>.</p>
    <p>Si no has hecho esta petición, simplemente ignora este correo electrónico.</p>`,
  });
}

async function sendAccountConfirmationEmail(mailer: Mail, mailToken: MailToken) {
  const accountConfirmationCallback =
    process.env.TIMEIT_FRONTEND_URL + `/confirm-account?token=${mailToken.id}`;
  return await mailer.sendMail({
    from: '"Jaime de TimeIt" <jaime@jamezrin.name>',
    to: mailToken.emailAddress,
    subject: `Confirmación de registro`,
    text: `
    Te has registrado en TimeIt, accede a ${accountConfirmationCallback} para confirmar tu cuenta.
    Si no has hecho esta petición, simplemente ignora este correo electrónico.`,
    html: `
    <p>Te has registrado en TimeIt, procede a <a href="${accountConfirmationCallback}">confirmar tu cuenta</a>.</p>
    <p>Si no has hecho esta petición, simplemente ignora este correo electrónico.</p>`,
  });
}

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
      // Try to cleanup account confirmation mail tokens
      const mailToken = await MailToken.findOne({
        where: {
          emailAddress: emailAddress,
          type: MailRequestType.ACCOUNT_CONFIRMATION,
        },
      });

      if (mailToken && hasMailTokenExpired(mailToken)) {
        // User account creation request has expired
        // Delete the request and the previously created user
        await mailToken.remove();
        await user.remove();

        return invalidCredentialsError(req, res);
      }

      return inactiveAccountError(req, res);
    }

    const authToken = new AuthToken();
    authToken.status = AuthTokenStatus.ACTIVE;
    authToken.user = user;
    await authToken.save();

    const accessToken = jwt.sign(
      {
        userId: user.id,
        tokenId: authToken.id,
      },
      process.env.TIMEIT_JWT_SECRET,
      { expiresIn: '180 days' },
    );

    res.cookie(accessTokenCookieName, accessToken, {
      path: '/',
      httpOnly: true,
      domain: process.env.TIMEIT_COOKIE_DOMAIN,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
      maxAge: 1000 * 60 * 60 * 24 * 180, // 180 days
    });

    res.sendStatus(HttpStatus.OK);
  },
  async deauthenticate(req: Request, res: Response) {
    const tokenInfo = res.locals.tokenInfo as AuthToken;

    if (!tokenInfo) {
      return unknownServerError(req, res);
    }

    // Delete the token this user authenticated with
    await tokenInfo.remove();

    res.sendStatus(HttpStatus.ACCEPTED);
  },
  createAccount(mailer: Mail) {
    return async function (req: Request, res: Response) {
      const { emailAddress, password, firstName, lastName } = req.body;

      try {
        const user = new User();
        user.emailAddress = emailAddress;
        user.firstName = firstName;
        user.lastName = lastName;
        user.status = UserStatus.NOT_CONFIRMED;
        user.passwordHash = await hashPassword(password);
        await user.save();

        const mailToken = new MailToken();
        mailToken.id = nanoid();
        mailToken.emailAddress = emailAddress;
        mailToken.type = MailRequestType.ACCOUNT_CONFIRMATION;
        mailToken.expiresIn = 7 * 24 * 60 * 60; // 7 days
        mailToken.payload = {};
        await mailToken.save();

        // Sends the actual account confirmation email with the token
        await sendAccountConfirmationEmail(mailer, mailToken);

        res.sendStatus(HttpStatus.ACCEPTED);
      } catch (err) {
        switch (err.code) {
          case '23505':
            // duplicated key constraint error
            return accountAlreadyExistsError(req, res);
        }

        return unknownServerError(req, res);
      }
    };
  },
  async confirmAccount(req: Request, res: Response) {
    const { token } = req.body;

    const mailToken = await MailToken.findOne(token);

    if (!mailToken) {
      return mailTokenNotFoundError(req, res);
    }

    if (hasMailTokenExpired(mailToken)) {
      // Password reset token has expired
      await mailToken.remove();

      return expiredMailTokenError(req, res);
    }

    const invitedProjectMember = await ProjectMember.findOne({
      where: { emailAddress: mailToken.emailAddress },
    });

    if (!invitedProjectMember) {
      return accountNotFoundError(req, res);
    }

    invitedProjectMember.status = ProjectMemberStatus.ACTIVE;

    await invitedProjectMember.save();
    await mailToken.remove();

    res.sendStatus(HttpStatus.ACCEPTED);
  },
  requestPasswordReset(mailer: Mail) {
    return async function (req: Request, res: Response) {
      const { emailAddress } = req.body;

      const user = await User.findOne({
        where: { emailAddress },
      });

      if (!user) {
        return accountNotFoundError(req, res);
      }

      if (user.status !== UserStatus.ACTIVE) {
        return inactiveAccountError(req, res);
      }

      const mailToken = new MailToken();
      mailToken.id = nanoid();
      mailToken.type = MailRequestType.PASSWORD_RESET;
      mailToken.emailAddress = emailAddress;
      mailToken.expiresIn = 12 * 60 * 60; // 12 hours
      await mailToken.save();

      // Sends the actual password reset email with the token
      await sendPasswordResetEmail(mailer, mailToken);

      res.status(HttpStatus.ACCEPTED);
    };
  },
  async performPasswordReset(req: Request, res: Response) {
    const { token, newPassword } = req.body;

    const mailToken = await MailToken.findOne(token);

    if (!mailToken) {
      return mailTokenNotFoundError(req, res);
    }

    if (mailToken.type !== MailRequestType.PASSWORD_RESET) {
      return incorrectMailTokenError(req, res);
    }

    if (hasMailTokenExpired(mailToken)) {
      // Password reset token has expired
      await mailToken.remove();

      return expiredMailTokenError(req, res);
    }

    const user = await User.findOne({
      where: { emailAddress: mailToken.emailAddress },
    });

    if (!user) {
      return accountNotFoundError(req, res);
    }

    user.passwordHash = await hashPassword(newPassword);

    await user.save();
    await mailToken.remove();

    res.sendStatus(HttpStatus.ACCEPTED);
  },
};

export default authController;
