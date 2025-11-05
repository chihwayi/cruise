import { Router } from 'express';
import authRoutes from './auth';
import candidateRoutes from './candidates';
import jobRoutes from './jobs';
import applicationRoutes from './applications';
import employmentHistoryRoutes from './employment-history';
import documentRoutes from './documents';
import contractRoutes from './contracts';
import crewRoutes from './crew';
import cvScreeningRoutes from './cv-screening';
import adminRoutes from './admin';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
router.use('/auth', authRoutes);
router.use('/candidates', candidateRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/employment-history', employmentHistoryRoutes);
router.use('/documents', documentRoutes);
router.use('/contracts', contractRoutes);
router.use('/crew', crewRoutes);
router.use('/cv-screening', cvScreeningRoutes);
router.use('/admin', adminRoutes);

export default router;

