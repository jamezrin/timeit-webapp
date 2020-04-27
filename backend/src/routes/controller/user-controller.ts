import { Request, Response } from 'express';
import { hashPassword } from '../../utils';
import { User } from '../../entity/User';
import HttpStatus from 'http-status-codes';

const userController = {
  async currentUser(req: Request, res: Response) {
    const tokenPayload = req['tokenPayload'];
    const user = await User.findOneOrFail(tokenPayload['userId'], {
      loadEagerRelations: false,
    });

    res.status(HttpStatus.OK).send({
      id: user.id,
      createdAt: user.createdAt,
      status: user.status,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  },
  async updateUser(req: Request, res: Response) {
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

    res.sendStatus(HttpStatus.ACCEPTED);
  },
};

export default userController;
