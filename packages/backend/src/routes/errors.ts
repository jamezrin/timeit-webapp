import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import {
  ACCOUNT_ALREADY_EXISTS_ERROR,
  ACCOUNT_NOT_FOUND_ERROR,
  ALREADY_PROJECT_MEMBER_ERROR,
  ALREADY_REQUESTED_MAIL_TOKEN_ERROR,
  COULD_NOT_SEND_EMAIL_ERROR,
  DISABLED_ACCOUNT_ERROR,
  EXPIRED_MAIL_TOKEN_ERROR,
  INACTIVE_ACCOUNT_ERROR,
  INACTIVE_TOKEN_ERROR,
  INCORRECT_MAIL_TOKEN_ERROR,
  INSUFFICIENT_PRIVILEGES_ERROR,
  INVALID_CREDENTIALS_ERROR,
  INVALID_TOKEN_ERROR,
  MAIL_TOKEN_NOT_FOUND_ERROR,
  NO_ACCESS_TOKEN_ERROR,
  RESOURCE_NOT_FOUND_ERROR,
  SESSION_ENDED_ERROR,
  UNKNOWN_SERVER_ERROR,
} from 'common';

const error = (type: string, message: string) => ({ error: { type, message } });

export const invalidTokenError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.UNAUTHORIZED)
    .json(error(INVALID_TOKEN_ERROR, 'The token provided is invalid'));
};

export const inactiveAccountError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.UNAUTHORIZED)
    .json(error(INACTIVE_ACCOUNT_ERROR, 'Account not active'));
};

export const disabledAccountError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.UNAUTHORIZED)
    .json(error(DISABLED_ACCOUNT_ERROR, 'Account is disabled'));
};
export const invalidCredentialsError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.UNAUTHORIZED)
    .send(error(INVALID_CREDENTIALS_ERROR, 'Invalid credentials'));
};

export const inactiveTokenError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.UNAUTHORIZED)
    .json(error(INACTIVE_TOKEN_ERROR, 'Token provided is inactive'));
};

export const noAccessTokenError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.UNAUTHORIZED)
    .json(error(NO_ACCESS_TOKEN_ERROR, 'No token provided'));
};

export const unknownServerError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json(error(UNKNOWN_SERVER_ERROR, 'Unknown server error'));
};

export const resourceNotFoundError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.NOT_FOUND)
    .json(
      error(RESOURCE_NOT_FOUND_ERROR, 'Could not find any matching entity'),
    );
};

export const sessionEndedError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.NOT_ACCEPTABLE)
    .json(error(SESSION_ENDED_ERROR, 'The session has already ended'));
};

export const accountNotFoundError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.NOT_FOUND)
    .json(
      error(
        ACCOUNT_NOT_FOUND_ERROR,
        'Could not find an account with the provided email address',
      ),
    );
};

export const insufficientPrivilegesError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.FORBIDDEN)
    .json(
      error(
        INSUFFICIENT_PRIVILEGES_ERROR,
        'Insufficient permissions to perform this operation',
      ),
    );
};

export const accountAlreadyExistsError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.NOT_ACCEPTABLE)
    .json(
      error(
        ACCOUNT_ALREADY_EXISTS_ERROR,
        'There is already an account with that email address',
      ),
    );
};

export const alreadyProjectMemberError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.NOT_ACCEPTABLE)
    .json(
      error(
        ALREADY_PROJECT_MEMBER_ERROR,
        'This user is already a member in the project',
      ),
    );
};

export const mailTokenNotFoundError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.NOT_FOUND)
    .json(error(MAIL_TOKEN_NOT_FOUND_ERROR, 'Could not find this mail token'));
};

export const incorrectMailTokenError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.NOT_ACCEPTABLE)
    .json(
      error(
        INCORRECT_MAIL_TOKEN_ERROR,
        'The mail token provided is not acceptable',
      ),
    );
};

export const expiredMailTokenError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.NOT_ACCEPTABLE)
    .json(
      error(EXPIRED_MAIL_TOKEN_ERROR, 'The mail token provided has expired'),
    );
};

export const alreadyRequestedMailTokenError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.NOT_ACCEPTABLE)
    .json(
      error(
        ALREADY_REQUESTED_MAIL_TOKEN_ERROR,
        'There is already an unexpired mail token',
      ),
    );
};

export const couldNotSendEmailError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json(
      error(COULD_NOT_SEND_EMAIL_ERROR, 'Could not send the requested email'),
    );
};
