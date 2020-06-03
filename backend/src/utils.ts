import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { ProjectMember, ProjectMemberRole } from './entity/ProjectMember';
import { Project } from './entity/Project';
import { UpdateResult } from 'typeorm';
import { Session } from './entity/Session';
import { MailToken } from './entity/MailToken';

// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
export const wrapAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Uniform way of hashing the password across the codebase
export const hashPassword = (rawPassword: string): Promise<string> =>
  bcrypt.hash(rawPassword, parseInt(process.env.TIMEIT_CRYPT_ROUNDS));

// Only ADMIN and MANAGER roles can see entities of other project members
export const isMemberPrivileged = (projectMember: ProjectMember): boolean =>
  projectMember.role === ProjectMemberRole.ADMIN ||
  projectMember.role === ProjectMemberRole.MANAGER;

// Convenient function just for updating the "updatedAt" column
// Meant to be used when some kind of activity happens inside a project
export const updateProjectDate = (projectId: number): Promise<UpdateResult> =>
  Project.update(projectId, {});

// Get difference in seconds between a previous date and the current date
export const getDateDiffSecs = (date: Date): number => (Date.now() - date.getTime()) / 1000;

// Returns whether a mail token has expired or not based on the expiration date
export const hasMailTokenExpired = (mailToken: MailToken): boolean =>
  mailToken.expiresIn !== -1 && getDateDiffSecs(mailToken.createdAt) > mailToken.expiresIn;

// Ends all previous open sessions of one project member
export const endAllOpenSessions = (projectMember: ProjectMember): Promise<UpdateResult> =>
  Session.createQueryBuilder()
    .update()
    .set({
      endedAt: new Date(Date.now()),
    })
    .where('projectMember = :currentProjectMemberId', {
      currentProjectMemberId: projectMember.id,
    })
    .andWhere('endedAt IS NULL')
    .execute();
