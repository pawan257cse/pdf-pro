import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { RotateCw, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Rotate() {
  const [files, setFiles] = useState<File[]>([]);
  const [angle, setAngle] = useState('90');
  const [pages, setPages] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleRotate = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file');
      return;
    }

    setProcessing(true);

    try {
      const { rotatePdfPages, downloadPdf, parsePageRange } = await import('../utils/pdfUtils');
      const rotation = parseInt(angle, 10);
      const pageNumbers = pages.trim() ? parsePageRange(pages) : undefined;
      const rotatedPdf = await rotatePdfPages(files[0], rotation, pageNumbers);
      const filename = `${files[0].name.replace('.pdf', '')}_rotated.pdf`;
      downloadPdf(rotatedPdf, filename);
    } catch (error) {
      console.error('Error rotating PDF:', error);
      alert('Failed to rotate PDF. Please try again.');
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
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <RotateCw className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Rotate PDF</h1>
                <p className="text-teal-100 text-sm mt-1">Rotate pages in your PDF document</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <FileUpload accept=".pdf" multiple={false} onFilesSelected={setFiles} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rotation Angle
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['90', '180', '270'].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setAngle(deg)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      angle === deg
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{deg}°</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Pages to Rotate (Optional)
              </label>
              <input
                type="text"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="Leave empty to rotate all pages"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-2">
                Enter page numbers separated by commas (e.g., 1, 3, 5-7)
              </p>
            </div>

            <button
              onClick={handleRotate}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Rotate & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
