import { Router } from 'express';
import {
  getDashboardStats,
  getApplicationStats,
  getCandidateStats,
} from '../controllers/AdminController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.get('/dashboard', authenticate, requireRole(['admin']), getDashboardStats);
router.get('/stats/applications', authenticate, requireRole(['admin']), getApplicationStats);
router.get('/stats/candidates', authenticate, requireRole(['admin']), getCandidateStats);

export default router;

