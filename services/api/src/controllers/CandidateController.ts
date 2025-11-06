import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Candidate from '../models/Candidate';
import Document from '../models/Document';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import emailService from '../services/notification/emailService';

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

  // Send welcome email
  try {
    await emailService.sendWelcomeEmail(candidate.email, candidate.firstName);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't fail the registration if email fails
  }

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

export const checkProfileCompleteness = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId!;

  const candidate = await Candidate.findByPk(candidateId, {
    attributes: { exclude: ['passwordHash'] },
  });

  if (!candidate) {
    throw new AppError('Candidate not found', 404);
  }

  // Check required profile fields
  const requiredProfileFields = {
    firstName: !!candidate.firstName,
    lastName: !!candidate.lastName,
    email: !!candidate.email,
    phoneNumber: !!candidate.phoneNumber,
    nationality: !!candidate.nationality,
    dateOfBirth: !!candidate.dateOfBirth,
    gender: !!candidate.gender,
    maritalStatus: !!candidate.maritalStatus,
    physicalAddress: !!candidate.physicalAddress,
    city: !!candidate.city,
    country: !!candidate.country,
  };

  const profileFieldsComplete = Object.values(requiredProfileFields).every(Boolean);
  const profileFieldsCount = Object.values(requiredProfileFields).filter(Boolean).length;
  const profileFieldsTotal = Object.keys(requiredProfileFields).length;

  // Check required documents
  const requiredDocuments = ['passport', 'visa', 'medical', 'seaman_book', 'stcw_certificate', 'peme', 'identity_card'];
  const documents = await Document.findAll({
    where: { candidateId },
  });

  const documentTypes = documents.map(doc => doc.documentType);
  const documentsComplete = requiredDocuments.every(docType => documentTypes.includes(docType));
  const documentsCount = requiredDocuments.filter(docType => documentTypes.includes(docType)).length;
  const documentsTotal = requiredDocuments.length;

  // Check if resume exists
  const hasResume = documentTypes.includes('resume');

  // Overall completeness
  const isComplete = profileFieldsComplete && documentsComplete && hasResume;
  const overallProgress = Math.round(
    ((profileFieldsCount / profileFieldsTotal) * 0.6 + 
     (documentsCount / documentsTotal) * 0.3 + 
     (hasResume ? 0.1 : 0)) * 100
  );

  res.json({
    isComplete,
    overallProgress,
    profile: {
      isComplete: profileFieldsComplete,
      progress: Math.round((profileFieldsCount / profileFieldsTotal) * 100),
      missingFields: Object.entries(requiredProfileFields)
        .filter(([_, complete]) => !complete)
        .map(([field]) => field),
      fields: requiredProfileFields,
    },
    documents: {
      isComplete: documentsComplete,
      progress: Math.round((documentsCount / documentsTotal) * 100),
      missingDocuments: requiredDocuments.filter(docType => !documentTypes.includes(docType)),
      hasResume,
      uploadedDocuments: documentTypes,
    },
  });
});

export const updateCandidateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId;
  const updates = req.body;
  
  console.log('Received update request:', JSON.stringify(updates, null, 2));

  const candidate = await Candidate.findByPk(candidateId);
  if (!candidate) {
    throw new AppError('Candidate not found', 404);
  }

  // Prepare updates object - only include fields that are provided
  const fieldsToUpdate: any = {};
  
  if (updates.firstName !== undefined) fieldsToUpdate.firstName = updates.firstName;
  if (updates.lastName !== undefined) fieldsToUpdate.lastName = updates.lastName;
  if (updates.phoneNumber !== undefined) {
    fieldsToUpdate.phoneNumber = updates.phoneNumber && updates.phoneNumber.trim() !== '' ? updates.phoneNumber.trim() : null;
  }
  if (updates.physicalAddress !== undefined) {
    fieldsToUpdate.physicalAddress = updates.physicalAddress && updates.physicalAddress.trim() !== '' ? updates.physicalAddress.trim() : null;
  }
  // Handle nationality
  if (updates.nationality !== undefined) {
    const value = typeof updates.nationality === 'string' ? updates.nationality.trim() : '';
    fieldsToUpdate.nationality = value !== '' ? value : null;
  }
  // Handle dateOfBirth
  if (updates.dateOfBirth !== undefined) {
    if (updates.dateOfBirth && updates.dateOfBirth !== null && updates.dateOfBirth !== '') {
      if (typeof updates.dateOfBirth === 'string' && updates.dateOfBirth.trim() !== '') {
        // Parse YYYY-MM-DD format
        const dateStr = updates.dateOfBirth.trim();
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          // Ensure we're setting a proper Date object
          fieldsToUpdate.dateOfBirth = date;
        } else {
          fieldsToUpdate.dateOfBirth = null;
        }
      } else {
        fieldsToUpdate.dateOfBirth = null;
      }
    } else {
      fieldsToUpdate.dateOfBirth = null;
    }
  }
  // Handle city
  if (updates.city !== undefined) {
    const value = typeof updates.city === 'string' ? updates.city.trim() : '';
    fieldsToUpdate.city = value !== '' ? value : null;
  }
  // Handle country
  if (updates.country !== undefined) {
    const value = typeof updates.country === 'string' ? updates.country.trim() : '';
    fieldsToUpdate.country = value !== '' ? value : null;
  }
  // Handle gender
  if (updates.gender !== undefined) {
    const value = typeof updates.gender === 'string' ? updates.gender.trim() : '';
    fieldsToUpdate.gender = value !== '' ? value : null;
  }
  // Handle maritalStatus
  if (updates.maritalStatus !== undefined) {
    const value = typeof updates.maritalStatus === 'string' ? updates.maritalStatus.trim() : '';
    fieldsToUpdate.maritalStatus = value !== '' ? value : null;
  }

  console.log('Fields to update:', JSON.stringify(fieldsToUpdate, null, 2));

  // Update each field individually to ensure proper persistence
  for (const key in fieldsToUpdate) {
    candidate.set(key, fieldsToUpdate[key]);
  }
  
  await candidate.save();

  console.log('Candidate updated successfully');

  // Fetch updated candidate to return
  const updatedCandidate = await Candidate.findByPk(candidateId, {
    attributes: { exclude: ['passwordHash'] },
  });

  res.json({
    message: 'Profile updated successfully',
    candidate: updatedCandidate,
  });
});

export const assignEmploymentNumber = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { candidateId } = req.params;
  const { employmentNumber } = req.body;

  const candidate = await Candidate.findByPk(candidateId);
  if (!candidate) {
    throw new AppError('Candidate not found', 404);
  }

  await candidate.update({ employmentNumber });

  res.json({
    message: 'Employment number assigned successfully',
    candidate,
  });
});

export const getAllCandidates = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, search, crewStatus } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const where: any = {};
  if (search) {
    const { Op } = require('sequelize');
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (crewStatus) {
    where.crewStatus = crewStatus;
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

  const candidate = await Candidate.findByPk(candidateId);
  if (!candidate) {
    throw new AppError('Candidate not found', 404);
  }

  await candidate.update(req.body);

  res.json({
    message: 'Candidate updated successfully',
    candidate,
  });
});
