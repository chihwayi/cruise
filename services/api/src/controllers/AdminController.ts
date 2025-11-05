import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Candidate from '../models/Candidate';
import Application from '../models/Application';
import JobPosting from '../models/JobPosting';
import Contract from '../models/Contract';
import Document from '../models/Document';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { Op } from 'sequelize';

export const getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Get total counts
  const [
    totalCandidates,
    totalApplications,
    totalJobPostings,
    totalContracts,
    onboardCrew,
    onVacationCrew,
    pendingApplications,
    shortlistedApplications,
    hiredCandidates,
  ] = await Promise.all([
    Candidate.count(),
    Application.count(),
    JobPosting.count({ where: { isActive: true } }),
    Contract.count(),
    Candidate.count({ where: { crewStatus: 'onboard' } }),
    Candidate.count({ where: { crewStatus: 'on_vacation' } }),
    Application.count({ where: { screeningStatus: 'pending' } }),
    Application.count({ where: { screeningStatus: 'shortlisted' } }),
    Application.count({ where: { screeningStatus: 'hired' } }),
  ]);

  // Get recent activity (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentApplications = await Application.count({
    where: {
      createdAt: {
        [Op.gte]: thirtyDaysAgo,
      },
    },
  });

  const recentCandidates = await Candidate.count({
    where: {
      createdAt: {
        [Op.gte]: thirtyDaysAgo,
      },
    },
  });

  // Get expiring documents count
  const expiringDocuments = await Document.count({
    where: {
      expiryDate: {
        [Op.lte]: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        [Op.gte]: new Date(),
      },
      isExpired: false,
    },
  });

  res.json({
    overview: {
      totalCandidates,
      totalApplications,
      activeJobPostings: totalJobPostings,
      totalContracts,
    },
    crew: {
      onboard: onboardCrew,
      onVacation: onVacationCrew,
      available: await Candidate.count({ where: { crewStatus: 'available' } }),
    },
    applications: {
      pending: pendingApplications,
      shortlisted: shortlistedApplications,
      hired: hiredCandidates,
    },
    recentActivity: {
      applicationsLast30Days: recentApplications,
      candidatesLast30Days: recentCandidates,
      expiringDocuments,
    },
  });
});

export const getApplicationStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { jobPostingId, startDate, endDate } = req.query;

  const where: any = {};
  if (jobPostingId) {
    where.jobPostingId = jobPostingId;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt[Op.gte] = new Date(startDate as string);
    }
    if (endDate) {
      where.createdAt[Op.lte] = new Date(endDate as string);
    }
  }

  const applications = await Application.findAll({ where });

  const stats = {
    total: applications.length,
    byStatus: {
      pending: applications.filter((a) => a.screeningStatus === 'pending').length,
      screening: applications.filter((a) => a.screeningStatus === 'screening').length,
      shortlisted: applications.filter((a) => a.screeningStatus === 'shortlisted').length,
      rejected: applications.filter((a) => a.screeningStatus === 'rejected').length,
      interview_scheduled: applications.filter((a) => a.screeningStatus === 'interview_scheduled').length,
      hired: applications.filter((a) => a.screeningStatus === 'hired').length,
    },
    averageScore: applications.length > 0
      ? applications
          .filter((a) => a.screeningScore !== null && a.screeningScore !== undefined)
          .reduce((sum, a) => sum + Number(a.screeningScore || 0), 0) /
        applications.filter((a) => a.screeningScore !== null && a.screeningScore !== undefined).length
      : 0,
  };

  res.json(stats);
});

export const getCandidateStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = {
    total: await Candidate.count(),
    byCrewStatus: {
      onboard: await Candidate.count({ where: { crewStatus: 'onboard' } }),
      on_vacation: await Candidate.count({ where: { crewStatus: 'on_vacation' } }),
      available: await Candidate.count({ where: { crewStatus: 'available' } }),
      unavailable: await Candidate.count({ where: { crewStatus: 'unavailable' } }),
    },
    withEmploymentNumber: await Candidate.count({ where: { employmentNumber: { [Op.not]: null } } }),
    withoutEmploymentNumber: await Candidate.count({ where: { employmentNumber: null } }),
  };

  res.json(stats);
});

