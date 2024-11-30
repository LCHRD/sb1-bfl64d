import { ScriptAnalysis } from '../types/analysis';
import { analyzeEngagement } from './analysisHelpers/engagementAnalyzer';
import { analyzeHook } from './analysisHelpers/hookAnalyzer';
import { analyzePacing } from './analysisHelpers/pacingAnalyzer';
import { generateSuggestions } from './analysisHelpers/suggestionGenerator';
import { calculateFleschKincaid } from './readabilityHelpers';
import { analyzeEnergy } from './analysisHelpers/energyAnalyzer';
import { analyzeOpinionBalance } from './analysisHelpers/opinionAnalyzer';

export const analyzeScript = (content: string): ScriptAnalysis => {
  const engagement = Number(analyzeEngagement(content).toFixed(2));
  const hookStrength = Number(analyzeHook(content).toFixed(2));
  const pacing = Number(analyzePacing(content).toFixed(2));
  const readability = calculateFleschKincaid(content);
  const energy = Number(analyzeEnergy(content).toFixed(2));
  const opinionBalance = Number(analyzeOpinionBalance(content).toFixed(2));

  // Calculate overall grade
  const scores = [engagement, hookStrength, pacing, readability.score, energy, opinionBalance];
  const averageScore = scores.reduce((a, b) => a + b) / scores.length;
  
  const getGradeTier = (score: number): { tier: 'S' | 'A' | 'B' | 'C' | 'D' | 'F'; color: string } => {
    if (score >= 95) return { tier: 'S', color: 'indigo-500' };
    if (score >= 85) return { tier: 'A', color: 'green-500' };
    if (score >= 75) return { tier: 'B', color: 'blue-500' };
    if (score >= 65) return { tier: 'C', color: 'yellow-500' };
    if (score >= 55) return { tier: 'D', color: 'orange-500' };
    return { tier: 'F', color: 'red-500' };
  };

  const { tier, color } = getGradeTier(averageScore);

  return {
    engagement,
    hookStrength,
    pacing,
    readability,
    energy,
    opinionBalance,
    suggestions: generateSuggestions(content),
    overallGrade: {
      score: averageScore,
      tier,
      color
    }
  };
};