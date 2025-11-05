import { Router } from 'express';
import {
  registerCandidate,
  getCandidateProfile,
  updateCandidateProfile,
  assignEmploymentNumber,
  getAllCandidates,
  getCandidateById,
  updateCandidateById,
} from '../controllers/CandidateController';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../utils/validation';
import Joi from 'joi';

const router = Router();

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).optional(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  middleInitials: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
});

const updateSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  physicalAddress: Joi.string().optional(),
  // Add more fields as needed
}).min(1);

// Public route - candidate registration
router.post('/register', validate(registerSchema), registerCandidate);

// Protected routes
router.get('/profile', authenticate, getCandidateProfile);
router.put('/profile', authenticate, validate(updateSchema), updateCandidateProfile);

// Admin routes
router.get('/', authenticate, requireRole(['admin']), getAllCandidates);
router.get('/:candidateId', authenticate, requireRole(['admin']), getCandidateById);
router.put('/:candidateId', authenticate, requireRole(['admin']), validate(updateSchema), updateCandidateById);
router.post('/:candidateId/employment-number', authenticate, requireRole(['admin']), assignEmploymentNumber);

export default router;

