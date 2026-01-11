import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validatePostCreate = [
  body('title').isString().notEmpty().withMessage('title is required'),
  body('body').isString().notEmpty().withMessage('body is required'),
  // senderId is derived from authenticated user; do not accept from client
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

export const validatePostUpdate = [
  // For full-replace semantics require all post fields on PUT
  body('title').isString().notEmpty().withMessage('title is required'),
  body('body').isString().notEmpty().withMessage('body is required'),
  // senderId should not be updated by client
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

export const validateCommentCreate = [
  body('postId').isString().notEmpty().withMessage('postId is required'),
  // authorId derived from authenticated user; do not accept from client
  body('text').isString().notEmpty().withMessage('text is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

export const validateCommentUpdate = [
  body('text').isString().notEmpty().withMessage('text is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

// User validation
export const validateRegister = [
  body('username').isString().trim().notEmpty().withMessage('username is required'),
  body('email').isEmail().withMessage('valid email is required'),
  body('password').isString().isLength({ min: 6 }).withMessage('password must be at least 6 chars'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

export const validateLogin = [
  body('identifier').isString().notEmpty().withMessage('email or username required'),
  body('password').isString().notEmpty().withMessage('password required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

export const validateUserUpdate = [
  body('displayName').optional().isString(),
  body('bio').optional().isString(),
  body('password').optional().isLength({ min: 6 }).withMessage('password must be at least 6 chars'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];
