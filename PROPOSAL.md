# Cruise Ship Recruitment Agency System - Technical Proposal

## Executive Summary

This proposal outlines a modern, containerized recruitment platform for cruise ship candidates with two integrated systems:
1. **Application & Screening Platform** - Public-facing job portal
2. **Candidate Profiling & Management System** - Internal CRM for successful candidates

## System Architecture Overview

### Two Integrated Platforms

#### Platform 1: Application & Screening Portal
- Public-facing job board linked to your website
- Candidate application submission
- Document upload and management
- Automated CV/Resume screening with AI capabilities
- Preliminary interview scheduling

#### Platform 2: Candidate Profiling & Management System
- Secure internal portal for successful candidates
- Employment number assignment
- Document lifecycle management (contracts, visas, medical exams)
- Crew status tracking (onboard/on vacation)
- Joining dates and sign-off dates management

## Proposed Technology Stack

### Backend
- **API Framework**: Node.js with Express.js or Python with FastAPI
- **Database**: PostgreSQL (primary) + Redis (caching/sessions)
- **File Storage**: AWS S3 / MinIO (for documents)
- **Search Engine**: Elasticsearch (for CV/resume screening)
- **Message Queue**: RabbitMQ or Redis Queue (for background jobs)

### Frontend
- **Public Portal**: React.js with Next.js (SSR for SEO)
- **Admin Portal**: React.js with TypeScript
- **Candidate Portal**: React.js with Progressive Web App (PWA) capabilities
- **UI Framework**: Tailwind CSS + shadcn/ui or Material-UI

### Containerization
- **Container Runtime**: Docker
- **Orchestration**: Docker Compose (development) / Kubernetes (production)
- **Container Registry**: Docker Hub or private registry

### DevOps & Infrastructure
- **CI/CD**: GitHub Actions or GitLab CI
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Reverse Proxy**: Nginx

## Advanced Features (Compared to Standard Platforms)

### 1. AI-Powered Resume Screening
- **Natural Language Processing** for CV parsing
- **Skill matching** against job requirements
- **Experience ranking** algorithm
- **Automated shortlisting** with confidence scores
- **Multi-language CV support** (crucial for international candidates)

### 2. Smart Document Management
- **OCR capabilities** for document text extraction
- **Automatic document validation** (expiry dates, format checks)
- **Document versioning** and audit trails
- **Bulk document upload** with drag-and-drop
- **Smart document categorization** (passport, visa, medical, etc.)

### 3. Advanced Candidate Profiling
- **360-degree candidate view** with timeline
- **Skill matrix visualization**
- **Performance analytics** dashboard
- **Contract lifecycle tracking**
- **Automated reminder system** for document renewals

### 4. Intelligent Job Matching
- **Candidate-job compatibility scoring**
- **Automated job recommendations** based on profile
- **Skill gap analysis**
- **Career progression tracking**

### 5. Communication & Notifications
- **Multi-channel notifications** (Email, SMS, In-app, Push)
- **Interview scheduling** with calendar integration
- **Automated email campaigns** for job updates
- **Real-time chat** for candidate support
- **WhatsApp integration** for international candidates

### 6. Analytics & Reporting
- **Application funnel analytics**
- **Time-to-hire metrics**
- **Source tracking** (where candidates found jobs)
- **Diversity and inclusion metrics**
- **Custom report builder**
- **Export to Excel/PDF**

### 7. Security & Compliance
- **GDPR compliance** features
- **Data encryption** at rest and in transit
- **Role-based access control** (RBAC)
- **Audit logging** for all actions
- **Two-factor authentication** (2FA)
- **IP whitelisting** for admin access
- **Data retention policies**

### 8. Mobile-First Experience
- **Progressive Web App** (works offline)
- **Mobile-optimized** application forms
- **QR code scanning** for document uploads
- **Biometric authentication** support

### 9. Integration Capabilities
- **RESTful API** for third-party integrations
- **Webhook support** for event notifications
- **Calendar sync** (Google Calendar, Outlook)
- **HRIS integration** capabilities
- **Background check** API integration

### 10. Crew Management Features
- **Vessel assignment** tracking
- **Contract timeline** visualization
- **Sign-on/sign-off** workflow automation
- **Crew readiness dashboard**
- **Emergency contact** quick access
- **Medical certificate** expiry alerts

