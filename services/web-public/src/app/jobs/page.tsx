'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Filter, MapPin, Calendar, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api';
import { JobPosting } from '@/shared/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cruiseLineFilter, setCruiseLineFilter] = useState('');
  const [cruiseLines, setCruiseLines] = useState<string[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      const uniqueCruiseLines = Array.from(
        new Set(jobs.map((job) => job.cruiseLineName))
      );
      setCruiseLines(uniqueCruiseLines);
    }
  }, [jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (cruiseLineFilter) params.append('cruiseLineName', cruiseLineFilter);
      
      const response = await apiClient.get(`/jobs?${params.toString()}`);
      setJobs(response.data.jobPostings || []);
    } catch (error: any) {
      toast.error('Failed to load jobs. Please try again.');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const filteredJobs = jobs.filter((job) => {
    if (cruiseLineFilter && job.cruiseLineName !== cruiseLineFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Job Opportunities
          </h1>
          <p className="text-gray-600">
            Discover exciting career opportunities in the cruise industry
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search jobs by position, cruise line, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="sm:w-48">
                    <select
                      value={cruiseLineFilter}
                      onChange={(e) => {
                        setCruiseLineFilter(e.target.value);
                        fetchJobs();
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All Cruise Lines</option>
                      {cruiseLines.map((line) => (
                        <option key={line} value={line}>
                          {line}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit">Search</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <div className="animate-pulse p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} hover>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {job.positionTitle}
                          </h3>
                          <p className="text-primary-600 font-medium mb-2">
                            {job.cruiseLineName}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {job.positionDescription}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {job.department && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{job.department}</span>
                          </div>
                        )}
                        {job.employmentType && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{job.employmentType}</span>
                          </div>
                        )}
                        {job.applicationDeadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <Link href={`/jobs/${job.id}`}>
                        <Button>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/jobs/${job.id}/apply`}>
                        <Button variant="primary">
                          Apply Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or check back later.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setCruiseLineFilter('');
                fetchJobs();
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

