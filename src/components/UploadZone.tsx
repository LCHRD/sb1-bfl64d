import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface UploadZoneProps {
  onUpload: (file: File) => void;
  acceptedTypes: Record<string, string[]>;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUpload, acceptedTypes }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB max file size
  });

  return (
    <div
      {...getRootProps()}
      className={`p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-4">
        <Upload className="w-12 h-12 text-gray-400" />
        <p className="text-lg text-gray-600">
          {isDragActive
            ? "Drop your file here..."
            : "Drag & drop your file, or click to select"}
        </p>
        <p className="text-sm text-gray-500">
          Supports {Object.values(acceptedTypes).flat().join(', ')} (max 100MB)
        </p>
      </div>
    </div>
  );
};