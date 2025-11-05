# Complete API Documentation

## Base URL
`http://localhost:3000/api`

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication Endpoints

### POST `/api/auth/login`
Login and get JWT token.

**Request Body:**
```json
{
  "email": "candidate@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "candidate": { ... }
}
```

### GET `/api/auth/me`
Get current authenticated user information.

**Headers:** `Authorization: Bearer <token>`

---

## 2. Candidate Endpoints

### POST `/api/candidates/register` (Public)
Register a new candidate.

**Request Body:**
```json
{
  "email": "candidate@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "middleInitials": "M",
  "phoneNumber": "+1234567890"
}
```

### GET `/api/candidates/profile` (Protected)
Get own candidate profile.

**Headers:** `Authorization: Bearer <token>`

### PUT `/api/candidates/profile` (Protected)
Update own candidate profile.

**Headers:** `Authorization: Bearer <token>`

### GET `/api/candidates` (Admin)
Get all candidates with pagination and filters.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `crewStatus` - Filter by crew status (onboard, on_vacation, available, unavailable)
- `search` - Search by name or email

### GET `/api/candidates/:candidateId` (Admin)
Get candidate by ID.

### PUT `/api/candidates/:candidateId` (Admin)
Update candidate by ID.

### POST `/api/candidates/:candidateId/employment-number` (Admin)
Assign employment number to candidate.

---

## 3. Job Posting Endpoints

### GET `/api/jobs` (Public)
Get all active job postings.

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `cruiseLineName` - Filter by cruise line
- `search` - Search in title/description
- `isActive` - Filter active jobs (default: true)

### GET `/api/jobs/:id` (Public)
Get job posting by ID.

### POST `/api/jobs` (Admin)
Create new job posting.

**Request Body:**
```json
{
  "cruiseLineName": "Royal Caribbean",
  "positionTitle": "Deck Officer",
  "positionDescription": "...",
  "requirements": "...",
  "specifications": "...",
  "department": "Deck",
  "employmentType": "Full-time",
  "startDate": "2024-01-01",
  "applicationDeadline": "2024-12-31"
}
```

### PUT `/api/jobs/:id` (Admin)
Update job posting.

### DELETE `/api/jobs/:id` (Admin)
Delete (deactivate) job posting.

---

## 4. Application Endpoints

### POST `/api/applications` (Protected)
Submit application for a job.

**Request Body:**
```json
{
  "jobPostingId": "uuid",
  "personalSummary": "Experienced seafarer...",
  "resumeUrl": "http://..."
}
```

### GET `/api/applications/my` (Protected)
Get my applications.

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status

### GET `/api/applications/all` (Admin)
Get all applications.

**Query Parameters:**
- `page`, `limit`
- `status` - Filter by screening status
- `jobPostingId` - Filter by job
- `candidateId` - Filter by candidate

### GET `/api/applications/:id` (Admin)
Get application by ID with full details.

### PUT `/api/applications/:id/status` (Admin)
Update application status.

**Request Body:**
```json
{
  "screeningStatus": "shortlisted",
  "screeningScore": 85
}
```

---

## 5. Employment History Endpoints

### POST `/api/employment-history` (Protected)
Add employment history entry.

**Request Body:**
```json
{
  "employerName": "Company Name",
  "position": "Position Title",
  "duties": "Job duties and responsibilities",
  "startDate": "2020-01-01",
  "endDate": "2022-12-31",
  "isCurrent": false
}
```

### GET `/api/employment-history/my` (Protected)
Get my employment history.

### PUT `/api/employment-history/:id` (Protected)
Update employment history entry.

### DELETE `/api/employment-history/:id` (Protected)
Delete employment history entry.

### GET `/api/employment-history/candidate/:candidateId` (Admin)
Get employment history for a candidate.

---

## 6. Document Endpoints

