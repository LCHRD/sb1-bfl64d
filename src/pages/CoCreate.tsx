import React, { useState, useCallback, useRef } from 'react';
import { analyzeScript } from '../utils/scriptAnalyzer';
import { ScriptMetrics } from '../components/ScriptMetrics';
import { TopicSuggestions } from '../components/TopicSuggestions';
import { ScriptAnalysis } from '../types/analysis';
import { PenTool } from 'lucide-react';

export const CoCreate: React.FC = () => {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<ScriptAnalysis | null>(null);
  const analysisTimeoutRef = useRef<number | null>(null);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (analysisTimeoutRef.current) {
      window.clearTimeout(analysisTimeoutRef.current);
    }

    analysisTimeoutRef.current = window.setTimeout(() => {
      if (newContent.trim()) {
        const newAnalysis = analyzeScript(newContent);
        setAnalysis(newAnalysis);
      } else {
        setAnalysis(null);
      }
    }, 800);
  }, []);

  const handleTopicSelect = (excerpt: string) => {
    setContent(excerpt);
    const newAnalysis = analyzeScript(excerpt);
    setAnalysis(newAnalysis);
  };

  return (
    <div className="space-y-8">
      <TopicSuggestions onSelect={handleTopicSelect} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-6">
              <PenTool className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Co-Create Your Script</h2>
            </div>
            <div className="space-y-4">
              <textarea
                value={content}
                onChange={handleContentChange}
                className="w-full h-[50vh] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-y-auto"
                placeholder="Start writing your script here... Analysis will appear after you pause typing."
              />
              <div className="text-sm text-gray-500">
                Analysis updates automatically 0.8 seconds after you stop typing.
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {analysis && <ScriptMetrics analysis={analysis} />}
        </div>
      </div>
    </div>
  );
};