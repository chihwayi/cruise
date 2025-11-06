'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogIn, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { GoogleLoginButton } from '@/components/GoogleLoginButton';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      // Store token for public portal
      localStorage.setItem('token', response.data.token);
      // Set flag to indicate this login was from public portal
      localStorage.setItem('public_portal_login', 'true');
      
      toast.success('Login successful! Redirecting to your dashboard...');
      
      // Redirect to candidate portal with token in URL (will be stored there)
      // Note: localStorage is domain-specific, so we pass token via URL
      setTimeout(() => {
        window.location.href = `http://localhost:4002/dashboard?token=${encodeURIComponent(response.data.token)}`;
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <LogIn className="h-8 w-8 text-primary-600" />
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail className="h-4 w-4" />}
              />
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock className="h-4 w-4" />}
              />
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In
              </Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <GoogleLoginButton />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Create one here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

