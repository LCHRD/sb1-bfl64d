import React, { useState } from 'react';
import { UploadZone } from '../components/UploadZone';
import { AnalysisResults } from '../components/AnalysisResults';
import { ScriptAnalysis, UploadedScript } from '../types/analysis';
import { analyzeScript } from '../utils/scriptAnalyzer';

export const ScriptAnalyzer: React.FC = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<ScriptAnalysis | null>(null);
  const [uploadedScript, setUploadedScript] = useState<UploadedScript | null>(null);

  const handleUpload = async (file: File) => {
    const content = await file.text();
    const scriptData: UploadedScript = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      type: 'text',
      timestamp: Date.now(),
    };

    setUploadedScript(scriptData);
    const analysis = analyzeScript(content);
    setCurrentAnalysis(analysis);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Written Script</h2>
        <UploadZone onUpload={handleUpload} acceptedTypes={{ 'text/plain': ['.txt'] }} />
      </div>

      {uploadedScript && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <h2 className="text-xl font-semibold">Script Content</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Uploaded {new Date(uploadedScript.timestamp).toLocaleString()}
          </p>
          <div className="bg-gray-50 p-4 rounded max-h-[50vh] overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap">{uploadedScript.content}</p>
          </div>
        </div>
      )}

      {currentAnalysis && <AnalysisResults analysis={currentAnalysis} />}
    </div>
  );
};