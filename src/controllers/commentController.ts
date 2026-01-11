import type { Request, Response, NextFunction } from 'express';
import { Comment } from '../models';

export async function createComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { postId, text } = req.body as { postId: string; text: string };
    const authorId = (req as any).user?.id;
    if (!authorId) return res.status(401).json({ error: 'Unauthorized' });
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
    const comments = await Comment.find(filter).sort({ createdAt: -1 }).populate('authorId', 'username displayName');
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
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.authorId.toString() !== userId) return res.status(403).json({ error: 'Forbidden' });

    comment.text = text ?? comment.text;
    await comment.save();
    const populated = await comment.populate('authorId', 'username displayName');
    return res.json(populated);
  } catch (err) {
    return next(err);
  }
}

export async function deleteComment(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.authorId.toString() !== userId) return res.status(403).json({ error: 'Forbidden' });

    await comment.deleteOne();
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
