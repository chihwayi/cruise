import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Candidate from '../models/Candidate';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const candidate = await Candidate.findOne({ where: { email } });

  if (!candidate || !candidate.passwordHash) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, candidate.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = jwt.sign(
    {
      userId: candidate.id,
      email: candidate.email,
      role: 'candidate',
    },
    process.env.JWT_SECRET || 'your_jwt_secret_change_in_prod',
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    candidate: {
      id: candidate.id,
      email: candidate.email,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      employmentNumber: candidate.employmentNumber,
    },
  });
});

export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidate = await Candidate.findByPk(req.userId, {
    attributes: { exclude: ['passwordHash'] },
  });

  if (!candidate) {
    throw new AppError('Candidate not found', 404);
  }

  res.json({ candidate });
});

