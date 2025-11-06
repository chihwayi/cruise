'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

interface GoogleOAuthProviderWrapperProps {
  children: ReactNode;
}

export function GoogleOAuthProviderWrapper({ children }: GoogleOAuthProviderWrapperProps) {
  // Get client ID from environment variable
  // Fallback to hardcoded value for development (Next.js embeds NEXT_PUBLIC_ vars at build time)
  const googleClientId = 
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
    '643277036091-825up6vv6av3q5fu3ia6l0ragrkrsrbc.apps.googleusercontent.com';

  // Always render the provider to ensure context is available
  // If client ID is invalid, OAuth will just fail gracefully
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
