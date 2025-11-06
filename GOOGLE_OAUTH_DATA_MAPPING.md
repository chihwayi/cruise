# Google OAuth Data Mapping

## Overview
When users log in with Google OAuth, the system automatically captures and maps all available Google user data to the candidate profile.

## Data Captured from Google

### Direct Fields
- **Email** → `candidate.email`
- **First Name** (`given_name`) → `candidate.firstName`
- **Last Name** (`family_name`) → `candidate.lastName`
- **Full Name** (`name`) → Used to extract `candidate.middleInitials`
- **Profile Photo** (`picture`) → `candidate.profilePhotoUrl`
- **Locale** (`locale`) → Used to determine `candidate.country` and `candidate.languages`
- **Verified Email** (`verified_email`) → Used for validation (not stored)

## Automatic Field Population

### For New Users
When a new user logs in with Google, the system automatically creates a profile with:
- ✅ Email
- ✅ First Name
- ✅ Last Name
- ✅ Middle Initials (extracted from full name if available)
- ✅ Profile Photo URL
- ✅ Country (derived from locale, e.g., "en-US" → "United States")
- ✅ Languages (derived from locale, e.g., "en" → "English")

### For Existing Users
When an existing user logs in with Google, the system updates only **empty/missing** fields:
- ✅ Profile Photo (if not already set)
- ✅ First Name (if empty)
- ✅ Last Name (if empty)
- ✅ Middle Initials (if not set, extracted from full name)
- ✅ Country (if not set, derived from locale)
- ✅ Languages (if empty, derived from locale)

**Note:** Existing data is never overwritten. Google data only fills in missing information.

## Country Mapping

The system maps common country codes from Google locale to full country names:

| Code | Country |
|------|---------|
| US | United States |
| GB | United Kingdom |
| CA | Canada |
| AU | Australia |
| NZ | New Zealand |
| FR | France |
| DE | Germany |
| ES | Spain |
| IT | Italy |
| NL | Netherlands |
| BE | Belgium |
| PH | Philippines |
| IN | India |
| And 30+ more... |

## Language Mapping

The system maps language codes from Google locale to language names:

| Code | Language |
|------|----------|
| en | English |
| es | Spanish |
| fr | French |
| de | German |
| it | Italian |
| pt | Portuguese |
| nl | Dutch |
| ja | Japanese |
| ko | Korean |
| zh | Chinese |
| And 15+ more... |

## Example Flow

1. User clicks "Continue with Google"
2. Google OAuth popup appears
3. User grants permissions
4. System receives:
   ```json
   {
     "email": "john.doe@example.com",
     "given_name": "John",
     "family_name": "Doe",
     "name": "John Michael Doe",
     "picture": "https://...",
     "locale": "en-US",
     "verified_email": true
   }
   ```
5. System creates/updates profile:
   - Email: `john.doe@example.com`
   - First Name: `John`
   - Last Name: `Doe`
   - Middle Initials: `M.` (extracted from "John Michael Doe")
   - Profile Photo: `https://...`
   - Country: `United States` (from "en-US")
   - Languages: `["English"]` (from "en")

## Benefits

✅ **Automatic Profile Completion**: Users don't need to manually enter basic information
✅ **Data Accuracy**: Information comes directly from Google, reducing errors
✅ **Better User Experience**: Faster registration and profile setup
✅ **Smart Updates**: Only fills missing fields, never overwrites existing data
✅ **International Support**: Automatically detects country and language from locale

