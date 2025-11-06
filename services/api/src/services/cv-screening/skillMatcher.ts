import { ParsedCV } from './pdfParser';
import nlpService from './nlpService';

interface JobRequirements {
  requiredSkills: string[];
  preferredSkills: string[];
  experience: string;
  education: string;
}

interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceMatch: boolean;
  educationMatch: boolean;
  confidence: number;
  semanticMatches?: string[]; // Skills matched via semantic similarity
}

class SkillMatcher {
  /**
   * Calculate similarity between two strings
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Match skills between CV and job requirements using semantic similarity
   */
  async matchSkills(cvSkills: string[], requiredSkills: string[]): Promise<{
    matched: string[];
    missing: string[];
    semanticMatches: string[];
  }> {
    const matched: string[] = [];
    const missing: string[] = [];
    const semanticMatches: string[] = [];

    await nlpService.initialize();

    for (const requiredSkill of requiredSkills) {
      const lowerRequired = requiredSkill.toLowerCase();
      let found = false;
      let semanticMatch = false;

      // First try exact and substring matching
      for (const cvSkill of cvSkills) {
        const lowerCV = cvSkill.toLowerCase();
        const similarity = this.calculateSimilarity(lowerCV, lowerRequired);
        
        if (similarity > 0.7 || lowerCV.includes(lowerRequired) || lowerRequired.includes(lowerCV)) {
          matched.push(requiredSkill);
          found = true;
          break;
        }
      }

      // If not found, try semantic similarity using NLP
      if (!found) {
        for (const cvSkill of cvSkills) {
          const semanticSimilarity = nlpService.calculateSemanticSimilarity(
            cvSkill,
            requiredSkill
          );
          
          if (semanticSimilarity > 0.6) {
            matched.push(requiredSkill);
            semanticMatches.push(requiredSkill);
            semanticMatch = true;
            found = true;
            break;
          }
        }
      }

      if (!found) {
        missing.push(requiredSkill);
      }
    }

    return { matched, missing, semanticMatches };
  }

  /**
   * Calculate overall match score with NLP-enhanced matching
   */
  async calculateMatchScore(cv: ParsedCV, requirements: JobRequirements): Promise<MatchResult> {
    // Match required skills (weight: 50%) - using async NLP matching
    const requiredMatch = await this.matchSkills(cv.skills, requirements.requiredSkills);
    const requiredSkillScore = requiredMatch.matched.length / Math.max(requirements.requiredSkills.length, 1);

    // Match preferred skills (weight: 20%)
    const preferredMatch = await this.matchSkills(cv.skills, requirements.preferredSkills);
    const preferredSkillScore = preferredMatch.matched.length / Math.max(requirements.preferredSkills.length, 1);

    // Experience match (weight: 20%) - enhanced with NLP
    const experienceText = cv.experience.join(' ') || (cv.entities?.experience.positions.join(' ') || '');
    const experienceMatch = await this.checkExperienceMatchEnhanced(experienceText, requirements.experience, cv.entities?.experience.years);
    const experienceScore = experienceMatch ? 1 : 0.5;

    // Education match (weight: 10%) - enhanced with NLP
    const educationText = cv.education.join(' ') || (cv.entities?.education.degrees.join(' ') || '');
    const educationMatch = await this.checkEducationMatchEnhanced(educationText, requirements.education, cv.entities?.education.degrees);
    const educationScore = educationMatch ? 1 : 0.5;

    // Calculate overall score
    const overallScore = (
      requiredSkillScore * 0.5 +
      preferredSkillScore * 0.2 +
      experienceScore * 0.2 +
      educationScore * 0.1
    ) * 100;

    // Calculate confidence (higher if more skills matched, bonus for semantic matches)
    const baseConfidence = (requiredMatch.matched.length / Math.max(requirements.requiredSkills.length, 1)) * 100;
    const semanticBonus = requiredMatch.semanticMatches.length > 0 ? 5 : 0; // Small bonus for semantic matches
    const confidence = Math.min(baseConfidence + semanticBonus, 100);

    return {
      score: Math.round(overallScore),
      matchedSkills: [...requiredMatch.matched, ...preferredMatch.matched],
      missingSkills: requiredMatch.missing,
      experienceMatch,
      educationMatch,
      confidence: Math.round(confidence),
      semanticMatches: [...requiredMatch.semanticMatches, ...preferredMatch.semanticMatches],
    };
  }

