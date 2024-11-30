import React from 'react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { FileText, Video, PenTool } from 'lucide-react';

export const UsageStats: React.FC = () => {
  const { currentPlan, usage } = useSubscriptionStore();

  const tools = [
    { name: 'Script Analysis', icon: FileText, usage: usage.scriptAnalysis },
    { name: 'Video Analysis', icon: Video, usage: usage.videoAnalysis },
    { name: 'Co-Create', icon: PenTool, usage: usage.coCreate }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Usage Statistics</h3>
      <div className="space-y-3">
        {tools.map(({ name, icon: Icon, usage: usageCount }) => (
          <div key={name} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{name}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{usageCount}</span>
              <span className="text-gray-500">/{currentPlan.generationsPerTool}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};