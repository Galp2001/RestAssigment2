import type { Request, Response, NextFunction } from 'express';
import { Comment } from '../models';

export async function createComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { postId, authorId, text } = req.body as { postId: string; authorId: string; text: string };
    const created = await Comment.create({ postId, authorId, text });
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

export async function listComments(req: Request, res: Response, next: NextFunction) {
  try {
    const post = req.query.post as string | undefined;
    const filter = post ? { postId: post } : {};
    const comments = await Comment.find(filter).sort({ createdAt: -1 });
    return res.json(comments);
  } catch (err) {
    return next(err);
  }
}

export async function getComment(req: Request, res: Response, next: NextFunction) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    return res.json(comment);
  } catch (err) {
    return next(err);
  }
}

export async function updateComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { text } = req.body as { text?: string };
    const updated = await Comment.findByIdAndUpdate(req.params.id, { text }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Comment not found' });
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function deleteComment(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Comment not found' });
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
