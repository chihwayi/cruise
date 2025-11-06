import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FileText, Upload, Download, AlertCircle, CheckCircle, XCircle, X, Loader2, CheckCircle2, Trash2 } from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

interface Document {
  id: number;
  documentType: string;
  type?: string;
  fileName: string;
  fileUrl: string;
  expiryDate: string | null;
  isExpired: boolean;
  isExpiringSoon?: boolean;
  uploadedAt?: string;
  createdAt?: string;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  fileName?: string;
  fileSize?: number;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadStates, setUploadStates] = useState<Record<string, UploadState>>({});
  const [justUploaded, setJustUploaded] = useState<Record<string, boolean>>({});
  const [dragOver, setDragOver] = useState<Record<string, boolean>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; document: Document | null }>({
    isOpen: false,
    document: null,
  });
  const [deleting, setDeleting] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await apiClient.get('/documents/my');
      setDocuments(response.data.documents || []);
    } catch (error) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (type: string) => {
    const input = fileInputRefs.current[type];
    if (input) {
      input.click();
    }
  };

  const validateAndUpload = async (file: File, type: string) => {
    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error(`File size (${formatFileSize(file.size)}) exceeds 50MB limit`);
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PDF, JPG, or PNG files only.');
      return;
    }

    // Upload the file
    await performUpload(file, type);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input
    e.target.value = '';
    
    await validateAndUpload(file, type);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: false }));

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    await validateAndUpload(file, type);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (type: string) => {
    setDragOver(prev => ({ ...prev, [type]: false }));
  };

  const performUpload = async (file: File, type: string) => {

    // Set upload state
    setUploadStates(prev => ({
      ...prev,
      [type]: {
        uploading: true,
        progress: 0,
        fileName: file.name,
        fileSize: file.size,
      },
    }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', type);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadStates(prev => {
          const current = prev[type];
          if (!current) return prev;
          const newProgress = Math.min(current.progress + 10, 90);
          return {
            ...prev,
            [type]: { ...current, progress: newProgress },
          };
        });
      }, 200);

      await apiClient.post('/documents/upload', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadStates(prev => ({
              ...prev,
              [type]: {
                uploading: true,
                progress: Math.min(progress, 95),
                fileName: file.name,
              },
            }));
          }
        },
      });

      clearInterval(progressInterval);

      // Complete progress
      setUploadStates(prev => ({
        ...prev,
        [type]: {
          uploading: true,
          progress: 100,
          fileName: file.name,
        },
      }));

      // Show success animation
      setJustUploaded(prev => ({ ...prev, [type]: true }));
      
      toast.success('Document uploaded successfully!', {
        icon: '✅',
        duration: 3000,
      });

      // Refresh documents after a short delay
      setTimeout(() => {
        fetchDocuments();
        setUploadStates(prev => {
          const newState = { ...prev };
          delete newState[type];
          return newState;
        });
        setTimeout(() => {
          setJustUploaded(prev => {
            const newState = { ...prev };
            delete newState[type];
            return newState;
          });
        }, 2000);
      }, 500);
    } catch (error: any) {
      setUploadStates(prev => {
        const newState = { ...prev };
        delete newState[type];
        return newState;
      });
      toast.error(error.response?.data?.error || 'Failed to upload document');
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    window.open(fileUrl, '_blank');
  };

  const handleDeleteClick = (document: Document) => {
    setDeleteConfirm({ isOpen: true, document });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.document) return;

    setDeleting(true);
    try {
      await apiClient.delete(`/documents/${deleteConfirm.document.id}`);
      toast.success('Document deleted successfully');
      fetchDocuments();
      setDeleteConfirm({ isOpen: false, document: null });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete document');
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const documentTypes = [
    { type: 'passport', label: 'Passport', required: true },
    { type: 'visa', label: 'Visa', required: true },
    { type: 'medical', label: 'Medical Certificate', required: true },
    { type: 'seaman_book', label: 'Seaman Book', required: true },
    { type: 'stcw_certificate', label: 'STCW Certificate', required: true },
    { type: 'peme', label: 'PEME', required: true },
    { type: 'identity_card', label: 'Identity Card', required: false },
    { type: 'resume', label: 'CV/Resume', required: false },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-600 mt-1">Manage your documents and certificates</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {documentTypes.map((docType) => {
          const existingDoc = documents.find((d) => (d.documentType || d.type) === docType.type);
          const uploadState = uploadStates[docType.type];
          const isJustUploaded = justUploaded[docType.type];
          const isUploading = uploadState?.uploading || false;

          return (
            <Card 
              key={docType.type} 
              className={`transition-all duration-300 ${
                isJustUploaded ? 'ring-2 ring-green-500 ring-offset-2' : ''
              } ${dragOver[docType.type] ? 'ring-2 ring-primary-500 ring-offset-2 bg-primary-50' : ''}`}
              onDrop={(e) => handleDrop(e, docType.type)}
              onDragOver={(e) => handleDragOver(e, docType.type)}
              onDragLeave={() => handleDragLeave(docType.type)}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isJustUploaded
                        ? 'bg-green-100 scale-110'
                        : existingDoc
                        ? existingDoc.isExpired
                          ? 'bg-red-100'
                          : existingDoc.isExpiringSoon
                          ? 'bg-yellow-100'
                          : 'bg-green-100'
                        : 'bg-gray-100'
                    }`}>
                      {isJustUploaded ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600 animate-in fade-in zoom-in duration-300" />
                      ) : existingDoc ? (
                        existingDoc.isExpired ? (
                          <XCircle className="h-6 w-6 text-red-600" />
                        ) : existingDoc.isExpiringSoon ? (
                          <AlertCircle className="h-6 w-6 text-yellow-600" />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        )
                      ) : (
                        <FileText className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {docType.label}
                          {docType.required && (
                            <span className="ml-2 text-xs text-red-600">*</span>
                          )}
                        </h3>
                        {existingDoc && !isUploading && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                              existingDoc.isExpired
                                ? 'bg-red-100 text-red-800'
                                : existingDoc.isExpiringSoon
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {existingDoc.isExpired
                              ? 'Expired'
                              : existingDoc.isExpiringSoon
                              ? 'Expiring Soon'
                              : 'Valid'}
                          </span>
                        )}
                      </div>
                      
                      {/* Upload Progress Bar */}
                      {isUploading && uploadState && (
                        <div className="space-y-2 mb-2 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span className="truncate flex-1 mr-2 font-medium">{uploadState.fileName}</span>
                            <span className="font-semibold text-primary-600">{uploadState.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                            <div
                              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                              style={{ width: `${uploadState.progress}%` }}
                            >
                              <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
                            </div>
                          </div>
                          {uploadState.fileSize && (
                            <p className="text-xs text-gray-500">
                              {formatFileSize((uploadState.progress / 100) * uploadState.fileSize)} / {formatFileSize(uploadState.fileSize)}
                            </p>
                          )}
                        </div>
                      )}

                      {existingDoc && !isUploading ? (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">{existingDoc.fileName}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded: {formatDate(existingDoc.uploadedAt || existingDoc.createdAt)}
                          </p>
                          {existingDoc.expiryDate && (
                            <p className="text-xs text-gray-500">
                              Expires: {formatDate(existingDoc.expiryDate)}
                            </p>
                          )}
                        </div>
                      ) : !isUploading ? (
                        <p className="text-sm text-gray-500">No document uploaded</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:flex-shrink-0">
                    {existingDoc && !isUploading && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(existingDoc.fileUrl, existingDoc.fileName)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(existingDoc)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <input
                      ref={(el) => (fileInputRefs.current[docType.type] = el)}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, docType.type)}
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={isUploading}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileSelect(docType.type)}
                      disabled={isUploading}
                      isLoading={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {existingDoc ? 'Replace' : 'Upload'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, document: null })}
        title="Delete Document"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900 font-medium mb-1">
                Are you sure you want to delete this document?
              </p>
              <p className="text-sm text-gray-600">
                {deleteConfirm.document?.fileName || 'This document'} will be permanently deleted and cannot be recovered.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ isOpen: false, document: null })}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Document'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
