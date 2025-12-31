import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { Crop, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CropPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [marginTop, setMarginTop] = useState('0');
  const [marginBottom, setMarginBottom] = useState('0');
  const [marginLeft, setMarginLeft] = useState('0');
  const [marginRight, setMarginRight] = useState('0');
  const [processing, setProcessing] = useState(false);

  const handleCrop = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file');
      return;
    }

    setProcessing(true);

    try {
      const { cropPdf, downloadPdf } = await import('../utils/pdfUtils');
      const margins = {
        top: parseFloat(marginTop) || 0,
        bottom: parseFloat(marginBottom) || 0,
        left: parseFloat(marginLeft) || 0,
        right: parseFloat(marginRight) || 0,
      };
      const croppedPdf = await cropPdf(files[0], margins);
      const filename = `${files[0].name.replace('.pdf', '')}_cropped.pdf`;
      downloadPdf(croppedPdf, filename);
    } catch (error) {
      console.error('Error cropping PDF:', error);
      alert('Failed to crop PDF. Please try again.');
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
          <div className="bg-gradient-to-r from-lime-500 to-lime-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Crop className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Crop PDF</h1>
                <p className="text-lime-100 text-sm mt-1">Remove margins from your PDF pages</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <FileUpload accept=".pdf" multiple={false} onFilesSelected={setFiles} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4">
                Crop Margins (points)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Top</label>
                  <input
                    type="number"
                    min="0"
                    value={marginTop}
                    onChange={(e) => setMarginTop(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Bottom</label>
                  <input
                    type="number"
                    min="0"
                    value={marginBottom}
                    onChange={(e) => setMarginBottom(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Left</label>
                  <input
                    type="number"
                    min="0"
                    value={marginLeft}
                    onChange={(e) => setMarginLeft(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Right</label>
                  <input
                    type="number"
                    min="0"
                    value={marginRight}
                    onChange={(e) => setMarginRight(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCrop}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-lime-600 to-lime-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-lime-700 hover:to-lime-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Crop & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
