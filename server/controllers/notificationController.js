import { z } from 'zod';
import { sendSMS } from '../services/smsService.js';
import { sendWhatsApp } from '../services/whatsappService.js';

const notifySchema = z.object({
  to: z.string().min(8),
  message: z.string().min(1)
});

export const notifySMS = async (req, res) => {
  const parsed = notifySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });

  await sendSMS(parsed.data.to, parsed.data.message);
  return res.json({ message: 'SMS dispatch requested' });
};

export const notifyWhatsApp = async (req, res) => {
  const parsed = notifySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });

  await sendWhatsApp(parsed.data.to, parsed.data.message);
  return res.json({ message: 'WhatsApp dispatch requested' });
};
