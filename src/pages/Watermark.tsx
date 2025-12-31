import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { Droplet, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Watermark() {
  const [files, setFiles] = useState<File[]>([]);
  const [watermarkText, setWatermarkText] = useState('WATERMARK');
  const [opacity, setOpacity] = useState('0.3');
  const [position, setPosition] = useState('center');
  const [processing, setProcessing] = useState(false);

  const handleAddWatermark = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file');
      return;
    }
    if (!watermarkText.trim()) {
      alert('Please enter watermark text');
      return;
    }

    setProcessing(true);

    try {
      const { addWatermark, downloadPdf } = await import('../utils/pdfUtils');
      const watermarkedPdf = await addWatermark(files[0], watermarkText, parseFloat(opacity), position);
      const filename = `${files[0].name.replace('.pdf', '')}_watermarked.pdf`;
      downloadPdf(watermarkedPdf, filename);
    } catch (error) {
      console.error('Error adding watermark:', error);
      alert('Failed to add watermark. Please try again.');
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
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Droplet className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Add Watermark</h1>
                <p className="text-sky-100 text-sm mt-1">Add text watermark to your PDF pages</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <FileUpload accept=".pdf" multiple={false} onFilesSelected={setFiles} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Position
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['top', 'center', 'bottom'].map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPosition(pos)}
                    className={`p-4 rounded-lg border-2 transition-all capitalize ${
                      position === pos
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddWatermark}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-sky-600 to-sky-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-sky-700 hover:to-sky-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Add Watermark & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
