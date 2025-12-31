import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { Trash2, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Remove() {
  const [files, setFiles] = useState<File[]>([]);
  const [pagesToRemove, setPagesToRemove] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleRemove = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file');
      return;
    }
    if (!pagesToRemove.trim()) {
      alert('Please specify pages to remove');
      return;
    }

    setProcessing(true);

    try {
      const { removePages, downloadPdf, parsePageRange } = await import('../utils/pdfUtils');
      const pageNumbers = parsePageRange(pagesToRemove);
      if (pageNumbers.length === 0) {
        alert('Please enter valid page numbers');
        setProcessing(false);
        return;
      }
      const modifiedPdf = await removePages(files[0], pageNumbers);
      const filename = `${files[0].name.replace('.pdf', '')}_removed.pdf`;
      downloadPdf(modifiedPdf, filename);
    } catch (error) {
      console.error('Error removing pages:', error);
      alert('Failed to remove pages. Please try again.');
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

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Trash2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Remove Pages</h1>
                <p className="text-red-100 text-sm mt-1">Delete specific pages from your PDF</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <FileUpload accept=".pdf" multiple={false} onFilesSelected={setFiles} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Pages to Remove
              </label>
              <input
                type="text"
                value={pagesToRemove}
                onChange={(e) => setPagesToRemove(e.target.value)}
                placeholder="e.g., 1, 3, 5-7"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-2">
                Enter page numbers separated by commas, or use ranges (e.g., 1, 3, 5-7)
              </p>
            </div>

            <button
              onClick={handleRemove}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Remove & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
