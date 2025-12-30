// Mapping of subject names/slugs to local image assets
import subjectMaths from '@/assets/subject-maths.png';
import subjectEnglish from '@/assets/subject-english.png';
import subjectScience from '@/assets/subject-science.png';
import subjectCommerce from '@/assets/subject-commerce.png';
import subjectComputer from '@/assets/subject-computer.png';
import subjectHindi from '@/assets/subject-hindi.png';

// Map subject names and slugs to their corresponding images
const subjectImageMap: Record<string, string> = {
  // Maths
  'maths': subjectMaths,
  'mathematics': subjectMaths,
  'math': subjectMaths,
  
  // English
  'english': subjectEnglish,
  
  // Science (used for Physics, Chemistry, Biology)
  'science': subjectScience,
  'physics': subjectScience,
  'chemistry': subjectScience,
  'biology': subjectScience,
  'environmental science': subjectScience,
  'environmental-science': subjectScience,
  'biotechnology': subjectScience,
  
  // Commerce (used for business, economics, accountancy, test prep)
  'commerce': subjectCommerce,
  'accountancy': subjectCommerce,
  'accounts': subjectCommerce,
  'economics': subjectCommerce,
  'business studies': subjectCommerce,
  'business-studies': subjectCommerce,
  'business': subjectCommerce,
  'entrepreneurship': subjectCommerce,
  'sat': subjectCommerce,
  'act': subjectCommerce,
  'cat': subjectCommerce,
  'nmat': subjectCommerce,
  'gmat': subjectCommerce,
  'ca': subjectCommerce,
  'cfa': subjectCommerce,
  'upsc': subjectCommerce,
  'ssc': subjectCommerce,
  'banking': subjectCommerce,
  'railways': subjectCommerce,
  'defence': subjectCommerce,
  'nda': subjectCommerce,
  'cds': subjectCommerce,
  'afcat': subjectCommerce,
  'clat': subjectCommerce,
  'lsat': subjectCommerce,
  'gre': subjectCommerce,
  'toefl': subjectCommerce,
  'ielts': subjectCommerce,
  'pte': subjectCommerce,
  
  // Computer (used for tech-related subjects)
  'computer': subjectComputer,
  'computer science': subjectComputer,
  'computer-science': subjectComputer,
  'informatics practices': subjectComputer,
  'informatics-practices': subjectComputer,
  'artificial intelligence': subjectComputer,
  'artificial-intelligence': subjectComputer,
  'data science': subjectComputer,
  'data-science': subjectComputer,
  'multimedia & web technology': subjectComputer,
  'multimedia-web-technology': subjectComputer,
  'multimedia and web technology': subjectComputer,
  'robotics': subjectComputer,
  'cyber security': subjectComputer,
  'cyber-security': subjectComputer,
  'cybersecurity': subjectComputer,
  'engineering graphics': subjectComputer,
  'multimedia & web technology': subjectComputer,
  
  // Hindi (used for other languages)
  'hindi': subjectHindi,
  'bengali': subjectHindi,
  'sanskrit': subjectHindi,
  'urdu': subjectHindi,
  'punjabi': subjectHindi,
  'gujarati': subjectHindi,
  'marathi': subjectHindi,
  'telugu': subjectHindi,
  'tamil': subjectHindi,
  'kannada': subjectHindi,
  'malayalam': subjectHindi,
  'odia': subjectHindi,
  'assamese': subjectHindi,
  'nepali': subjectHindi,
  'manipuri': subjectHindi,
  'mizo': subjectHindi,
  'arabic': subjectHindi,
  'persian': subjectHindi,
  'russian': subjectHindi,
  'japanese': subjectHindi,
  'chinese': subjectHindi,
  'korean': subjectHindi,
  'italian': subjectHindi,
  'portuguese': subjectHindi,
  'french': subjectHindi,
  'german': subjectHindi,
  'spanish': subjectHindi,
  
  // Use Science for social sciences and humanities
  'history & civics': subjectScience,
  'history and civics': subjectScience,
  'history-civics': subjectScience,
  'history': subjectScience,
  'civics': subjectScience,
  'geography': subjectScience,
  'political science': subjectScience,
  'political-science': subjectScience,
  'sociology': subjectScience,
  'psychology': subjectScience,
  'philosophy': subjectScience,
  'legal studies': subjectScience,
  'legal-studies': subjectScience,
  
  // Use Commerce for arts and creative subjects (or could use Science)
  'drawing': subjectCommerce,
  'fine arts': subjectCommerce,
  'fine-arts': subjectCommerce,
  'music': subjectCommerce,
  'dance': subjectCommerce,
  'drama': subjectCommerce,
  'fashion studies': subjectCommerce,
  'fashion-studies': subjectCommerce,
  'mass media studies': subjectCommerce,
  'mass-media-studies': subjectCommerce,
  'home science': subjectCommerce,
  'home-science': subjectCommerce,
  'physical education': subjectCommerce,
  'physical-education': subjectCommerce,
};

/**
 * Normalize a subject name/slug for matching
 * Handles special characters, spaces, and variations
 */
function normalizeSubjectKey(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and') // Replace & with 'and'
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters except spaces
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim();
}

/**
 * Get the local image path for a subject based on its name or slug
 * @param subjectName - The name of the subject
 * @param subjectSlug - The slug of the subject (optional)
 * @returns The image path or null if no match found
 */
export function getSubjectImage(subjectName?: string | null, subjectSlug?: string | null): string | null {
  if (!subjectName && !subjectSlug) {
    return null;
  }
  
  // Try to find a match using the slug first (more reliable)
  if (subjectSlug) {
    const slugKey = normalizeSubjectKey(subjectSlug);
    // Try exact match
    if (subjectImageMap[slugKey]) {
      return subjectImageMap[slugKey];
    }
    // Try with hyphens replaced by spaces
    const slugKeyWithSpaces = slugKey.replace(/-/g, ' ');
    if (subjectImageMap[slugKeyWithSpaces]) {
      return subjectImageMap[slugKeyWithSpaces];
    }
  }
  
  // Try to find a match using the name
  if (subjectName) {
    const nameKey = normalizeSubjectKey(subjectName);
    // Try exact match
    if (subjectImageMap[nameKey]) {
      return subjectImageMap[nameKey];
    }
    
    // Try partial matches for compound names
    // Check if any key is contained in the name or vice versa
    for (const [key, image] of Object.entries(subjectImageMap)) {
      const normalizedKey = normalizeSubjectKey(key);
      // Check if key words are in the name
      const keyWords = normalizedKey.split(' ');
      const nameWords = nameKey.split(' ');
      
      // If all key words are in the name, it's a match
      if (keyWords.length > 0 && keyWords.every(word => nameWords.some(nw => nw.includes(word) || word.includes(nw)))) {
        return image;
      }
      
      // Also check if name contains the key or key contains the name
      if (nameKey.includes(normalizedKey) || normalizedKey.includes(nameKey)) {
        return image;
      }
    }
  }
  
  return null;
}

