# Cruise Ship Recruitment Agency System

A modern, containerized recruitment platform for cruise ship candidates featuring AI-powered CV screening, document management, and comprehensive candidate profiling.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop (or Docker Engine + Docker Compose)
- Git
- Node.js 18+ (for local development)

### Running the Application

1. **Clone and navigate to the project:**
```bash
cd cruise
```

2. **Start all services:**
```bash
docker-compose up -d
```

3. **Access the services:**
   - **Public Job Portal**: http://localhost/
   - **Admin Dashboard**: http://localhost/admin
   - **Candidate Portal**: http://localhost/candidate
   - **API**: http://localhost/api
   - **MinIO Console**: http://localhost:9001 (admin/admin)
   - **Elasticsearch**: http://localhost:9200

### Development Mode

For development with hot-reload:

```bash
docker-compose up
```

This will start all services with volume mounts for live code updates.

## 📁 Project Structure

```
cruise-recruitment-system/
├── docker-compose.yml          # Main Docker Compose configuration
├── services/                   # Microservices
│   ├── api/                   # Backend API
│   ├── web-public/            # Public job portal
│   ├── web-admin/             # Admin dashboard
│   └── web-candidate/         # Candidate portal
├── infrastructure/            # Infrastructure configs
│   ├── nginx/                 # Reverse proxy config
│   ├── postgres/              # Database init scripts
│   └── redis/                 # Redis config
├── shared/                    # Shared libraries
└── scripts/                   # Utility scripts
```

## 🏗️ Architecture

### Services

1. **API Service** (Port 3000)
   - RESTful API backend
   - Authentication & authorization
   - CV screening engine
   - Document processing
   - Business logic

2. **Public Portal** (Port 3001)
   - Job listings
   - Application submission
   - Document upload
   - Public-facing interface

3. **Admin Dashboard** (Port 3002)
   - Candidate management
   - Job post management
   - Analytics & reporting
   - System administration

4. **Candidate Portal** (Port 3003)
   - Profile management
   - Document upload
   - Contract viewing
   - Status tracking

### Infrastructure

- **PostgreSQL**: Primary database
- **Redis**: Caching and sessions
- **Elasticsearch**: CV/resume search and screening
- **MinIO**: Object storage (S3-compatible)
- **Nginx**: Reverse proxy and load balancer

## 🔧 Development

### Setting up a new service

1. Create service directory in `services/`
2. Add Dockerfile
3. Update `docker-compose.yml` with new service
4. Add nginx configuration if needed

### Database Migrations

```bash
# Run migrations
docker-compose exec api npm run migrate

# Rollback
docker-compose exec api npm run migrate:rollback
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
```

## 🔐 Environment Variables

Create `.env` files for each service with required environment variables:

- Database credentials
- JWT secrets
- API keys
- Service URLs

See `PROPOSAL.md` for detailed environment variable requirements.

## 🧪 Testing

```bash
# Run tests
docker-compose exec api npm test

# Run tests with coverage
docker-compose exec api npm run test:coverage
```

## 📦 Production Deployment

1. Update `docker-compose.prod.yml` with production settings
2. Set environment variables
3. Build optimized images
4. Deploy using Docker Swarm or Kubernetes

## 📚 Documentation

- [System Proposal](./PROPOSAL.md) - Detailed system proposal
- [API Documentation](./docs/api/) - API endpoints documentation
- [Architecture](./docs/architecture/) - System architecture details
- [Deployment Guide](./docs/deployment/) - Deployment instructions

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally with Docker
4. Submit pull request

## 📝 License

Proprietary - All rights reserved

## 🆘 Support

For issues or questions, please contact the development team.

---

**Built with modern containerization for scalability and maintainability**

