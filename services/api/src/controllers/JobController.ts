import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import JobPosting from '../models/JobPosting';
import { AppError, asyncHandler } from '../middleware/errorHandler';

export const createJobPosting = asyncHandler(async (req: AuthRequest, res: Response) => {
  const jobPosting = await JobPosting.create(req.body);

  res.status(201).json({
    message: 'Job posting created successfully',
    jobPosting,
  });
});

export const getAllJobPostings = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, cruiseLineName, search, isActive } = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  const where: any = {};
  
  // Handle isActive filter - default to true if not specified
  if (isActive !== undefined) {
    where.isActive = isActive === 'true' || isActive === true;
  } else {
    where.isActive = true; // Default to showing only active jobs
  }

  if (cruiseLineName) {
    where.cruiseLineName = cruiseLineName;
  }

  if (search) {
    const { Op } = require('sequelize');
    where[Op.or] = [
      { positionTitle: { [Op.iLike]: `%${search}%` } },
      { positionDescription: { [Op.iLike]: `%${search}%` } },
      { cruiseLineName: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { count, rows } = await JobPosting.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [['createdAt', 'DESC']],
  });

  res.json({
    jobPostings: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
    },
  });
});

export const getJobPosting = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const jobPosting = await JobPosting.findByPk(id);

  if (!jobPosting) {
    throw new AppError('Job posting not found', 404);
  }

  res.json({ jobPosting });
});

export const updateJobPosting = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const jobPosting = await JobPosting.findByPk(id);
  if (!jobPosting) {
    throw new AppError('Job posting not found', 404);
  }

  await jobPosting.update(req.body);

  res.json({
    message: 'Job posting updated successfully',
    jobPosting,
  });
});

export const deleteJobPosting = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const jobPosting = await JobPosting.findByPk(id);
  if (!jobPosting) {
    throw new AppError('Job posting not found', 404);
  }

  await jobPosting.update({ isActive: false });

  res.json({ message: 'Job posting deleted successfully' });
});

