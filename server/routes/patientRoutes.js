import { Router } from 'express';
import { createPatient, getPatients } from '../controllers/patientController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/', authenticate, authorize('admin', 'receptionist'), createPatient);
router.get('/', authenticate, getPatients);

export default router;
