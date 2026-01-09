import type { Request, Response } from 'express';
import { Router } from 'express';
import { Comment } from '../models';

const router = Router();

// Create a comment
router.post('/', async (req: Request, res: Response) => {
  try {
    const { postId, authorId, text } = req.body as { postId?: string; authorId?: string; text?: string };
    if (!postId || !authorId || !text) {
      return res.status(400).json({ error: 'postId, authorId and text are required' });
    }

    const created = await Comment.create({ postId, authorId, text });
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get comments by post (query) or all comments
router.get('/', async (req: Request, res: Response) => {
  try {
    const post = req.query.post as string | undefined;
    const filter = post ? { postId: post } : {};
    const comments = await Comment.find(filter).sort({ createdAt: -1 });
    return res.json(comments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single comment
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    return res.json(comment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update comment
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { text } = req.body as { text?: string };
    if (!text) return res.status(400).json({ error: 'text is required' });

    const updated = await Comment.findByIdAndUpdate(req.params.id, { text }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Comment not found' });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete comment
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Comment not found' });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as commentsRouter };
