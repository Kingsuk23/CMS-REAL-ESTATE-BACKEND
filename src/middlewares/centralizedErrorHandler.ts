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

  res.status((err as BaseError).httpCode || 500).json({
    status: (err as BaseError).name || 'Error',
    message: (err as BaseError).message || 'Internal Server Error',
  });
};
