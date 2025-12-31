import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { Layers, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BatchWatermark() {
  const [files, setFiles] = useState<File[]>([]);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState('0.3');
  const [processing, setProcessing] = useState(false);

  const handleBatchWatermark = async () => {
    if (files.length === 0) {
      alert('Please select at least one PDF file');
      return;
    }
    if (!watermarkText.trim()) {
      alert('Please enter watermark text');
      return;
    }

    setProcessing(true);

    try {
      const { addWatermark, downloadPdf } = await import('../utils/pdfUtils');
      for (let i = 0; i < files.length; i++) {
        const watermarkedPdf = await addWatermark(files[i], watermarkText, parseFloat(opacity), 'center');
        const filename = `${files[i].name.replace('.pdf', '')}_watermarked.pdf`;
        downloadPdf(watermarkedPdf, filename);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.error('Error batch watermarking:', error);
      alert('Failed to watermark PDFs. Please try again.');
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
          <div className="bg-gradient-to-r from-violet-500 to-violet-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Batch Watermark</h1>
                <p className="text-violet-100 text-sm mt-1">Add watermark to multiple PDFs</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <FileUpload accept=".pdf" multiple={true} onFilesSelected={setFiles} />

            {files.length > 0 && (
              <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                <p className="text-sm text-violet-800">
                  <span className="font-semibold">{files.length}</span> PDF{files.length > 1 ? 's' : ''} will be watermarked
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Opacity: {opacity}
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(e.target.value)}
                className="w-full"
              />
            </div>

            <button
              onClick={handleBatchWatermark}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-violet-600 to-violet-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-violet-700 hover:to-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Process & Download ZIP</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
