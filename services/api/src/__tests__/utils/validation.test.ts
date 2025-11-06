import { validate } from '../../utils/validation';
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

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

  it('should pass validation for valid data', () => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });

    mockRequest.body = {
      email: 'test@example.com',
      password: 'password123',
    };

    const middleware = validate(schema);
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should reject invalid data', () => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });

    mockRequest.body = {
      email: 'invalid-email',
      password: '123',
    };

    const middleware = validate(schema);
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });
});

