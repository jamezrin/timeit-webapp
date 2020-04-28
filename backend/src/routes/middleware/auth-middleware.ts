import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { UserToken, UserTokenStatus } from '../../entity/UserToken';
import { inactiveTokenError, invalidTokenError, noAccessTokenError } from '../errors';

export const accessTokenCookieName = 'timeit_accessToken';

export function authMiddleware(ignoreExpiration: boolean) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies[accessTokenCookieName];

    if (!accessToken) {
      return noAccessTokenError(req, res);
    }

    try {
      const decodedPayload = await jwt.verify(accessToken, process.env.TIMEIT_JWT_SECRET, {
        ignoreExpiration: ignoreExpiration,
      });

      const tokenInfo = await UserToken.findOneOrFail(decodedPayload['tokenId']);

      if (tokenInfo.status !== UserTokenStatus.ACTIVE) {
        await tokenInfo.remove();
        return inactiveTokenError(req, res);
      }

      // User is authenticated correctly, continue with the request
      req['tokenPayload'] = decodedPayload;
      req['tokenInfo'] = tokenInfo;
      next();
    } catch (err) {
      return invalidTokenError(req, res);
    }
  };
}

export const defaultAuthMiddleware = authMiddleware(false);

export default defaultAuthMiddleware;
