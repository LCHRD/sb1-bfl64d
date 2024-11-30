import React from 'react';
import { ScriptAnalysis } from '../types/analysis';
import { Award, Zap, Brain, Scale, BookOpen, Gauge } from 'lucide-react';

interface ScriptMetricsProps {
  analysis: ScriptAnalysis;
}

export const ScriptMetrics: React.FC<ScriptMetricsProps> = ({ analysis }) => {
  const metrics = [
    {
      label: 'Overall Grade',
      value: analysis.overallGrade.score,
      tier: analysis.overallGrade.tier,
      color: analysis.overallGrade.color,
      icon: Award
    },
    {
      label: 'Energy',
      value: analysis.energy,
      icon: Zap
    },
    {
      label: 'Readability',
      value: analysis.readability.score,
      icon: BookOpen
    },
    {
      label: 'Engagement',
      value: analysis.engagement,
      icon: Brain
    },
    {
      label: 'Opinion Balance',
      value: analysis.opinionBalance,
      icon: Scale
    },
    {
      label: 'Hook Strength',
      value: analysis.hookStrength,
      icon: Gauge
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-6">Script Analysis</h3>
      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={index} className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <metric.icon className="w-5 h-5 text-gray-600" />
                <span className="font-medium">{metric.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {metric.tier ? metric.tier : `${metric.value.toFixed(2)}%`}
                </span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  metric.color ? `bg-${metric.color}` : 'bg-blue-500'
                }`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};