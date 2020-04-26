import express, { Request, Response } from 'express';
import { hashPassword, wrapAsync } from '../utils';
import { User } from '../entity/User';
import defaultAuthMiddleware from '../auth-middleware';

const userRouter = express.Router();

// These routes have to be protected
userRouter.use(defaultAuthMiddleware);

// Get current user
userRouter.get(
  '/user',
  wrapAsync(async (req: Request, res: Response) => {
    const tokenPayload = req['tokenPayload'];
    const user = await User.findOneOrFail(tokenPayload['userId'], {
      loadEagerRelations: false,
    });

    res.status(200).send({
      id: user.id,
      createdAt: user.createdAt,
      status: user.status,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  }),
);

// Update current user
userRouter.patch(
  '/user',
  wrapAsync(async (req: Request, res: Response) => {
    const tokenPayload = req['tokenPayload'];
    const user = await User.findOneOrFail(tokenPayload['userId'], {
      loadEagerRelations: false,
    });

    const { firstName, lastName, emailAddress, password } = req.body;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.emailAddress = emailAddress || user.emailAddress;
    user.passwordHash = password
      ? await hashPassword(password)
      : user.passwordHash;

    res.sendStatus(202);
  }),
);

export default userRouter;
