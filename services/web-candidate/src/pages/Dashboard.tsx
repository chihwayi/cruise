import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Briefcase, FileText, FileCheck, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface DashboardData {
  readiness: {
    percentage: number;
    missingDocuments: string[];
    expiringDocuments: number;
  };
  applications: {
    total: number;
    pending: number;
    shortlisted: number;
    rejected: number;
  };
  contracts: {
    total: number;
    active: number;
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [readinessRes, applicationsRes, contractsRes] = await Promise.all([
        apiClient.get('/crew/readiness/my'),
        apiClient.get('/applications/my'),
        apiClient.get('/contracts/my'),
      ]);

      const applications = applicationsRes.data.applications || [];
      const contracts = contractsRes.data.contracts || [];

      setData({
        readiness: readinessRes.data,
        applications: {
          total: applications.length,
          pending: applications.filter((a: any) => (a.screeningStatus || a.status) === 'pending').length,
          shortlisted: applications.filter((a: any) => (a.screeningStatus || a.status) === 'shortlisted').length,
          rejected: applications.filter((a: any) => (a.screeningStatus || a.status) === 'rejected').length,
        },
        contracts: {
          total: contracts.length,
          active: contracts.filter((c: any) => c.status === 'active').length,
        },
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const getReadinessColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getReadinessIcon = (percentage: number) => {
    if (percentage >= 90) return <CheckCircle className="h-6 w-6" />;
    if (percentage >= 70) return <AlertCircle className="h-6 w-6" />;
    return <XCircle className="h-6 w-6" />;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your candidate portal</p>
      </div>

      {/* Readiness Card */}
      <Card>
        <CardHeader>
          <CardTitle>Crew Readiness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center ${getReadinessColor(data.readiness.percentage)}`}>
                {getReadinessIcon(data.readiness.percentage)}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{data.readiness.percentage}%</p>
                <p className="text-sm text-gray-600">Ready for deployment</p>
              </div>
            </div>
            {data.readiness.expiringDocuments > 0 && (
              <div className="text-right">
                <p className="text-sm text-red-600 font-medium">
                  {data.readiness.expiringDocuments} document(s) expiring soon
                </p>
              </div>
            )}
          </div>
          {data.readiness.missingDocuments.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-2">Missing Documents:</p>
              <ul className="list-disc list-inside text-sm text-yellow-700">
                {data.readiness.missingDocuments.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover className="cursor-pointer" onClick={() => navigate('/applications')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{data.applications.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex space-x-2 text-xs">
              <span className="text-yellow-600">{data.applications.pending} pending</span>
              <span className="text-blue-600">{data.applications.shortlisted} shortlisted</span>
            </div>
          </CardContent>
        </Card>

        <Card hover className="cursor-pointer" onClick={() => navigate('/contracts')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contracts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{data.contracts.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs text-green-600">{data.contracts.active} active</span>
            </div>
          </CardContent>
        </Card>

        <Card hover className="cursor-pointer" onClick={() => navigate('/documents')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
            {data.readiness.expiringDocuments > 0 && (
              <div className="mt-4">
                <span className="text-xs text-red-600">{data.readiness.expiringDocuments} expiring</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card hover className="cursor-pointer" onClick={() => navigate('/profile')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile</p>
                <p className="text-sm text-gray-500 mt-2">View & Edit</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

