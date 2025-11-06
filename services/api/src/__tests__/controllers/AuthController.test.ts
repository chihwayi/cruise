import { Request, Response } from 'express';
import { login, getCurrentUser } from '../../controllers/AuthController';
import Candidate from '../../models/Candidate';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../models/Candidate');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockCandidate = {
        id: '123',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        employmentNumber: 'EMP001',
        toJSON: () => ({
          id: '123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          employmentNumber: 'EMP001',
        }),
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      (Candidate.findOne as jest.Mock).mockResolvedValue(mockCandidate);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        token: 'mock-token',
        candidate: expect.objectContaining({
          email: 'test@example.com',
        }),
      });
    });

    it('should reject login with invalid email', async () => {
      mockRequest.body = {
        email: 'invalid@example.com',
        password: 'password123',
      };

      (Candidate.findOne as jest.Mock).mockResolvedValue(null);

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should reject login with invalid password', async () => {
      const mockCandidate = {
        id: '123',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      (Candidate.findOne as jest.Mock).mockResolvedValue(mockCandidate);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });
});

