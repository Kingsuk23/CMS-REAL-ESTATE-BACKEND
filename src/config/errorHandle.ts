import { BaseError } from './baseError';
import { logger } from './logger';

// Centralized error handling class
class ErrorHandle {
  // Logs the error using the custom logger
  public async handleError(err: Error): Promise<void> {
    await logger.error(
      'Error message from the centralized error-handling component',
      err,
    );
  }

  // Determines if the error is a known, operational (trusted) error
  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}

export const errorHandle = new ErrorHandle();
