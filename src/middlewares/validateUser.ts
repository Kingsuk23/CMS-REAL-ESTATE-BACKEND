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
    const authToke = req.header('auth-token');

    // validate token exist or not
    if (!authToke) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'missing fields',
        true,
      );
    }

    // verify if it's correct or false
    const verify = <jwt.UserIDJwtPayload>(
      jwt.verify(authToke, process.env.JWT_SECRETE as string)
    );
    console.log(verify);
    if (!verify) {
      throw new BaseError(
        'BAD REQUEST',
        HttpStatusCode.BadRequest,
        'Invalid user input',
        true,
      );
    }

    (req as CustomRequest).user = verify.user;
    next();
  } catch (error) {
    next(error);
  }
};
