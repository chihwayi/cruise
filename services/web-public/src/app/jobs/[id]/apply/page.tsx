'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { SmartApplyFlow } from '@/components/SmartApplyFlow';
import { Upload, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [job, setJob] = useState<any>(null);
  const [personalSummary, setPersonalSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingJob, setLoadingJob] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [completeness, setCompleteness] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('candidate_token');
    if (!token) {
      // No token, SmartApplyFlow will handle it
      if (params.id) {
        fetchJob();
      }
      return;
    }

    // Check completeness
    checkCompleteness();
    
    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const checkCompleteness = async () => {
    try {
      const response = await apiClient.get('/candidates/profile/completeness');
      const data = response.data;
      setCompleteness(data);
      
      if (data.isComplete) {
        setShowApplicationForm(true);
      }
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error('Error checking completeness:', error);
      }
    }
  };

  const fetchJob = async () => {
    try {
      const response = await apiClient.get(`/jobs/${params.id}`);
      setJob(response.data.jobPosting);
    } catch (error) {
      toast.error('Failed to load job details');
      router.push('/jobs');
    } finally {
      setLoadingJob(false);
    }
  };

  const handleFlowComplete = () => {
    checkCompleteness();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.post('/applications', {
        jobPostingId: params.id,
        personalSummary,
      });
      toast.success('Application submitted successfully!');
      // Redirect to candidate portal with token
      const token = localStorage.getItem('token') || localStorage.getItem('candidate_token');
      if (token) {
        window.location.href = `http://localhost:4002/dashboard?token=${encodeURIComponent(token)}`;
      } else {
        router.push('/login');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const token = localStorage.getItem('token') || localStorage.getItem('candidate_token');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href={`/jobs/${params.id}`} 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Job Details
        </Link>

        {job && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.positionTitle}</h1>
            <p className="text-primary-600 font-semibold text-lg">{job.cruiseLineName}</p>
          </div>
        )}

        {/* Show Smart Apply Flow if not authenticated or profile incomplete */}
        {(!token || !showApplicationForm) && (
          <div className="mb-6">
            <SmartApplyFlow jobId={params.id as string} onComplete={handleFlowComplete} />
          </div>
        )}

        {/* Show Application Form if authenticated and profile complete */}
        {token && showApplicationForm && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">Apply for Position</CardTitle>
                  {job && (
                    <p className="text-blue-100 text-sm mt-1">
                      {job.positionTitle} - {job.cruiseLineName}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {/* Profile Completeness Indicator */}
              {completeness && completeness.isComplete && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Profile Complete</p>
                    <p className="text-xs text-green-700">
                      All required information and documents are uploaded
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Personal Summary
                  </label>
                  <Textarea
                    placeholder="Tell us about yourself, your experience, and why you're interested in this position..."
                    value={personalSummary}
                    onChange={(e) => setPersonalSummary(e.target.value)}
                    rows={8}
                    required
                    className="border-2 focus:border-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This will help us understand your background and motivation for this role.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all" 
                    isLoading={isLoading}
                    size="lg"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Submit Application
                  </Button>
                  <Link href={`/jobs/${params.id}`} className="flex-1">
                    <Button type="button" variant="outline" size="lg" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
