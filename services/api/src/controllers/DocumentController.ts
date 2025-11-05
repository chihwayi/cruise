import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Document from '../models/Document';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import minioClient from '../config/minio';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { isBefore } from 'date-fns';

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

export const uploadDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId!;
  const { documentType, expiryDate } = req.body;
  const file = req.file;

  if (!file) {
    throw new AppError('No file uploaded', 400);
  }

  // Generate unique filename
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${candidateId}/${documentType}/${uuidv4()}.${fileExtension}`;

  // Upload to MinIO
  await minioClient.putObject('cruise-documents', fileName, file.buffer, file.size, {
    'Content-Type': file.mimetype,
  });

  // Generate file URL
  const fileUrl = `http://localhost:9000/cruise-documents/${fileName}`;

  // Check if expired
  let isExpired = false;
  if (expiryDate) {
    isExpired = isBefore(new Date(expiryDate), new Date());
  }

  const document = await Document.create({
    candidateId,
    documentType,
    fileName: file.originalname,
    fileUrl,
    fileSize: file.size,
    mimeType: file.mimetype,
    expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    isExpired,
  });

  res.status(201).json({
    message: 'Document uploaded successfully',
    document,
  });
});

export const getMyDocuments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId!;
  const { documentType, expired } = req.query;

  const where: any = { candidateId };
  if (documentType) {
    where.documentType = documentType;
  }
  if (expired === 'true') {
    where.isExpired = true;
  } else if (expired === 'false') {
    where.isExpired = false;
  }

  const documents = await Document.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });

  res.json({ documents });
});

export const getDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId!;
  const { id } = req.params;

  const document = await Document.findOne({
    where: { id, candidateId },
  });

  if (!document) {
    throw new AppError('Document not found', 404);
  }

  res.json({ document });
});

export const deleteDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId!;
  const { id } = req.params;

  const document = await Document.findOne({
    where: { id, candidateId },
  });

  if (!document) {
    throw new AppError('Document not found', 404);
  }

  // Delete from MinIO
  try {
    const objectName = document.fileUrl.split('/cruise-documents/')[1];
    await minioClient.removeObject('cruise-documents', objectName);
  } catch (error) {
    console.error('Error deleting file from MinIO:', error);
  }

  await document.destroy();

  res.json({ message: 'Document deleted successfully' });
});

export const getDocumentsByCandidate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { candidateId } = req.params;

  const documents = await Document.findAll({
    where: { candidateId },
    order: [['documentType', 'ASC'], ['createdAt', 'DESC']],
  });

  res.json({ documents });
});

export const verifyDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { verified } = req.body;

  const document = await Document.findByPk(id);
  if (!document) {
    throw new AppError('Document not found', 404);
  }

  await document.update({
    isVerified: verified !== false,
    verifiedAt: verified !== false ? new Date() : null,
    verifiedBy: req.userId,
  });

  res.json({
    message: `Document ${verified !== false ? 'verified' : 'unverified'} successfully`,
    document,
  });
});

export const getExpiringDocuments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidateId = req.userId!;
  const { days = 30 } = req.query;
  const daysNumber = Number(days);
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysNumber);

  const { Op } = require('sequelize');

  const documents = await Document.findAll({
    where: {
      candidateId,
      expiryDate: {
        [Op.lte]: thresholdDate,
        [Op.gte]: new Date(),
      },
      isExpired: false,
    },
    order: [['expiryDate', 'ASC']],
  });

  res.json({ documents, thresholdDate });
});

