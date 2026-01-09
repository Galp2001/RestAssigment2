import { Router } from 'express';
import { createPost, listPosts, getPost, updatePost } from '../controllers/postController';
import { validatePostCreate, validatePostUpdate } from '../middleware/validation';

const router = Router();

router.post('/', validatePostCreate, createPost);
router.get('/', listPosts);
router.get('/:id', getPost);
router.put('/:id', validatePostUpdate, updatePost);

export { router as postsRouter };
