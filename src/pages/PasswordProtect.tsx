import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { Lock, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PasswordProtect() {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProtect = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file');
      return;
    }
    if (!password || password !== confirmPassword) {
      alert('Passwords do not match or are empty');
      return;
    }

    setProcessing(true);

    try {
      const { passwordProtectPdf, downloadPdf } = await import('../utils/pdfUtils');
      const protectedPdf = await passwordProtectPdf(files[0], password);
      const filename = `${files[0].name.replace('.pdf', '')}_protected.pdf`;
      downloadPdf(protectedPdf, filename);
    } catch (error) {
      console.error('Error password protecting PDF:', error);
      alert('Failed to password protect PDF. Please try again.');
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
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Password Protect PDF</h1>
                <p className="text-rose-100 text-sm mt-1">Secure your PDF with a password</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <FileUpload accept=".pdf" multiple={false} onFilesSelected={setFiles} />

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleProtect}
              disabled={files.length === 0 || processing}
              className="w-full bg-gradient-to-r from-rose-600 to-rose-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-rose-700 hover:to-rose-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Protect & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
