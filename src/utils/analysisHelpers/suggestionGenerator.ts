import { calculateFleschKincaid } from '../readabilityHelpers';

export const generateSuggestions = (content: string): string[] => {
  const suggestions: string[] = [];
  const contentLower = content.toLowerCase();
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const firstSentence = sentences[0] || '';
  const readability = calculateFleschKincaid(content);
  
  if (!firstSentence.includes('?') && 
      !['why', 'how', 'what', 'imagine'].some(hook => firstSentence.toLowerCase().includes(hook))) {
    suggestions.push("Consider starting with a hook question or engaging statement");
  }
  
  const longSentences = sentences.filter(s => s.split(/\s+/).length > 25);
  if (longSentences.length > sentences.length * 0.2) {
    suggestions.push("Some sentences are too long. Consider breaking them down for better pacing");
  }
  
  if (!contentLower.includes('?')) {
    suggestions.push("Add rhetorical questions to increase audience engagement");
  }
  
  if (!['subscribe', 'follow', 'like', 'share', 'comment'].some(cta => contentLower.includes(cta))) {
    suggestions.push("Include a clear call-to-action to encourage audience interaction");
  }
  
  if (readability.grade > 12) {
    suggestions.push("Consider simplifying your language for better accessibility");
  }
  
  if (sentences.length < 3) {
    suggestions.push("Content seems too short. Expand your ideas for better engagement");
  }
  
  return suggestions;
};