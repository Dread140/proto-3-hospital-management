import { Router } from 'express';
import { createTests, completeTest, startTest, waitingTests } from '../controllers/testController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/', authenticate, authorize('admin', 'receptionist', 'technician'), createTests);
router.put('/start/:id', authenticate, authorize('admin', 'technician'), startTest);
router.put('/complete/:id', authenticate, authorize('admin', 'technician'), completeTest);
router.get('/waiting', authenticate, waitingTests);

export default router;

