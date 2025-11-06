import { Router } from 'express';
import { login, googleLogin, getCurrentUser } from '../controllers/AuthController';
import { authenticate } from '../middleware/auth';
import { validate } from '../utils/validation';
import Joi from 'joi';

const router = Router();

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const googleLoginSchema = Joi.object({
  idToken: Joi.string().optional(),
  email: Joi.string().email().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  fullName: Joi.string().optional(),
  picture: Joi.string().optional(),
  locale: Joi.string().optional(),
  verifiedEmail: Joi.boolean().optional(),
}).or('idToken', 'email');

router.post('/login', validate(loginSchema), login);
router.post('/google', validate(googleLoginSchema), googleLogin);
router.get('/me', authenticate, getCurrentUser);

export default router;

