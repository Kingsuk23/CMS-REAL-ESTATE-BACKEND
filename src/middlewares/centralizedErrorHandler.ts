import { NextFunction, Response, Request } from 'express';
import { errorHandle } from '../config/errorHandle';
import { BaseError } from '../config/baseError';

export const centralizedErrorHandlerMiddlerWare = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!errorHandle.isTrustedError) {
    next(err);
  }

  await errorHandle.handleError(err);

  res.status((err as BaseError).httpCode).json({
    status: err.name,
    message: err.message,
  });
};
