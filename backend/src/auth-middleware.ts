import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserToken, UserTokenStatus } from './entity/UserToken';

export const accessTokenCookieName = 'timeit_accessToken';

export default async function mandatoryAuthMiddleware(
  req: Request,
  res: Response,
  next: Function,
) {
  const accessToken = req.cookies[accessTokenCookieName];

  if (!accessToken) {
    return res.status(401).json({
      error: {
        type: 'NO_ACCESS_TOKEN',
        message: 'No token provided',
      },
    });
  }

  try {
    const decodedPayload = await jwt.verify(
      accessToken,
      process.env.TIMEIT_JWT_SECRET,
    );

    const token = await UserToken.findOneOrFail(decodedPayload['tokenId'], {
      loadEagerRelations: false, // No need to load the user relation
    });

    if (token.status !== UserTokenStatus.ACTIVE) {
      return res.status(401).json({
        error: {
          type: 'INACTIVE_TOKEN',
          message: 'The token provided is inactive',
          info: {
            tokenStatus: token.status,
          },
        },
      });
    }

    // User is authenticated correctly, continue with the request
    req['tokenPayload'] = decodedPayload;
    next();
  } catch (err) {
    return res.status(401).json({
      error: {
        type: 'INVALID_TOKEN',
        message: 'The token provided is invalid',
      },
    });
  }
}
