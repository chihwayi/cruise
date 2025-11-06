import { Request, Response } from 'express';
import { uploadDocument, getMyDocuments } from '../../controllers/DocumentController';
import Document from '../../models/Document';
import minioClient from '../../config/minio';

jest.mock('../../models/Document');
jest.mock('../../config/minio');

describe('DocumentController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {},
      file: {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from('test'),
        size: 100,
      } as Express.Multer.File,
      userId: '123',
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadDocument', () => {
    it('should upload document successfully', async () => {
      mockRequest.body = {
        documentType: 'passport',
        expiryDate: '2025-12-31',
      };

      (minioClient.putObject as jest.Mock).mockResolvedValue({});
      
      const mockDocument = {
        id: '123',
        documentType: 'passport',
        fileName: 'test.pdf',
        fileUrl: 'http://localhost:9000/test.pdf',
        toJSON: () => ({
          id: '123',
          documentType: 'passport',
          fileName: 'test.pdf',
        }),
      };

      (Document.create as jest.Mock).mockResolvedValue(mockDocument);

      await uploadDocument(mockRequest as any, mockResponse as Response);

      expect(minioClient.putObject).toHaveBeenCalled();
      expect(Document.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should reject upload without file', async () => {
      mockRequest.file = undefined;
      mockRequest.body = {
        documentType: 'passport',
      };

      await uploadDocument(mockRequest as any, mockResponse as Response);

      expect(minioClient.putObject).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getMyDocuments', () => {
    it('should return all documents for a candidate', async () => {
      const mockDocuments = [
        { id: '1', documentType: 'passport', fileName: 'passport.pdf' },
        { id: '2', documentType: 'visa', fileName: 'visa.pdf' },
      ];

      (Document.findAll as jest.Mock).mockResolvedValue(mockDocuments);

      await getMyDocuments(mockRequest as any, mockResponse as Response);

      expect(Document.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ candidateId: '123' }),
        })
      );
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should filter documents by type', async () => {
      mockRequest.query = { documentType: 'passport' };

      (Document.findAll as jest.Mock).mockResolvedValue([]);

      await getMyDocuments(mockRequest as any, mockResponse as Response);

      expect(Document.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            candidateId: '123',
            documentType: 'passport',
          }),
        })
      );
    });
  });
});

