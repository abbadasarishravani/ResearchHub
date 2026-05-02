import { Router } from 'express';
import {
  createSuggestion,
  getSuggestions,
  updateSuggestion,
  deleteSuggestion,
} from '../controllers/suggestionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createSuggestion);
router.get('/:codeReviewId', getSuggestions);
router.put('/:id', updateSuggestion);
router.delete('/:id', deleteSuggestion);

export default router;
