'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Upload, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [personalSummary, setPersonalSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingJob, setLoadingJob] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to apply');
      router.push('/login');
      return;
    }

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.post('/applications', {
        jobPostingId: params.id,
        personalSummary,
      });
      toast.success('Application submitted successfully!');
      router.push('/candidate/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/jobs/${params.id}`} className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Job Details
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Apply for Position</CardTitle>
            {job && (
              <p className="text-primary-600 font-semibold">
                {job.positionTitle} - {job.cruiseLineName}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Textarea
                label="Personal Summary"
                placeholder="Tell us about yourself, your experience, and why you're interested in this position..."
                value={personalSummary}
                onChange={(e) => setPersonalSummary(e.target.value)}
                rows={8}
                required
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" className="flex-1" isLoading={isLoading}>
                  Submit Application
                </Button>
                <Link href={`/jobs/${params.id}`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

