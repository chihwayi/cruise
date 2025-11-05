import { Router } from 'express';
import {
  updateCrewStatus,
  getCrewReadiness,
  getAllCrewStatus,
  getCrewOnboard,
  getCrewOnVacation,
} from '../controllers/CrewController';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../utils/validation';
import Joi from 'joi';

const router = Router();

const crewStatusSchema = Joi.object({
  crewStatus: Joi.string().valid('onboard', 'on_vacation', 'available', 'unavailable').required(),
});

// Candidate can check their own readiness (must come before /:candidateId route)
router.get('/readiness/my', authenticate, (req, res, next) => {
  req.params.candidateId = 'my';
  next();
}, getCrewReadiness);

// Public/Admin routes
router.get('/status', authenticate, requireRole(['admin']), getAllCrewStatus);
router.get('/onboard', authenticate, requireRole(['admin']), getCrewOnboard);
router.get('/on-vacation', authenticate, requireRole(['admin']), getCrewOnVacation);
router.get('/readiness/:candidateId', authenticate, requireRole(['admin']), getCrewReadiness);
router.put('/status/:candidateId', authenticate, requireRole(['admin']), validate(crewStatusSchema), updateCrewStatus);

export default router;

