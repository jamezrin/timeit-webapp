import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { ProjectMember, ProjectMemberRole } from './entity/ProjectMember';
import { Project } from './entity/Project';
import { UpdateResult } from 'typeorm';
import { Session } from './entity/Session';

// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
export const wrapAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Uniform way of hashing the password across the codebase
export const hashPassword = (rawPassword: string): Promise<string> =>
  bcrypt.hash(rawPassword, parseInt(process.env.TIMEIT_CRYPT_ROUNDS));

// Only ADMIN and EMPLOYER roles can see entities of other project members
export const isMemberPrivileged = (projectMember: ProjectMember): boolean =>
  projectMember.role === ProjectMemberRole.ADMIN ||
  projectMember.role === ProjectMemberRole.EMPLOYER;

// Convenient function just for updating the "updatedAt" column
// Meant to be used when some kind of activity happens inside a project
export const updateProjectDate = (projectId: number): Promise<UpdateResult> =>
  Project.update(projectId, {});

export const endAllOpenSessions = (projectMember) =>
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
