import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import EmploymentHistory from '../models/EmploymentHistory';
import { AppError, asyncHandler } from '../middleware/errorHandler';

export const createEmploymentHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId!;
  const { employerName, position, duties, startDate, endDate, isCurrent } = req.body;

  const employmentHistory = await EmploymentHistory.create({
    candidateId,
    employerName,
    position,
    duties,
    startDate,
    endDate,
    isCurrent: isCurrent || false,
  });

  res.status(201).json({
    message: 'Employment history added successfully',
    employmentHistory,
  });
});

export const getMyEmploymentHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId!;

  const employmentHistory = await EmploymentHistory.findAll({
    where: { candidateId },
    order: [['startDate', 'DESC']],
  });

  res.json({ employmentHistory });
});

export const updateEmploymentHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId!;
  const { id } = req.params;
  const updates = req.body;

  const employmentHistory = await EmploymentHistory.findOne({
    where: { id, candidateId },
  });

  if (!employmentHistory) {
    throw new AppError('Employment history not found', 404);
  }

  await employmentHistory.update(updates);

  res.json({
    message: 'Employment history updated successfully',
    employmentHistory,
  });
});

export const deleteEmploymentHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId!;
  const { id } = req.params;

  const employmentHistory = await EmploymentHistory.findOne({
    where: { id, candidateId },
  });

  if (!employmentHistory) {
    throw new AppError('Employment history not found', 404);
  }

  await employmentHistory.destroy();

  res.json({ message: 'Employment history deleted successfully' });
});

export const getCandidateEmploymentHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { candidateId } = req.params;

  const employmentHistory = await EmploymentHistory.findAll({
    where: { candidateId },
    order: [['startDate', 'DESC']],
  });

  res.json({ employmentHistory });
});

