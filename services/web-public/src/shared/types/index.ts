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

export interface Candidate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleInitials?: string;
  phoneNumber?: string;
  nationality?: string;
  languages?: string[];
  employmentNumber?: string;
  crewStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  candidateId: string;
  jobPostingId: string;
  personalSummary?: string;
  resumeUrl?: string;
  screeningStatus: string;
  screeningScore?: number;
  createdAt: string;
  updatedAt: string;
  jobPosting?: JobPosting;
  candidate?: Candidate;
}

