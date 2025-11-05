import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Candidate from '../models/Candidate';
import Document from '../models/Document';
import Contract from '../models/Contract';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { isBefore, addDays } from 'date-fns';

export const updateCrewStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { candidateId } = req.params;
  const { crewStatus } = req.body;

  const candidate = await Candidate.findByPk(candidateId);
  if (!candidate) {
    throw new AppError('Candidate not found', 404);
  }

  if (!['onboard', 'on_vacation', 'available', 'unavailable'].includes(crewStatus)) {
    throw new AppError('Invalid crew status', 400);
  }

  await candidate.update({ crewStatus });

  res.json({
    message: 'Crew status updated successfully',
    candidate: {
      id: candidate.id,
      crewStatus: candidate.crewStatus,
    },
  });
});

export const getCrewReadiness = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { candidateId } = req.params;
  const userId = req.userId!;
  
  // If candidateId is 'my', use the authenticated user's ID
  const targetCandidateId = candidateId === 'my' ? userId : candidateId;

  const candidate = await Candidate.findByPk(targetCandidateId);
  if (!candidate) {
    throw new AppError('Candidate not found', 404);
  }

  // Required documents for crew readiness
  const requiredDocuments = [
    'passport',
    'visa',
    'medical',
    'seaman_book',
    'stcw_certificate',
    'peme',
    'identity_card',
  ];

  // Get all documents for candidate
  const documents = await Document.findAll({
    where: { candidateId: targetCandidateId },
  });

  // Check document status
  const documentStatus: Record<string, any> = {};
  const missingDocuments: string[] = [];
  const expiredDocuments: string[] = [];
  const expiringSoonDocuments: string[] = [];

  requiredDocuments.forEach((docType) => {
    const doc = documents.find((d) => d.documentType === docType && !d.isExpired);
    
    if (!doc) {
      missingDocuments.push(docType);
      documentStatus[docType] = { status: 'missing', document: null };
    } else {
      const daysUntilExpiry = doc.expiryDate
        ? Math.ceil((new Date(doc.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

      if (doc.isExpired) {
        expiredDocuments.push(docType);
        documentStatus[docType] = { status: 'expired', document: doc };
      } else if (daysUntilExpiry !== null && daysUntilExpiry <= 30) {
        expiringSoonDocuments.push(docType);
        documentStatus[docType] = { 
          status: 'expiring_soon', 
          document: doc,
          daysUntilExpiry,
        };
      } else {
        documentStatus[docType] = { status: 'valid', document: doc };
      }
    }
  });

  // Check if all required documents are present and valid
  const isReady = 
    missingDocuments.length === 0 &&
    expiredDocuments.length === 0 &&
    expiringSoonDocuments.length === 0;

  // Calculate readiness percentage
  const validDocuments = requiredDocuments.filter(
    (docType) => documentStatus[docType].status === 'valid'
  ).length;
  const readinessPercentage = (validDocuments / requiredDocuments.length) * 100;

  res.json({
    candidateId: targetCandidateId,
    isReady,
    readinessPercentage: Math.round(readinessPercentage),
    documentStatus,
    missingDocuments,
    expiredDocuments,
    expiringSoonDocuments,
    summary: {
      totalRequired: requiredDocuments.length,
      valid: validDocuments,
      missing: missingDocuments.length,
      expired: expiredDocuments.length,
      expiringSoon: expiringSoonDocuments.length,
    },
  });
});

export const getAllCrewStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { crewStatus, page = 1, limit = 10 } = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  const where: any = {};

  if (crewStatus) {
    where.crewStatus = crewStatus;
  }

  const { count, rows } = await Candidate.findAndCountAll({
    where,
    attributes: { exclude: ['passwordHash'] },
    limit: Number(limit),
    offset,
    order: [['createdAt', 'DESC']],
  });

  res.json({
    crew: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
    },
  });
});

export const getCrewOnboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const crew = await Candidate.findAll({
    where: { crewStatus: 'onboard' },
    attributes: { exclude: ['passwordHash'] },
    order: [['createdAt', 'DESC']],
  });

  res.json({ crew });
});

export const getCrewOnVacation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const crew = await Candidate.findAll({
    where: { crewStatus: 'on_vacation' },
    attributes: { exclude: ['passwordHash'] },
    order: [['createdAt', 'DESC']],
  });

  res.json({ crew });
});

