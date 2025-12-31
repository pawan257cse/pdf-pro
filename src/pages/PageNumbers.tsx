import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { Hash, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PageNumbers() {
  const [files, setFiles] = useState<File[]>([]);
  const [position, setPosition] = useState('bottom-center');
  const [startNumber, setStartNumber] = useState('1');
  const [processing, setProcessing] = useState(false);

  const handleAddPageNumbers = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file');
      return;
    }

    setProcessing(true);

    try {
      const { addPageNumbers, downloadPdf } = await import('../utils/pdfUtils');
      const numberedPdf = await addPageNumbers(files[0], position, parseInt(startNumber, 10) || 1);
      const filename = `${files[0].name.replace('.pdf', '')}_numbered.pdf`;
      downloadPdf(numberedPdf, filename);
    } catch (error) {
      console.error('Error adding page numbers:', error);
      alert('Failed to add page numbers. Please try again.');
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
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Hash className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Add Page Numbers</h1>
                <p className="text-emerald-100 text-sm mt-1">Number your PDF pages</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <FileUpload accept=".pdf" multiple={false} onFilesSelected={setFiles} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Position
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'top-left', label: 'Top Left' },
                  { value: 'top-center', label: 'Top Center' },
                  { value: 'top-right', label: 'Top Right' },
                  { value: 'bottom-left', label: 'Bottom Left' },
                  { value: 'bottom-center', label: 'Bottom Center' },
                  { value: 'bottom-right', label: 'Bottom Right' },
                ].map((pos) => (
                  <button
                    key={pos.value}
                    onClick={() => setPosition(pos.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      position === pos.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Numbering From
              </label>
              <input
                type="number"
                min="1"
                value={startNumber}
                onChange={(e) => setStartNumber(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleAddPageNumbers}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Add Numbers & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
