import { Router } from 'express';
import { createTask, updateTaskStatus, getMyTasks } from '../controllers/tasks';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/me', getMyTasks);
router.post('/', createTask);
router.patch('/:id/status', updateTaskStatus);

export default router;
