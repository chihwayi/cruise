'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Search, Ship, Briefcase, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api';
import { JobPosting } from '@/shared/types';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await apiClient.get('/jobs?page=1&limit=6');
      setJobs(response.data.jobPostings || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-ocean-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Your Dream Career
              <br />
              <span className="text-ocean-300">Awaits at Sea</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of professional seafarers working on the world's most luxurious cruise ships
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs by position, cruise line, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <Button type="submit" size="lg" className="whitespace-nowrap">
                  Search Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/jobs">
                <Button variant="secondary" size="lg">
                  Browse All Jobs
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="bg-white/10 text-white border-white hover:bg-white/20">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Cruise Recruitment?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the world while building a rewarding career at sea
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Ship,
                title: 'Global Opportunities',
                description: 'Travel to exotic destinations while you work',
              },
              {
                icon: Briefcase,
                title: 'Career Growth',
                description: 'Advance your career with professional development',
              },
              {
                icon: Users,
                title: 'Diverse Roles',
                description: 'From deck officers to hospitality professionals',
              },
              {
                icon: TrendingUp,
                title: 'Competitive Pay',
                description: 'Attractive salary packages and benefits',
              },
            ].map((feature, index) => (
              <Card key={index} hover className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Featured Job Opportunities
              </h2>
              <p className="text-gray-600">Explore our latest openings</p>
            </div>
            <Link href="/jobs">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} hover>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{job.positionTitle}</CardTitle>
                    </div>
                    <CardDescription className="text-primary-600 font-semibold">
                      {job.cruiseLineName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {job.positionDescription.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {job.department || 'General'}
                      </span>
                      <Link href={`/jobs/${job.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
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
                  No jobs available at the moment
                </h3>
                <p className="text-gray-600">
                  Check back soon for new opportunities!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of professional seafarers and discover your next adventure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Create Your Profile
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Ship className="h-6 w-6 text-primary-400" />
                <span className="text-lg font-bold text-white">CruiseRecruit</span>
              </div>
              <p className="text-sm">
                Your gateway to exciting career opportunities in the cruise industry.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Candidates</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/jobs" className="hover:text-primary-400 transition-colors">Browse Jobs</Link></li>
                <li><Link href="/register" className="hover:text-primary-400 transition-colors">Create Account</Link></li>
                <li><Link href="/login" className="hover:text-primary-400 transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
                <li><Link href="/help" className="hover:text-primary-400 transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 CruiseRecruit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

