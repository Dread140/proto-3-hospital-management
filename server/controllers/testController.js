import { z } from 'zod';
import { getDb } from '../config/db.js';
import { sendWhatsApp } from '../services/whatsappService.js';

const testDurations = {
  vision: 5,
  refraction: 10,
  iop: 5,
  oct: 15,
  field: 20,
  preop: 25
};

const createTestsSchema = z.object({
  patient_id: z.number().int().positive(),
  test_types: z.array(z.enum(['vision', 'refraction', 'iop', 'oct', 'field', 'preop'])).min(1)
});

export const createTests = async (req, res) => {
  const parsed = createTestsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });
  }

  const db = await getDb();
  const patient = await db.get('SELECT id FROM patients WHERE id = ?', parsed.data.patient_id);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  const testIds = [];
  for (const testType of parsed.data.test_types) {
    const result = await db.run(
      'INSERT INTO tests (patient_id, test_type, status) VALUES (?, ?, ?)',
      [parsed.data.patient_id, testType, 'pending']
    );
    testIds.push(result.lastID);
  }

  return res.status(201).json({
    message: `${parsed.data.test_types.length} tests assigned successfully`,
    test_ids: testIds
  });
};

export const startTest = async (req, res) => {
  const db = await getDb();
  const test = await db.get('SELECT * FROM tests WHERE id = ?', req.params.id);
  if (!test) return res.status(404).json({ message: 'Test not found' });

  await db.run('UPDATE tests SET status = ?, start_time = CURRENT_TIMESTAMP WHERE id = ?', ['in_progress', req.params.id]);
  await db.run('UPDATE patients SET current_stage = ?, status = ? WHERE id = ?', ['screening', 'in_progress', test.patient_id]);
  
  // Notify WhatsApp
  const patient = await db.get('SELECT * FROM patients WHERE id = ?', test.patient_id);
  // Using a mock phone number if not present, or assuming it exists on patient record
  // format: 8000000000
  if (patient && patient.phone) {
      await sendWhatsApp(patient.phone, `Hello ${patient.name}, your ${test.test_type} test has started.`);
  }

  return res.json({ message: 'Test started', expected_duration_min: testDurations[test.test_type] || null });
};

export const completeTest = async (req, res) => {
  const db = await getDb();
  const test = await db.get('SELECT * FROM tests WHERE id = ?', req.params.id);
  if (!test) return res.status(404).json({ message: 'Test not found' });

  await db.run('UPDATE tests SET status = ?, end_time = CURRENT_TIMESTAMP WHERE id = ?', ['completed', req.params.id]);
  await db.run('UPDATE patients SET current_stage = ?, status = ? WHERE id = ?', ['doctor', 'waiting', test.patient_id]);
  await db.run(
    'INSERT INTO logs (user_id, action, patient_id) VALUES (?, ?, ?)',
    [req.user.id, `Completed ${test.test_type} test`, test.patient_id]
  );

  // Notify WhatsApp
  const patient = await db.get('SELECT * FROM patients WHERE id = ?', test.patient_id);
  if (patient && patient.phone) {
      await sendWhatsApp(patient.phone, `Hello ${patient.name}, your ${test.test_type} test is complete. You are now in the doctor's queue.`);
  }

  return res.json({ message: 'Test completed and patient moved to doctor queue' });
};

export const waitingTests = async (_req, res) => {
  const db = await getDb();
  const tests = await db.all(
    `SELECT t.*, p.name AS patient_name, p.priority_level
     FROM tests t
     JOIN patients p ON p.id = t.patient_id
     WHERE t.status != 'completed'
     ORDER BY
       CASE p.priority_level
         WHEN 'emergency' THEN 1
         WHEN 'vip' THEN 2
         WHEN 'senior' THEN 3
         ELSE 4
       END,
       p.token_number ASC`
  );
  return res.json(tests);
};

