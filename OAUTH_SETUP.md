# OAuth Authentication Setup Guide

## Google OAuth Configuration

To enable Google OAuth authentication, you need to:

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen:
   - User Type: External
   - App name: Cruise Recruitment System
   - Support email: your-email@example.com
   - Authorized domains: localhost (for development)
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: Cruise Recruitment Web
   - Authorized JavaScript origins:
     - `http://localhost:4000`
     - `http://localhost:4001`
     - `http://localhost:4002`
   - Authorized redirect URIs:
     - `http://localhost:4000`
     - `http://localhost:4001`
     - `http://localhost:4002`

### 2. Environment Variables

Add the following environment variables:

**Backend (API):**
```env
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

**Frontend (Public Portal):**
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

✅ **These credentials have been configured in `docker-compose.yml`**

### 3. Docker Compose Configuration

Update `docker-compose.yml` to include the environment variables:

```yaml
services:
  api:
    environment:
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
  
  web-public:
    environment:
      - NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
```

### 4. How It Works

1. **User clicks "Continue with Google"** on login/register page
2. **Google OAuth popup** appears for authentication
3. **User grants permissions** to the application
4. **Frontend receives access token** from Google
5. **Frontend fetches user info** using the access token
6. **Frontend sends user info to backend** (`/api/auth/google`)
7. **Backend verifies/creates user** and returns JWT token
8. **User is logged in** and redirected to dashboard

### 5. Features

- ✅ Automatic account creation if user doesn't exist
- ✅ Profile photo sync from Google
- ✅ Seamless login for existing users
- ✅ Works on all portals (public, admin, candidate)

### 6. Testing

1. Make sure environment variables are set
2. Restart Docker containers: `docker-compose restart`
3. Navigate to login/register page
4. Click "Continue with Google"
5. Complete Google authentication
6. You should be logged in and redirected

### 7. Production Considerations

- Update authorized domains and redirect URIs for production domain
- Use HTTPS in production
- Store secrets securely (use secrets management)
- Consider adding additional OAuth providers (Microsoft, Facebook, etc.)

