import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, Save, X } from 'lucide-react';
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
}

export default function EditJob() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<JobPosting>({
    id: '',
    positionTitle: '',
    cruiseLineName: '',
    department: '',
    positionDescription: '',
    requirements: '',
    specifications: '',
    employmentType: '',
    isActive: true,
    startDate: '',
    applicationDeadline: '',
  });

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await apiClient.get(`/jobs/${id}`);
      const job = response.data.jobPosting;
      setFormData({
        id: job.id,
        positionTitle: job.positionTitle || '',
        cruiseLineName: job.cruiseLineName || '',
        department: job.department || '',
        positionDescription: job.positionDescription || '',
        requirements: job.requirements || '',
        specifications: job.specifications || '',
        employmentType: job.employmentType || '',
        isActive: job.isActive ?? true,
        startDate: job.startDate ? new Date(job.startDate).toISOString().split('T')[0] : '',
        applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
      });
    } catch (error: any) {
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await apiClient.put(`/jobs/${id}`, {
        positionTitle: formData.positionTitle,
        cruiseLineName: formData.cruiseLineName,
        department: formData.department || undefined,
        positionDescription: formData.positionDescription,
        requirements: formData.requirements,
        specifications: formData.specifications,
        employmentType: formData.employmentType || undefined,
        isActive: formData.isActive,
        startDate: formData.startDate || undefined,
        applicationDeadline: formData.applicationDeadline || undefined,
      });
      toast.success('Job posting updated successfully');
      navigate(`/jobs/${id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update job posting');
    } finally {
      setSaving(false);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to={`/jobs/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Job Posting</h1>
            <p className="text-gray-600 mt-1">Update job details and requirements</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Position Title *"
                  name="positionTitle"
                  value={formData.positionTitle}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Deck Officer"
                />
              </div>
              <div>
                <Input
                  label="Cruise Line Name *"
                  name="cruiseLineName"
                  value={formData.cruiseLineName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Royal Caribbean International"
                />
              </div>
              <div>
                <Input
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g., Deck, Engine, Hotel"
                />
              </div>
              <div>
                <Input
                  label="Employment Type"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  placeholder="e.g., Full-time, Contract"
                />
              </div>
              <div>
                <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  label="Application Deadline"
                  name="applicationDeadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Job is Active (visible to candidates)
              </label>
            </div>

            {/* Description */}
            <div>
              <Textarea
                label="Job Description *"
                name="positionDescription"
                value={formData.positionDescription}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Detailed description of the position, responsibilities, and duties..."
              />
            </div>

            {/* Requirements */}
            <div>
              <Textarea
                label="Requirements *"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Required qualifications, certifications, experience, skills..."
              />
            </div>

            {/* Specifications */}
            <div>
              <Textarea
                label="Specifications *"
                name="specifications"
                value={formData.specifications}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Additional specifications, working conditions, contract details..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <Link to={`/jobs/${id}`}>
                <Button type="button" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </Link>
              <Button type="submit" isLoading={saving}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

