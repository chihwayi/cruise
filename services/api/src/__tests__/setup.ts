import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/cruise_test';

// Mock external services in tests
jest.mock('../config/minio', () => ({
  __esModule: true,
  default: {
    putObject: jest.fn().mockResolvedValue({}),
    getObject: jest.fn().mockResolvedValue({}),
    removeObject: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock('../config/redis', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
  },
}));

jest.mock('../config/elasticsearch', () => ({
  __esModule: true,
  default: {
    index: jest.fn().mockResolvedValue({}),
    search: jest.fn().mockResolvedValue({ hits: { hits: [] } }),
  },
}));

