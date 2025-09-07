import { HttpStatusCode } from '../models/httpStatusCode';

export class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: HttpStatusCode,
    description: string,
    isOperational: boolean,
  ) {
    super(description); // Set the error message

    // Fix prototype chain for custom error class
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this); // Capture stack trace starting from where the error was thrown
  }
}

export class APIError extends BaseError {
  constructor(
    name: string,
    httpCode = HttpStatusCode.InternalServerError,
    description = 'internal server error',
    isOperational = true,
  ) {
    super(name, httpCode, description, isOperational);
  }
}
