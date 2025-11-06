'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  User, 
  ArrowRight,
  Loader2,
  Upload
} from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';

interface SmartApplyFlowProps {
  jobId: string;
  onComplete?: () => void;
}

export const SmartApplyFlow: React.FC<SmartApplyFlowProps> = ({ jobId, onComplete }) => {
  const router = useRouter();
  const [step, setStep] = useState<'checking' | 'unauthenticated' | 'incomplete' | 'complete' | 'applying'>('checking');
  const [completeness, setCompleteness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndCompleteness();
  }, []);

  const checkAuthAndCompleteness = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('candidate_token');
      
      if (!token) {
        setStep('unauthenticated');
        setLoading(false);
        return;
      }

      // Check profile completeness
      try {
        const response = await apiClient.get('/candidates/profile/completeness');
        const data = response.data;
        setCompleteness(data);

        if (data.isComplete) {
          setStep('complete');
        } else {
          setStep('incomplete');
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          // Token invalid, need to login
          localStorage.removeItem('token');
          localStorage.removeItem('candidate_token');
          setStep('unauthenticated');
        } else {
          toast.error('Failed to check profile completeness');
          setStep('unauthenticated');
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setStep('unauthenticated');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push(`/register?redirect=/jobs/${jobId}/apply`);
  };

  const handleLogin = () => {
    router.push(`/login?redirect=/jobs/${jobId}/apply`);
  };

  const handleCompleteProfile = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('candidate_token');
    if (token) {
      window.location.href = `http://localhost:4002/profile?token=${encodeURIComponent(token)}&redirect=/jobs/${jobId}/apply`;
    } else {
      handleLogin();
    }
  };

  const handleApply = async () => {
    setStep('applying');
    // This will be handled by the parent component or redirect to apply page
    if (onComplete) {
      onComplete();
    } else {
      router.push(`/jobs/${jobId}/apply`);
    }
  };

  if (loading || step === 'checking') {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking your profile...</p>
        </CardContent>
      </Card>
    );
  }

  if (step === 'unauthenticated') {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-6">
            Please register or login to apply for this position
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleRegister} size="lg" className="bg-gradient-to-r from-primary-600 to-indigo-600">
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button onClick={handleLogin} variant="outline" size="lg">
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'incomplete') {
    const profileProgress = completeness?.profile?.progress || 0;
    const documentsProgress = completeness?.documents?.progress || 0;
    const overallProgress = completeness?.overallProgress || 0;

    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h3>
            <p className="text-gray-600 mb-4">
              Please complete your profile and upload required documents before applying
            </p>
            
            {/* Overall Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-bold text-primary-600">{overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Profile Completeness */}
          <div className="space-y-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Profile Information</span>
                </div>
                <span className="text-sm font-medium text-gray-600">{profileProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${profileProgress}%` }}
                />
              </div>
              {completeness?.profile?.missingFields?.length > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  Missing: {completeness.profile.missingFields.join(', ')}
                </p>
              )}
            </div>

            {/* Documents Completeness */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Documents</span>
                </div>
                <span className="text-sm font-medium text-gray-600">{documentsProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${documentsProgress}%` }}
                />
              </div>
              {completeness?.documents?.missingDocuments?.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">Missing documents:</p>
                  <div className="flex flex-wrap gap-1">
                    {completeness.documents.missingDocuments.map((doc: string) => (
                      <span key={doc} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        {doc.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {!completeness?.documents?.hasResume && (
                <p className="text-xs text-orange-600 mt-2">⚠️ Resume/CV is required</p>
              )}
            </div>
          </div>

          <Button 
            onClick={handleCompleteProfile} 
            size="lg" 
            className="w-full bg-gradient-to-r from-primary-600 to-indigo-600"
          >
            <Upload className="mr-2 h-5 w-5" />
            Complete Profile & Documents
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'complete') {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Complete!</h3>
          <p className="text-gray-600 mb-6">
            Your profile and documents are complete. You're ready to apply!
          </p>
          <Button 
            onClick={handleApply} 
            size="lg" 
            className="bg-gradient-to-r from-primary-600 to-indigo-600"
          >
            Continue to Application
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};

