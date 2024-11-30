import React from 'react';
import { UploadedScript } from '../types/analysis';

interface VideoViewerProps {
  script: UploadedScript;
}

export const VideoViewer: React.FC<VideoViewerProps> = ({ script }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Video Preview</h3>
          <div className="lg:h-[50vh] relative">
            {script.videoUrl ? (
              <video
                className="w-full h-full rounded-lg shadow-sm object-contain bg-black"
                controls
                src={script.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500 h-full flex items-center justify-center">
                Video preview not available
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Transcript</h3>
          <div className="bg-gray-50 p-4 rounded-lg h-[50vh] overflow-y-auto">
            <p className="whitespace-pre-wrap text-gray-700">
              {script.transcript || script.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};