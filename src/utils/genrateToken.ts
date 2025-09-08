import jwt from 'jsonwebtoken';
import { BaseError } from '../config/baseError';
import { HttpStatusCode } from '../models/httpStatusCode';

interface TokenPayload {
  [key: string]: any;
}

// Generate jwt token
export const generateToken = (payload: TokenPayload): string => {
  try {
    if (!process.env.JWT_SECRETE) {
      throw new BaseError(
        'CONFIGURATION_ERROR',
        HttpStatusCode.InternalServerError,
        'JWT secret is not configured',
        false,
      );
    }
    return jwt.sign(payload, process.env.JWT_SECRETE, {
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
