# Port Structure Guide

## Overview
The Cruise Recruitment System runs on **3 different ports**, each serving a different purpose:

## Port 4000 - Public Portal (Next.js)
**URL:** `http://localhost:4000`

**Purpose:** Public-facing website for job browsing and application

**Features:**
- Browse all job postings
- View job details
- Register as a candidate
- Login as a candidate
- Apply for jobs
- Google OAuth login

**Who uses it:**
- Job seekers
- Prospective candidates
- General public

**Login:** Candidate login (redirects to candidate portal after login)

---

## Port 4001 - Admin/Recruiter Dashboard (React)
**URL:** `http://localhost:4001`

**Purpose:** Administrative dashboard for recruiters and system administrators

**Features:**
- Dashboard with statistics
- Manage candidates
- Manage job postings
- Review applications
- Manage contracts
- Crew management
- System analytics

**Who uses it:**
- Recruiters
- HR administrators
- System administrators

**Login:** Admin/Recruiter login
- Uses `admin_token` in localStorage
- Requires admin role in the system

**Routes:**
- `/login` - Admin login page
- `/dashboard` - Main dashboard
- `/candidates` - Candidate management
- `/jobs` - Job posting management
- `/applications` - Application review
- `/contracts` - Contract management
- `/crew` - Crew status management

---

## Port 4002 - Candidate Portal (React)
**URL:** `http://localhost:4002`

**Purpose:** Personal dashboard for candidates to manage their profile and applications

**Features:**
- Personal dashboard
- Profile management
- Document upload
- Application tracking
- Contract viewing
- Crew readiness status

**Who uses it:**
- Registered candidates
- Applicants
- Crew members

**Login:** Candidate login
- Uses `candidate_token` in localStorage
- Can also receive token from public portal

**Routes:**
- `/login` - Candidate login page
- `/register` - Candidate registration
- `/dashboard` - Personal dashboard
- `/profile` - Profile management
- `/documents` - Document upload/management
- `/applications` - Application tracking
- `/contracts` - Contract viewing

---

## Quick Reference

| Port | Service | User Type | Main Purpose |
|------|---------|-----------|--------------|
| 4000 | Public Portal | Public/Job Seekers | Browse jobs, apply |
| 4001 | Admin Dashboard | Recruiters/Admins | Manage system |
| 4002 | Candidate Portal | Candidates | Manage profile/applications |

## Access URLs

- **Public Portal:** http://localhost:4000
- **Admin Dashboard:** http://localhost:4001
- **Candidate Portal:** http://localhost:4002

## Login Credentials

### Admin/Recruiter (Port 4001)
- You need to create an admin user in the database
- Admin users have `role: 'admin'` in the system

### Candidate (Port 4002 or 4000)
- Register at http://localhost:4000/register or http://localhost:4002/register
- Or login with Google OAuth

## Important Notes

1. **Different Login Systems:**
   - Port 4001 uses `admin_token` (for recruiters/admins)
   - Port 4002 uses `candidate_token` (for candidates)
   - Port 4000 can login candidates and redirect to port 4002

2. **Token Storage:**
   - Admin tokens: `localStorage.getItem('admin_token')`
   - Candidate tokens: `localStorage.getItem('candidate_token')` or `localStorage.getItem('token')`

3. **Role-Based Access:**
   - Admin routes require `role: 'admin'` in JWT token
   - Candidate routes require `role: 'candidate'` in JWT token

