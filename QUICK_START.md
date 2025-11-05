# Quick Start Guide

## Prerequisites

- Docker Desktop installed and running
- Node.js 18+ (for local development without Docker)
- Git

## Getting Started

### 1. Initial Setup

Run the setup script to create necessary configuration files:

```bash
./scripts/setup.sh
```

This will:
- Create `.env` file with secure random passwords
- Set up necessary directories
- Prepare the environment

### 2. Start All Services

```bash
docker-compose up -d
```

This starts all services in the background:
- PostgreSQL database
- Redis cache
- Elasticsearch
- MinIO object storage
- API service
- Public web portal
- Admin dashboard
- Candidate portal
- Nginx reverse proxy

### 3. Access the Services

Once all containers are running, access:

- **Public Job Portal**: http://localhost/
- **Admin Dashboard**: http://localhost/admin
- **Candidate Portal**: http://localhost/candidate
- **API**: http://localhost/api
- **API Health Check**: http://localhost/api/health
- **MinIO Console**: http://localhost:9001 (admin/admin)

### 4. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
```

### 5. Stop Services

```bash
docker-compose down
```

To remove volumes (⚠️ deletes data):

```bash
docker-compose down -v
```

## Development Mode

For development with hot-reload:

```bash
docker-compose up
```

This keeps containers in the foreground and shows live logs.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Candidate login
- `GET /api/auth/me` - Get current user (requires auth)

### Candidates
- `POST /api/candidates/register` - Register new candidate
- `GET /api/candidates/profile` - Get own profile (requires auth)
- `PUT /api/candidates/profile` - Update own profile (requires auth)
- `GET /api/candidates` - List all candidates (admin only)
- `POST /api/candidates/:id/employment-number` - Assign employment number (admin only)

### Job Postings
- `GET /api/jobs` - List all active job postings (public)
- `GET /api/jobs/:id` - Get job posting details (public)
- `POST /api/jobs` - Create job posting (admin only)
- `PUT /api/jobs/:id` - Update job posting (admin only)
- `DELETE /api/jobs/:id` - Delete job posting (admin only)

### Applications
- `POST /api/applications` - Submit application (requires auth)
- `GET /api/applications/my` - Get my applications (requires auth)
- `GET /api/applications/all` - Get all applications (admin only)
- `PUT /api/applications/:id/status` - Update application status (admin only)

## Testing the API

### Register a Candidate

```bash
curl -X POST http://localhost/api/candidates/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Job Postings (Public)

```bash
curl http://localhost/api/jobs
```

## Troubleshooting

### Port Already in Use

If ports are already in use, update the port mappings in `docker-compose.yml`.

### Database Connection Issues

Ensure PostgreSQL container is healthy:
```bash
docker-compose ps
```

Check logs:
```bash
docker-compose logs postgres
```

### Reset Everything

To start fresh:

```bash
docker-compose down -v
docker-compose up -d
```

## Next Steps

1. Create admin user (via API or direct database)
2. Add job postings
3. Test candidate registration and application flow
4. Implement frontend UIs
5. Add CV screening functionality
6. Set up document management

## Production Deployment

For production, use `docker-compose.prod.yml`:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Make sure to:
- Update all environment variables in `.env`
- Use strong passwords
- Configure SSL/TLS certificates
- Set up proper backups
- Configure monitoring and logging

