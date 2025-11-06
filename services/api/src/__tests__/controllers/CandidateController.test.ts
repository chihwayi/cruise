import { Request, Response } from 'express';
import {
  registerCandidate,
  getCandidateProfile,
  updateCandidateProfile,
} from '../../controllers/CandidateController';
import Candidate from '../../models/Candidate';
import bcrypt from 'bcryptjs';

jest.mock('../../models/Candidate');
jest.mock('bcryptjs');

describe('CandidateController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {},
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

  describe('registerCandidate', () => {
    it('should register a new candidate successfully', async () => {
      mockRequest.body = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      (Candidate.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      
      const mockCreate = {
        id: '123',
        ...mockRequest.body,
        toJSON: () => ({
          id: '123',
          email: 'new@example.com',
          firstName: 'John',
          lastName: 'Doe',
        }),
      };

      (Candidate.create as jest.Mock).mockResolvedValue(mockCreate);

      await registerCandidate(mockRequest as any, mockResponse as Response);

      expect(Candidate.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should reject registration with existing email', async () => {
      mockRequest.body = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      (Candidate.findOne as jest.Mock).mockResolvedValue({ id: '123' });

      await registerCandidate(mockRequest as any, mockResponse as Response);

      expect(Candidate.create).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getCandidateProfile', () => {
    it('should return candidate profile', async () => {
      const mockCandidate = {
        id: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        toJSON: () => ({
          id: '123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        }),
      };

      (Candidate.findByPk as jest.Mock).mockResolvedValue(mockCandidate);

      await getCandidateProfile(mockRequest as any, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        candidate: expect.objectContaining({
          email: 'test@example.com',
        }),
      });
    });
  });
});

