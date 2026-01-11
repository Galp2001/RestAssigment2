import type { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/HttpError';

function mapMongooseError(err: any): HttpError | null {
  if (!err) return null;
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors || {}).map((e: any) => ({ message: e.message, path: e.path }));
    return HttpError.badRequest('Validation failed', details);
  }
  // CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return HttpError.badRequest('Invalid identifier', { path: err.path, value: err.value });
  }
  // Duplicate key
  if (err.code === 11000 || (err.name === 'MongoServerError' && err.code === 11000)) {
    return HttpError.conflict('Duplicate key', { keyValue: err.keyValue });
  }
  return null;
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next(err);

  // If it's already an HttpError, use it
  let httpErr: HttpError | null = null;
  if (err instanceof HttpError) httpErr = err;

  // Map known mongoose/db errors to HttpError
  if (!httpErr) httpErr = mapMongooseError(err);

  const status = httpErr?.status || 500;
  const message = httpErr?.message || err?.message || 'Internal server error';

  const payload: any = { error: { message } };
  if (httpErr?.details) payload.error.details = httpErr.details;
  if (!httpErr && err?.details) payload.error.details = err.details;
  if (process.env.NODE_ENV !== 'production' && err?.stack) payload.error.stack = err.stack;

  console.error(err);
  res.status(status).json(payload);
}
