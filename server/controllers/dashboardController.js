import { getDb } from '../config/db.js';

export const getDashboard = async (_req, res) => {
  const db = await getDb();

  const [totals, testsInProgress, emergencyCases, completedPatients, avgTestDuration, avgConsultationTime] = await Promise.all([
    db.get("SELECT COUNT(*) AS total FROM patients WHERE date(created_at) = date('now')"),
    db.get("SELECT COUNT(*) AS total FROM tests WHERE status = 'in_progress'"),
    db.get("SELECT COUNT(*) AS total FROM patients WHERE priority_level = 'emergency' AND status != 'completed'"),
    db.get("SELECT COUNT(*) AS total FROM patients WHERE status = 'completed'"),
    db.get(
      `SELECT ROUND(AVG((julianday(end_time) - julianday(start_time)) * 24 * 60), 2) AS average
       FROM tests
       WHERE start_time IS NOT NULL AND end_time IS NOT NULL`
    ),
    db.get('SELECT ROUND(AVG(duration), 2) AS average FROM consultations WHERE duration IS NOT NULL')
  ]);

  const waitingQueue = await db.all(
    `SELECT id, name, token_number, priority_level, current_stage
     FROM patients
     WHERE status = 'waiting'
     ORDER BY token_number ASC
     LIMIT 10`
  );

  return res.json({
    total_patients_today: totals.total,
    tests_in_progress: testsInProgress.total,
    emergency_cases: emergencyCases.total,
    completed_patients: completedPatients.total,
    average_test_duration_minutes: avgTestDuration.average,
    average_consultation_time_minutes: avgConsultationTime.average,
    waiting_queue: waitingQueue
  });
};
