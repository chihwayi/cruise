import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, FileText, User, Briefcase, Calendar, Filter, Eye, Brain, Sparkles, CheckSquare, TrendingUp } from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: string;
  screeningStatus: string;
  screeningScore?: number;
  appliedAt: string;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  jobPosting: {
    id: string;
    positionTitle: string;
    department?: string;
    cruiseLineName: string;
  };
}

export default function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  const [bulkScreening, setBulkScreening] = useState(false);
  const [skillSearchTerm, setSkillSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await apiClient.get('/applications?limit=100');
      setApplications(response.data.applications || response.data || []);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkScreen = async () => {
    if (selectedApplications.size === 0) {
      toast.error('Please select at least one application');
      return;
    }

    setBulkScreening(true);
    try {
      const response = await apiClient.post('/cv-screening/bulk', {
        applicationIds: Array.from(selectedApplications),
      });
      toast.success(`Successfully screened ${response.data.successful} of ${response.data.total} applications`);
      setSelectedApplications(new Set());
      fetchApplications();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to screen applications');
    } finally {
      setBulkScreening(false);
    }
  };

  const handleSearchBySkills = async () => {
    if (!skillSearchTerm.trim()) {
      toast.error('Please enter skills to search');
      return;
    }

    try {
      const response = await apiClient.get(`/cv-screening/search?query=${encodeURIComponent(skillSearchTerm)}`);
      toast.success(`Found ${response.data.total} candidates matching your skills`);
      // In a real implementation, you'd navigate to a search results page
      // For now, we'll just show a toast
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Search failed');
    }
  };

  const toggleSelection = (applicationId: string) => {
    const newSelection = new Set(selectedApplications);
    if (newSelection.has(applicationId)) {
      newSelection.delete(applicationId);
    } else {
      newSelection.add(applicationId);
    }
    setSelectedApplications(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedApplications.size === filteredApplications.length) {
      setSelectedApplications(new Set());
    } else {
      setSelectedApplications(new Set(filteredApplications.map(app => app.id)));
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobPosting.positionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.screeningStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'screening', label: 'Screening' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-600 mt-1">Review and manage all job applications</p>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by candidate name, email, or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* NLP Skill Search */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-gray-700">NLP Skill Search:</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Input
                  type="text"
                  placeholder="Search candidates by skills (e.g., 'navigation, safety, engineering')..."
                  value={skillSearchTerm}
                  onChange={(e) => setSkillSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearchBySkills} variant="outline">
                  <Brain className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedApplications.size > 0 && (
              <div className="border-t pt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedApplications.size} application(s) selected
                </span>
                <Button
                  onClick={handleBulkScreen}
                  isLoading={bulkScreening}
                  disabled={bulkScreening}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Bulk NLP Screen ({selectedApplications.size})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applications found</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Showing {filteredApplications.length} application(s)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectAll}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                {selectedApplications.size === filteredApplications.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            {filteredApplications.map((application) => (
              <Card key={application.id} hover>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedApplications.has(application.id)}
                        onChange={() => toggleSelection(application.id)}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.candidate.firstName} {application.candidate.lastName}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {application.screeningScore !== undefined && (
                              <div className={`flex items-center space-x-1 ${getScoreColor(application.screeningScore)}`}>
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm font-medium">{application.screeningScore}%</span>
                              </div>
                            )}
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                application.screeningStatus === 'hired'
                                  ? 'bg-green-100 text-green-800'
                                  : application.screeningStatus === 'shortlisted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : application.screeningStatus === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {application.screeningStatus}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{application.jobPosting.positionTitle} - {application.jobPosting.cruiseLineName}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{application.candidate.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Applied {formatDate(application.appliedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:flex-shrink-0">
                      {!application.screeningScore && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await apiClient.post(`/cv-screening/application/${application.id}`);
                              toast.success('Application screened successfully');
                              fetchApplications();
                            } catch (error: any) {
                              toast.error(error.response?.data?.error || 'Failed to screen application');
                            }
                          }}
                        >
                          <Brain className="h-4 w-4 mr-2" />
                          Screen
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/applications/${application.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

