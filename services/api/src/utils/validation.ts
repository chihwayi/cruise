import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      res.status(400).json({ error: 'Validation failed', errors });
      return;
    }

    req.body = value;
    next();
  };
};

// Common validation schemas
export const schemas = {
  candidate: {
    create: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).optional(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      middleInitials: Joi.string().optional(),
      phoneNumber: Joi.string().optional(),
      // ... other fields
    }),
  },
  jobPosting: {
    create: Joi.object({
      cruiseLineName: Joi.string().required(),
      positionTitle: Joi.string().required(),
      positionDescription: Joi.string().required(),
      requirements: Joi.string().required(),
      specifications: Joi.string().required(),
    }),
  },
  application: {
    create: Joi.object({
      jobPostingId: Joi.string().uuid().required(),
      personalSummary: Joi.string().optional(),
    }),
  },
};

