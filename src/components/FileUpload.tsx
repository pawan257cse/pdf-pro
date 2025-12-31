import { Upload, X, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';

interface FileUploadProps {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  maxSize?: number;
  showError?: (message: string) => void;
}

export default function FileUpload({ 
  accept, 
  multiple = false, 
  onFilesSelected, 
  maxSize = 50,
  showError 
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const fileArray = Array.from(selectedFiles);
    const invalidFiles: string[] = [];
    const validFiles = fileArray.filter(file => {
      // Check file type
      if (accept.includes('pdf') && !file.type.includes('pdf') && file.name.toLowerCase().endsWith('.pdf')) {
        // Allow PDF files even if MIME type is incorrect
      } else if (accept && !file.type.match(accept.replace(/\*/g, '.*')) && !file.name.toLowerCase().match(accept.replace(/\./g, '\\.').replace(/\*/g, '.*'))) {
        invalidFiles.push(`${file.name} (invalid file type)`);
        return false;
      }

      // Check file size
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSize) {
        invalidFiles.push(`${file.name} (${sizeMB.toFixed(2)}MB exceeds ${maxSize}MB limit)`);
        return false;
      }

      return true;
    });

    if (invalidFiles.length > 0) {
      const errorMsg = `Invalid files:\n${invalidFiles.join('\n')}`;
      setError(errorMsg);
      if (showError) {
        showError(errorMsg);
      }
    } else {
      setError(null);
    }

    if (validFiles.length > 0) {
    setFiles(validFiles);
      setUploading(true);
      
      // Simulate upload progress
      setTimeout(() => {
        setUploading(false);
    onFilesSelected(validFiles);
      }, 300);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 sm:p-6 md:p-8 text-center cursor-pointer transition-all relative touch-manipulation ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 active:bg-blue-50'
        } ${uploading ? 'opacity-75 cursor-wait' : ''}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label="Upload files"
      >
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl z-10">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <Upload className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 ${dragActive ? 'text-blue-500' : error ? 'text-red-500' : 'text-slate-400'}`} />
        <p className="text-xs sm:text-sm font-medium text-slate-700 mb-1">
          {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-slate-500">
          {accept.includes('pdf') ? 'PDF files' : 'Image files'} up to {maxSize}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Upload Error</p>
            <p className="text-xs text-red-600 mt-1 whitespace-pre-line">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="p-1 hover:bg-red-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="ml-3 p-1.5 sm:p-1 hover:bg-red-100 rounded transition-colors touch-manipulation flex-shrink-0"
                title="Remove file"
                aria-label="Remove file"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
