import React from 'react';
import { FileText, Video, PenTool, Settings, History } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { UsageStats } from './UsageStats';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">RIVERS</h1>
        <p className="text-sm text-gray-600 mt-1">Script Analysis Tool</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/script"
          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            isActive('/script')
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Written Scripts</span>
        </Link>
        
        <Link
          to="/video"
          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            isActive('/video')
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Video className="w-5 h-5" />
          <span>Video Analysis</span>
        </Link>

        <Link
          to="/co-create"
          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            isActive('/co-create')
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <PenTool className="w-5 h-5" />
          <span>Co-Create</span>
        </Link>
      </nav>

      <div className="p-4 space-y-2">
        <UsageStats />
        
        <Link
          to="/history"
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <History className="w-5 h-5" />
          <span>History</span>
        </Link>

        <Link
          to="/settings"
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};