import { Router } from 'express';
import { getProjects, createProject, getProjectDetails, addMember } from '../controllers/projects';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProjectDetails);
router.post('/:id/members', addMember);

export default router;
