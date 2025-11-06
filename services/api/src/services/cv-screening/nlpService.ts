// Using natural library for NLP as it's more stable and well-documented
import natural from 'natural';

interface ExtractedEntities {
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
}

class NLPService {
  private initialized: boolean = false;
  private skillDictionary: Set<string> = new Set();
  private tokenizer: natural.WordTokenizer;

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
  }

  /**
   * Initialize NLP service with skill dictionary
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Build skill dictionary for faster lookup
      const commonSkills = [
        // Technical Skills
        'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js',
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'SQL', 'MongoDB',
        // Maritime Skills
        'Navigation', 'Safety', 'Emergency Response', 'Maintenance',
        'Engineering', 'Cooking', 'Housekeeping', 'Entertainment',
        'Customer Service', 'Leadership', 'Teamwork', 'Communication',
        'Problem Solving', 'First Aid', 'Firefighting', 'Lifeboat',
        'STCW', 'Seamanship', 'Deck Operations', 'Engine Operations',
        'Maritime', 'Cruise', 'Vessel', 'Ship', 'Crew Management',
      ];

      commonSkills.forEach(skill => {
        this.skillDictionary.add(skill.toLowerCase());
        const variations = this.getSkillVariations(skill);
        variations.forEach(variation => {
          this.skillDictionary.add(variation.toLowerCase());
        });
      });

      this.initialized = true;
      console.log('✅ NLP Service initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing NLP Service:', error);
      // Continue without NLP if initialization fails
      this.initialized = false;
    }
  }

  /**
   * Get skill variations for better matching
   */
  private getSkillVariations(skill: string): string[] {
    const variations = [skill];
    const lower = skill.toLowerCase();
    
    // Add common abbreviations
    if (lower.includes('javascript')) variations.push('js', 'ecmascript');
    if (lower.includes('typescript')) variations.push('ts');
    if (lower.includes('react')) variations.push('reactjs', 'react.js');
    if (lower.includes('node')) variations.push('nodejs', 'node.js');
    
    return variations;
  }

  /**
   * Detect language of text
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      if (!this.initialized) await this.initialize();
      
      // Simple language detection based on common words
      const englishWords = ['the', 'and', 'is', 'are', 'was', 'were', 'have', 'has'];
      const spanishWords = ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'una'];
      const frenchWords = ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et'];
      
      const lowerText = text.toLowerCase();
      let enCount = 0, esCount = 0, frCount = 0;
      
      englishWords.forEach(word => {
        if (lowerText.includes(word)) enCount++;
      });
      spanishWords.forEach(word => {
        if (lowerText.includes(word)) esCount++;
      });
      frenchWords.forEach(word => {
        if (lowerText.includes(word)) frCount++;
      });
      
      if (esCount > enCount && esCount > frCount) return 'es';
      if (frCount > enCount && frCount > esCount) return 'fr';
      return 'en'; // Default to English
    } catch (error) {
      console.error('Error detecting language:', error);
      return 'en';
    }
  }

  /**
   * Extract entities from CV text using NLP
   */
  async extractEntities(text: string): Promise<ExtractedEntities> {
    try {
      if (!this.initialized) await this.initialize();
      
      const language = await this.detectLanguage(text);
      
      // Extract skills using dictionary and tokenization
      const tokens = this.tokenizer.tokenize(text.toLowerCase()) || [];
      const skillEntities: string[] = [];
      
      // Check tokens against skill dictionary
      tokens.forEach(token => {
        if (this.skillDictionary.has(token)) {
          skillEntities.push(token);
        }
      });
      
      // Also check for multi-word skills
      const lowerText = text.toLowerCase();
      this.skillDictionary.forEach(skill => {
        if (lowerText.includes(skill) && !skillEntities.includes(skill)) {
          skillEntities.push(skill);
        }
      });
      
      // Extract years of experience
      const yearsMatch = text.match(/(\d+)\s*(years?|yrs?|anos?|années?)/i);
      const years = yearsMatch ? parseInt(yearsMatch[1]) : undefined;
      
      // Extract positions and companies
      const positions = this.extractPositions(text);
      const companies = this.extractCompanies(text);
      const degrees = this.extractDegrees(text);
      const institutions = this.extractInstitutions(text);
      const languages = this.extractLanguages(text);
      const certifications = this.extractCertifications(text);
      
      return {
        skills: [...new Set(skillEntities)],
        experience: {
          years,
          positions,
          companies,
        },
        education: {
          degrees,
          institutions,
        },
        languages,
        certifications,
      };
    } catch (error) {
      console.error('Error extracting entities with NLP:', error);
      // Fallback to basic extraction
      return {
        skills: [],
        experience: { positions: [], companies: [] },
        education: { degrees: [], institutions: [] },
        languages: [],
        certifications: [],
      };
    }
  }

  /**
   * Extract job positions from text
   */
  private extractPositions(text: string): string[] {
    const positionKeywords = [
      'captain', 'officer', 'engineer', 'chef', 'cook', 'waiter', 'steward',
      'housekeeper', 'entertainer', 'bartender', 'manager', 'supervisor',
      'technician', 'mechanic', 'electrician', 'plumber', 'carpenter',
    ];
    
    const positions: string[] = [];
    const lowerText = text.toLowerCase();
    
    positionKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        // Try to extract the full position title
        const regex = new RegExp(`(${keyword}[^\\n\\r,;]{0,50})`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          positions.push(...matches.map(m => m.trim()));
        }
      }
    });
    
    return [...new Set(positions)];
  }

  /**
   * Extract company names from text
   */
  private extractCompanies(text: string): string[] {
    // Look for capitalized words that might be company names
    const companyPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Cruise|Lines|Shipping|Maritime|Company|Corp|Inc|Ltd)/gi;
    const matches = text.match(companyPattern);
    return matches ? [...new Set(matches.map(m => m.trim()))] : [];
  }

  /**
   * Extract degrees from text
   */
  private extractDegrees(text: string): string[] {
    const degreePattern = /\b(Bachelor|Master|PhD|Ph\.D\.|Diploma|Certificate|Degree)\s+(?:of|in)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)?/gi;
    const matches = text.match(degreePattern);
    return matches ? [...new Set(matches.map(m => m.trim()))] : [];
  }

  /**
   * Extract educational institutions
   */
  private extractInstitutions(text: string): string[] {
    const institutionPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:University|College|Institute|School|Academy)/gi;
    const matches = text.match(institutionPattern);
    return matches ? [...new Set(matches.map(m => m.trim()))] : [];
  }

  /**
   * Extract languages from text
   */
  private extractLanguages(text: string): string[] {
    const commonLanguages = [
      'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
      'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian',
    ];
    
    const languages: string[] = [];
    const lowerText = text.toLowerCase();
    
    commonLanguages.forEach(lang => {
      if (lowerText.includes(lang.toLowerCase())) {
        languages.push(lang);
      }
    });
    
    return languages;
  }

  /**
   * Extract certifications from text
   */
  private extractCertifications(text: string): string[] {
    const certPattern = /\b(STCW|ISO|SOLAS|MARPOL|ISM|PSC|COC|COP|Certificate|Certification)\s*[:\-]?\s*([A-Z0-9]+)?/gi;
    const matches = text.match(certPattern);
    return matches ? [...new Set(matches.map(m => m.trim()))] : [];
  }

  /**
   * Calculate semantic similarity between two texts using NLP
   */
  calculateSemanticSimilarity(text1: string, text2: string): number {
    if (!this.initialized) {
      // Initialize synchronously if needed
      this.initialize().catch(console.error);
    }
    
    // Use natural library's string distance and tokenization
    const words1 = this.tokenizer.tokenize(text1.toLowerCase()) || [];
    const words2 = this.tokenizer.tokenize(text2.toLowerCase()) || [];
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    // Jaccard similarity
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = words1.filter(word => set2.has(word));
    const union = new Set([...words1, ...words2]);
    const jaccard = intersection.length / union.size;
    
    // Use natural library's string distance for individual word similarity
    let wordSimilaritySum = 0;
    let comparisons = 0;
    
    words1.forEach(word1 => {
      words2.forEach(word2 => {
        // Use Jaro-Winkler distance for better semantic matching
        const similarity = natural.JaroWinklerDistance(word1, word2, {});
        wordSimilaritySum += similarity;
        comparisons++;
      });
    });
    
    const avgWordSimilarity = comparisons > 0 ? wordSimilaritySum / comparisons : 0;
    
    // Combined similarity (weighted)
    return (jaccard * 0.6 + avgWordSimilarity * 0.4);
  }

  /**
   * Tokenize text into words (using natural library)
   */
  private tokenize(text: string): string[] {
    return this.tokenizer.tokenize(text.toLowerCase()) || [];
  }

  /**
   * Calculate word order similarity
   */
  private calculateOrderSimilarity(words1: string[], words2: string[]): number {
    if (words1.length === 0 || words2.length === 0) return 0;
    
    let matches = 0;
    const minLength = Math.min(words1.length, words2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (words1[i] === words2[i]) matches++;
    }
    
    return matches / minLength;
  }
}

export default new NLPService();
