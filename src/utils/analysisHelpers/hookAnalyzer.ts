export const analyzeHook = (content: string): number => {
  const firstSentence = content.split(/[.!?]+/)[0] || '';
  const firstSentenceLower = firstSentence.toLowerCase();
  
  let score = 0;
  
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

  Object.entries(hookPatterns).forEach(([_, { pattern, weight }]) => {
    if (pattern.test(firstSentenceLower)) {
      score += weight;
    }
  });

  const wordCount = firstSentence.split(/\s+/).length;
  if (wordCount < 5) score *= 0.5;
  if (wordCount > 25) score *= 0.8;

  return score;
};