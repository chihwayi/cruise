# How to Create Login Credentials and Use the System as an Applicant

## Quick Start Guide

### Option 1: Using the Web Interface (Recommended)

1. **Access the Public Portal**
   - Open your browser and go to: `http://localhost:4000`
   - Or if using Nginx: `http://localhost`

2. **Register a New Account**
   - Click on "Register" or "Sign Up" in the navigation menu
   - Or go directly to: `http://localhost:4000/register`
   - Fill in the registration form:
     - **First Name**: Your first name
     - **Last Name**: Your last name
     - **Email Address**: Your email (will be used for login)
     - **Phone Number**: Your phone number (optional)
     - **Password**: Minimum 8 characters
   - Click "Create Account"
   - You'll be redirected to the login page

3. **Login to Your Account**
   - Go to: `http://localhost:4000/login`
   - Enter your email and password
   - Click "Sign In"
   - You'll be redirected to your candidate dashboard

### Option 2: Using the API Directly

You can also register using curl or Postman:

```bash
# Register a new candidate
curl -X POST http://localhost:3000/api/candidates/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "applicant@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
  }'
```

After registration, login:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "applicant@example.com",
    "password": "password123"
  }'
```

The response will contain a JWT token that you can use for authenticated requests.

## What You Can Do After Login

Once logged in as a candidate, you can:

1. **View Your Profile**
   - Access your candidate dashboard at: `http://localhost:4002/dashboard`
   - View and update your profile information

2. **Browse Jobs**
   - View all available job postings
   - Search and filter jobs by cruise line, position, etc.
   - View detailed job descriptions

3. **Apply for Jobs**
   - Click on any job posting
   - Click "Apply Now"
   - Upload your CV/resume
   - Submit your application

4. **Manage Documents**
   - Upload required documents (passport, visa, certificates, etc.)
   - View document expiry dates
   - Download your documents

5. **Track Applications**
   - View status of all your applications
   - See screening results
   - Track application progress

6. **View Contracts**
   - If you have any contracts, view them in your dashboard
   - Check contract details and status

## Troubleshooting

### Registration Issues

- **Email already exists**: Use a different email address
- **Password too short**: Password must be at least 8 characters
- **Validation errors**: Make sure all required fields are filled correctly

### Login Issues

- **Invalid credentials**: Double-check your email and password
- **Account not found**: Make sure you've registered first
- **Token expired**: Log out and log back in

### API Connection Issues

- Make sure the API is running: `docker-compose ps api`
- Check API health: `curl http://localhost:3000/api/health`
- Check API logs: `docker-compose logs api`

## Example Test Account

You can create a test account with these details:

- **Email**: `test.applicant@example.com`
- **Password**: `Test123456`
- **First Name**: `Test`
- **Last Name**: `Applicant`
- **Phone**: `+1234567890`

## Next Steps

1. Complete your profile with all required information
2. Upload your CV/resume
3. Upload required documents (passport, certificates, etc.)
4. Browse available job postings
5. Apply for positions that match your skills
6. Track your application status

## Need Help?

- Check the API documentation: `API_DOCUMENTATION.md`
- View system logs: `docker-compose logs -f`
- Check service status: `docker-compose ps`

