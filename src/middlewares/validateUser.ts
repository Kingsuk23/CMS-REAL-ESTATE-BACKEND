import { NextFunction, Request, Response } from 'express';
import { BaseError } from '../config/baseError';
import { HttpStatusCode } from '../models/httpStatusCode';
import * as jwt from 'jsonwebtoken';
import { CustomRequest } from '../models/customType';

declare module 'jsonwebtoken' {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    user: { id: string };
  }
}

export const validateUserAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // collect token from header
    const authToken = req.header('auth-token');

    // validate token exist or not
    if (!authToken || !authToken.startsWith('Bearer ')) {
      throw new BaseError(
        'UNAUTHORIZED',
        HttpStatusCode.Unauthorized,
        'Authentication token is required',
        true,
      );
    }
    const token = authToken.split(' ')[1];
    // verify if it's correct or false
    const verify = <jwt.UserIDJwtPayload>(
      jwt.verify(token, process.env.JWT_SECRETE as string)
    );

    if (!verify) {
      throw new BaseError(
        'UNAUTHORIZED',
        HttpStatusCode.Unauthorized,
        'Invalid authentication token',
        true,
      );
    }

    (req as CustomRequest).user = verify.user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(
        new BaseError(
          'UNAUTHORIZED',
          HttpStatusCode.Unauthorized,
          'Token expired',
          true,
        ),
      );
      return;
    }
    next(error);
  }
};
