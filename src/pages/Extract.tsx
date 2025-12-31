import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { FileOutput, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '../components/Toast';

export default function Extract() {
  const [files, setFiles] = useState<File[]>([]);
  const [pagesToExtract, setPagesToExtract] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleExtract = async () => {
    if (files.length === 0) {
      toast.warning('Please select a PDF file');
      return;
    }
    if (!pagesToExtract.trim()) {
      toast.warning('Please specify pages to extract');
      return;
    }

    setProcessing(true);

    try {
      const { extractPages, downloadPdf, parsePageRange } = await import('../utils/pdfUtils');
      const pageNumbers = parsePageRange(pagesToExtract);
      if (pageNumbers.length === 0) {
        toast.warning('Please enter valid page numbers (e.g., 1, 3, 5-7)');
        setProcessing(false);
        return;
      }
      const extractedPdf = await extractPages(files[0], pageNumbers);
      const filename = `${files[0].name.replace('.pdf', '')}_extracted.pdf`;
      downloadPdf(extractedPdf, filename);
      toast.success(`Successfully extracted ${pageNumbers.length} page(s)!`);
      setFiles([]);
      setPagesToExtract('');
    } catch (error) {
      console.error('Error extracting pages:', error);
      toast.error('Failed to extract pages. Please try again.');
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
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 sm:p-6 text-white">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <FileOutput className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold truncate">Extract Pages</h1>
                <p className="text-orange-100 text-xs sm:text-sm mt-1">Create a new PDF with specific pages</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <FileUpload accept=".pdf" multiple={false} onFilesSelected={setFiles} />

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                Pages to Extract
              </label>
              <input
                type="text"
                value={pagesToExtract}
                onChange={(e) => setPagesToExtract(e.target.value)}
                placeholder="e.g., 1, 3, 5-7"
                className="w-full px-3 sm:px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                aria-label="Page numbers to extract"
              />
              <p className="text-xs text-slate-500 mt-2">
                Enter page numbers separated by commas, or use ranges (e.g., 1, 3, 5-7)
              </p>
            </div>

            <button
              onClick={handleExtract}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold py-3 sm:py-3.5 px-6 rounded-lg hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 touch-manipulation text-sm sm:text-base"
              aria-label="Extract pages"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Extract & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
