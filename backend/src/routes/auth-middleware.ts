import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserToken, UserTokenStatus } from '../entity/UserToken';
import HttpStatus from 'http-status-codes';

export const accessTokenCookieName = 'timeit_accessToken';

export function authMiddleware(ignoreExpiration: boolean) {
  return async function (req: Request, res: Response, next: Function) {
    const accessToken = req.cookies[accessTokenCookieName];

    if (!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: {
          type: 'NO_ACCESS_TOKEN',
          message: 'No token provided',
        },
      });
    }

    try {
      const decodedPayload = await jwt.verify(accessToken, process.env.TIMEIT_JWT_SECRET, {
        ignoreExpiration: ignoreExpiration,
      });

      const tokenInfo = await UserToken.findOneOrFail(decodedPayload['tokenId']);

      if (tokenInfo.status !== UserTokenStatus.ACTIVE) {
        await tokenInfo.remove();

        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: {
            type: 'INACTIVE_TOKEN',
            message: 'The token provided is inactive',
          },
        });
      }

      // User is authenticated correctly, continue with the request
      req['tokenPayload'] = decodedPayload;
      req['tokenInfo'] = tokenInfo;
      next();
    } catch (err) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: {
          type: 'INVALID_TOKEN',
          message: 'The token provided is invalid',
        },
      });
    }
  };
}

export const defaultAuthMiddleware = authMiddleware(false);
export default defaultAuthMiddleware;
