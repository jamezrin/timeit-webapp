import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { ProjectMember, ProjectMemberRole } from './entity/ProjectMember';

// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
export const wrapAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const hashPassword = (rawPassword: string): Promise<string> =>
  bcrypt.hash(rawPassword, parseInt(process.env.TIMEIT_CRYPT_ROUNDS));

export const isMemberPrivileged = (projectMember: ProjectMember): boolean =>
  projectMember.role === ProjectMemberRole.ADMIN ||
  projectMember.role === ProjectMemberRole.EMPLOYER;
