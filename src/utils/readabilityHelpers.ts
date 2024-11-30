import { ReadabilityScore } from '../types/analysis';

export const calculateFleschKincaid = (text: string): ReadabilityScore => {
  // Split into sentences and words
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  
  if (sentences.length === 0 || words.length === 0) {
    return {
      score: 0,
      grade: 0,
      level: 'N/A',
      color: 'gray-500'
    };
  }

  // Count syllables
  const syllableCount = words.reduce((count, word) => count + countSyllables(word), 0);
  
  // Calculate metrics
  const averageWordsPerSentence = words.length / sentences.length;
  const averageSyllablesPerWord = syllableCount / words.length;
  
  // Flesch-Kincaid Grade Level formula
  const grade = 0.39 * averageWordsPerSentence + 11.8 * averageSyllablesPerWord - 15.59;
  const gradeRounded = Number(Math.max(0, grade).toFixed(2));
  
  // Determine reading level and color
  const level = determineReadingLevel(gradeRounded);
  const color = determineReadabilityColor(gradeRounded);

  return {
    score: Number((100 - grade).toFixed(2)),
    grade: gradeRounded,
    level,
    color
  };
};

const countSyllables = (word: string): number => {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
};

const determineReadingLevel = (grade: number): string => {
  if (grade < 6) return 'Very Easy';
  if (grade < 8) return 'Easy';
  if (grade < 10) return 'Fairly Easy';
  if (grade < 12) return 'Standard';
  if (grade < 14) return 'Fairly Difficult';
  if (grade < 16) return 'Difficult';
  return 'Very Difficult';
};

const determineReadabilityColor = (grade: number): string => {
  if (grade < 6) return 'green-500';
  if (grade < 8) return 'emerald-500';
  if (grade < 10) return 'blue-500';
  if (grade < 12) return 'yellow-500';
  if (grade < 14) return 'orange-500';
  if (grade < 16) return 'red-500';
  return 'red-700';
};