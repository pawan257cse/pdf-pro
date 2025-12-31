import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { Scissors, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '../components/Toast';

export default function Split() {
  const [files, setFiles] = useState<File[]>([]);
  const [splitType, setSplitType] = useState<'range' | 'all'>('range');
  const [startPage, setStartPage] = useState('1');
  const [endPage, setEndPage] = useState('1');
  const [processing, setProcessing] = useState(false);

  const handleSplit = async () => {
    if (files.length === 0) {
      toast.warning('Please select a PDF file');
      return;
    }

    setProcessing(true);

    try {
      if (splitType === 'all') {
        const { splitPdfIntoPages, downloadMultiplePdfs } = await import('../utils/pdfUtils');
        const pdfs = await splitPdfIntoPages(files[0]);
        const baseFilename = files[0].name.replace('.pdf', '');
        await downloadMultiplePdfs(pdfs, baseFilename);
        toast.success(`Successfully split PDF into ${pdfs.length} pages!`);
        setFiles([]);
      } else {
        const start = parseInt(startPage, 10);
        const end = parseInt(endPage, 10);
        if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
          toast.warning('Please enter valid page numbers');
          setProcessing(false);
          return;
        }
        const { splitPdfByRange, downloadPdf } = await import('../utils/pdfUtils');
        const splitPdf = await splitPdfByRange(files[0], start, end);
        const filename = `${files[0].name.replace('.pdf', '')}_pages_${start}-${end}.pdf`;
        downloadPdf(splitPdf, filename);
        toast.success(`Successfully extracted pages ${start}-${end}!`);
        setFiles([]);
      }
    } catch (error) {
      console.error('Error splitting PDF:', error);
      toast.error('Failed to split PDF. Please try again.');
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
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 text-white">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <Scissors className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold truncate">Split PDF</h1>
                <p className="text-green-100 text-xs sm:text-sm mt-1">Extract pages from your PDF document</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <FileUpload accept=".pdf" multiple={false} onFilesSelected={setFiles} />

            <div className="space-y-3 sm:space-y-4">
              <label className="block text-xs sm:text-sm font-medium text-slate-700">Split Mode</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  onClick={() => setSplitType('range')}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all touch-manipulation ${
                    splitType === 'range'
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  aria-label="Split by page range"
                >
                  <p className="font-semibold text-slate-900 text-xs sm:text-sm">Page Range</p>
                  <p className="text-xs text-slate-600 mt-1">Extract specific pages</p>
                </button>
                <button
                  onClick={() => setSplitType('all')}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all touch-manipulation ${
                    splitType === 'all'
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  aria-label="Split all pages"
                >
                  <p className="font-semibold text-slate-900 text-xs sm:text-sm">All Pages</p>
                  <p className="text-xs text-slate-600 mt-1">Split into individual pages</p>
                </button>
              </div>
            </div>

            {splitType === 'range' && (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">Start Page</label>
                  <input
                    type="number"
                    min="1"
                    value={startPage}
                    onChange={(e) => setStartPage(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">End Page</label>
                  <input
                    type="number"
                    min="1"
                    value={endPage}
                    onChange={(e) => setEndPage(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleSplit}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 sm:py-3.5 px-6 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 touch-manipulation text-sm sm:text-base"
              aria-label="Split PDF"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Split & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
