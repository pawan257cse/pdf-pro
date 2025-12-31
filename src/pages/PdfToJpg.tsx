import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { FileImage, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '../components/Toast';

export default function PdfToJpg() {
  const [files, setFiles] = useState<File[]>([]);
  const [dpi, setDpi] = useState('150');
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.warning('Please select a PDF file');
      return;
    }

    setProcessing(true);

    try {
      const { pdfToImages } = await import('../utils/pdfUtils');
      const images = await pdfToImages(files[0], parseInt(dpi, 10));
      
      if (!images || images.length === 0) {
        throw new Error('No images were generated');
      }
      
      // Download each image with a small delay to avoid browser blocking
      for (let i = 0; i < images.length; i++) {
        const url = URL.createObjectURL(images[i]);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${files[0].name.replace(/\.pdf$/i, '')}_page_${i + 1}.jpg`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Clean up after a delay
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
        
        // Small delay between downloads to avoid browser blocking
        if (i < images.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }
      
      toast.success(`Successfully converted ${images.length} page(s) to images!`);
      setFiles([]);
    } catch (error) {
      console.error('Error converting PDF to images:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to convert PDF to images';
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
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-4 sm:p-6 text-white">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <FileImage className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold truncate">PDF to JPG</h1>
                <p className="text-pink-100 text-xs sm:text-sm mt-1">Convert PDF pages to images</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <FileUpload accept=".pdf" multiple={false} onFilesSelected={setFiles} />

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                Image Quality (DPI)
              </label>
              <select
                value={dpi}
                onChange={(e) => setDpi(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                aria-label="Select image quality"
              >
                <option value="72">Low (72 DPI)</option>
                <option value="150">Medium (150 DPI)</option>
                <option value="300">High (300 DPI)</option>
              </select>
            </div>

            <button
              onClick={handleConvert}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-pink-600 to-pink-700 text-white font-semibold py-3 sm:py-3.5 px-6 rounded-lg hover:from-pink-700 hover:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 touch-manipulation text-sm sm:text-base"
              aria-label="Convert PDF to images"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Convert & Download ZIP</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
