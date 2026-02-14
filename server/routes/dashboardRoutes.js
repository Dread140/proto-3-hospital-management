import { Router } from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', authenticate, authorize('admin'), getDashboard);
router.get('/metrics', authenticate, getDashboard);

export default router;

