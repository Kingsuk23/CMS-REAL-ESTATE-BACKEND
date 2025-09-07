import jwt from 'jsonwebtoken';
import { BaseError } from '../config/baseError';
import { HttpStatusCode } from '../models/httpStatusCode';

// Generate jwt token
export const generateToken = (id: string): string => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRETE as string, {
      expiresIn: '30d',
    });
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }
    throw new BaseError(
      'INTERNAL SERVER ERROR',
      HttpStatusCode.InternalServerError,
      'Failed to create user',
      false,
    );
  }
};
