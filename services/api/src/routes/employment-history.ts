import { Router } from 'express';
import {
  createEmploymentHistory,
  getMyEmploymentHistory,
  updateEmploymentHistory,
  deleteEmploymentHistory,
  getCandidateEmploymentHistory,
} from '../controllers/EmploymentHistoryController';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../utils/validation';
import Joi from 'joi';

const router = Router();

const employmentHistorySchema = Joi.object({
  employerName: Joi.string().required(),
  position: Joi.string().required(),
  duties: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().optional(),
  isCurrent: Joi.boolean().optional(),
});

const updateSchema = Joi.object({
  employerName: Joi.string().optional(),
  position: Joi.string().optional(),
  duties: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  isCurrent: Joi.boolean().optional(),
}).min(1);

// Candidate routes
router.post('/', authenticate, validate(employmentHistorySchema), createEmploymentHistory);
router.get('/my', authenticate, getMyEmploymentHistory);
router.put('/:id', authenticate, validate(updateSchema), updateEmploymentHistory);
router.delete('/:id', authenticate, deleteEmploymentHistory);

// Admin routes
router.get('/candidate/:candidateId', authenticate, requireRole(['admin']), getCandidateEmploymentHistory);

export default router;

