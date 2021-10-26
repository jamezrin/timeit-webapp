import bcrypt from 'bcrypt';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { ProjectMember, ProjectMemberRole } from './entity/ProjectMember';
import { Project } from './entity/Project';
import { UpdateResult } from 'typeorm';
import { Session } from './entity/Session';
import { MailToken } from './entity/MailToken';

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
export const getDateDiffSecs = (date: Date): number =>
  (Date.now() - date.getTime()) / 1000;

// Returns whether a mail token has expired or not based on the expiration date
export const hasMailTokenExpired = (mailToken: MailToken): boolean =>
  mailToken.expiresIn !== -1 &&
  getDateDiffSecs(mailToken.createdAt) > mailToken.expiresIn;

// Ends all previous open sessions of one project member
export const endAllOpenSessions = (
  projectMember: ProjectMember,
): Promise<UpdateResult> =>
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

export const createDefaultCookieOptions = (): CookieOptions => {
  const defaultCookieMaxAge = 1000 * 60 * 60 * 24 * 180; // 180 days
  const cookieDomain = process.env.TIMEIT_COOKIE_DOMAIN;
  const secureCookie = process.env.TIMEIT_COOKIE_SECURE;
  const maxAge = process.env.TIMEIT_COOKIE_MAXAGE;

  const cookieOptions = {
    path: '/',
    httpOnly: true,
    maxAge: maxAge || defaultCookieMaxAge,
  } as CookieOptions;

  if (cookieDomain) {
    cookieOptions.domain = cookieDomain;
    if (cookieDomain === 'localhost') {
      console.log('⚠ Setting cookies to localhost, disable "Secure" flag requirement'); // prettier-ignore
      console.log('Read more: https://www.chromium.org/updates/same-site/test-debug'); // prettier-ignore
      console.log('For a workaround, use the localhost IP (127.0.0.1) instead'); // prettier-ignore

      cookieOptions.sameSite = 'none';
    } else {
      cookieOptions.sameSite = 'lax';
    }
  }

  if (secureCookie) {
    cookieOptions.secure = secureCookie === 'true';
  } else {
    cookieOptions.secure = process.env.NODE_ENV === 'production';
  }

  return cookieOptions;
};

const defaultCookieOptions = createDefaultCookieOptions();

export const setCookie = (
  res: Response,
  cookieName: string,
  cookieValue: string,
  options?: CookieOptions,
) => {
  res.cookie(cookieName, cookieValue, {
    ...defaultCookieOptions,
    ...options,
  });
};
