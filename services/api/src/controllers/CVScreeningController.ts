import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Application from '../models/Application';
import Document from '../models/Document';
import Candidate from '../models/Candidate';
import JobPosting from '../models/JobPosting';
import elasticsearchClient from '../config/elasticsearch';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import pdfParser from '../services/cv-screening/pdfParser';
import skillMatcher from '../services/cv-screening/skillMatcher';
import minioClient from '../config/minio';

export const screenApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { applicationId } = req.params;

  const application = await Application.findByPk(applicationId, {
    include: [
      { model: JobPosting, as: 'jobPosting' },
      { model: Candidate, as: 'candidate' },
    ],
  });

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  // Get resume document
  const resume = await Document.findOne({
    where: {
      candidateId: application.candidateId,
      documentType: 'resume',
    },
  });

  if (!resume) {
    throw new AppError('Resume not found for this candidate', 404);
  }

  // Index resume in Elasticsearch for search
  const resumeId = `resume-${application.candidateId}`;
  
  try {
    await elasticsearchClient.index({
      index: 'resumes',
      id: resumeId,
      document: {
        candidateId: application.candidateId,
        applicationId: application.id,
        jobPostingId: application.jobPostingId,
        resumeUrl: resume.fileUrl,
        personalSummary: application.personalSummary,
        screeningStatus: application.screeningStatus,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error indexing resume:', error);
  }

  // Calculate screening score based on job requirements
  const jobPosting = application.jobPosting;
  const requirements = jobPosting?.requirements || '';
  const specifications = jobPosting?.specifications || '';

  let score = 50; // Base score
  let confidence = 50;

  // Try to parse CV if it's a PDF
  try {
    // Download resume from MinIO
    const resumeBuffer = await minioClient.getObject('cruise-documents', resume.fileUrl.split('/').pop() || '');
    const chunks: Buffer[] = [];
    
    resumeBuffer.on('data', (chunk) => chunks.push(chunk));
    await new Promise((resolve) => {
      resumeBuffer.on('end', resolve);
    });
    
    const fileBuffer = Buffer.concat(chunks);
    
    // Parse CV
    const parsedCV = await pdfParser.parseCV(fileBuffer);
    
    // Extract job requirements
    const jobRequirements = {
      requiredSkills: extractSkillsFromText(requirements),
      preferredSkills: extractSkillsFromText(specifications),
      experience: extractExperienceRequirement(requirements),
      education: extractEducationRequirement(requirements),
    };
    
    // Match skills using NLP-enhanced matching
    const matchResult = await skillMatcher.calculateMatchScore(parsedCV, jobRequirements);
    score = matchResult.score;
    confidence = matchResult.confidence;
    
    // Store parsed data in Elasticsearch
    await elasticsearchClient.index({
      index: 'resumes',
      id: resumeId,
      document: {
        candidateId: application.candidateId,
        applicationId: application.id,
        jobPostingId: application.jobPostingId,
        resumeUrl: resume.fileUrl,
        personalSummary: application.personalSummary,
        screeningStatus: application.screeningStatus,
        parsedSkills: parsedCV.skills,
        parsedExperience: parsedCV.experience,
        parsedEducation: parsedCV.education,
        nlpEntities: parsedCV.entities,
        matchScore: score,
        confidence,
        semanticMatches: matchResult.semanticMatches,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('CV parsing failed, using fallback scoring:', error);
    // Fallback to simple scoring
    if (application.personalSummary) {
      const summaryLower = application.personalSummary.toLowerCase();
      const requirementsLower = requirements.toLowerCase();
      
      const requirementWords = requirementsLower.split(/\s+/);
      const matchedWords = requirementWords.filter((word) => 
        summaryLower.includes(word) && word.length > 4
      );
      
      score += Math.min((matchedWords.length / requirementWords.length) * 30, 30);
    }
  }

  // Update application with screening score
  await application.update({
    screeningStatus: 'screening',
    screeningScore: Math.min(Math.round(score), 100),
  });

  res.json({
    message: 'Application screened successfully',
    application: {
      id: application.id,
      screeningStatus: application.screeningStatus,
      screeningScore: application.screeningScore,
    },
  });
});

// Helper function to extract skills from text
function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'react', 'node.js',
    'docker', 'kubernetes', 'aws', 'azure', 'sql', 'mongodb',
    'communication', 'leadership', 'teamwork', 'problem solving',
    'navigation', 'safety', 'emergency response', 'maintenance',
    'engineering', 'cooking', 'housekeeping', 'entertainment',
  ];
  
  const lowerText = text.toLowerCase();
  return commonSkills.filter(skill => lowerText.includes(skill.toLowerCase()));
}

// Helper function to extract experience requirement
function extractExperienceRequirement(text: string): string {
  const experienceMatch = text.match(/(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?experience/i);
  return experienceMatch ? experienceMatch[0] : '';
}

// Helper function to extract education requirement
function extractEducationRequirement(text: string): string {
  const educationMatch = text.match(/(?:bachelor|master|phd|diploma|certificate)[\s\w]+(?:degree|in)/i);
  return educationMatch ? educationMatch[0] : '';
}

export const searchCandidatesBySkills = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { query, jobPostingId } = req.query;

  if (!query) {
    throw new AppError('Search query is required', 400);
  }

  try {
    const searchResult = await elasticsearchClient.search({
      index: 'resumes',
      body: {
        query: {
          multi_match: {
            query: query as string,
            fields: ['personalSummary', 'resumeUrl'],
            type: 'best_fields',
          },
        },
      },
    });

    const candidates = searchResult.hits.hits.map((hit: any) => ({
      applicationId: hit._source.applicationId,
      candidateId: hit._source.candidateId,
      score: hit._score,
      data: hit._source,
    }));

    res.json({
      query,
      candidates,
      total: searchResult.hits.total,
    });
  } catch (error) {
    console.error('Elasticsearch search error:', error);
    throw new AppError('Search failed', 500);
  }
});

export const bulkScreenApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { applicationIds } = req.body;

  if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
    throw new AppError('Application IDs array is required', 400);
  }

  const applications = await Application.findAll({
    where: { id: applicationIds },
    include: [
      { model: JobPosting, as: 'jobPosting' },
    ],
  });

  const results = [];

  for (const application of applications) {
    try {
      // Simple scoring (same as single screen)
      let score = 50;
      const jobPosting = application.jobPosting;
      
      if (application.personalSummary && jobPosting?.requirements) {
        const summaryLower = application.personalSummary.toLowerCase();
        const requirementsLower = jobPosting.requirements.toLowerCase();
        const requirementWords = requirementsLower.split(/\s+/);
        const matchedWords = requirementWords.filter((word) => 
          summaryLower.includes(word) && word.length > 4
        );
        score += Math.min((matchedWords.length / requirementWords.length) * 30, 30);
      }

      await application.update({
        screeningStatus: 'screening',
        screeningScore: Math.min(Math.round(score), 100),
      });

      results.push({
        applicationId: application.id,
        screeningScore: application.screeningScore,
        status: 'success',
      });
    } catch (error) {
      results.push({
        applicationId: application.id,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  res.json({
    message: 'Bulk screening completed',
    results,
    total: applications.length,
    successful: results.filter((r) => r.status === 'success').length,
  });
});

