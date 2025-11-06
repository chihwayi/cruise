import request from 'supertest';
import app from '../../index';
import Candidate from '../../models/Candidate';
import bcrypt from 'bcryptjs';

describe('Auth Integration Tests', () => {
  beforeEach(async () => {
    // Clean up test data
    await Candidate.destroy({ where: {}, truncate: true });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Create test candidate
      const passwordHash = await bcrypt.hash('password123', 10);
      await Candidate.create({
        email: 'test@example.com',
        passwordHash,
        firstName: 'Test',
        lastName: 'User',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('candidate');
    });

    it('should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/candidates/register', () => {
    it('should register a new candidate', async () => {
      const response = await request(app)
        .post('/api/candidates/register')
        .send({
          email: 'new@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('candidate');
      expect(response.body.candidate.email).toBe('new@example.com');
    });

    it('should reject duplicate email registration', async () => {
      await Candidate.create({
        email: 'existing@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Existing',
        lastName: 'User',
      });

      const response = await request(app)
        .post('/api/candidates/register')
        .send({
          email: 'existing@example.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
        });

      expect(response.status).toBe(400);
    });
  });
});

