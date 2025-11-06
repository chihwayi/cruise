import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FileCheck, 
  Calendar, 
  DollarSign, 
  Download, 
  Eye,
  Ship,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Building
} from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate, formatCurrency } from '@/lib/utils';

interface Contract {
  id: string;
  contractNumber: string;
  contractType: string;
  startDate: string;
  endDate?: string;
  joiningDate?: string;
  signOffDate?: string;
  vesselName?: string;
  position: string;
  salary?: number;
  currency?: string;
  status: string;
  signedAt?: string;
  documentUrl?: string;
  jobPosting?: {
    id: string;
    title: string;
    department: string;
  };
  candidate?: {
    firstName: string;
    lastName: string;
  };
}

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await apiClient.get('/contracts/my');
      setContracts(response.data.contracts || []);
    } catch (error) {
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const statusLower = status?.toLowerCase() || 'draft';
    const configs: Record<string, { color: string; bgColor: string; icon: React.ReactNode; label: string }> = {
      active: {
        color: 'text-green-800',
        bgColor: 'bg-green-100',
        icon: <CheckCircle className="h-4 w-4" />,
        label: 'Active',
      },
      signed: {
        color: 'text-blue-800',
        bgColor: 'bg-blue-100',
        icon: <FileCheck className="h-4 w-4" />,
        label: 'Signed',
      },
      pending_signature: {
        color: 'text-yellow-800',
        bgColor: 'bg-yellow-100',
        icon: <Clock className="h-4 w-4" />,
        label: 'Pending Signature',
      },
      completed: {
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        icon: <CheckCircle className="h-4 w-4" />,
        label: 'Completed',
      },
      terminated: {
        color: 'text-red-800',
        bgColor: 'bg-red-100',
        icon: <XCircle className="h-4 w-4" />,
        label: 'Terminated',
      },
      draft: {
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        icon: <FileText className="h-4 w-4" />,
        label: 'Draft',
      },
    };
    return configs[statusLower] || configs.draft;
  };

  const getContractTypeColor = (type: string) => {
    const typeLower = type?.toLowerCase() || '';
    if (typeLower === 'permanent') return 'bg-purple-100 text-purple-800';
    if (typeLower === 'seasonal') return 'bg-orange-100 text-orange-800';
    return 'bg-blue-100 text-blue-800';
  };

  const calculateDaysRemaining = (endDate?: string) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Contracts</h1>
        <p className="text-gray-600 mt-1">View and manage your employment contracts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Active Contracts</p>
                <p className="text-2xl font-bold text-green-900">
                  {contracts.filter(c => c.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Contracts</p>
                <p className="text-2xl font-bold text-blue-900">{contracts.length}</p>
              </div>
              <FileCheck className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Pending Signature</p>
                <p className="text-2xl font-bold text-purple-900">
                  {contracts.filter(c => c.status === 'pending_signature').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts List */}
      <div className="grid grid-cols-1 gap-4">
        {contracts.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="pt-6 text-center py-12">
              <FileCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No contracts found</h3>
              <p className="text-gray-600">Your contracts will appear here once they are created</p>
            </CardContent>
          </Card>
        ) : (
          contracts.map((contract) => {
            const statusConfig = getStatusConfig(contract.status);
            const isSelected = selectedContract?.id === contract.id;
            const daysRemaining = calculateDaysRemaining(contract.endDate);
            const isExpiringSoon = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30;

            return (
              <Card 
                key={contract.id} 
                className={`transition-all duration-300 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary-500' : ''
                } ${isExpiringSoon ? 'border-yellow-300 bg-yellow-50' : ''}`}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <FileCheck className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {contract.jobPosting?.title || contract.position}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Contract #{contract.contractNumber}
                                </p>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 ${statusConfig.bgColor} ${statusConfig.color}`}>
                                  {statusConfig.icon}
                                  <span>{statusConfig.label}</span>
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getContractTypeColor(contract.contractType)}`}>
                                  {contract.contractType?.toUpperCase() || 'TEMPORARY'}
                                </span>
                              </div>
                            </div>

                            {/* Contract Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                              {contract.jobPosting?.department && (
                                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                  <Building className="h-4 w-4 mr-2 text-primary-600 flex-shrink-0" />
                                  <span className="truncate">{contract.jobPosting.department}</span>
                                </div>
                              )}
                              {contract.vesselName && (
                                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                  <Ship className="h-4 w-4 mr-2 text-primary-600 flex-shrink-0" />
                                  <span className="truncate">{contract.vesselName}</span>
                                </div>
                              )}
                              {contract.salary && (
                                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                  <DollarSign className="h-4 w-4 mr-2 text-primary-600 flex-shrink-0" />
                                  <span className="truncate">
                                    {formatCurrency(contract.salary, contract.currency || 'USD')}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                <Calendar className="h-4 w-4 mr-2 text-primary-600 flex-shrink-0" />
                                <span className="truncate">
                                  {formatDate(contract.startDate)} - {contract.endDate ? formatDate(contract.endDate) : 'Ongoing'}
                                </span>
                              </div>
                              {contract.joiningDate && (
                                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                  <Clock className="h-4 w-4 mr-2 text-primary-600 flex-shrink-0" />
                                  <span className="truncate">
                                    Joins: {formatDate(contract.joiningDate)}
                                  </span>
                                </div>
                              )}
                              {contract.signedAt && (
                                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                  <CheckCircle className="h-4 w-4 mr-2 text-primary-600 flex-shrink-0" />
                                  <span className="truncate">
                                    Signed: {formatDate(contract.signedAt)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Expiry Warning */}
                            {isExpiringSoon && daysRemaining !== null && (
                              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2">
                                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                                <p className="text-sm text-yellow-800">
                                  <span className="font-semibold">Contract expires in {daysRemaining} days</span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-stretch gap-2 lg:w-48">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedContract(isSelected ? null : contract)}
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {isSelected ? 'Hide Details' : 'View Details'}
                      </Button>
                      {contract.documentUrl && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => window.open(contract.documentUrl!, '_blank')}
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isSelected && (
                    <div className="mt-6 pt-6 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary-600" />
                            Contract Information
                          </h4>
                          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Contract Number:</span>
                              <span className="text-sm font-medium text-gray-900">{contract.contractNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Type:</span>
                              <span className="text-sm font-medium text-gray-900 capitalize">{contract.contractType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Position:</span>
                              <span className="text-sm font-medium text-gray-900">{contract.position}</span>
                            </div>
                            {contract.vesselName && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Vessel:</span>
                                <span className="text-sm font-medium text-gray-900">{contract.vesselName}</span>
                              </div>
                            )}
                            {contract.salary && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Salary:</span>
                                <span className="text-sm font-medium text-gray-900">
                                  {formatCurrency(contract.salary, contract.currency || 'USD')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary-600" />
                            Timeline
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <div className="h-2 w-2 rounded-full bg-primary-600 mt-1.5"></div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Start Date</p>
                                <p className="text-xs text-gray-500">{formatDate(contract.startDate)}</p>
                              </div>
                            </div>
                            {contract.endDate && (
                              <div className="flex items-start space-x-3">
                                <div className={`h-2 w-2 rounded-full ${isExpiringSoon ? 'bg-yellow-500' : 'bg-gray-400'} mt-1.5`}></div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">End Date</p>
                                  <p className="text-xs text-gray-500">
                                    {formatDate(contract.endDate)}
                                    {daysRemaining !== null && (
                                      <span className={`ml-2 ${isExpiringSoon ? 'text-yellow-600 font-semibold' : 'text-gray-500'}`}>
                                        ({daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'})
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            )}
                            {contract.joiningDate && (
                              <div className="flex items-start space-x-3">
                                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5"></div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Joining Date</p>
                                  <p className="text-xs text-gray-500">{formatDate(contract.joiningDate)}</p>
                                </div>
                              </div>
                            )}
                            {contract.signedAt && (
                              <div className="flex items-start space-x-3">
                                <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5"></div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Signed Date</p>
                                  <p className="text-xs text-gray-500">{formatDate(contract.signedAt)}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
