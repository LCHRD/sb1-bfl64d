import React from 'react';
import { Video } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Video className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900">RIVERS</h1>
        </div>
        <p className="mt-2 text-gray-600">Refine, Improve, and Verify Every Script</p>
      </div>
    </header>
  );
};