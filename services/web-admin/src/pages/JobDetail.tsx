import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Clock, 
  Building2, 
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

interface JobPosting {
  id: string;
  positionTitle: string;
  cruiseLineName: string;
  department?: string;
  positionDescription: string;
  requirements: string;
  specifications: string;
  employmentType?: string;
  isActive: boolean;
  startDate?: string;
  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await apiClient.get(`/jobs/${id}`);
      setJob(response.data.jobPosting);
    } catch (error: any) {
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await apiClient.delete(`/jobs/${id}`);
      toast.success('Job posting deleted successfully');
      navigate('/jobs');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete job posting');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async () => {
    if (!job) return;

    try {
      await apiClient.put(`/jobs/${id}`, {
        ...job,
        isActive: !job.isActive,
      });
      toast.success(`Job posting ${!job.isActive ? 'activated' : 'deactivated'} successfully`);
      fetchJob(); // Refresh job data
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update job posting');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Job posting not found</p>
        <Link to="/jobs">
          <Button className="mt-4">Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/jobs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.positionTitle}</h1>
            <p className="text-gray-600 mt-1">{job.cruiseLineName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleToggleActive}
            className={job.isActive ? 'text-green-600 border-green-600' : 'text-gray-600'}
          >
            {job.isActive ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Active
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Inactive
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/jobs/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            isLoading={deleting}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Job Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {job.department && (
              <div className="flex items-center gap-2 text-gray-700">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium">{job.department}</p>
                </div>
              </div>
            )}
            {job.employmentType && (
              <div className="flex items-center gap-2 text-gray-700">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Employment Type</p>
                  <p className="font-medium">{job.employmentType}</p>
                </div>
              </div>
            )}
            {job.startDate && (
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="font-medium">{formatDate(job.startDate)}</p>
                </div>
              </div>
            )}
            {job.applicationDeadline && (
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Application Deadline</p>
                  <p className="font-medium">{formatDate(job.applicationDeadline)}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Cruise Line</p>
                <p className="font-medium">{job.cruiseLineName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <div className="h-5 w-5 flex items-center justify-center">
                <div className={`h-3 w-3 rounded-full ${job.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-medium">{job.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-6">
            {/* Job Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-line">{job.positionDescription}</p>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-line">{job.specifications}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t pt-6 text-sm text-gray-500">
            <p>Created: {formatDate(job.createdAt)}</p>
            <p>Last Updated: {formatDate(job.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

