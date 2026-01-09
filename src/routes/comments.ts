import { Router } from 'express';
import {
  createComment,
  listComments,
  getComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController';

const router = Router();

router.post('/', createComment);
router.get('/', listComments);
router.get('/:id', getComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export { router as commentsRouter };
