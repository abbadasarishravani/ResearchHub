import { Router } from 'express';
import {
  createCodeReview,
  getCodeReviews,
  getCodeReview,
  updateCodeReview,
  updateCodeReviewStatus,
  deleteCodeReview,
} from '../controllers/codeReviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createCodeReview);
router.get('/', getCodeReviews);
router.get('/:id', getCodeReview);
router.put('/:id', updateCodeReview);
router.patch('/:id/status', updateCodeReviewStatus);
router.delete('/:id', deleteCodeReview);

export default router;
