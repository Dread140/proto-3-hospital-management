import { z } from 'zod';
import { getDb } from '../config/db.js';

const priorities = ['emergency', 'vip', 'senior', 'normal'];
const patientSchema = z.object({
  uhid: z.string().min(3),
  name: z.string().min(2),
  age: z.number().int().min(0).max(120),
  gender: z.string().min(1),
  phone: z.string().min(8),
  priority_level: z.enum(priorities)
});

export const createPatient = async (req, res) => {
  const parsed = patientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });
  }

  const db = await getDb();
  const row = await db.get('SELECT COALESCE(MAX(token_number), 0) + 1 AS nextToken FROM patients');

  const result = await db.run(
    `INSERT INTO patients (uhid, name, age, gender, phone, token_number, priority_level, current_stage, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'registered', 'waiting')`,
    [
      parsed.data.uhid,
      parsed.data.name,
      parsed.data.age,
      parsed.data.gender,
      parsed.data.phone,
      row.nextToken,
      parsed.data.priority_level
    ]
  );

  return res.status(201).json({ id: result.lastID, token_number: row.nextToken });
};

export const getPatients = async (_req, res) => {
  const db = await getDb();
  const patients = await db.all(
    `SELECT * FROM patients
     ORDER BY
       CASE priority_level
         WHEN 'emergency' THEN 1
         WHEN 'vip' THEN 2
         WHEN 'senior' THEN 3
         ELSE 4
       END,
       token_number ASC`
  );

  return res.json(patients);
};
