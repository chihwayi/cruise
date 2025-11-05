'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Briefcase, MapPin, Calendar, Clock, Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api';
import { JobPosting } from '@/shared/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const fetchJob = async () => {
    try {
      const response = await apiClient.get(`/jobs/${params.id}`);
      setJob(response.data.jobPosting);
    } catch (error: any) {
      toast.error('Failed to load job details.');
      router.push('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to apply for this job');
      router.push('/login');
      return;
    }
    router.push(`/jobs/${params.id}/apply`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
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

  if (!job) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/jobs" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl mb-2">{job.positionTitle}</CardTitle>
                <p className="text-xl text-primary-600 font-semibold">{job.cruiseLineName}</p>
              </div>
              <Button size="lg" onClick={handleApply}>
                Apply Now
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {job.department && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="h-5 w-5" />
                  <span>{job.department}</span>
                </div>
              )}
              {job.employmentType && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="h-5 w-5" />
                  <span>{job.employmentType}</span>
                </div>
              )}
              {job.startDate && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>Start: {formatDate(job.startDate)}</span>
                </div>
              )}
              {job.applicationDeadline && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-5 w-5" />
                  <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.positionDescription}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Requirements</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Specifications</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.specifications}</p>
            </div>

            <div className="pt-6 border-t">
              <Button size="lg" className="w-full sm:w-auto" onClick={handleApply}>
                Apply for This Position
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

