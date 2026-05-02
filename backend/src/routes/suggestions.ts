import { Router } from 'express';
import {
  createSuggestion,
  getSuggestions,
  updateSuggestion,
  deleteSuggestion,
} from '../controllers/suggestionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createSuggestion);
router.get('/:codeReviewId', getSuggestions);
router.put('/:id', updateSuggestion);
router.delete('/:id', deleteSuggestion);

export default router;
