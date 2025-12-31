import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { Combine, ArrowLeft, Download, Loader2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '../components/Toast';

export default function Merge() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const moveFileUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    setFiles(newFiles);
  };

  const moveFileDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.warning('Please select at least 2 PDF files to merge');
      return;
    }

    setProcessing(true);

    try {
      const { mergePdfs, downloadPdf } = await import('../utils/pdfUtils');
      const mergedPdf = await mergePdfs(files);
      const filename = `merged_${Date.now()}.pdf`;
      downloadPdf(mergedPdf, filename);
      toast.success(`Successfully merged ${files.length} PDF files!`);
      setFiles([]);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      toast.error('Failed to merge PDFs. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Layout>
      <Link
        to="/"
        className="inline-flex items-center text-sm text-slate-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to All Tools
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6 text-white">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <Combine className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold truncate">Merge PDF Files</h1>
                <p className="text-blue-100 text-xs sm:text-sm mt-1">
                  Combine multiple PDF documents into one
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <FileUpload
              accept=".pdf"
              multiple={true}
              onFilesSelected={setFiles}
            />

            {files.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Merge Order ({files.length} PDF{files.length > 1 ? 's' : ''})
                  </h3>
                  <p className="text-xs text-slate-500">Use arrows to reorder</p>
                </div>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center gap-2 sm:gap-3 bg-slate-50 border border-slate-200 rounded-lg p-2 sm:p-3 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                        <div className="flex flex-col gap-0.5 sm:gap-1 flex-shrink-0">
                          <button
                            onClick={() => moveFileUp(index)}
                            disabled={index === 0}
                            className="p-1.5 sm:p-1 hover:bg-blue-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors touch-manipulation"
                            title="Move up"
                            aria-label="Move file up"
                          >
                            <ChevronUp className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => moveFileDown(index)}
                            disabled={index === files.length - 1}
                            className="p-1.5 sm:p-1 hover:bg-blue-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors touch-manipulation"
                            title="Move down"
                            aria-label="Move file down"
                          >
                            <ChevronDown className="w-4 h-4 text-blue-600" />
                          </button>
                        </div>
                        <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs sm:text-sm font-semibold text-blue-700">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-2 hover:bg-red-100 rounded transition-colors flex-shrink-0 touch-manipulation"
                        title="Remove file"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleMerge}
              disabled={files.length < 2 || processing}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 sm:py-3.5 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 touch-manipulation text-sm sm:text-base"
              aria-label="Merge PDF files"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Merge & Download</span>
                </>
              )}
            </button>

            <div className="bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2 text-xs sm:text-sm">How it works:</h3>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1">
                <li>1. Upload multiple PDF files</li>
                <li>2. Reorder files using up/down arrows (merge order)</li>
                <li>3. Files will be merged in the order shown above</li>
                <li>4. Download your combined PDF document</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
