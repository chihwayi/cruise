# Login Credentials

## 🔐 Admin/Recruiter Dashboard (Port 4001)

**URL:** http://localhost:4001/login

### Default Admin Credentials:
```
📧 Email: admin@cruiserecruit.com
🔑 Password: Admin123!@#
```

### Additional Admin Emails:
You can add more admin emails by setting the `ADMIN_EMAILS` environment variable in `docker-compose.yml`:
```yaml
ADMIN_EMAILS=admin@cruiserecruit.com,recruiter@cruiserecruit.com,hr@cruiserecruit.com
```

**Note:** The system automatically assigns `role: 'admin'` to any email listed in `ADMIN_EMAILS` when logging in.

---

## 👤 Candidate Portal (Port 4002)

**URL:** http://localhost:4002/login

### How to Get Candidate Credentials:

#### Option 1: Register New Candidate
1. Go to http://localhost:4002/register
2. Fill in the registration form
3. You'll be redirected to login after registration

#### Option 2: Use Public Portal
1. Go to http://localhost:4000/register
2. Register as a candidate
3. Login will redirect you to the candidate portal

#### Option 3: Google OAuth
1. Go to http://localhost:4000/login or http://localhost:4002/login
2. Click "Continue with Google"
3. Account will be created automatically

---

## 🔧 Creating Additional Admin Users

To create more admin users, run:

```bash
docker-compose exec api npm run create:admin
```

Or set environment variables:
```bash
ADMIN_EMAIL=your-email@example.com \
ADMIN_PASSWORD=YourPassword123! \
ADMIN_FIRST_NAME=YourName \
ADMIN_LAST_NAME=YourLastName \
docker-compose exec api npm run create:admin
```

Then add the email to `ADMIN_EMAILS` in `docker-compose.yml`:
```yaml
ADMIN_EMAILS=admin@cruiserecruit.com,your-email@example.com
```

---

## 📝 Important Notes

1. **Role Assignment:**
   - Admin role is determined by email address during login
   - Emails in `ADMIN_EMAILS` environment variable get `role: 'admin'`
   - All other users get `role: 'candidate'`

2. **Token Storage:**
   - Admin tokens stored as: `admin_token` in localStorage
   - Candidate tokens stored as: `candidate_token` or `token` in localStorage

3. **Ports:**
   - **4000**: Public Portal (browse jobs, register)
   - **4001**: Admin/Recruiter Dashboard (manage system)
   - **4002**: Candidate Portal (personal dashboard)

---

## 🚀 Quick Start

1. **Login as Admin:**
   - Go to: http://localhost:4001/login
   - Email: `admin@cruiserecruit.com`
   - Password: `Admin123!@#`

2. **Register as Candidate:**
   - Go to: http://localhost:4002/register
   - Fill in the form
   - Login with your credentials

3. **Browse Jobs (No Login Required):**
   - Go to: http://localhost:4000/jobs

