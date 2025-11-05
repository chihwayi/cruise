import { Router } from 'express';
import {
  uploadDocument,
  getMyDocuments,
  getDocument,
  deleteDocument,
  getDocumentsByCandidate,
  verifyDocument,
  getExpiringDocuments,
  upload,
} from '../controllers/DocumentController';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../utils/validation';
import Joi from 'joi';

const router = Router();

const documentSchema = Joi.object({
  documentType: Joi.string().valid(
    'passport', 'visa', 'medical', 'seaman_book', 'contract', 
    'employment_agreement', 'stcw_certificate', 'peme', 
    'identity_card', 'resume', 'certificate', 'other'
  ).required(),
  expiryDate: Joi.date().optional(),
});

// Candidate routes
router.post('/upload', authenticate, upload.single('file'), validate(documentSchema), uploadDocument);
router.get('/my', authenticate, getMyDocuments);
router.get('/my/expiring', authenticate, getExpiringDocuments);
router.get('/:id', authenticate, getDocument);
router.delete('/:id', authenticate, deleteDocument);

// Admin routes
router.get('/candidate/:candidateId', authenticate, requireRole(['admin']), getDocumentsByCandidate);
router.put('/:id/verify', authenticate, requireRole(['admin']), verifyDocument);

export default router;

