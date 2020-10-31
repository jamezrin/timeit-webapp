import { Request, Response } from "express";
import { hashPassword } from "../../utils";
import { User } from "../../entity/User";
import HttpStatus from "http-status-codes";
import { resourceNotFoundError } from "../errors";
import { TokenPayload } from "../middleware/auth-middleware";

const userController = {
  async currentUser(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;

    const user = await User.findOne(currentUserId, {
      loadEagerRelations: false,
      select: ["id", "createdAt", "status", "type", "firstName", "lastName", "emailAddress"]
    });

    if (!user) {
      return resourceNotFoundError(req, res);
    }

    res.status(HttpStatus.OK).json(user);
  },
  async updateUser(req: Request, res: Response) {
    const tokenPayload = res.locals.tokenPayload as TokenPayload;
    const currentUserId = tokenPayload.userId;

    const user = await User.findOne(currentUserId, { loadEagerRelations: false });

    if (!user) {
      return resourceNotFoundError(req, res);
    }

    const { firstName, lastName, emailAddress, password } = req.body;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.emailAddress = emailAddress || user.emailAddress;
    user.passwordHash = password ? await hashPassword(password) : user.passwordHash;

    res.sendStatus(HttpStatus.ACCEPTED);
  }
};

export default userController;
