import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Application from '../models/Application';
import JobPosting from '../models/JobPosting';
import Candidate from '../models/Candidate';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import emailService from '../services/notification/emailService';

export const createApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId!;
  const { jobPostingId, personalSummary, resumeUrl } = req.body;

  // Check if job posting exists
  const jobPosting = await JobPosting.findByPk(jobPostingId);
  if (!jobPosting || !jobPosting.isActive) {
    throw new AppError('Job posting not found or inactive', 404);
  }

  // Check if application already exists
  const existingApplication = await Application.findOne({
    where: { candidateId, jobPostingId },
  });

  if (existingApplication) {
    throw new AppError('Application already exists for this job posting', 400);
  }

  const application = await Application.create({
    candidateId,
    jobPostingId,
    personalSummary,
    resumeUrl,
    screeningStatus: 'pending',
  });

  // Load relations
  await application.reload({
    include: [
      { model: JobPosting, as: 'jobPosting' },
      { model: Candidate, as: 'candidate' },
    ],
  });

  res.status(201).json({
    message: 'Application submitted successfully',
    application,
  });
});

export const getMyApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId!;
  const { page = 1, limit = 10, status } = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  const where: any = { candidateId };

  if (status) {
    where.screeningStatus = status;
  }

  const { count, rows } = await Application.findAndCountAll({
    where,
    include: [
      { model: JobPosting, as: 'jobPosting' },
    ],
    limit: Number(limit),
    offset,
    order: [['createdAt', 'DESC']],
  });

  res.json({
    applications: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
    },
  });
});

export const getAllApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, status, jobPostingId, candidateId } = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  const where: any = {};

  if (status) {
    where.screeningStatus = status;
  }

  if (jobPostingId) {
    where.jobPostingId = jobPostingId;
  }

  if (candidateId) {
    where.candidateId = candidateId;
  }

  const { count, rows } = await Application.findAndCountAll({
    where,
    include: [
      { model: JobPosting, as: 'jobPosting' },
      { model: Candidate, as: 'candidate' },
    ],
    limit: Number(limit),
    offset,
    order: [['createdAt', 'DESC']],
  });

  res.json({
    applications: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
    },
  });
});

export const updateApplicationStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { screeningStatus, screeningScore } = req.body;

  const application = await Application.findByPk(id, {
    include: [
      { model: JobPosting, as: 'jobPosting' },
      { model: Candidate, as: 'candidate' },
    ],
  });
  
  if (!application) {
    throw new AppError('Application not found', 404);
  }

  const oldStatus = application.screeningStatus;
  await application.update({
    screeningStatus,
    screeningScore,
  });

  // Send email notification if status changed
  if (oldStatus !== screeningStatus && application.candidate && application.jobPosting) {
    try {
      await emailService.sendApplicationStatusEmail(
        application.candidate.email,
        application.candidate.firstName,
        application.jobPosting.title,
        screeningStatus
      );
    } catch (error) {
      console.error('Failed to send application status email:', error);
      // Don't fail the update if email fails
    }
  }

  res.json({
    message: 'Application status updated successfully',
    application,
  });
});

export const getApplicationById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const application = await Application.findByPk(id, {
    include: [
      { model: JobPosting, as: 'jobPosting' },
      { model: Candidate, as: 'candidate', attributes: { exclude: ['passwordHash'] } },
    ],
  });

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  res.json({ application });
});

