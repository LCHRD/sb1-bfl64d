import { ReadabilityScore } from '../types/analysis';
import { calculateFleschKincaid } from './readabilityHelpers';

export const analyzeHook = (content: string): number => {
  const firstSentence = content.split(/[.!?]+/)[0] || '';
  const firstSentenceLower = firstSentence.toLowerCase();
  
  let score = 0;
  
  // Check for hook types (100 points total)
  const hookPatterns = {
    question: {
      pattern: /\?/,
      weight: 25
    },
    statistic: {
      pattern: /\d+%|\d+\s(?:million|billion|trillion)|[\d,.]+/,
      weight: 20
    },
    emotionalTrigger: {
      pattern: /amazing|incredible|shocking|surprising|unbelievable|never|every|always/i,
      weight: 15
    },
    curiosityGap: {
      pattern: /(?:why|how|what|when|where)\s(?:do|does|did|is|are|was|were|will|would|could|should)/i,
      weight: 20
    },
    personalAddress: {
      pattern: /\b(?:you|your|you'll|you're|we|our)\b/i,
      weight: 10
    },
    story: {
      pattern: /\b(?:imagine|picture|think about|consider|when i|once|one day)\b/i,
      weight: 10
    }
  };

  // Calculate score based on hook patterns
  Object.entries(hookPatterns).forEach(([_, { pattern, weight }]) => {
    if (pattern.test(firstSentenceLower)) {
      score += weight;
    }
  });

  // Length penalty (if too short or too long)
  const wordCount = firstSentence.split(/\s+/).length;
  if (wordCount < 5) score *= 0.5;
  if (wordCount > 25) score *= 0.8;

  return Number(score.toFixed(2));
};

export const analyzeEngagement = (content: string): number => {
  const engagementMarkers = {
    hooks: ['why', 'how', 'what if', 'imagine', 'discover'],
    questions: ['?'],
    emotionalWords: ['amazing', 'incredible', 'exciting', 'surprising', 'shocking'],
    callToAction: ['subscribe', 'follow', 'like', 'share', 'comment'],
  };

  let score = 0;
  const contentLower = content.toLowerCase();

  // Check for hooks (40% weight)
  const hookCount = engagementMarkers.hooks.reduce((count, hook) => 
    count + (contentLower.match(new RegExp(hook, 'g')) || []).length, 0
  );
  score += Math.min(hookCount * 8, 40);

  // Check for questions (20% weight)
  const questionCount = (content.match(/\?/g) || []).length;
  score += Math.min(questionCount * 5, 20);

  // Check for emotional words (20% weight)
  const emotionalCount = engagementMarkers.emotionalWords.reduce((count, word) => 
    count + (contentLower.match(new RegExp(word, 'g')) || []).length, 0
  );
  score += Math.min(emotionalCount * 4, 20);

  // Check for calls to action (20% weight)
  const ctaCount = engagementMarkers.callToAction.reduce((count, cta) => 
    count + (contentLower.match(new RegExp(cta, 'g')) || []).length, 0
  );
  score += Math.min(ctaCount * 4, 20);

  return Number(score.toFixed(2));
};

export const analyzePacing = (content: string): number => {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = content.split(/\s+/);
  
  if (sentences.length === 0) return 0;

  // Calculate average words per sentence
  const avgWordsPerSentence = words.length / sentences.length;
  
  // Calculate sentence length variation
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const variation = Math.std(sentenceLengths) || 0;
  
  // Ideal metrics
  const idealAvgLength = 15;
  const idealVariation = 5;
  
  // Score based on deviation from ideal (60% weight for average length, 40% for variation)
  const avgLengthScore = Math.max(0, 60 - Math.abs(idealAvgLength - avgWordsPerSentence) * 2);
  const variationScore = Math.max(0, 40 - Math.abs(idealVariation - variation) * 3);
  
  return Number((avgLengthScore + variationScore).toFixed(2));
};

// Helper function to calculate standard deviation
Math.std = function(array: number[]): number {
  const mean = array.reduce((a, b) => a + b) / array.length;
  const variance = array.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / array.length;
  return Math.sqrt(variance);
};

export const generateSuggestions = (content: string): string[] => {
  const suggestions: string[] = [];
  const contentLower = content.toLowerCase();
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const firstSentence = sentences[0] || '';
  const readability = calculateFleschKincaid(content);
  
  // Hook analysis
  if (!firstSentence.includes('?') && 
      !['why', 'how', 'what', 'imagine'].some(hook => firstSentence.toLowerCase().includes(hook))) {
    suggestions.push("Consider starting with a hook question or engaging statement");
  }
  
  // Pacing analysis
  const longSentences = sentences.filter(s => s.split(/\s+/).length > 25);
  if (longSentences.length > sentences.length * 0.2) {
    suggestions.push("Some sentences are too long. Consider breaking them down for better pacing");
  }
  
  // Engagement elements
  if (!contentLower.includes('?')) {
    suggestions.push("Add rhetorical questions to increase audience engagement");
  }
  
  if (!['subscribe', 'follow', 'like', 'share', 'comment'].some(cta => contentLower.includes(cta))) {
    suggestions.push("Include a clear call-to-action to encourage audience interaction");
  }
  
  // Readability suggestions
  if (readability.grade > 12) {
    suggestions.push("Consider simplifying your language for better accessibility");
  }
  
  // Content structure
  if (sentences.length < 3) {
    suggestions.push("Content seems too short. Expand your ideas for better engagement");
  }
  
  return suggestions;
};