import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { Grid3x3, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PagesPerSheet() {
  const [files, setFiles] = useState<File[]>([]);
  const [pagesPerSheet, setPagesPerSheet] = useState('2');
  const [addBorder, setAddBorder] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file');
      return;
    }

    setProcessing(true);

    try {
      const { pagesPerSheet: arrangePagesPerSheet, downloadPdf } = await import('../utils/pdfUtils');
      const processedPdf = await arrangePagesPerSheet(files[0], parseInt(pagesPerSheet, 10), addBorder);
      const filename = `${files[0].name.replace('.pdf', '')}_${pagesPerSheet}perSheet.pdf`;
      downloadPdf(processedPdf, filename);
    } catch (error) {
      console.error('Error processing pages per sheet:', error);
      alert('Failed to process PDF. Please try again.');
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
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Grid3x3 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Pages Per Sheet</h1>
                <p className="text-cyan-100 text-sm mt-1">Arrange multiple pages on a single sheet</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <FileUpload accept=".pdf" multiple={false} onFilesSelected={setFiles} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Pages Per Sheet
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '2', label: '2 pages' },
                  { value: '4', label: '4 pages' },
                  { value: '6', label: '6 pages' },
                  { value: '9', label: '9 pages' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPagesPerSheet(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      pagesPerSheet === option.value
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{option.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="add-border"
                checked={addBorder}
                onChange={(e) => setAddBorder(e.target.checked)}
                className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="add-border" className="ml-2 text-sm font-medium text-slate-700">
                Add border around each page
              </label>
            </div>

            <button
              onClick={handleProcess}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-cyan-700 hover:to-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Process & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
