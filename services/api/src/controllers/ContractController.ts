import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Contract from '../models/Contract';
import Candidate from '../models/Candidate';
import JobPosting from '../models/JobPosting';
import { AppError, asyncHandler } from '../middleware/errorHandler';

export const createContract = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { candidateId, jobPostingId, contractType, startDate, endDate, position, salary, currency, vesselName, terms } = req.body;

  // Generate contract number
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const contractNumber = `CT-${year}-${randomNum}`;

  const contract = await Contract.create({
    candidateId,
    jobPostingId,
    contractNumber,
    contractType,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : undefined,
    position,
    salary,
    currency: currency || 'USD',
    vesselName,
    terms,
    status: 'draft',
  });

  res.status(201).json({
    message: 'Contract created successfully',
    contract,
  });
});

export const getMyContracts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId!;

  const contracts = await Contract.findAll({
    where: { candidateId },
    include: [
      { model: Candidate, as: 'candidate', attributes: { exclude: ['passwordHash'] } },
      { model: JobPosting, as: 'jobPosting' },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.json({ contracts });
});

export const getContract = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const candidateId = req.userId;

  const where: any = { id };
  if (candidateId) {
    where.candidateId = candidateId;
  }

  const contract = await Contract.findOne({
    where,
    include: [
      { model: Candidate, as: 'candidate', attributes: { exclude: ['passwordHash'] } },
      { model: JobPosting, as: 'jobPosting' },
    ],
  });

  if (!contract) {
    throw new AppError('Contract not found', 404);
  }

  res.json({ contract });
});

export const updateContract = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const contract = await Contract.findByPk(id);
  if (!contract) {
    throw new AppError('Contract not found', 404);
  }

  // Convert date strings to Date objects
  if (updates.startDate) updates.startDate = new Date(updates.startDate);
  if (updates.endDate) updates.endDate = new Date(updates.endDate);
  if (updates.joiningDate) updates.joiningDate = new Date(updates.joiningDate);
  if (updates.signOffDate) updates.signOffDate = new Date(updates.signOffDate);

  await contract.update(updates);

  res.json({
    message: 'Contract updated successfully',
    contract,
  });
});

export const signContract = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { documentUrl } = req.body;
  const candidateId = req.userId!;

  const contract = await Contract.findOne({
    where: { id, candidateId },
  });

  if (!contract) {
    throw new AppError('Contract not found', 404);
  }

  if (contract.status === 'signed') {
    throw new AppError('Contract already signed', 400);
  }

  await contract.update({
    status: 'signed',
    signedAt: new Date(),
    signedBy: candidateId,
    documentUrl,
  });

  res.json({
    message: 'Contract signed successfully',
    contract,
  });
});

export const getAllContracts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, status, candidateId } = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  const where: any = {};

  if (status) {
    where.status = status;
  }
  if (candidateId) {
    where.candidateId = candidateId;
  }

  const { count, rows } = await Contract.findAndCountAll({
    where,
    include: [
      { model: Candidate, as: 'candidate', attributes: { exclude: ['passwordHash'] } },
      { model: JobPosting, as: 'jobPosting' },
    ],
    limit: Number(limit),
    offset,
    order: [['createdAt', 'DESC']],
  });

  res.json({
    contracts: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
    },
  });
});

export const updateJoiningDate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { joiningDate } = req.body;

  const contract = await Contract.findByPk(id);
  if (!contract) {
    throw new AppError('Contract not found', 404);
  }

  await contract.update({
    joiningDate: new Date(joiningDate),
  });

  res.json({
    message: 'Joining date updated successfully',
    contract,
  });
});

export const updateSignOffDate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { signOffDate } = req.body;

  const contract = await Contract.findByPk(id);
  if (!contract) {
    throw new AppError('Contract not found', 404);
  }

  await contract.update({
    signOffDate: new Date(signOffDate),
  });

  res.json({
    message: 'Sign-off date updated successfully',
    contract,
  });
});

