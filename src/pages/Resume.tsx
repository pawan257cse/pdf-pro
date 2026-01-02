import { useState } from 'react';
import Layout from '../components/Layout';
import { User, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '../components/Toast';

export default function Resume() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [summary, setSummary] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleCreateResume = async () => {
    if (!name.trim()) {
      toast.warning('Please enter your name');
      return;
    }

    setProcessing(true);

    try {
      const { createResume, downloadPdf } = await import('../utils/pdfUtils');
      const resumeData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        summary: summary.trim(),
      };
      const resumePdf = await createResume(resumeData);
      const filename = `resume_${name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      downloadPdf(resumePdf, filename);
      toast.success('Resume created successfully!');
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setSummary('');
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error('Failed to create resume. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Layout>
      <Link
        to="/"
        className="inline-flex items-center text-sm text-slate-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to All Tools
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 sm:p-6 text-white">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <User className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold truncate">Resume Builder</h1>
                <p className="text-purple-100 text-xs sm:text-sm mt-1">
                  Create a professional resume in PDF format
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Professional Summary
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of your professional experience and skills..."
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm sm:text-base"
              />
            </div>

            <button
              onClick={handleCreateResume}
              disabled={!name.trim() || processing}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 sm:py-3.5 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 touch-manipulation text-sm sm:text-base"
              aria-label="Create and download resume"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Create Resume & Download</span>
                </>
              )}
            </button>

            <div className="bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2 text-xs sm:text-sm">How it works:</h3>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1">
                <li>1. Enter your personal information (name is required)</li>
                <li>2. Add your contact details (email and phone)</li>
                <li>3. Write a brief professional summary</li>
                <li>4. Click "Create Resume & Download" to generate your PDF resume</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
