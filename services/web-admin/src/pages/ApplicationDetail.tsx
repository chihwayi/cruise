import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar,
  FileText,
  Brain,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

interface Application {
  id: string;
  personalSummary?: string;
  screeningStatus: string;
  screeningScore?: number;
  appliedAt: string;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    nationality?: string;
    dateOfBirth?: string;
  };
  jobPosting: {
    id: string;
    positionTitle: string;
    cruiseLineName: string;
    department?: string;
    requirements: string;
    specifications: string;
  };
}

interface ScreeningData {
  nlpEntities?: {
    skills?: string[];
    experience?: any[];
    education?: any[];
    languages?: string[];
    certifications?: string[];
  };
  semanticMatches?: string[];
  parsedSkills?: string[];
  parsedExperience?: any[];
  parsedEducation?: any[];
  confidence?: number;
}

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [screeningData, setScreeningData] = useState<ScreeningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [screening, setScreening] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await apiClient.get(`/applications/${id}`);
      setApplication(response.data.application);
      
      // Try to fetch NLP screening data from Elasticsearch (if available)
      // This would be enhanced to fetch from a dedicated endpoint
      if (response.data.application.screeningScore) {
        // In a real implementation, you'd fetch this from Elasticsearch
        // For now, we'll show what we can from the application data
      }
    } catch (error: any) {
      toast.error('Failed to load application details');
      navigate('/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleScreen = async () => {
    if (!id) return;
    
    setScreening(true);
    try {
      const response = await apiClient.post(`/cv-screening/application/${id}`);
      toast.success('Application screened successfully with NLP analysis');
      fetchApplication(); // Refresh to show new scores
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to screen application');
    } finally {
      setScreening(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!id) return;
    
    setUpdating(true);
    try {
      await apiClient.put(`/applications/${id}`, {
        screeningStatus: newStatus,
      });
      toast.success('Application status updated successfully');
      fetchApplication();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'screening':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
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

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Application not found</p>
        <Link to="/applications">
          <Button className="mt-4">Back to Applications</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/applications">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600 mt-1">
              {application.candidate.firstName} {application.candidate.lastName} - {application.jobPosting.positionTitle}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleScreen}
            isLoading={screening}
            disabled={screening}
          >
            <Brain className="h-4 w-4 mr-2" />
            Run NLP Screening
          </Button>
        </div>
      </div>

      {/* Screening Score & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Screening Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-5xl font-bold ${getScoreColor(application.screeningScore)}`}>
                  {application.screeningScore ?? 'N/A'}
                </p>
                {application.screeningScore && (
                  <p className="text-sm text-gray-600 mt-2">
                    {application.screeningScore >= 80 ? 'Excellent Match' : 
                     application.screeningScore >= 60 ? 'Good Match' : 
                     'Needs Review'}
                  </p>
                )}
              </div>
              {!application.screeningScore && (
                <div className="text-center">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Not screened yet</p>
                  <Button size="sm" className="mt-2" onClick={handleScreen}>
                    Screen Now
                  </Button>
                </div>
              )}
            </div>
            {application.screeningScore && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      application.screeningScore >= 80 ? 'bg-green-600' :
                      application.screeningScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${application.screeningScore}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.screeningStatus)}`}>
                  {application.screeningStatus}
                </span>
              </div>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant={application.screeningStatus === 'shortlisted' ? 'default' : 'outline'}
                  onClick={() => handleStatusUpdate('shortlisted')}
                  disabled={updating || application.screeningStatus === 'shortlisted'}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Shortlist
                </Button>
                <Button
                  size="sm"
                  variant={application.screeningStatus === 'hired' ? 'default' : 'outline'}
                  onClick={() => handleStatusUpdate('hired')}
                  disabled={updating || application.screeningStatus === 'hired'}
                  className="ml-2"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Hire
                </Button>
                <Button
                  size="sm"
                  variant={application.screeningStatus === 'rejected' ? 'default' : 'outline'}
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={updating || application.screeningStatus === 'rejected'}
                  className="ml-2 text-red-600 border-red-600"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidate Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Candidate Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Personal Details</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">{application.candidate.firstName} {application.candidate.lastName}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{application.candidate.email}</span>
                </div>
                {application.candidate.phoneNumber && (
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2">{application.candidate.phoneNumber}</span>
                  </div>
                )}
                {application.candidate.nationality && (
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium">Nationality:</span>
                    <span className="ml-2">{application.candidate.nationality}</span>
                  </div>
                )}
                {application.candidate.dateOfBirth && (
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Date of Birth:</span>
                    <span className="ml-2">{formatDate(application.candidate.dateOfBirth)}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Application Details</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Position:</span>
                  <span className="ml-2">{application.jobPosting.positionTitle}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium">Cruise Line:</span>
                  <span className="ml-2">{application.jobPosting.cruiseLineName}</span>
                </div>
                {application.jobPosting.department && (
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium">Department:</span>
                    <span className="ml-2">{application.jobPosting.department}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Applied:</span>
                  <span className="ml-2">{formatDate(application.appliedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Summary */}
      {application.personalSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Personal Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-line">{application.personalSummary}</p>
          </CardContent>
        </Card>
      )}

      {/* Job Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Job Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-line text-sm">{application.jobPosting.requirements}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Job Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-line text-sm">{application.jobPosting.specifications}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NLP Insights (if available) */}
      {screeningData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              NLP Analysis Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {screeningData.nlpEntities?.skills && screeningData.nlpEntities.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Extracted Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {screeningData.nlpEntities.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {screeningData.semanticMatches && screeningData.semanticMatches.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Semantic Matches:</h4>
                  <div className="flex flex-wrap gap-2">
                    {screeningData.semanticMatches.map((match, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {match}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {screeningData.confidence && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Confidence Level:</h4>
                  <p className="text-gray-700">{Math.round(screeningData.confidence * 100)}%</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

