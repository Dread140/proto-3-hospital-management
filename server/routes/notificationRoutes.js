import { Router } from 'express';
import { notifySMS, notifyWhatsApp } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/sms', authenticate, notifySMS);
router.post('/whatsapp', authenticate, notifyWhatsApp);

export default router;
