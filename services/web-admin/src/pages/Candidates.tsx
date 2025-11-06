import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, User, Mail, Phone, Calendar, Eye, Edit } from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  nationality?: string;
  dateOfBirth?: string;
  isActive: boolean;
  employmentNumber?: string;
  createdAt: string;
}

export default function Candidates() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await apiClient.get('/candidates?limit=100');
      setCandidates(response.data.candidates || response.data || []);
    } catch (error) {
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600 mt-1">Manage all candidate profiles</p>
        </div>
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

      {/* Candidates List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No candidates found</p>
            </CardContent>
          </Card>
        ) : (
          filteredCandidates.map((candidate) => (
            <Card key={candidate.id} hover>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {candidate.firstName} {candidate.lastName}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{candidate.email}</span>
                        </div>
                        {candidate.phoneNumber && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{candidate.phoneNumber}</span>
                          </div>
                        )}
                        {candidate.nationality && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span>Nationality: {candidate.nationality}</span>
                          </div>
                        )}
                        {candidate.employmentNumber && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-mono">Emp #: {candidate.employmentNumber}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Joined {formatDate(candidate.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        candidate.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {candidate.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/candidates/${candidate.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
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

