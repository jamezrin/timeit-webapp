import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

const error = (type: string, message: string) => ({ error: { type, message } });

export const invalidTokenError = (req: Request, res: Response) => {
  res.status(HttpStatus.UNAUTHORIZED).json(error('INVALID_TOKEN', 'The token provided is invalid'));
};

export const inactiveAccountError = (req: Request, res: Response) => {
  res.status(HttpStatus.UNAUTHORIZED).json(error('INACTIVE_ACCOUNT', 'Account not active'));
};

export const invalidCredentialsError = (req: Request, res: Response) => {
  res.status(HttpStatus.UNAUTHORIZED).send(error('INVALID_CREDENTIALS', 'Invalid credentials'));
};

export const inactiveTokenError = (req: Request, res: Response) => {
  res.status(HttpStatus.UNAUTHORIZED).json(error('INACTIVE_TOKEN', 'Token provided is inactive'));
};

export const noAccessTokenError = (req: Request, res: Response) => {
  res.status(HttpStatus.UNAUTHORIZED).json(error('NO_ACCESS_TOKEN', 'No token provided'));
};

export const unknownServerError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json(error('UNKNOWN_SERVER_ERROR', 'Unknown server error'));
};

export const resourceNotFoundError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.NOT_FOUND)
    .json(error('RESOURCE_NOT_FOUND', 'Could not find any matching entity'));
};

export const accountNotFoundError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.NOT_FOUND)
    .json(error('ACCOUNT_NOT_FOUND', 'Could not find an account with the provided email address'));
};

export const forbiddenError = (req: Request, res: Response) => {
  res
    .status(HttpStatus.FORBIDDEN)
    .json(error('INSUFFICIENT_PRIVILEGES', 'Insufficient permissions to perform this operation'));
};
