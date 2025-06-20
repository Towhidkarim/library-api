import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../src/utils/ValidationError';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  let statusCode: number = err.status ?? 500;
  let message: string = err.message || 'An unexpected error occurred.';
  let errors: any;

  if (err instanceof ValidationError) {
    statusCode = err.status;
    message = err.message;
    errors = err.details;
  }
  const responseBody: { success: false; message: string; errors?: any } = {
    success: false,
    message: message,
  };
  if (errors) responseBody.errors = errors;
  res.status(statusCode).json(responseBody);
};

export default errorHandler;
