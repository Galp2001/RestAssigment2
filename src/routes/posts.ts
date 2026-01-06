import type { Request, Response } from 'express';
import { Router } from 'express';
import { Post } from '../models';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, body, senderId } = req.body as { title?: string; body?: string; senderId?: string };
    if (!title || !body || !senderId) {
      return res.status(400).json({ error: 'title, body and senderId are required' });
    }

    const created = await Post.create({ title, body, senderId });
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const sender = req.query.sender as string | undefined;
    const filter = sender ? { senderId: sender } : {};
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, body, senderId } = req.body as { title?: string; body?: string; senderId?: string };
    if (!title || !body) {
      return res.status(400).json({ error: 'title and body are required' });
    }

    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      { title, body, ...(senderId ? { senderId } : {}) },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Post not found' });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as postsRouter };
