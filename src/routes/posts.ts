import { Router } from 'express';
import { createPost, listPosts, getPost, updatePost, deletePost } from '../controllers/postController';
import { validatePostCreate, validatePostUpdate } from '../middleware/validation';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, validatePostCreate, createPost);
router.get('/', listPosts);
router.get('/:id', getPost);
router.put('/:id', authMiddleware, validatePostUpdate, updatePost);
router.delete('/:id', authMiddleware, deletePost);

export { router as postsRouter };
