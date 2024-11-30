export interface ScriptAnalysis {
  engagement: number;
  hookStrength: number;
  pacing: number;
  readability: ReadabilityScore;
  suggestions: string[];
  opinionBalance: number;
  energy: number;
  overallGrade: {
    score: number;
    tier: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
    color: string;
  };
}

export interface ReadabilityScore {
  score: number;
  grade: number;
  level: string;
  color: string;
}

export interface UploadedScript {
  id: string;
  content: string;
  type: 'text' | 'video';
  timestamp: number;
  videoUrl?: string;
  transcript?: string;
}

export interface TopicSuggestion {
  title: string;
  excerpt: string[];
  category: string;
}