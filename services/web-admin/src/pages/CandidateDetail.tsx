import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Flag,
  FileText,
  Briefcase,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Download
} from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  nationality?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  physicalAddress?: string;
  city?: string;
  country?: string;
  employmentNumber?: string;
  isActive: boolean;
  createdAt: string;
}

interface Document {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  expiryDate?: string;
  isVerified: boolean;
  uploadedAt: string;
}

interface Application {
  id: string;
  screeningStatus: string;
  screeningScore?: number;
  appliedAt: string;
  jobPosting: {
    id: string;
    positionTitle: string;
    cruiseLineName: string;
  };
}

export default function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Candidate>>({});

  useEffect(() => {
    if (id) {
      fetchCandidateData();
    }
  }, [id]);

  const fetchCandidateData = async () => {
    try {
      const [candidateRes, documentsRes, applicationsRes] = await Promise.all([
        apiClient.get(`/candidates/${id}`),
        apiClient.get(`/documents/candidate/${id}`),
        apiClient.get(`/applications?candidateId=${id}`),
      ]);

      setCandidate(candidateRes.data.candidate);
      setDocuments(documentsRes.data.documents || []);
      setApplications(applicationsRes.data.applications || []);
      setFormData(candidateRes.data.candidate);
    } catch (error: any) {
      toast.error('Failed to load candidate details');
      navigate('/candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!id) return;
    
    setSaving(true);
    try {
      await apiClient.put(`/candidates/${id}`, formData);
      toast.success('Candidate updated successfully');
      setEditing(false);
      fetchCandidateData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update candidate');
    } finally {
      setSaving(false);
    }
  };

  const handleAssignEmploymentNumber = async () => {
    if (!id) return;
    const employmentNumber = prompt('Enter employment number:');
    if (!employmentNumber) return;

    try {
      await apiClient.post(`/candidates/${id}/employment-number`, { employmentNumber });
      toast.success('Employment number assigned successfully');
      fetchCandidateData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to assign employment number');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Candidate not found</p>
        <Link to="/candidates">
          <Button className="mt-4">Back to Candidates</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/candidates">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {candidate.firstName} {candidate.lastName}
            </h1>
            <p className="text-gray-600 mt-1">{candidate.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {!candidate.employmentNumber && (
                <Button variant="outline" onClick={handleAssignEmploymentNumber}>
                  Assign Employment #
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => { setEditing(false); setFormData(candidate); }}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} isLoading={saving}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              {editing ? (
                <Input
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-gray-900">{candidate.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              {editing ? (
                <Input
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-gray-900">{candidate.lastName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </label>
              <p className="text-gray-900">{candidate.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Phone
              </label>
              {editing ? (
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-gray-900">{candidate.phoneNumber || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Flag className="h-4 w-4 mr-1" />
                Nationality
              </label>
              {editing ? (
                <Input
                  name="nationality"
                  value={formData.nationality || ''}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-gray-900">{candidate.nationality || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Date of Birth
              </label>
              {editing ? (
                <Input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-gray-900">{candidate.dateOfBirth ? formatDate(candidate.dateOfBirth) : 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              {editing ? (
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-gray-900">{candidate.gender || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
              {editing ? (
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select...</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              ) : (
                <p className="text-gray-900">{candidate.maritalStatus || 'N/A'}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Address
              </label>
              {editing ? (
                <Input
                  name="physicalAddress"
                  value={formData.physicalAddress || ''}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-gray-900">{candidate.physicalAddress || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              {editing ? (
                <Input
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-gray-900">{candidate.city || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              {editing ? (
                <Input
                  name="country"
                  value={formData.country || ''}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-gray-900">{candidate.country || 'N/A'}</p>
              )}
            </div>
            {candidate.employmentNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Number</label>
                <p className="text-gray-900 font-mono">{candidate.employmentNumber}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                candidate.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {candidate.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Documents ({documents.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No documents uploaded</p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{doc.fileName}</p>
                        {doc.isVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="capitalize">{doc.documentType.replace(/_/g, ' ')}</span>
                        {doc.expiryDate && (
                          <span>Expires: {formatDate(doc.expiryDate)}</span>
                        )}
                        <span>Uploaded: {formatDate(doc.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(doc.fileUrl, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Applications ({applications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No applications submitted</p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-gray-900">{app.jobPosting.positionTitle}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.screeningStatus === 'hired' ? 'bg-green-100 text-green-800' :
                        app.screeningStatus === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                        app.screeningStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.screeningStatus}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{app.jobPosting.cruiseLineName}</span>
                      {app.screeningScore && (
                        <span className="font-medium">Score: {app.screeningScore}%</span>
                      )}
                      <span>Applied: {formatDate(app.appliedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

