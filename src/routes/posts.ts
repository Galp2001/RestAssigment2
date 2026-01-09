import { Router } from 'express';
import { createPost, listPosts, getPost, updatePost } from '../controllers/postController';

const router = Router();

router.post('/', createPost);
router.get('/', listPosts);
router.get('/:id', getPost);
router.put('/:id', updatePost);

export { router as postsRouter };
