import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next(err);
  const status = err?.status || 500;
  const message = err?.message || 'Internal server error';
  // Standard error response format
  const payload: any = { error: { message } };
  if (err?.details) payload.error.details = err.details;
  // Include stack trace only in non-production for debugging
  if (process.env.NODE_ENV !== 'production' && err?.stack) payload.error.stack = err.stack;
  console.error(err);
  res.status(status).json(payload);
}