### POST `/api/documents/upload` (Protected)
Upload a document.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` - File to upload
- `documentType` - Type: passport, visa, medical, seaman_book, contract, employment_agreement, stcw_certificate, peme, identity_card, resume, certificate, other
- `expiryDate` - Optional expiry date

### GET `/api/documents/my` (Protected)
Get my documents.

**Query Parameters:**
- `documentType` - Filter by type
- `expired` - Filter expired documents (true/false)

### GET `/api/documents/my/expiring` (Protected)
Get my expiring documents.

**Query Parameters:**
- `days` - Days ahead to check (default: 30)

### GET `/api/documents/:id` (Protected)
Get document by ID.

### DELETE `/api/documents/:id` (Protected)
Delete document.

### GET `/api/documents/candidate/:candidateId` (Admin)
Get all documents for a candidate.

### PUT `/api/documents/:id/verify` (Admin)
Verify/unverify a document.

**Request Body:**
```json
{
  "verified": true
}
```

---

## 7. Contract Endpoints

### POST `/api/contracts` (Admin)
Create a new contract.

**Request Body:**
```json
{
  "candidateId": "uuid",
  "jobPostingId": "uuid",
  "contractType": "temporary",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "position": "Deck Officer",
  "salary": 5000,
  "currency": "USD",
  "vesselName": "Ship Name",
  "terms": {}
}
```

### GET `/api/contracts/my` (Protected)
Get my contracts.

### GET `/api/contracts/:id` (Protected)
Get contract by ID.

### POST `/api/contracts/:id/sign` (Protected)
Sign a contract.

**Request Body:**
```json
{
  "documentUrl": "http://..."
}
```

### GET `/api/contracts` (Admin)
Get all contracts with pagination.

**Query Parameters:**
- `page`, `limit`
- `status` - Filter by status
- `candidateId` - Filter by candidate

### PUT `/api/contracts/:id` (Admin)
Update contract.

### PUT `/api/contracts/:id/joining-date` (Admin)
Update joining date.

**Request Body:**
```json
{
  "joiningDate": "2024-01-15"
}
```

### PUT `/api/contracts/:id/sign-off-date` (Admin)
Update sign-off date.

**Request Body:**
```json
{
  "signOffDate": "2024-12-31"
}
```

---

## 8. Crew Management Endpoints

### GET `/api/crew/status` (Admin)
Get all crew status with pagination.

**Query Parameters:**
- `page`, `limit`
- `crewStatus` - Filter by status

### GET `/api/crew/onboard` (Admin)
Get all crew currently onboard.

### GET `/api/crew/on-vacation` (Admin)
Get all crew on vacation.

### GET `/api/crew/readiness/:candidateId` (Admin)
Get crew readiness for a candidate.

**Response:**
```json
{
  "candidateId": "uuid",
  "isReady": false,
  "readinessPercentage": 75,
  "documentStatus": { ... },
  "missingDocuments": ["visa"],
  "expiredDocuments": [],
  "expiringSoonDocuments": ["medical"],
  "summary": { ... }
}
```

### GET `/api/crew/readiness/my` (Protected)
Get my own crew readiness.

### PUT `/api/crew/status/:candidateId` (Admin)
Update crew status.

**Request Body:**
```json
{
  "crewStatus": "onboard"
}
```

---

## 9. CV Screening Endpoints

### POST `/api/cv-screening/application/:applicationId` (Admin)
Screen a single application.

### POST `/api/cv-screening/bulk` (Admin)
Bulk screen multiple applications.

**Request Body:**
```json
{
  "applicationIds": ["uuid1", "uuid2", ...]
}
```

### GET `/api/cv-screening/search` (Admin)
Search candidates by skills.

**Query Parameters:**
- `query` - Search query (required)
- `jobPostingId` - Optional filter by job

---

## 10. Admin Endpoints

### GET `/api/admin/dashboard` (Admin)
Get dashboard statistics.

**Response:**
```json
{
  "overview": {
    "totalCandidates": 150,
    "totalApplications": 500,
    "activeJobPostings": 25,
    "totalContracts": 80
  },
  "crew": { ... },
  "applications": { ... },
  "recentActivity": { ... }
}
```

### GET `/api/admin/stats/applications` (Admin)
Get application statistics.

**Query Parameters:**
- `jobPostingId` - Filter by job
- `startDate` - Filter start date
- `endDate` - Filter end date

### GET `/api/admin/stats/candidates` (Admin)
Get candidate statistics.

---

## 11. Health Check

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Error Responses

All endpoints may return error responses:

**400 Bad Request:**
```json
{
  "error": "Validation failed",
  "errors": [...]
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "error": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Internal Server Error

---

## Complete Endpoint List

### Public Endpoints
- `POST /api/candidates/register`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `GET /api/health`

### Protected Endpoints (Require Authentication)
- All `/api/*/my` endpoints
- `GET /api/candidates/profile`
- `PUT /api/candidates/profile`
- `POST /api/applications`
- `GET /api/applications/my`
- `POST /api/employment-history`
- `GET /api/employment-history/my`
- `PUT /api/employment-history/:id`
- `DELETE /api/employment-history/:id`
- `POST /api/documents/upload`
- `GET /api/documents/my`
- `GET /api/documents/my/expiring`
- `GET /api/documents/:id`
- `DELETE /api/documents/:id`
- `GET /api/contracts/my`
- `GET /api/contracts/:id`
- `POST /api/contracts/:id/sign`
- `GET /api/crew/readiness/my`

### Admin Endpoints (Require Admin Role)
- All `/api/admin/*` endpoints
- All `/api/candidates/*` (except register, profile)
- All `/api/jobs/*` (except GET)
- All `/api/applications/all` and `/api/applications/:id`
- `PUT /api/applications/:id/status`
- `GET /api/employment-history/candidate/:candidateId`
- `GET /api/documents/candidate/:candidateId`
- `PUT /api/documents/:id/verify`
- All `/api/contracts/*` (except my, :id, sign)
- All `/api/crew/*` (except readiness/my)
- All `/api/cv-screening/*`

---

**Total Endpoints: 50+**

All endpoints are fully implemented and ready for use!

