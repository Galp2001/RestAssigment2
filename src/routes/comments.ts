import { Router } from 'express';
import {
  createComment,
  listComments,
  getComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController';
import { validateCommentCreate, validateCommentUpdate } from '../middleware/validation';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, validateCommentCreate, createComment);
router.get('/', listComments);
router.get('/:id', getComment);
router.put('/:id', authMiddleware, validateCommentUpdate, updateComment);
router.delete('/:id', authMiddleware, deleteComment);

export { router as commentsRouter };
