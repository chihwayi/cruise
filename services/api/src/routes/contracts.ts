import { Router } from 'express';
import {
  createContract,
  getMyContracts,
  getContract,
  updateContract,
  signContract,
  getAllContracts,
  updateJoiningDate,
  updateSignOffDate,
} from '../controllers/ContractController';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../utils/validation';
import Joi from 'joi';

const router = Router();

const contractSchema = Joi.object({
  candidateId: Joi.string().uuid().required(),
  jobPostingId: Joi.string().uuid().optional(),
  contractType: Joi.string().valid('temporary', 'permanent', 'seasonal').required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().optional(),
  position: Joi.string().required(),
  salary: Joi.number().optional(),
  currency: Joi.string().optional(),
  vesselName: Joi.string().optional(),
  terms: Joi.object().optional(),
});

const updateSchema = Joi.object({
  contractType: Joi.string().valid('temporary', 'permanent', 'seasonal').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  joiningDate: Joi.date().optional(),
  signOffDate: Joi.date().optional(),
  position: Joi.string().optional(),
  salary: Joi.number().optional(),
  currency: Joi.string().optional(),
  vesselName: Joi.string().optional(),
  status: Joi.string().valid('draft', 'pending_signature', 'signed', 'active', 'completed', 'terminated').optional(),
  terms: Joi.object().optional(),
}).min(1);

// Candidate routes
router.get('/my', authenticate, getMyContracts);
router.get('/:id', authenticate, getContract);
router.post('/:id/sign', authenticate, validate(Joi.object({ documentUrl: Joi.string().uri().optional() })), signContract);

// Admin routes
router.post('/', authenticate, requireRole(['admin']), validate(contractSchema), createContract);
router.get('/', authenticate, requireRole(['admin']), getAllContracts);
router.put('/:id', authenticate, requireRole(['admin']), validate(updateSchema), updateContract);
router.put('/:id/joining-date', authenticate, requireRole(['admin']), validate(Joi.object({ joiningDate: Joi.date().required() })), updateJoiningDate);
router.put('/:id/sign-off-date', authenticate, requireRole(['admin']), validate(Joi.object({ signOffDate: Joi.date().required() })), updateSignOffDate);

export default router;

