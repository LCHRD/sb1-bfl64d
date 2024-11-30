export const analyzeOpinionBalance = (content: string): number => {
  const opinionMarkers = {
    subjective: [
      'I think', 'I believe', 'in my opinion', 'I feel',
      'should', 'must', 'better', 'worse', 'best', 'worst'
    ],
    objective: [
      'research shows', 'studies indicate', 'according to',
      'data suggests', 'evidence shows', 'statistics show'
    ],
    neutral: [
      'however', 'alternatively', 'on the other hand',
      'while', 'although', 'despite', 'nevertheless'
    ]
  };

  const contentLower = content.toLowerCase();
  
  // Count occurrences of each type of marker
  const subjectiveCount = opinionMarkers.subjective.reduce((count, marker) =>
    count + (contentLower.match(new RegExp(marker, 'g')) || []).length, 0
  );
  
  const objectiveCount = opinionMarkers.objective.reduce((count, marker) =>
    count + (contentLower.match(new RegExp(marker, 'g')) || []).length, 0
  );
  
  const neutralCount = opinionMarkers.neutral.reduce((count, marker) =>
    count + (contentLower.match(new RegExp(marker, 'g')) || []).length, 0
  );

  // Calculate balance score
  const total = subjectiveCount + objectiveCount + neutralCount || 1;
  const balance = (objectiveCount + neutralCount) / total;
  
  // Convert to percentage and ensure it's between 0-100
  return Math.min(balance * 100, 100);
};