import { Router } from 'express';
import { createBilling, payBilling, getPendingBills } from '../controllers/billingController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/', authenticate, authorize('admin', 'billing'), createBilling);
router.put('/pay/:id', authenticate, authorize('admin', 'billing'), payBilling);
router.get('/pending', authenticate, authorize('admin', 'billing'), getPendingBills);

export default router;

