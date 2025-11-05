import { Router } from 'express';
import {
  screenApplication,
  searchCandidatesBySkills,
  bulkScreenApplications,
} from '../controllers/CVScreeningController';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../utils/validation';
import Joi from 'joi';

const router = Router();

const bulkScreenSchema = Joi.object({
  applicationIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
});

// Admin routes
router.post('/application/:applicationId', authenticate, requireRole(['admin']), screenApplication);
router.post('/bulk', authenticate, requireRole(['admin']), validate(bulkScreenSchema), bulkScreenApplications);
router.get('/search', authenticate, requireRole(['admin']), searchCandidatesBySkills);

export default router;

