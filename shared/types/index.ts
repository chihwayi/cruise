// Shared types for the Cruise Recruitment System

export interface Candidate {
  id: string;
  email: string;
  title?: string;
  firstName: string;
  middleInitials?: string;
  lastName: string;
  age?: number;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  citizenship?: string;
  languages?: string[];
  phoneNumber?: string;
  skypeId?: string;
  physicalAddress?: string;
  placeOfBirth?: string;
  nextOfKinName?: string;
  nextOfKinRelationship?: string;
  nextOfKinContact?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  height?: number;
  weight?: number;
  hairColor?: string;
  eyeColor?: string;
  bloodGroup?: string;
  employmentNumber?: string;
  profilePhotoUrl?: string;
  crewStatus?: 'onboard' | 'on_vacation' | 'available' | 'unavailable';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobPosting {
  id: string;
  cruiseLineName: string;
  positionTitle: string;
  positionDescription: string;
  requirements: string;
  specifications: string;
  department?: string;
  employmentType?: string;
  startDate?: string;
  applicationDeadline?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  candidateId: string;
  jobPostingId: string;
  personalSummary?: string;
  screeningStatus: 'pending' | 'screening' | 'shortlisted' | 'rejected' | 'interview_scheduled' | 'hired';
  screeningScore?: number;
  resumeUrl?: string;
  candidate?: Candidate;
  jobPosting?: JobPosting;
  createdAt: string;
  updatedAt: string;
}

export interface EmploymentHistory {
  id: string;
  candidateId: string;
  employerName: string;
  position: string;
  duties: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

