import React from 'react';
import { ScriptAnalysis } from '../types/analysis';
import { Gauge, ThumbsUp, Clock, BookOpen } from 'lucide-react';

interface AnalysisResultsProps {
  analysis: ScriptAnalysis;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<ThumbsUp className="w-6 h-6" />}
          title="Hook Strength"
          value={analysis.hookStrength}
        />
        <MetricCard
          icon={<Gauge className="w-6 h-6" />}
          title="Engagement"
          value={analysis.engagement}
        />
        <MetricCard
          icon={<Clock className="w-6 h-6" />}
          title="Pacing"
          value={analysis.pacing}
        />
        <ReadabilityCard
          icon={<BookOpen className="w-6 h-6" />}
          readability={analysis.readability}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Suggestions for Improvement</h3>
        <ul className="space-y-2">
          {analysis.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-block w-4 h-4 mt-1 mr-2 bg-blue-500 rounded-full" />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
}> = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center space-x-3 mb-4">
      <div className="text-blue-500">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
    </div>
    <div className="relative pt-1">
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
        <div
          style={{ width: `${value}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
        />
      </div>
      <span className="text-xl font-bold">{value.toFixed(2)}%</span>
    </div>
  </div>
);

const ReadabilityCard: React.FC<{
  icon: React.ReactNode;
  readability: ScriptAnalysis['readability'];
}> = ({ icon, readability }) => {
  const textColorClass = `text-${readability.color}`;
  const bgColorClass = `bg-${readability.color}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center space-x-3 mb-4">
        <div className={textColorClass}>{icon}</div>
        <h3 className="font-semibold">Readability</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Grade Level</span>
          <span className={textColorClass + " font-semibold"}>
            {readability.grade.toFixed(1)}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded">
          <div
            className={`h-full rounded ${bgColorClass}`}
            style={{ width: `${Math.min(100, (readability.grade / 20) * 100)}%` }}
          />
        </div>
        <p className={`text-sm font-medium ${textColorClass}`}>
          {readability.level}
        </p>
      </div>
    </div>
  );
};