import { Router } from 'express';
import {
  createApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getApplicationById,
} from '../controllers/ApplicationController';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../utils/validation';
import Joi from 'joi';

const router = Router();

const applicationSchema = Joi.object({
  jobPostingId: Joi.string().uuid().required(),
  personalSummary: Joi.string().optional(),
  resumeUrl: Joi.string().uri().optional(),
});

const statusUpdateSchema = Joi.object({
  screeningStatus: Joi.string().valid('pending', 'screening', 'shortlisted', 'rejected', 'interview_scheduled', 'hired').required(),
  screeningScore: Joi.number().min(0).max(100).optional(),
});

// Candidate routes
router.post('/', authenticate, validate(applicationSchema), createApplication);
router.get('/my', authenticate, getMyApplications);

// Admin routes
router.get('/all', authenticate, requireRole(['admin']), getAllApplications);
router.get('/:id', authenticate, requireRole(['admin']), getApplicationById);
router.put('/:id/status', authenticate, requireRole(['admin']), validate(statusUpdateSchema), updateApplicationStatus);

export default router;

