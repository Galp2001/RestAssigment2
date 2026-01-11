import HttpError from '../errors/HttpError';

// Middleware factory that ensures the authenticated user is the owner of a resource
// `getOwnerId` can be a function that reads req and returns the owner id (string)
export function ensureOwnerOrAdmin(getOwnerId: (req: any) => string | undefined) {
  return (req: any, res: any, next: any) => {
    const user = req.user;
    if (!user) return next(HttpError.unauthorized());
    const ownerId = getOwnerId(req);
    if (!ownerId) return next(HttpError.notFound());
    // allow if same user id
    if (String(user.id) === String(ownerId)) return next();
    // allow if admin flag present on user
    if (user.role === 'admin') return next();
    return next(HttpError.forbidden());
  };
}

export default ensureOwnerOrAdmin;
