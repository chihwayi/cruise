import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Candidate from '../models/Candidate';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const registerCandidate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password, firstName, lastName, ...otherData } = req.body;

  // Check if candidate already exists
  const existingCandidate = await Candidate.findOne({ where: { email } });
  if (existingCandidate) {
    throw new AppError('Candidate with this email already exists', 400);
  }

  // Hash password if provided
  let passwordHash;
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  const candidate = await Candidate.create({
    email,
    passwordHash,
    firstName,
    lastName,
    ...otherData,
  });

  res.status(201).json({
    message: 'Candidate registered successfully',
    candidate: {
      id: candidate.id,
      email: candidate.email,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
    },
  });
});

export const getCandidateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId;

  const candidate = await Candidate.findByPk(candidateId, {
    attributes: { exclude: ['passwordHash'] },
  });

  if (!candidate) {
    throw new AppError('Candidate not found', 404);
  }

  res.json({ candidate });
});

export const updateCandidateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId;
  const updates = req.body;

  const candidate = await Candidate.findByPk(candidateId);
  if (!candidate) {
    throw new AppError('Candidate not found', 404);
  }

  await candidate.update(updates);

  res.json({
    message: 'Profile updated successfully',
    candidate: {
      id: candidate.id,
      email: candidate.email,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
    },
  });
});

export const assignEmploymentNumber = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { candidateId } = req.params;

  const candidate = await Candidate.findByPk(candidateId);
  if (!candidate) {
    throw new AppError('Candidate not found', 404);
  }

  if (candidate.employmentNumber) {
    throw new AppError('Candidate already has an employment number', 400);
  }

  // Generate employment number (format: CR-YYYY-NNNNNN)
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const employmentNumber = `CR-${year}-${randomNum}`;

  await candidate.update({ employmentNumber });

  res.json({
    message: 'Employment number assigned successfully',
    employmentNumber,
  });
});

export const getAllCandidates = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, crewStatus, search } = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  const where: any = {};

  if (crewStatus) {
    where.crewStatus = crewStatus;
  }

  if (search) {
    const { Op } = require('sequelize');
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { count, rows } = await Candidate.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    attributes: { exclude: ['passwordHash'] },
    order: [['createdAt', 'DESC']],
  });

  res.json({
    candidates: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
    },
  });
});

export const getCandidateById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { candidateId } = req.params;

  const candidate = await Candidate.findByPk(candidateId, {
    attributes: { exclude: ['passwordHash'] },
  });

  if (!candidate) {
    throw new AppError('Candidate not found', 404);
  }

  res.json({ candidate });
});

export const updateCandidateById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { candidateId } = req.params;
  const updates = req.body;

  const candidate = await Candidate.findByPk(candidateId);
  if (!candidate) {
    throw new AppError('Candidate not found', 404);
  }

  await candidate.update(updates);

  res.json({
    message: 'Candidate updated successfully',
    candidate: {
      id: candidate.id,
      email: candidate.email,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
    },
  });
});

