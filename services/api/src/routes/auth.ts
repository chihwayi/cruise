import { Router } from 'express';
import { login, getCurrentUser } from '../controllers/AuthController';
import { authenticate } from '../middleware/auth';
import { validate } from '../utils/validation';
import Joi from 'joi';

const router = Router();

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getCurrentUser);

export default router;

