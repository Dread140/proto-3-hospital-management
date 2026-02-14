import { getDb } from '../config/db.js';

export const startConsultation = async (req, res) => {
  const db = await getDb();
  const patient = await db.get('SELECT id FROM patients WHERE id = ?', req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });

  const result = await db.run(
    'INSERT INTO consultations (patient_id, doctor_id, start_time) VALUES (?, ?, CURRENT_TIMESTAMP)',
    [req.params.id, req.user.id]
  );
  await db.run('UPDATE patients SET current_stage = ?, status = ? WHERE id = ?', ['doctor', 'in_progress', req.params.id]);

  return res.json({ consultation_id: result.lastID, message: 'Consultation started' });
};

export const endConsultation = async (req, res) => {
  const db = await getDb();
  const consultation = await db.get(
    `SELECT id, start_time, patient_id
     FROM consultations
     WHERE patient_id = ?
     ORDER BY id DESC
     LIMIT 1`,
    req.params.id
  );

  if (!consultation || !consultation.start_time) {
    return res.status(404).json({ message: 'Active consultation not found' });
  }

  const startedAt = new Date(consultation.start_time);
  const durationMinutes = Math.max(1, Math.round((Date.now() - startedAt.getTime()) / 60000));

  await db.run(
    'UPDATE consultations SET end_time = CURRENT_TIMESTAMP, duration = ? WHERE id = ?',
    [durationMinutes, consultation.id]
  );
  await db.run('UPDATE patients SET current_stage = ?, status = ? WHERE id = ?', ['billing', 'waiting', req.params.id]);

  return res.json({ message: 'Consultation ended', duration_minutes: durationMinutes });
};
