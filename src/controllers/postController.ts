import type { Request, Response, NextFunction } from 'express';
import { Post } from '../models';

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, body, senderId } = req.body as { title: string; body: string; senderId: string };
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
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    return next(err);
  }
}

export async function getPost(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.json(post);
  } catch (err) {
    return next(err);
  }
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, body, senderId } = req.body as { title?: string; body?: string; senderId?: string };
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      { title, body, ...(senderId ? { senderId } : {}) },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Post not found' });
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}
