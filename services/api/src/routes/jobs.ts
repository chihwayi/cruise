import { Router } from 'express';
import {
  createJobPosting,
  getAllJobPostings,
  getJobPosting,
  updateJobPosting,
  deleteJobPosting,
} from '../controllers/JobController';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../utils/validation';
import Joi from 'joi';

const router = Router();

const jobPostingSchema = Joi.object({
  cruiseLineName: Joi.string().required(),
  positionTitle: Joi.string().required(),
  positionDescription: Joi.string().required(),
  requirements: Joi.string().required(),
  specifications: Joi.string().required(),
  department: Joi.string().optional(),
  employmentType: Joi.string().optional(),
  startDate: Joi.date().optional(),
  applicationDeadline: Joi.date().optional(),
});

// Public route - get all active job postings
router.get('/', getAllJobPostings);
router.get('/:id', getJobPosting);

// Admin routes
router.post('/', authenticate, requireRole(['admin']), validate(jobPostingSchema), createJobPosting);
router.put('/:id', authenticate, requireRole(['admin']), validate(jobPostingSchema), updateJobPosting);
router.delete('/:id', authenticate, requireRole(['admin']), deleteJobPosting);

export default router;

