export const analyzeEnergy = (content: string): number => {
  const energeticWords = [
    'exciting', 'amazing', 'incredible', 'powerful', 'dynamic',
    'revolutionary', 'innovative', 'transformative', 'inspiring',
    'energetic', 'vibrant', 'passionate', 'enthusiastic'
  ];

  const exclamationCount = (content.match(/!/g) || []).length;
  const contentWords = content.toLowerCase().split(/\s+/);
  const energeticWordCount = contentWords.filter(word => 
    energeticWords.some(energetic => word.includes(energetic))
  ).length;

  const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim()).length;
  
  // Calculate energy score based on:
  // 1. Presence of energetic words (40%)
  // 2. Use of exclamation marks (30%)
  // 3. Sentence variation (30%)
  
  const energeticWordsScore = Math.min((energeticWordCount / contentWords.length) * 100 * 2, 40);
  const exclamationScore = Math.min((exclamationCount / sentenceCount) * 100 * 1.5, 30);
  const variationScore = 30; // Base score, could be adjusted based on sentence length variation

  return energeticWordsScore + exclamationScore + variationScore;
};