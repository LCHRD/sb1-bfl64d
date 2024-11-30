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

  return score;
};