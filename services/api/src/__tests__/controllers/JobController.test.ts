import { Request, Response } from 'express';
import {
  createJobPosting,
  getAllJobPostings,
  getJobPostingById,
  updateJobPosting,
} from '../../controllers/JobController';
import JobPosting from '../../models/JobPosting';

jest.mock('../../models/JobPosting');

describe('JobController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
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

  describe('createJobPosting', () => {
    it('should create a new job posting successfully', async () => {
      mockRequest.body = {
        title: 'Deck Officer',
        department: 'Deck',
        location: 'Caribbean',
        salary: '3000-4000',
        employmentType: 'contract',
        description: 'Test description',
      };

      const mockJob = {
        id: '123',
        ...mockRequest.body,
        isActive: true,
        toJSON: () => ({
          id: '123',
          ...mockRequest.body,
          isActive: true,
        }),
      };

      (JobPosting.create as jest.Mock).mockResolvedValue(mockJob);

      await createJobPosting(mockRequest as any, mockResponse as Response);

      expect(JobPosting.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should reject job posting with missing required fields', async () => {
      mockRequest.body = {
        title: 'Deck Officer',
        // Missing required fields
      };

      await createJobPosting(mockRequest as any, mockResponse as Response);

      expect(JobPosting.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllJobPostings', () => {
    it('should return all job postings', async () => {
      const mockJobs = [
        { id: '1', title: 'Job 1', isActive: true },
        { id: '2', title: 'Job 2', isActive: true },
      ];

      (JobPosting.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 2,
        rows: mockJobs,
      });

      await getAllJobPostings(mockRequest as any, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should filter by active status', async () => {
      mockRequest.query = { isActive: 'true' };

      (JobPosting.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: '1', title: 'Job 1', isActive: true }],
      });

      await getAllJobPostings(mockRequest as any, mockResponse as Response);

      expect(JobPosting.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isActive: true }),
        })
      );
    });
  });
});

