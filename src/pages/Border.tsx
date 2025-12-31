import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { Square, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Border() {
  const [files, setFiles] = useState<File[]>([]);
  const [borderWidth, setBorderWidth] = useState('5');
  const [borderColor, setBorderColor] = useState('#000000');
  const [processing, setProcessing] = useState(false);

  const handleAddBorder = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file');
      return;
    }

    setProcessing(true);

    try {
      const { addBorder, downloadPdf } = await import('../utils/pdfUtils');
      const borderedPdf = await addBorder(files[0], parseFloat(borderWidth) || 5, borderColor);
      const filename = `${files[0].name.replace('.pdf', '')}_bordered.pdf`;
      downloadPdf(borderedPdf, filename);
    } catch (error) {
      console.error('Error adding border:', error);
      alert('Failed to add border. Please try again.');
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
          <div className="bg-gradient-to-r from-slate-500 to-slate-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Square className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Add Border</h1>
                <p className="text-slate-100 text-sm mt-1">Add decorative borders to your PDF pages</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <FileUpload accept=".pdf" multiple={false} onFilesSelected={setFiles} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Border Width (mm)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Border Color
                </label>
                <input
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="w-full h-10 border border-slate-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleAddBorder}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-slate-700 hover:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Add Border & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
