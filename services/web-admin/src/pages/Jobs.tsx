import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Briefcase, MapPin, DollarSign, Calendar, Plus, Eye, Edit } from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface JobPosting {
  id: string;
  positionTitle: string;
  cruiseLineName: string;
  department: string;
  positionDescription: string;
  requirements: string;
  specifications: string;
  employmentType: string;
  isActive: boolean;
  startDate?: string;
  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await apiClient.get('/jobs?limit=100'); // Get all jobs for admin
      // API returns { jobPostings: [...], pagination: {...} }
      const jobPostings = response.data?.jobPostings || response.data || [];
      setJobs(Array.isArray(jobPostings) ? jobPostings : []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load job postings');
      setJobs([]); // Ensure jobs is always an array
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = Array.isArray(jobs) ? jobs.filter(
    (job) =>
      (job.positionTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (job.department?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (job.cruiseLineName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ) : [];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600 mt-1">Manage all job openings</p>
        </div>
        <Button onClick={() => navigate('/jobs/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Job
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by title, department, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No job postings found</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} hover>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{job.positionTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1">{job.cruiseLineName}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{job.department || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{job.cruiseLineName || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{job.employmentType || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{job.applicationDeadline ? `Deadline: ${formatDate(job.applicationDeadline)}` : 'No deadline'}</span>
                      </div>
                    </div>
                    {job.positionDescription && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                        {job.positionDescription.substring(0, 150)}...
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 sm:flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/jobs/${job.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

