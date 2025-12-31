import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { Minimize2, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '../components/Toast';

export default function Compress() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [processing, setProcessing] = useState(false);

  const handleCompress = async () => {
    if (files.length === 0) {
      toast.warning('Please select a PDF file');
      return;
    }

    setProcessing(true);

    try {
      const { compressPdf, downloadPdf } = await import('../utils/pdfUtils');
      const originalSize = files[0].size;
      const compressedPdf = await compressPdf(files[0], compressionLevel);
      const newSize = compressedPdf.length;
      const filename = `${files[0].name.replace(/\.pdf$/i, '')}_compressed.pdf`;
      downloadPdf(compressedPdf, filename);
      
      const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      const message = newSize < originalSize 
        ? `PDF compressed! Size reduced by ${reduction}%`
        : 'PDF processed. Note: Some PDFs may not compress further with basic compression.';
      toast.success(message);
      setFiles([]);
    } catch (error) {
      console.error('Error compressing PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to compress PDF';
      toast.error(errorMessage);
    } finally {
    setProcessing(false);
    }
  };

  return (
    <Layout>
      <Link to="/" className="inline-flex items-center text-sm text-slate-600 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to All Tools
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 sm:p-6 text-white">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <Minimize2 className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold truncate">Compress PDF</h1>
                <p className="text-amber-100 text-xs sm:text-sm mt-1">Reduce file size without losing quality</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <FileUpload accept=".pdf" multiple={false} onFilesSelected={setFiles} />

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                Compression Level
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { value: 'low', label: 'Low', desc: 'Minimal compression' },
                  { value: 'medium', label: 'Medium', desc: 'Balanced quality' },
                  { value: 'high', label: 'High', desc: 'Maximum compression' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setCompressionLevel(option.value)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all touch-manipulation ${
                      compressionLevel === option.value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    aria-label={`Select ${option.label} compression`}
                  >
                    <p className="font-semibold text-slate-900 text-xs sm:text-sm">{option.label}</p>
                    <p className="text-xs text-slate-600 mt-1">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCompress}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-3 sm:py-3.5 px-6 rounded-lg hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 touch-manipulation text-sm sm:text-base"
              aria-label="Compress PDF"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Compressing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Compress & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
