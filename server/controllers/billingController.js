import { z } from 'zod';
import { getDb } from '../config/db.js';
import { sendWhatsApp } from '../services/whatsappService.js';

const createBillingSchema = z.object({
  patient_id: z.number().int().positive(),
  amount: z.number().positive()
});

const paySchema = z.object({
  payment_mode: z.enum(['cash', 'card', 'upi', 'insurance'])
});

export const createBilling = async (req, res) => {
  const parsed = createBillingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });

  const db = await getDb();
  const result = await db.run('INSERT INTO billing (patient_id, amount, status) VALUES (?, ?, ?)', [
    parsed.data.patient_id,
    parsed.data.amount,
    'pending'
  ]);

  // Notify WhatsApp
  const patient = await db.get('SELECT * FROM patients WHERE id = ?', parsed.data.patient_id);
  if (patient && patient.phone) {
    await sendWhatsApp(patient.phone, `Hello ${patient.name}, a bill of ₹${parsed.data.amount} has been generated. Please proceed to payment.`);
  }

  return res.status(201).json({ id: result.lastID, status: 'pending' });
};

export const payBilling = async (req, res) => {
  const parsed = paySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });

  const db = await getDb();
  const bill = await db.get('SELECT * FROM billing WHERE id = ?', req.params.id);
  if (!bill) return res.status(404).json({ message: 'Billing record not found' });

  await db.run('UPDATE billing SET status = ?, payment_mode = ? WHERE id = ?', ['paid', parsed.data.payment_mode, req.params.id]);
  await db.run('UPDATE patients SET current_stage = ?, status = ? WHERE id = ?', ['completed', 'completed', bill.patient_id]);

  // Notify WhatsApp
  const patient = await db.get('SELECT * FROM patients WHERE id = ?', bill.patient_id);
  if (patient && patient.phone) {
    await sendWhatsApp(patient.phone, `Hello ${patient.name}, we have received your payment of ₹${bill.amount} via ${parsed.data.payment_mode}. Thank you!`);
  }

  return res.json({ message: 'Payment recorded and patient workflow completed' });
};

export const getPendingBills = async (_req, res) => {
  const db = await getDb();
  const bills = await db.all(
    `SELECT b.*, p.name, p.uhid, p.token_number 
     FROM billing b 
     JOIN patients p ON b.patient_id = p.id 
     WHERE b.status = 'pending'`
  );
  return res.json(bills);
};