  /**
   * Enhanced experience matching with NLP
   */
  private async checkExperienceMatchEnhanced(
    cvExperience: string,
    requiredExperience: string,
    cvYears?: number
  ): Promise<boolean> {
    // Use NLP semantic similarity
    await nlpService.initialize();
    const semanticSimilarity = nlpService.calculateSemanticSimilarity(cvExperience, requiredExperience);
    
    if (semanticSimilarity > 0.7) return true;
    
    // Also check years if available
    if (cvYears !== undefined) {
      const yearsRegex = /(\d+)\s*(years?|yrs?)/i;
      const requiredYears = requiredExperience.match(yearsRegex);
      if (requiredYears) {
        const requiredYearsNum = parseInt(requiredYears[1]);
        if (cvYears >= requiredYearsNum) return true;
      }
    }
    
    // Fallback to original method
    return this.checkExperienceMatch(cvExperience, requiredExperience);
  }

  /**
   * Enhanced education matching with NLP
   */
  private async checkEducationMatchEnhanced(
    cvEducation: string,
    requiredEducation: string,
    cvDegrees?: string[]
  ): Promise<boolean> {
    // Use NLP semantic similarity
    await nlpService.initialize();
    const semanticSimilarity = nlpService.calculateSemanticSimilarity(cvEducation, requiredEducation);
    
    if (semanticSimilarity > 0.7) return true;
    
    // Check if CV has required degree types
    if (cvDegrees && cvDegrees.length > 0) {
      const lowerRequired = requiredEducation.toLowerCase();
      const hasMatchingDegree = cvDegrees.some(degree => 
        lowerRequired.includes(degree.toLowerCase()) || degree.toLowerCase().includes(lowerRequired)
      );
      if (hasMatchingDegree) return true;
    }
    
    // Fallback to original method
    return this.checkEducationMatch(cvEducation, requiredEducation);
  }

  /**
   * Check if experience matches requirements
   */
  private checkExperienceMatch(cvExperience: string, requiredExperience: string): boolean {
    const lowerCV = cvExperience.toLowerCase();
    const lowerRequired = requiredExperience.toLowerCase();
    
    // Check for years of experience
    const yearsRegex = /(\d+)\s*(years?|yrs?)/i;
    const cvYears = lowerCV.match(yearsRegex);
    const requiredYears = lowerRequired.match(yearsRegex);

    if (cvYears && requiredYears) {
      const cvYearsNum = parseInt(cvYears[1]);
      const requiredYearsNum = parseInt(requiredYears[1]);
      if (cvYearsNum < requiredYearsNum) return false;
    }

    // Check for keyword matches
    const requiredKeywords = lowerRequired.split(/\s+/).filter(word => word.length > 3);
    const matches = requiredKeywords.filter(keyword => lowerCV.includes(keyword));
    
    return matches.length >= requiredKeywords.length * 0.5;
  }

  /**
   * Check if education matches requirements
   */
  private checkEducationMatch(cvEducation: string, requiredEducation: string): boolean {
    const lowerCV = cvEducation.toLowerCase();
    const lowerRequired = requiredEducation.toLowerCase();

    // Check for degree types
    const degreeTypes = ['bachelor', 'master', 'phd', 'diploma', 'certificate'];
    const cvHasDegree = degreeTypes.some(degree => lowerCV.includes(degree));
    const requiredHasDegree = degreeTypes.some(degree => lowerRequired.includes(degree));

    if (!requiredHasDegree) return true; // No specific requirement
    if (!cvHasDegree) return false;

    // Check for specific degree matches
    return lowerCV.includes(lowerRequired) || this.calculateSimilarity(lowerCV, lowerRequired) > 0.6;
  }
}

export default new SkillMatcher();

