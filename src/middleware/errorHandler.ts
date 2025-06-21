import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/ValidationError';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  let statusCode: number = err.status ?? 500;
  let message: string = err.message || 'An unexpected error occurred.';
  let error: any;

  if (err instanceof ValidationError) {
    statusCode = err.status;
    message = err.message;
    error = err.details;
  }
  const responseBody: { success: false; message: string; error?: any } = {
    success: false,
    message: message,
  };
  if (error) responseBody.error = error;
  res.status(statusCode).json(responseBody);
};

export default errorHandler;
