import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { getDb } from '../config/db.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });
  }

  const db = await getDb();
  const user = await db.get('SELECT * FROM users WHERE email = ?', parsed.data.email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(parsed.data.password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '8h'
  });

  return res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
};

export const seedDefaultAdmin = async () => {
  const db = await getDb();
  const existingAdmin = await db.get('SELECT id FROM users WHERE email = ?', 'admin@sankara.local');
  if (existingAdmin) return;

  const password = await bcrypt.hash('Admin@123', 10);
  await db.run(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    ['System Admin', 'admin@sankara.local', password, 'admin']
  );
  console.log('Seeded default admin: admin@sankara.local / Admin@123');
};
