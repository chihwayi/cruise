'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.post('/candidates/register', formData);
      toast.success('Account created successfully! Please login.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
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
              <UserPlus className="h-8 w-8 text-primary-600" />
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join thousands of seafarers finding their dream jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="text"
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                type="tel"
                name="phoneNumber"
                label="Phone Number"
                placeholder="+1234567890"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Create Account
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

