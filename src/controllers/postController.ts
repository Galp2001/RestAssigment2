import type { Request, Response, NextFunction } from 'express';
import { Post, Comment } from '../models';

// auth middleware sets (req as any).user

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, body } = req.body as { title: string; body: string };
    const senderId = (req as any).user?.id;
    if (!senderId) return next(new (require('../errors/HttpError')).default(401, 'Unauthorized'));
    const created = await Post.create({ title, body, senderId });
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

export async function listPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const sender = req.query.sender as string | undefined;
    const filter = sender ? { senderId: sender } : {};
    const posts = await Post.find(filter).sort({ createdAt: -1 }).populate('senderId', 'username displayName');
    return res.json(posts);
  } catch (err) {
    return next(err);
  }
}

export async function getPost(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await Post.findById(req.params.id).populate('senderId', 'username displayName');
    if (!post) return next(new (require('../errors/HttpError')).default(404, 'Post not found'));
    return res.json(post);
  } catch (err) {
    return next(err);
  }
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, body } = req.body as { title: string; body: string };
    const userId = (req as any).user?.id;
    if (!userId) return next(new (require('../errors/HttpError')).default(401, 'Unauthorized'));

    const post = await Post.findById(req.params.id);
    if (!post) return next(new (require('../errors/HttpError')).default(404, 'Post not found'));
    if (post.senderId.toString() !== userId && (req as any).user?.role !== 'admin') return next(new (require('../errors/HttpError')).default(403, 'Forbidden'));

    post.title = title;
    post.body = body;
    await post.save();
    const populated = await post.populate('senderId', 'username displayName');
    return res.json(populated);
  } catch (err) {
    return next(err);
  }
}

export async function deletePost(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return next(new (require('../errors/HttpError')).default(401, 'Unauthorized'));

    const post = await Post.findById(req.params.id);
    if (!post) return next(new (require('../errors/HttpError')).default(404, 'Post not found'));
    if (post.senderId.toString() !== userId && (req as any).user?.role !== 'admin') return next(new (require('../errors/HttpError')).default(403, 'Forbidden'));

    await Comment.deleteMany({ postId: post._id });
    await post.deleteOne();
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
