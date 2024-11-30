import React, { useState } from 'react';
import { UploadZone } from '../components/UploadZone';
import { VideoViewer } from '../components/VideoViewer';
import { AnalysisResults } from '../components/AnalysisResults';
import { ScriptAnalysis, UploadedScript } from '../types/analysis';
import { analyzeScript } from '../utils/scriptAnalyzer';

export const VideoAnalyzer: React.FC = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<ScriptAnalysis | null>(null);
  const [uploadedScript, setUploadedScript] = useState<UploadedScript | null>(null);

  const handleUpload = async (file: File) => {
    const scriptData: UploadedScript = {
      id: Math.random().toString(36).substr(2, 9),
      content: '',
      type: 'video',
      timestamp: Date.now(),
      videoUrl: URL.createObjectURL(file),
      transcript: "This is a placeholder transcript. In a production environment, you would integrate with a speech-to-text service to generate the actual transcript from the video.",
    };

    setUploadedScript(scriptData);
    const analysis = analyzeScript(scriptData.transcript);
    setCurrentAnalysis(analysis);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
        <UploadZone
          onUpload={handleUpload}
          acceptedTypes={{ 'video/*': ['.mp4', '.mov', '.avi', '.webm'] }}
        />
      </div>

      {uploadedScript && <VideoViewer script={uploadedScript} />}
      {currentAnalysis && <AnalysisResults analysis={currentAnalysis} />}
    </div>
  );
};