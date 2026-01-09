import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validatePostCreate = [
  body('title').isString().notEmpty().withMessage('title is required'),
  body('body').isString().notEmpty().withMessage('body is required'),
  body('senderId').isString().notEmpty().withMessage('senderId is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

export const validatePostUpdate = [
  body('title').optional().isString().notEmpty().withMessage('title must be a non-empty string'),
  body('body').optional().isString().notEmpty().withMessage('body must be a non-empty string'),
  body('senderId').optional().isString().notEmpty().withMessage('senderId must be a non-empty string'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

export const validateCommentCreate = [
  body('postId').isString().notEmpty().withMessage('postId is required'),
  body('authorId').isString().notEmpty().withMessage('authorId is required'),
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
