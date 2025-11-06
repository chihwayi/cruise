import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { connectElasticsearch } from './config/elasticsearch';
import { initializeMinIO } from './config/minio';
import { syncDatabase } from './models';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import rateLimit from 'express-rate-limit';
import logger from './config/winston';
import requestLogger from './middleware/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
if (process.env.NODE_ENV === 'development') {
  // Less restrictive CSP for development
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
        styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        scriptSrcElem: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*", "http://127.0.0.1:*", "ws://127.0.0.1:*", "http://localhost:3000", "ws://localhost:3000"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));
} else {
  // Strict CSP for production
  app.use(helmet());
}

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',')
      : [
          'http://localhost:4000',
          'http://localhost:4001',
          'http://localhost:4002',
          'http://localhost:3000',
          'http://127.0.0.1:4000',
          'http://127.0.0.1:4001',
          'http://127.0.0.1:4002',
        ];
    
    if (allowedOrigins.includes(origin) || process.env.CORS_ORIGIN === '*') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request logger middleware
app.use(requestLogger);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Cruise Recruitment System API',
    version: '1.0.0',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        candidates: '/api/candidates',
        jobs: '/api/jobs',
        applications: '/api/applications',
        employmentHistory: '/api/employment-history',
        documents: '/api/documents',
        contracts: '/api/contracts',
        crew: '/api/crew',
        cvScreening: '/api/cv-screening',
        admin: '/api/admin',
      },
  });
});

// Routes
app.use('/api', routes);

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Cruise Recruitment System API',
    version: '1.0.0',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        candidates: '/api/candidates',
        jobs: '/api/jobs',
        applications: '/api/applications',
        employmentHistory: '/api/employment-history',
        documents: '/api/documents',
        contracts: '/api/contracts',
        crew: '/api/crew',
        cvScreening: '/api/cv-screening',
        admin: '/api/admin',
      },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize services
const initializeServices = async () => {
  try {
    await connectDatabase();
    await connectRedis();
    await connectElasticsearch();
    await initializeMinIO();
    
    // Sync database models (only in development)
    if (process.env.NODE_ENV === 'development') {
      await syncDatabase(false); // Set to true to force recreate tables
    }

    app.listen(PORT, () => {
      logger.info(`🚢 Cruise Recruitment API running on port ${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🚢 Cruise Recruitment API running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('❌ Failed to initialize services:', error);
    console.error('❌ Failed to initialize services:', error);
    process.exit(1);
  }
};

initializeServices();

export default app;