## Project Structure

```
cruise-recruitment-system/
├── docker-compose.yml              # Development environment
├── docker-compose.prod.yml         # Production environment
├── .dockerignore
├── .gitignore
├── README.md
│
├── services/
│   ├── api/                        # Backend API service
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   ├── services/
│   │   │   │   ├── cv-screening/
│   │   │   │   ├── document-processing/
│   │   │   │   └── notification/
│   │   │   └── utils/
│   │   └── package.json
│   │
│   ├── web-public/                 # Public job portal
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   └── package.json
│   │
│   ├── web-admin/                  # Admin dashboard
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── utils/
│   │   └── package.json
│   │
│   └── web-candidate/              # Candidate portal
│       ├── Dockerfile
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   └── utils/
│       └── package.json
│
├── infrastructure/
│   ├── nginx/                      # Reverse proxy config
│   ├── postgres/                   # Database init scripts
│   ├── redis/                      # Redis config
│   └── elasticsearch/              # Search config
│
├── shared/                         # Shared libraries/types
│   ├── types/
│   └── utils/
│
├── scripts/
│   ├── setup.sh                    # Initial setup script
│   ├── migrate.sh                  # Database migration
│   └── deploy.sh                   # Deployment script
│
└── docs/
    ├── api/                        # API documentation
    ├── deployment/                 # Deployment guides
    └── architecture/               # System architecture docs
```

## Docker Containerization Strategy

### Development Environment
- **Multi-container setup** with Docker Compose
- **Hot-reload** for all services
- **Volume mounts** for live code updates
- **Separate databases** for development

### Production Environment
- **Optimized Docker images** with multi-stage builds
- **Health checks** for all services
- **Resource limits** and constraints
- **Secrets management** with Docker secrets
- **Kubernetes-ready** manifests (optional)

### Container Services
1. **api** - Backend API service
2. **web-public** - Public job portal
3. **web-admin** - Admin dashboard
4. **web-candidate** - Candidate portal
5. **postgres** - Primary database
6. **redis** - Caching and sessions
7. **elasticsearch** - Search and CV screening
8. **nginx** - Reverse proxy and load balancer
9. **rabbitmq** - Message queue (optional)
10. **minio** - Object storage (S3-compatible)

## Key Data Models

### Candidate Application
- Personal details (name, age, gender, nationality)
- Contact information (email, phone, address, Skype)
- Job application details
- Uploaded documents (resume, certificates, IDs)
- Employment history
- Personal summary
- Screening status and scores

### Successful Candidate Profile
- Employment number (unique ID)
- All personal details
- Physical attributes (height, weight, etc.)
- Legal documents (passport, seaman's book)
- Profile photos
- Contract information
- Crew status (onboard/on vacation)
- Joining/sign-off dates
- Document compliance status

### Job Posting
- Cruise line information
- Job position details
- Requirements and specifications
- Application status

## Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
- Project setup and containerization
- Database schema design
- Basic API endpoints
- Authentication system
- Public job portal (basic)

### Phase 2: Core Features (Weeks 5-8)
- Application submission system
- Document upload functionality
- Admin dashboard (basic)
- Candidate profiling system
- Employment number assignment

### Phase 3: Advanced Features (Weeks 9-12)
- AI-powered CV screening
- Document management system
- Crew status tracking
- Contract management
- Notification system

### Phase 4: Polish & Optimization (Weeks 13-16)
- UI/UX enhancements
- Performance optimization
- Security hardening
- Testing and bug fixes
- Documentation

## Security Considerations

1. **Data Encryption**: All sensitive data encrypted
2. **Secure File Storage**: Documents stored securely with access controls
3. **API Security**: JWT authentication, rate limiting
4. **Input Validation**: Protection against SQL injection, XSS
5. **Regular Backups**: Automated database backups
6. **Compliance**: GDPR, data retention policies

## Scalability Considerations

- **Horizontal scaling** for API services
- **Database replication** for high availability
- **CDN integration** for static assets
- **Caching strategy** for performance
- **Load balancing** for traffic distribution

## Next Steps

1. Review and approve this proposal
2. Set up development environment
3. Begin Phase 1 implementation
4. Regular progress reviews and iterations

---

Would you like me to proceed with creating the initial project structure and Docker setup?

