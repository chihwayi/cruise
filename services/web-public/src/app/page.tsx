'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Search, 
  Ship, 
  Briefcase, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle,
  Globe,
  Award,
  Heart,
  Sparkles,
  Zap
} from 'lucide-react';
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
    } else {
      window.location.href = '/jobs';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-in fade-in slide-in-from-top-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Join Thousands of Seafarers Worldwide</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4">
              Your Dream Career
              <br />
              <span className="bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Awaits at Sea
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6">
              Join the world's most luxurious cruise ships and experience a career like no other
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-8">
              <div className="flex flex-col sm:flex-row gap-3 shadow-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs by position, cruise line, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-5 py-5 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="px-8 py-5 text-lg bg-white text-primary-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all"
                >
                  Search Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-10">
              <Link href="/jobs">
                <Button variant="secondary" size="lg" className="px-8 py-5 text-lg shadow-lg hover:shadow-xl transition-all">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Browse All Jobs
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-5 text-lg bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Cruise Recruitment?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the world while building a rewarding career at sea
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: 'Global Opportunities',
                description: 'Travel to exotic destinations while you work',
                gradient: 'from-blue-500 to-cyan-500',
                bgGradient: 'from-blue-50 to-cyan-50',
              },
              {
                icon: TrendingUp,
                title: 'Career Growth',
                description: 'Advance your career with professional development',
                gradient: 'from-purple-500 to-pink-500',
                bgGradient: 'from-purple-50 to-pink-50',
              },
              {
                icon: Users,
                title: 'Diverse Roles',
                description: 'From deck officers to hospitality professionals',
                gradient: 'from-green-500 to-emerald-500',
                bgGradient: 'from-green-50 to-emerald-50',
              },
              {
                icon: Award,
                title: 'Competitive Pay',
                description: 'Attractive salary packages and benefits',
                gradient: 'from-orange-500 to-red-500',
                bgGradient: 'from-orange-50 to-red-50',
              },
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group bg-white"
              >
                <CardContent className="pt-8 pb-8 text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
                Featured Job Opportunities
              </h2>
              <p className="text-xl text-gray-600">Explore our latest openings</p>
            </div>
            <Link href="/jobs" className="mt-4 sm:mt-0">
              <Button variant="outline" size="lg" className="group">
                View All
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => {
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
                    <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
                      {/* Pattern Overlay */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0v-2h20V2H0V0h22v20h-2zm-2 0v-2H0v2h18zm-2 0v-2H0v2h16zm-2 0v-2H0v2h14zm-2 0v-2H0v2h12zm-2 0v-2H0v2h10zm-2 0v-2H0v2h8zm-2 0v-2H0v2h6zm-2 0v-2H0v2h4zm-2 0v-2H0v2h2zm-2 0v-2H0v2h0z'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}></div>
                      </div>
                      
                      {/* Cruise Line Name Badge */}
                      <div className="absolute top-4 left-4 right-4">
                        <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <Ship className="h-4 w-4 text-primary-600" />
                          <span className="text-xs font-bold text-gray-900">{job.cruiseLineName}</span>
                        </div>
                      </div>

                      {/* Position Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-blue-200 transition-colors">
                          {job.positionTitle}
                        </h3>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Department Badge */}
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
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {job.positionDescription}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                        <Link href={`/jobs/${job.id}`}>
                          <Button 
                            variant="outline" 
                            className="w-full group-hover:border-primary-500 group-hover:text-primary-600 transition-colors"
                          >
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                        <Link href={`/jobs/${job.id}/apply`}>
                          <Button className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all">
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
                  No jobs available at the moment
                </h3>
                <p className="text-gray-600 mb-6">
                  Check back soon for new opportunities!
                </p>
                <Button onClick={fetchJobs}>
                  <Search className="h-4 w-4 mr-2" />
                  Refresh Jobs
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10K+', label: 'Active Seafarers', icon: Users },
              { number: '500+', label: 'Job Openings', icon: Briefcase },
              { number: '50+', label: 'Cruise Lines', icon: Ship },
              { number: '98%', label: 'Satisfaction Rate', icon: Heart },
            ].map((stat, index) => (
              <div key={index} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-indigo-50"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 text-white mb-6 shadow-lg">
            <Ship className="h-10 w-10" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join our community of professional seafarers and discover your next adventure at sea
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8 py-5 text-lg bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
                <CheckCircle className="mr-2 h-5 w-5" />
                Create Your Profile
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="px-8 py-5 text-lg border-2 shadow-lg hover:shadow-xl transition-all">
                <Briefcase className="mr-2 h-5 w-5" />
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
                  <Ship className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CruiseRecruit</span>
              </div>
              <p className="text-sm leading-relaxed">
                Your gateway to exciting career opportunities in the cruise industry.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Candidates</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/jobs" className="hover:text-primary-400 transition-colors">Browse Jobs</Link></li>
                <li><Link href="/register" className="hover:text-primary-400 transition-colors">Create Account</Link></li>
                <li><Link href="/login" className="hover:text-primary-400 transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
                <li><Link href="/help" className="hover:text-primary-400 transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} CruiseRecruit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
