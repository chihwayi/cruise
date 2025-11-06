'use client';

import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from './ui/Button';
import { Chrome } from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface GoogleLoginButtonProps {
  redirectUrl?: string;
  onSuccess?: () => void;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ 
  redirectUrl, 
  onSuccess 
}) => {
  const router = useRouter();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
        );
        
        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info from Google');
        }
        
        const userInfo = await userInfoResponse.json();

        // Extract all available data from Google
        // Google provides: email, given_name, family_name, name, picture, locale, verified_email
        const googleData = {
          idToken: tokenResponse.access_token,
          email: userInfo.email,
          firstName: userInfo.given_name || userInfo.name?.split(' ')[0] || '',
          lastName: userInfo.family_name || userInfo.name?.split(' ').slice(1).join(' ') || '',
          fullName: userInfo.name || '',
          picture: userInfo.picture,
          locale: userInfo.locale, // e.g., "en-US", can help determine country/language
          verifiedEmail: userInfo.verified_email || false,
        };

        // Send to our backend with all available data
        const response = await apiClient.post('/auth/google', googleData);

        // Store token
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('public_portal_login', 'true');
        
        toast.success('Login successful! Redirecting...');
        
        if (onSuccess) {
          onSuccess();
        } else if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          // Redirect to candidate portal
          window.location.href = `http://localhost:4002/dashboard?token=${encodeURIComponent(response.data.token)}`;
        }
      } catch (error: any) {
        console.error('Google login error:', error);
        toast.error(error.response?.data?.error || 'Google login failed');
      }
    },
    onError: () => {
      toast.error('Google login failed. Please try again.');
    },
  });

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
      onClick={() => handleGoogleLogin()}
    >
      <Chrome className="h-5 w-5 mr-2" />
      Continue with Google
    </Button>
  );
};
