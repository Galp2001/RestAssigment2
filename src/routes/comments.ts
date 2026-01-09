import { Router } from 'express';
import {
  createComment,
  listComments,
  getComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController';
import { validateCommentCreate, validateCommentUpdate } from '../middleware/validation';

const router = Router();

router.post('/', validateCommentCreate, createComment);
router.get('/', listComments);
router.get('/:id', getComment);
router.put('/:id', validateCommentUpdate, updateComment);
router.delete('/:id', deleteComment);

export { router as commentsRouter };
