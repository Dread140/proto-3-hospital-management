import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { getDb } from './config/db.js';
import { seedDefaultAdmin } from './controllers/authController.js';

import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import testRoutes from './routes/testRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

/* -------------------- Middleware -------------------- */

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300
  })
);

/* -------------------- Health Check -------------------- */

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Sankara Eye Hospital API' });
});

/* -------------------- Routes -------------------- */

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/notify', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

/* -------------------- Global Error Handler -------------------- */

app.use((err, _req, res, _next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    message: 'Internal Server Error'
  });
});

/* -------------------- Bootstrap -------------------- */

const bootstrap = async () => {
  try {
    await getDb(); // Initialize database
    await seedDefaultAdmin(); // Create default admin

    app.listen(port, () => {
      console.log(`✅ Sankara Eye Hospital Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

bootstrap();
