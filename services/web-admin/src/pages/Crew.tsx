import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, UsersRound, User, CheckCircle, AlertCircle, XCircle, Eye } from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface CrewMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  readinessPercentage: number;
  onboardDate: string;
  nextVacationDate: string;
}

export default function Crew() {
  const navigate = useNavigate();
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCrew();
  }, []);

  const fetchCrew = async () => {
    try {
      const response = await apiClient.get('/crew');
      setCrew(response.data);
    } catch (error) {
      toast.error('Failed to load crew members');
    } finally {
      setLoading(false);
    }
  };

  const filteredCrew = crew.filter(
    (member) =>
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getReadinessColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getReadinessIcon = (percentage: number) => {
    if (percentage >= 90) return <CheckCircle className="h-5 w-5" />;
    if (percentage >= 70) return <AlertCircle className="h-5 w-5" />;
    return <XCircle className="h-5 w-5" />;
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Crew Management</h1>
        <p className="text-gray-600 mt-1">Monitor crew readiness and status</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Crew List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCrew.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <UsersRound className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No crew members found</p>
            </CardContent>
          </Card>
        ) : (
          filteredCrew.map((member) => (
            <Card key={member.id} hover>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {member.firstName} {member.lastName}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            member.status === 'onboard'
                              ? 'bg-blue-100 text-blue-800'
                              : member.status === 'on_vacation'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {member.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">{member.email}</div>
                        <div className="flex items-center space-x-4">
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getReadinessColor(member.readinessPercentage)}`}>
                            {getReadinessIcon(member.readinessPercentage)}
                            <span>Readiness: {member.readinessPercentage}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/crew/${member.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
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

