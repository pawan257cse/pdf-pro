import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { ArrowUpDown, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Organize() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageOrder, setPageOrder] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleOrganize = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file');
      return;
    }

    setProcessing(true);

    try {
      const { organizePages, downloadPdf } = await import('../utils/pdfUtils');
      const organizedPdf = await organizePages(files[0], pageOrder);
      const filename = `${files[0].name.replace('.pdf', '')}_organized.pdf`;
      downloadPdf(organizedPdf, filename);
    } catch (error) {
      console.error('Error organizing pages:', error);
      alert('Failed to organize pages. Please try again.');
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
          <div className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <ArrowUpDown className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Organize Pages</h1>
                <p className="text-fuchsia-100 text-sm mt-1">Reorder pages in your PDF</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <FileUpload accept=".pdf" multiple={false} onFilesSelected={setFiles} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                New Page Order
              </label>
              <input
                type="text"
                value={pageOrder}
                onChange={(e) => setPageOrder(e.target.value)}
                placeholder="e.g., 3, 1, 2, 4-6"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-2">
                Enter page numbers in the order you want them (e.g., 3, 1, 2, 4-6). Leave empty to reverse all pages.
              </p>
            </div>

            <button
              onClick={handleOrganize}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-fuchsia-700 hover:to-fuchsia-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Organize & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
