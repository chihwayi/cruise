import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Filter,
  Search,
  TrendingUp,
  FileText,
  MessageSquare,
  Eye
} from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

interface Application {
  id: string;
  status?: string;
  screeningStatus?: string;
  screeningScore?: number;
  personalSummary?: string;
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  jobPosting?: {
    id: string;
    title: string;
    department: string;
    location: string;
    salary: string;
    requirements?: string;
  };
}

type StatusFilter = 'all' | 'pending' | 'screening' | 'shortlisted' | 'interview_scheduled' | 'hired' | 'rejected';

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter]);

  const fetchApplications = async () => {
    try {
      const response = await apiClient.get('/applications/my');
      setApplications(response.data.applications || []);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => 
        (app.screeningStatus || app.status) === statusFilter
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.jobPosting?.title?.toLowerCase().includes(query) ||
        app.jobPosting?.department?.toLowerCase().includes(query) ||
        app.jobPosting?.location?.toLowerCase().includes(query) ||
        app.personalSummary?.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.appliedAt || 0).getTime();
      const dateB = new Date(b.createdAt || b.appliedAt || 0).getTime();
      return dateB - dateA;
    });

    setFilteredApplications(filtered);
  };

  const getStatusConfig = (status: string) => {
    const statusLower = status?.toLowerCase() || 'pending';
    const configs: Record<string, { color: string; bgColor: string; icon: React.ReactNode; label: string }> = {
      hired: {
        color: 'text-green-800',
        bgColor: 'bg-green-100',
        icon: <CheckCircle className="h-4 w-4" />,
        label: 'Hired',
      },
      shortlisted: {
        color: 'text-blue-800',
        bgColor: 'bg-blue-100',
        icon: <TrendingUp className="h-4 w-4" />,
        label: 'Shortlisted',
      },
      interview_scheduled: {
        color: 'text-purple-800',
        bgColor: 'bg-purple-100',
        icon: <Calendar className="h-4 w-4" />,
        label: 'Interview Scheduled',
      },
      screening: {
        color: 'text-yellow-800',
        bgColor: 'bg-yellow-100',
        icon: <Clock className="h-4 w-4" />,
        label: 'Screening',
      },
      rejected: {
        color: 'text-red-800',
        bgColor: 'bg-red-100',
        icon: <XCircle className="h-4 w-4" />,
        label: 'Rejected',
      },
      pending: {
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        icon: <Clock className="h-4 w-4" />,
        label: 'Pending',
      },
    };
    return configs[statusLower] || configs.pending;
  };

  const getStatusCounts = () => {
    const counts = {
      all: applications.length,
      pending: 0,
      screening: 0,
      shortlisted: 0,
      interview_scheduled: 0,
      hired: 0,
      rejected: 0,
    };

    applications.forEach(app => {
      const status = (app.screeningStatus || app.status || 'pending').toLowerCase();
      if (status in counts) {
        counts[status as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-1">Track and manage your job applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-900">{statusCounts.all}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Hired</p>
                <p className="text-2xl font-bold text-green-900">{statusCounts.hired}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Shortlisted</p>
                <p className="text-2xl font-bold text-purple-900">{statusCounts.shortlisted}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">In Progress</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {statusCounts.screening + statusCounts.interview_scheduled}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
          {(['all', 'pending', 'screening', 'shortlisted', 'interview_scheduled', 'hired', 'rejected'] as StatusFilter[]).map((status) => {
            const config = getStatusConfig(status);
            const count = statusCounts[status] || 0;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  statusFilter === status
                    ? `${config.bgColor} ${config.color} shadow-md scale-105`
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  {config.icon}
                  <span className="capitalize">{config.label}</span>
                  {count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      statusFilter === status ? 'bg-white bg-opacity-50' : 'bg-gray-100'
                    }`}>
                      {count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredApplications.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="pt-6 text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'all' ? 'No applications found' : 'No applications yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start applying to jobs to see your applications here'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => {
            const status = application.screeningStatus || application.status || 'pending';
            const config = getStatusConfig(status);
            const isSelected = selectedApplication?.id === application.id;

            return (
              <Card 
                key={application.id} 
                className={`transition-all duration-300 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`h-14 w-14 rounded-xl ${config.bgColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                            <Briefcase className="h-7 w-7 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {application.jobPosting?.title || 'Unknown Job'}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 ${config.bgColor} ${config.color}`}>
                                  {config.icon}
                                  <span>{config.label}</span>
                                </span>
                              </div>
                            </div>
                            
                            {application.jobPosting && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                  <Briefcase className="h-4 w-4 mr-2 text-primary-600 flex-shrink-0" />
                                  <span className="truncate">{application.jobPosting.department}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                  <MapPin className="h-4 w-4 mr-2 text-primary-600 flex-shrink-0" />
                                  <span className="truncate">{application.jobPosting.location}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                  <DollarSign className="h-4 w-4 mr-2 text-primary-600 flex-shrink-0" />
                                  <span className="truncate">{application.jobPosting.salary}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                  <Calendar className="h-4 w-4 mr-2 text-primary-600 flex-shrink-0" />
                                  <span className="truncate">
                                    {formatDate(application.createdAt || application.appliedAt)}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Screening Score */}
                            {application.screeningScore !== undefined && application.screeningScore !== null && (
                              <div className="mt-4 flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                      application.screeningScore >= 80
                                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                                        : application.screeningScore >= 60
                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                        : 'bg-gradient-to-r from-red-500 to-red-600'
                                    }`}
                                    style={{ width: `${application.screeningScore}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-gray-700 min-w-[3rem] text-right">
                                  {application.screeningScore}%
                                </span>
                              </div>
                            )}

                            {/* Personal Summary Preview */}
                            {application.personalSummary && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-sm text-gray-700 line-clamp-2">
                                  {application.personalSummary}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-stretch gap-2 lg:w-48">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApplication(isSelected ? null : application)}
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {isSelected ? 'Hide Details' : 'View Details'}
                      </Button>
                      {application.jobPosting && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => window.open(`/jobs/${application.jobPosting?.id}`, '_blank')}
                          className="w-full"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Job
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isSelected && (
                    <div className="mt-6 pt-6 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2 text-primary-600" />
                            Application Summary
                          </h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                            {application.personalSummary || 'No summary provided'}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary-600" />
                            Timeline
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <div className="h-2 w-2 rounded-full bg-primary-600 mt-1.5"></div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Applied</p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(application.createdAt || application.appliedAt)}
                                </p>
                              </div>
                            </div>
                            {application.updatedAt && application.updatedAt !== application.createdAt && (
                              <div className="flex items-start space-x-3">
                                <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5"></div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Last Updated</p>
                                  <p className="text-xs text-gray-500">
                                    {formatDate(application.updatedAt)}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
