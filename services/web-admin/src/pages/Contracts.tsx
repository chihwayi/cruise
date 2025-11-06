import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, FileCheck, User, Calendar, DollarSign, Eye, Briefcase } from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Contract {
  id: number;
  contractNumber: string;
  startDate: string;
  endDate: string;
  salary: number;
  status: string;
  Candidate: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  JobPosting: {
    id: number;
    title: string;
  };
}

export default function Contracts() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await apiClient.get('/contracts');
      setContracts(response.data);
    } catch (error) {
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.Candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.Candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.Candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
        <p className="text-gray-600 mt-1">Manage all employment contracts</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by candidate name, email, or contract number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contracts List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredContracts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No contracts found</p>
            </CardContent>
          </Card>
        ) : (
          filteredContracts.map((contract) => (
            <Card key={contract.id} hover>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {contract.Candidate.firstName} {contract.Candidate.lastName}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            contract.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : contract.status === 'completed'
                              ? 'bg-gray-100 text-gray-800'
                              : contract.status === 'terminated'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {contract.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <FileCheck className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-mono text-xs">{contract.contractNumber}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{contract.JobPosting.title}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{formatCurrency(contract.salary)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/contracts/${contract.id}`)}
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

