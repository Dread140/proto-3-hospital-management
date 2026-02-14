import { Router } from 'express';
import { endConsultation, startConsultation } from '../controllers/consultationController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();
router.put('/start/:id', authenticate, authorize('admin', 'doctor'), startConsultation);
router.put('/end/:id', authenticate, authorize('admin', 'doctor'), endConsultation);

export default router;
