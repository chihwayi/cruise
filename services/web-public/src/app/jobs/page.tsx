'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Briefcase, 
  ArrowRight, 
  Clock,
  Building2,
  Sparkles,
  TrendingUp,
  X,
  Ship
} from 'lucide-react';
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
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [cruiseLines, setCruiseLines] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      const uniqueCruiseLines = Array.from(
        new Set(jobs.map((job) => job.cruiseLineName).filter(Boolean))
      );
      const uniqueDepartments = Array.from(
        new Set(jobs.map((job) => job.department).filter(Boolean))
      );
      setCruiseLines(uniqueCruiseLines);
      setDepartments(uniqueDepartments);
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
    if (departmentFilter && job.department !== departmentFilter) return false;
    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setCruiseLineFilter('');
    setDepartmentFilter('');
    fetchJobs();
  };

  const activeFiltersCount = [cruiseLineFilter, departmentFilter, searchQuery].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Discover Your Next Adventure</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream
              <br />
              <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                Career at Sea
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Explore exciting opportunities with the world's leading cruise lines
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="relative -mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Card className="shadow-2xl border-0">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Main Search Bar */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search by position, cruise line, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg border-2 focus:border-primary-500"
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setShowFilters(!showFilters)}
                    className="relative"
                  >
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                  <Button type="submit" size="lg" className="h-14 px-8">
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Expandable Filters */}
              {showFilters && (
                <div className="pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cruise Line
                      </label>
                      <select
                        value={cruiseLineFilter}
                        onChange={(e) => {
                          setCruiseLineFilter(e.target.value);
                          fetchJobs();
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                      >
                        <option value="">All Cruise Lines</option>
                        {cruiseLines.map((line) => (
                          <option key={line} value={line}>
                            {line}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <select
                        value={departmentFilter}
                        onChange={(e) => {
                          setDepartmentFilter(e.target.value);
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                      >
                        <option value="">All Departments</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {activeFiltersCount > 0 && (
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${filteredJobs.length} Job${filteredJobs.length !== 1 ? 's' : ''} Found`}
            </h2>
            {!loading && filteredJobs.length > 0 && (
              <p className="text-gray-600 mt-1">Discover opportunities that match your skills</p>
            )}
          </div>
          {!loading && filteredJobs.length > 0 && (
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>Sorted by relevance</span>
            </div>
          )}
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job, index) => {
              // Generate gradient based on index for variety
              const gradients = [
                'from-blue-500 via-cyan-500 to-blue-600',
                'from-purple-500 via-pink-500 to-purple-600',
                'from-green-500 via-emerald-500 to-green-600',
                'from-orange-500 via-red-500 to-orange-600',
                'from-indigo-500 via-blue-500 to-indigo-600',
                'from-teal-500 via-cyan-500 to-teal-600',
              ];
              const gradient = gradients[index % gradients.length];
              
              // Get department icon/color
              const getDepartmentStyle = (dept?: string) => {
                const deptLower = dept?.toLowerCase() || '';
                if (deptLower.includes('deck')) return { bg: 'bg-blue-100', text: 'text-blue-700', icon: '⚓' };
                if (deptLower.includes('culinary') || deptLower.includes('dining')) return { bg: 'bg-orange-100', text: 'text-orange-700', icon: '👨‍🍳' };
                if (deptLower.includes('engineer')) return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '⚙️' };
                if (deptLower.includes('entertainment')) return { bg: 'bg-purple-100', text: 'text-purple-700', icon: '🎭' };
                if (deptLower.includes('guest') || deptLower.includes('service')) return { bg: 'bg-green-100', text: 'text-green-700', icon: '✨' };
                if (deptLower.includes('spa') || deptLower.includes('wellness')) return { bg: 'bg-pink-100', text: 'text-pink-700', icon: '💆' };
                if (deptLower.includes('housekeeping')) return { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: '🧹' };
                if (deptLower.includes('beverage') || deptLower.includes('bar')) return { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🍸' };
                if (deptLower.includes('youth')) return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '🎈' };
                return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '💼' };
              };
              const deptStyle = getDepartmentStyle(job.department);

              return (
                <Card 
                  key={job.id} 
                  className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white overflow-hidden"
                >
                  {/* Image/Header Section */}
                  <div className={`relative h-56 bg-gradient-to-br ${gradient} overflow-hidden`}>
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0v-2h20V2H0V0h22v20h-2zm-2 0v-2H0v2h18zm-2 0v-2H0v2h16zm-2 0v-2H0v2h14zm-2 0v-2H0v2h12zm-2 0v-2H0v2h10zm-2 0v-2H0v2h8zm-2 0v-2H0v2h6zm-2 0v-2H0v2h4zm-2 0v-2H0v2h2zm-2 0v-2H0v2h0z'/%3E%3C/g%3E%3C/svg%3E")`,
                      }}></div>
                    </div>
                    
                    {/* Cruise Line Name Badge */}
                    <div className="absolute top-4 left-4 right-4">
                      <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                        <Ship className="h-4 w-4 text-primary-600" />
                        <span className="text-xs font-bold text-gray-900">{job.cruiseLineName}</span>
                      </div>
                    </div>

                    {/* Position Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                      <h3 className="text-2xl font-bold text-white mb-1 line-clamp-2 group-hover:text-blue-200 transition-colors">
                        {job.positionTitle}
                      </h3>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Department and Employment Type */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 ${deptStyle.bg} ${deptStyle.text} rounded-lg text-xs font-semibold`}>
                        <span className="text-base">{deptStyle.icon}</span>
                        <span>{job.department || 'General'}</span>
                      </span>
                      {job.employmentType && (
                        <span className="text-xs text-gray-500 font-medium">
                          {job.employmentType}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {job.positionDescription}
                    </p>

                    {/* Job Details */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.applicationDeadline && (
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                      <Link href={`/jobs/${job.id}`} className="flex-1">
                        <Button variant="outline" className="w-full group-hover:border-primary-500 group-hover:text-primary-600 transition-colors">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link href={`/jobs/${job.id}/apply`} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
                          Apply Now
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-2 border-dashed border-gray-300 bg-white">
            <CardContent className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <Briefcase className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any jobs matching your criteria. Try adjusting your search or filters.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={clearFilters} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
                <Button onClick={fetchJobs}>
                  <Search className="h-4 w-4 mr-2" />
                  Refresh Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
