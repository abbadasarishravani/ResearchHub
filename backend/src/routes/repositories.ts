import { Router } from 'express';
import {
  createRepository,
  getRepositories,
  getRepository,
  updateRepository,
  deleteRepository,
} from '../controllers/repositoryController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createRepository);
router.get('/', getRepositories);
router.get('/:id', getRepository);
router.put('/:id', updateRepository);
router.delete('/:id', deleteRepository);

export default router;
