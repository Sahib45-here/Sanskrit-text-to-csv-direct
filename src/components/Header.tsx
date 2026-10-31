import React from 'react';
import { Download, Sparkles, BookOpen, FileText } from 'lucide-react';

interface HeaderProps {
  onDownloadCsv: () => void;
  hasData: boolean;
  totalVerses: number;
}

export const Header: React.FC<HeaderProps> = ({ onDownloadCsv, hasData, totalVerses }) => {
  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-amber-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            सं
          </div>
          <div className="leading-tight">
            <span className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap">
              Samskrita Lab
            </span>
            <span className="hidden sm:inline-block text-xs text-neutral-500 ml-2 font-medium">
              ISO 15919 to Devanagari CSV Engine
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <a href="#input-section" className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-neutral-400" />
            Input & Sanitize
          </a>
          <a href="#preview-section" className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-neutral-400" />
            Data Table
          </a>
          <a href="#guide-section" className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-neutral-400" />
            Diacritics Guide
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onDownloadCsv}
            disabled={!hasData}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all whitespace-nowrap shrink-0 ${
              hasData
                ? 'bg-amber-800 text-white hover:bg-amber-900 active:scale-98 cursor-pointer'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
            title={hasData ? `Download ${totalVerses} rows as UTF-8 CSV` : 'Parse text to enable download'}
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
            {hasData && (
              <span className="bg-amber-700/50 text-amber-100 text-[11px] px-1.5 py-0.5 rounded font-mono-tabular">
                {totalVerses}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
