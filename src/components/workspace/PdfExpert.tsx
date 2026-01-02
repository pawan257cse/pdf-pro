import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Combine,
  Scissors,
  Trash2,
  FileOutput,
  Image,
  FileImage,
  RotateCw,
  Grid3x3,
  Square,
  Minimize2,
  Droplet,
  Hash,
  Crop,
  ArrowUpDown,
  Lock,
  Layers,
  FileEdit,
  User,
  ArrowRight,
} from 'lucide-react';

export default function PdfExpert() {
  const tools = [
    {
      title: 'Merge PDF',
      description: 'Combine multiple PDF files into a single document',
      icon: Combine,
      path: '/merge',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Split PDF',
      description: 'Extract pages or split PDF into multiple files',
      icon: Scissors,
      path: '/split',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Remove Pages',
      description: 'Delete specific pages from your PDF document',
      icon: Trash2,
      path: '/remove',
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'Extract Pages',
      description: 'Extract specific pages and create a new PDF',
      icon: FileOutput,
      path: '/extract',
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'JPG to PDF',
      description: 'Convert images to a single PDF document',
      icon: Image,
      path: '/jpg-to-pdf',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'PDF to JPG',
      description: 'Convert PDF pages to image files',
      icon: FileImage,
      path: '/pdf-to-jpg',
      color: 'from-pink-500 to-pink-600',
    },
    {
      title: 'Rotate PDF',
      description: 'Rotate pages in your PDF document',
      icon: RotateCw,
      path: '/rotate',
      color: 'from-teal-500 to-teal-600',
    },
    {
      title: 'Pages Per Sheet',
      description: 'Arrange multiple pages on a single sheet',
      icon: Grid3x3,
      path: '/pages-per-sheet',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      title: 'Add Border',
      description: 'Add decorative borders to PDF pages',
      icon: Square,
      path: '/border',
      color: 'from-slate-500 to-slate-600',
    },
    {
      title: 'Compress PDF',
      description: 'Reduce PDF file size without losing quality',
      icon: Minimize2,
      path: '/compress',
      color: 'from-amber-500 to-amber-600',
    },
    {
      title: 'Add Watermark',
      description: 'Add text watermark to your PDF pages',
      icon: Droplet,
      path: '/watermark',
      color: 'from-sky-500 to-sky-600',
    },
    {
      title: 'Page Numbers',
      description: 'Add page numbers to your PDF document',
      icon: Hash,
      path: '/page-numbers',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Crop PDF',
      description: 'Crop margins from PDF pages',
      icon: Crop,
      path: '/crop',
      color: 'from-lime-500 to-lime-600',
    },
    {
      title: 'Organize Pages',
      description: 'Reorder pages in your PDF document',
      icon: ArrowUpDown,
      path: '/organize',
      color: 'from-fuchsia-500 to-fuchsia-600',
    },
    {
      title: 'Password Protect',
      description: 'Secure your PDF with password protection',
      icon: Lock,
      path: '/password-protect',
      color: 'from-rose-500 to-rose-600',
    },
    {
      title: 'Batch Watermark',
      description: 'Add watermark to multiple PDFs at once',
      icon: Layers,
      path: '/batch-watermark',
      color: 'from-violet-500 to-violet-600',
    },
    {
      title: 'Edit Metadata',
      description: 'Modify PDF metadata and properties',
      icon: FileEdit,
      path: '/metadata-editor',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Resume Builder',
      description: 'Create professional resume in PDF format',
      icon: User,
      path: '/resume',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-6 sm:pb-8">
        {/* Header */}
        <div className="text-center pt-2 sm:pt-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-3">
            PDF Expert
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            Professional PDF manipulation tools at your fingertips
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={tool.path}
                  className="block bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-200 p-4 sm:p-5 md:p-6 transition-all group h-full touch-manipulation active:scale-[0.98]"
                  aria-label={`${tool.title} - ${tool.description}`}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 leading-relaxed">{tool.description}</p>
                  <div className="flex items-center text-blue-600 text-xs sm:text-sm font-medium">
                    Use Tool
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

