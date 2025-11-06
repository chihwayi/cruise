import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Candidate from '../models/Candidate';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const candidate = await Candidate.findOne({ where: { email } });

  if (!candidate || !candidate.passwordHash) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, candidate.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Determine user role - check if email is in admin list or use environment variable
  const adminEmails = process.env.ADMIN_EMAILS 
    ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
    : ['admin@cruiserecruit.com'];
  
  const isAdmin = adminEmails.includes(candidate.email.toLowerCase());

  const token = jwt.sign(
    {
      userId: candidate.id,
      email: candidate.email,
      role: isAdmin ? 'admin' : 'candidate',
    },
    process.env.JWT_SECRET || 'your_jwt_secret_change_in_prod',
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    candidate: {
      id: candidate.id,
      email: candidate.email,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      employmentNumber: candidate.employmentNumber,
    },
  });
});

export const googleLogin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { idToken, email, firstName, lastName, fullName, picture, locale, verifiedEmail } = req.body;

  // If we have direct user info (from access token), use it
  // Otherwise, verify the ID token
  let googleEmail: string;
  let googleFirstName: string;
  let googleLastName: string;
  let googlePicture: string | undefined;
  let googleLocale: string | undefined;
  let googleVerifiedEmail: boolean = false;

  if (email && firstName) {
    // Direct user info provided (from access token)
    googleEmail = email;
    googleFirstName = firstName;
    googleLastName = lastName || '';
    googlePicture = picture;
    googleLocale = locale;
    googleVerifiedEmail = verifiedEmail || false;
  } else if (idToken) {
    // Verify the Google ID token
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new AppError('Invalid Google token', 401);
      }

      googleEmail = payload.email || '';
      googleFirstName = payload.given_name || 'User';
      googleLastName = payload.family_name || '';
      googlePicture = payload.picture;
      googleLocale = payload.locale;
      googleVerifiedEmail = payload.email_verified || false;
    } catch (error: any) {
      console.error('Google token verification error:', error);
      throw new AppError('Google authentication failed', 401);
    }
  } else {
    throw new AppError('Google authentication data is required', 400);
  }

  if (!googleEmail) {
    throw new AppError('Email not provided by Google', 400);
  }

  // Parse locale to extract country and language if available
  // Locale format: "en-US", "fr-FR", etc.
  let countryFromLocale: string | undefined;
  let languageFromLocale: string | undefined;
  if (googleLocale) {
    const localeParts = googleLocale.split('-');
    languageFromLocale = localeParts[0]; // e.g., "en", "fr"
    if (localeParts.length > 1) {
      countryFromLocale = localeParts[1]; // e.g., "US", "FR"
    }
  }

  // Find or create candidate
  let candidate = await Candidate.findOne({ where: { email: googleEmail } });

  if (!candidate) {
    // Parse full name for middle initials if available
    let middleInitials: string | undefined;
    if (fullName && fullName.trim()) {
      const nameParts = fullName.trim().split(/\s+/);
      if (nameParts.length > 2) {
        // Extract middle names/initials (everything between first and last)
        const middleParts = nameParts.slice(1, -1);
        middleInitials = middleParts.map(part => part.charAt(0).toUpperCase()).join('.');
      }
    }

    // Create new candidate from Google account with all available data
    const candidateData: any = {
      email: googleEmail,
      firstName: googleFirstName,
      lastName: googleLastName,
      middleInitials: middleInitials,
      profilePhotoUrl: googlePicture,
      // No password hash for OAuth users
    };

    // Add country from locale if available and country is not set
    if (countryFromLocale && !candidateData.country) {
      // Map common country codes to country names (simplified)
      const countryMap: Record<string, string> = {
        'US': 'United States',
        'GB': 'United Kingdom',
        'CA': 'Canada',
        'AU': 'Australia',
        'NZ': 'New Zealand',
        'FR': 'France',
        'DE': 'Germany',
        'ES': 'Spain',
        'IT': 'Italy',
        'NL': 'Netherlands',
        'BE': 'Belgium',
        'CH': 'Switzerland',
        'AT': 'Austria',
        'SE': 'Sweden',
        'NO': 'Norway',
        'DK': 'Denmark',
        'FI': 'Finland',
        'PL': 'Poland',
        'PT': 'Portugal',
        'GR': 'Greece',
        'IE': 'Ireland',
        'ZA': 'South Africa',
        'IN': 'India',
        'PH': 'Philippines',
        'ID': 'Indonesia',
        'MY': 'Malaysia',
        'SG': 'Singapore',
        'TH': 'Thailand',
        'VN': 'Vietnam',
        'JP': 'Japan',
        'KR': 'South Korea',
        'CN': 'China',
        'BR': 'Brazil',
        'MX': 'Mexico',
        'AR': 'Argentina',
        'CL': 'Chile',
        'CO': 'Colombia',
      };
      candidateData.country = countryMap[countryFromLocale] || countryFromLocale;
    }

    // Add language from locale if available
    if (languageFromLocale && !candidateData.languages) {
      const languageMap: Record<string, string> = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'nl': 'Dutch',
        'pl': 'Polish',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'th': 'Thai',
        'vi': 'Vietnamese',
        'id': 'Indonesian',
        'ms': 'Malay',
        'tl': 'Filipino',
      };
      const languageName = languageMap[languageFromLocale] || languageFromLocale;
      candidateData.languages = [languageName];
    }

    candidate = await Candidate.create(candidateData);
  } else {
    // Update existing candidate with Google data (only if fields are empty)
    const updates: any = {};

    // Update profile photo if not set
    if (googlePicture && !candidate.profilePhotoUrl) {
      updates.profilePhotoUrl = googlePicture;
    }

    // Update first name if empty
    if (googleFirstName && !candidate.firstName) {
      updates.firstName = googleFirstName;
    }

    // Update last name if empty
    if (googleLastName && !candidate.lastName) {
      updates.lastName = googleLastName;
    }

    // Update middle initials from full name if available and not set
    if (fullName && !candidate.middleInitials) {
      const nameParts = fullName.trim().split(/\s+/);
      if (nameParts.length > 2) {
        const middleParts = nameParts.slice(1, -1);
        updates.middleInitials = middleParts.map(part => part.charAt(0).toUpperCase()).join('.');
      }
    }

    // Update country from locale if country is not set
    if (countryFromLocale && !candidate.country) {
      const countryMap: Record<string, string> = {
        'US': 'United States',
        'GB': 'United Kingdom',
        'CA': 'Canada',
        'AU': 'Australia',
        'NZ': 'New Zealand',
        'FR': 'France',
        'DE': 'Germany',
        'ES': 'Spain',
        'IT': 'Italy',
        'NL': 'Netherlands',
        'BE': 'Belgium',
        'CH': 'Switzerland',
        'AT': 'Austria',
        'SE': 'Sweden',
        'NO': 'Norway',
        'DK': 'Denmark',
        'FI': 'Finland',
        'PL': 'Poland',
        'PT': 'Portugal',
        'GR': 'Greece',
        'IE': 'Ireland',
        'ZA': 'South Africa',
        'IN': 'India',
        'PH': 'Philippines',
        'ID': 'Indonesia',
        'MY': 'Malaysia',
        'SG': 'Singapore',
        'TH': 'Thailand',
        'VN': 'Vietnam',
        'JP': 'Japan',
        'KR': 'South Korea',
        'CN': 'China',
        'BR': 'Brazil',
        'MX': 'Mexico',
        'AR': 'Argentina',
        'CL': 'Chile',
        'CO': 'Colombia',
      };
      updates.country = countryMap[countryFromLocale] || countryFromLocale;
    }

    // Add language from locale if languages array is empty
    if (languageFromLocale && (!candidate.languages || candidate.languages.length === 0)) {
      const languageMap: Record<string, string> = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'nl': 'Dutch',
        'pl': 'Polish',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'th': 'Thai',
        'vi': 'Vietnamese',
        'id': 'Indonesian',
        'ms': 'Malay',
        'tl': 'Filipino',
      };
      const languageName = languageMap[languageFromLocale] || languageFromLocale;
      updates.languages = [languageName];
    }

    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      await candidate.update(updates);
    }
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: candidate.id,
      email: candidate.email,
      role: 'candidate',
    },
    process.env.JWT_SECRET || 'your_jwt_secret_change_in_prod',
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Google login successful',
    token,
    candidate: {
      id: candidate.id,
      email: candidate.email,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      employmentNumber: candidate.employmentNumber,
      profilePhotoUrl: candidate.profilePhotoUrl,
    },
  });
});

export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const candidate = await Candidate.findByPk(req.userId, {
    attributes: { exclude: ['passwordHash'] },
  });

  if (!candidate) {
    throw new AppError('Candidate not found', 404);
  }

  res.json({ candidate });
});
