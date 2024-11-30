export const analyzePacing = (content: string): number => {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = content.split(/\s+/);
  
  if (sentences.length === 0) return 0;

  const avgWordsPerSentence = words.length / sentences.length;
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const variation = calculateStandardDeviation(sentenceLengths);
  
  const idealAvgLength = 15;
  const idealVariation = 5;
  
  const avgLengthScore = Math.max(0, 60 - Math.abs(idealAvgLength - avgWordsPerSentence) * 2);
  const variationScore = Math.max(0, 40 - Math.abs(idealVariation - variation) * 3);
  
  return avgLengthScore + variationScore;
};

const calculateStandardDeviation = (array: number[]): number => {
  const mean = array.reduce((a, b) => a + b) / array.length;
  const variance = array.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / array.length;
  return Math.sqrt(variance);
};