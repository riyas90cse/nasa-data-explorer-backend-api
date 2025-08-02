import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../types/api.types';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';

/**
 * Custom API error class that extends the standard Error
 * Includes additional properties for HTTP status code and operational status
 */
export class APIError extends Error {
  /** HTTP status code for the error response */
  public readonly statusCode: number;
  /** Indicates if the error is operational (expected) or programming error */
  public readonly isOperational: boolean;

  /**
   * Creates a new API error
   * 
   * @param message - Error message
   * @param statusCode - HTTP status code (defaults to 500)
   * @param isOperational - Whether the error is operational (defaults to true)
   */
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

/**
 * Middleware for handling 404 Not Found errors
 * Creates an APIError for routes that don't exist
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
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

/**
 * Global error handling middleware
 * Processes all errors and returns appropriate responses
 * 
 * @param error - Error object (can be standard Error or APIError)
 * @param req - Express request object
 * @param res - Express response object
 * @param _next - Express next function (unused)
 */
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
