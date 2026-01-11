export class HttpError extends Error {
  status: number;
  details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  static badRequest(message = 'Bad Request', details?: any) {
    return new HttpError(400, message, details);
  }

  static unauthorized(message = 'Unauthorized', details?: any) {
    return new HttpError(401, message, details);
  }

  static forbidden(message = 'Forbidden', details?: any) {
    return new HttpError(403, message, details);
  }

  static notFound(message = 'Not Found', details?: any) {
    return new HttpError(404, message, details);
  }

  static conflict(message = 'Conflict', details?: any) {
    return new HttpError(409, message, details);
  }
}

export default HttpError;
