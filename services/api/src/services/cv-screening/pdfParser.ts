import fs from 'fs';
import path from 'path';
import nlpService from './nlpService';

// Import pdf-parse (now properly installed in container)
import pdfParse from 'pdf-parse';

interface ParsedCV {
  text: string;
  skills: string[];
  experience: string[];
  education: string[];
  contactInfo: {
    email?: string;
    phone?: string;
  };
  entities?: {
    skills: string[];
    experience: {
      years?: number;
      positions: string[];
      companies: string[];
    };
    education: {
      degrees: string[];
      institutions: string[];
    };
    languages: string[];
    certifications: string[];
  };
}

class PDFParser {
  /**
   * Parse PDF file and extract text content using pdf-parse
   */
  async parsePDF(fileBuffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(fileBuffer);
      return data.text || '';
    } catch (error) {
      console.error('Error parsing PDF:', error);
      // Fallback: try to extract text from buffer as plain text
      const text = fileBuffer.toString('utf-8');
      return text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '').trim();
    }
  }

  /**
   * Extract skills from CV text using NLP and keyword matching
   */
  async extractSkills(text: string): Promise<string[]> {
    // Initialize NLP service
    await nlpService.initialize();
    
    // Extract skills using NLP
    const entities = await nlpService.extractEntities(text);
    const nlpSkills = entities.skills;
    
    // Also use keyword matching as fallback
    const commonSkills = [
      'javascript', 'typescript', 'python', 'java', 'react', 'node.js',
      'docker', 'kubernetes', 'aws', 'azure', 'sql', 'mongodb',
      'communication', 'leadership', 'teamwork', 'problem solving',
      'navigation', 'safety', 'emergency response', 'maintenance',
      'engineering', 'cooking', 'housekeeping', 'entertainment',
      'stcw', 'seamanship', 'deck operations', 'engine operations',
      'first aid', 'firefighting', 'lifeboat', 'customer service',
    ];

    const lowerText = text.toLowerCase();
    const keywordSkills = commonSkills.filter(skill => 
      lowerText.includes(skill.toLowerCase())
    );

    // Combine NLP and keyword results, remove duplicates
    const allSkills = [...new Set([...nlpSkills, ...keywordSkills])];
    return allSkills;
  }

  /**
   * Extract experience from CV text using NLP
   */
  async extractExperience(text: string): Promise<string[]> {
    await nlpService.initialize();
    const entities = await nlpService.extractEntities(text);
    
    // Combine NLP extracted positions and companies
    const nlpExperience = [
      ...entities.experience.positions,
      ...entities.experience.companies,
    ];
    
    // Also use pattern matching as fallback
    const experiencePatterns = [
      /experience[:\s]+(.*?)(?=education|skills|$)/is,
      /work history[:\s]+(.*?)(?=education|skills|$)/is,
      /\d{4}[\s-]+\d{4}[\s-]+(.*?)(?=\d{4}|$)/gi,
    ];

    const patternExperience: string[] = [];
    experiencePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        patternExperience.push(...matches);
      }
    });

    // Combine and deduplicate
    return [...new Set([...nlpExperience, ...patternExperience])];
  }

  /**
   * Extract education from CV text using NLP
   */
  async extractEducation(text: string): Promise<string[]> {
    await nlpService.initialize();
    const entities = await nlpService.extractEntities(text);
    
    // Combine NLP extracted degrees and institutions
    const nlpEducation = [
      ...entities.education.degrees,
      ...entities.education.institutions,
    ];
    
    // Also use pattern matching
    const educationPatterns = [
      /education[:\s]+(.*?)(?=experience|skills|$)/is,
      /degree[:\s]+(.*?)(?=experience|skills|$)/is,
      /bachelor|master|phd|diploma|certificate/gi,
    ];

    const patternEducation: string[] = [];
    educationPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        patternEducation.push(...matches);
      }
    });

    return [...new Set([...nlpEducation, ...patternEducation])];
  }

  /**
   * Extract contact information
   */
  extractContactInfo(text: string): { email?: string; phone?: string } {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

    const emailMatch = text.match(emailRegex);
    const phoneMatch = text.match(phoneRegex);

    return {
      email: emailMatch ? emailMatch[0] : undefined,
      phone: phoneMatch ? phoneMatch[0] : undefined,
    };
  }

  /**
   * Parse complete CV with NLP enhancement
   */
  async parseCV(fileBuffer: Buffer): Promise<ParsedCV> {
    const text = await this.parsePDF(fileBuffer);
    
    // Initialize NLP service
    await nlpService.initialize();
    
    // Extract entities using NLP
    const entities = await nlpService.extractEntities(text);
    
    // Extract skills, experience, and education (using both NLP and patterns)
    const [skills, experience, education] = await Promise.all([
      this.extractSkills(text),
      this.extractExperience(text),
      this.extractEducation(text),
    ]);
    
    return {
      text,
      skills,
      experience,
      education,
      contactInfo: this.extractContactInfo(text),
      entities, // Include full NLP entities for advanced matching
    };
  }
}

export default new PDFParser();

