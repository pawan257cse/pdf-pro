import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import PdfExpert from '../components/workspace/PdfExpert';

export default function Workspace() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Sticky Navigation Bar with Glassmorphism */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Clickable */}
            <Link
              to="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hidden sm:block">
                PDF Pro
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <PdfExpert />
      </main>
    </div>
  );
}
