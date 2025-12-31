import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { Image, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '../components/Toast';

export default function JpgToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.warning('Please select at least one image file');
      return;
    }

    setProcessing(true);

    try {
      const { imagesToPdf, downloadPdf } = await import('../utils/pdfUtils');
      const pdf = await imagesToPdf(files);
      const filename = `converted_${Date.now()}.pdf`;
      downloadPdf(pdf, filename);
      toast.success(`Successfully converted ${files.length} image(s) to PDF!`);
      setFiles([]);
    } catch (error) {
      console.error('Error converting images to PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to convert images to PDF';
      toast.error(errorMessage);
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
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Image className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">JPG to PDF</h1>
                <p className="text-purple-100 text-sm mt-1">Convert images to PDF document</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <FileUpload
              accept="image/jpeg,image/jpg,image/png"
              multiple={true}
              onFilesSelected={setFiles}
            />

            {files.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  <span className="font-semibold">{files.length}</span> image{files.length > 1 ? 's' : ''} will be converted to a single PDF
                </p>
              </div>
            )}

            <button
              onClick={handleConvert}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 sm:py-3.5 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 touch-manipulation text-sm sm:text-base"
              aria-label="Convert images to PDF"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Convert & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
