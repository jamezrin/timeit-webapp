import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { AuthToken, AuthTokenStatus } from '../../entity/AuthToken';
import {
  inactiveTokenError,
  invalidTokenError,
  noAccessTokenError,
} from '../errors';

export const accessTokenCookieName = 'timeit_accessToken';

export interface TokenPayload {
  readonly tokenId: string;
  readonly userId: string;
}

export function authMiddleware(ignoreExpiration: boolean) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies[accessTokenCookieName];

    if (!accessToken) {
      return noAccessTokenError(req, res);
    }

    try {
      const decodedPayload = (await jwt.verify(
        accessToken,
        process.env.TIMEIT_JWT_SECRET,
        {
          ignoreExpiration: ignoreExpiration,
        },
      )) as TokenPayload;

      const tokenInfo = await AuthToken.findOneOrFail(decodedPayload.tokenId);

      if (tokenInfo.status !== AuthTokenStatus.ACTIVE) {
        await tokenInfo.remove();
        return inactiveTokenError(req, res);
      }

      // User is authenticated correctly, continue with the request
      res.locals.tokenPayload = decodedPayload;
      res.locals.tokenInfo = tokenInfo;
      next();
    } catch (err) {
      return invalidTokenError(req, res);
    }
  };
}

export const defaultAuthMiddleware = authMiddleware(false);

export default defaultAuthMiddleware;
