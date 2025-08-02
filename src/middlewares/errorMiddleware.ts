import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../types/api.types';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';

export class APIError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new APIError(
    `Route ${req.originalUrl} not found`,
    HTTP_STATUS.NOT_FOUND
  );
  next(error);
};

export const errorHandler = (
  error: Error | APIError,
  req: Request,
  res: Response<APIResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = error.message;

  if (error instanceof APIError) {
    statusCode = error.statusCode;
  }

  if ('code' in error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
      message = ERROR_MESSAGES.EXTERNAL_SERVICE_UNAVAILABLE;
    }
  }

  console.error(`Error ${statusCode}: ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
};
