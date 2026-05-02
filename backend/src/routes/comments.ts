import { Router } from 'express';
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from '../controllers/commentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createComment);
router.get('/:codeReviewId', getComments);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;
