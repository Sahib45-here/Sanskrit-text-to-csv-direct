/**
 * Samskrita - Sanskrit ISO 15919 to Devanagari CSV Converter & Structuring Engine
 * Computational linguistics workbench for stotras, slokas, and Vedic literature.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { DiacriticsQuickBar } from './components/DiacriticsQuickBar';
import { SanitizerSettingsModal } from './components/SanitizerSettingsModal';
import { DataTable } from './components/DataTable';
import { MetricsBar } from './components/MetricsBar';
import { DiacriticsGuide } from './components/DiacriticsGuide';
import { SAMPLE_TEXTS, SampleTextItem } from './data/sampleTexts';
import {
  sanitizeSanskritSourceText,
  SanitizationOptions,
  SanitizationResult,
} from './utils/sanitizer';
import {
  parseTransliteratedText,
  ParsedVerseRow,
  ParseOptions,
} from './utils/sectionParser';
import {
  downloadCsv,
  downloadTsv,
  downloadJson,
  generateCsvContent,
} from './utils/csvExporter';
import {
  Sparkles,
  ShieldCheck,
  Download,
  Copy,
  Check,
  RefreshCw,
  FileText,
  SlidersHorizontal,
  FileSpreadsheet,
  Trash2,
  Settings2,
} from 'lucide-react';

export default function App() {
  // Input state
  const [rawInputText, setRawInputText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Parsing & Sanitizing options
  const [sanitizerOptions, setSanitizerOptions] = useState<SanitizationOptions>({
    stripUrls: true,
    stripKnownDomains: true,
    stripPageNumbers: true,
    stripDocumentMetadata: true,
    stripDecorativeBorders: true,
    normalizeWhitespace: true,
  });

  const [parseOptions, setParseOptions] = useState<ParseOptions>({
    autoAssignVerseNumbers: true,
    trimTrailingVerseNumberFromText: true,
    convertNumerals: true,
    convertDandas: true,
  });

  // Output dataset state
  const [rows, setRows] = useState<ParsedVerseRow[]>([]);
  const [lastSanitizationReport, setLastSanitizationReport] = useState<SanitizationResult | null>(null);

  // UI modal and notification states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedCsv, setCopiedCsv] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);

  // Load default sample on initial mount (Śrī Aṣṭabhujāṣṭakam)
  useEffect(() => {
    const defaultSample = SAMPLE_TEXTS[0]; // Ashtabhujashtakam
    handleLoadSample(defaultSample);
  }, []);

  // Process text function
  const handleProcessText = useCallback(
    (textToProcess: string = rawInputText) => {
      if (!textToProcess.trim()) {
        setRows([]);
        setLastSanitizationReport(null);
        return;
      }

      // Step 1: Sanitize
      const sanitizeResult = sanitizeSanskritSourceText(textToProcess, sanitizerOptions);
      setLastSanitizationReport(sanitizeResult);

      // Step 2: Parse into structured rows
      const parsed = parseTransliteratedText(sanitizeResult.cleanedText, parseOptions);
      setRows(parsed);
    },
    [rawInputText, sanitizerOptions, parseOptions]
  );

  // Load a sample stotra
  const handleLoadSample = (sample: SampleTextItem) => {
    setActiveSampleId(sample.id);
    setRawInputText(sample.text);
    handleProcessText(sample.text);
  };

  // Clear input
  const handleClear = () => {
    setRawInputText('');
    setRows([]);
    setLastSanitizationReport(null);
    setActiveSampleId(null);
  };

  // Insert diacritic at cursor in textarea
  const handleInsertDiacritic = (char: string) => {
    const el = textareaRef.current;
    if (!el) {
      setRawInputText(prev => prev + char);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const current = rawInputText;
    const updated = current.substring(0, start) + char + current.substring(end);
    setRawInputText(updated);

    // Reset cursor after inserted character
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + char.length, start + char.length);
    }, 0);
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to parse
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleProcessText();
    }
  };

  // Auto-renumber Main Stotra verses
  const handleRenumberVerses = () => {
    let counter = 1;
    const updated = rows.map(r => {
      if (r.section === 'Main Stotra') {
        return { ...r, verseNumber: String(counter++) };
      }
      return r;
    });
    setRows(updated);
  };

  // Export handlers
  const handleDownloadCsv = () => {
    if (rows.length === 0) return;
    const filename = activeSampleId
      ? `${activeSampleId}_verses.csv`
      : 'sanskrit_transliterated_verses.csv';
    downloadCsv(rows, filename);
  };

  const handleDownloadTsv = () => {
    if (rows.length === 0) return;
    const filename = activeSampleId
      ? `${activeSampleId}_verses.tsv`
      : 'sanskrit_transliterated_verses.tsv';
    downloadTsv(rows, filename);
  };

  const handleDownloadJson = () => {
    if (rows.length === 0) return;
    const filename = activeSampleId
      ? `${activeSampleId}_verses.json`
      : 'sanskrit_transliterated_verses.json';
    downloadJson(rows, filename);
  };

  const handleCopyCsv = () => {
    if (rows.length === 0) return;
    const csvContent = generateCsvContent(rows);
    navigator.clipboard.writeText(csvContent);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  const lineCount = rawInputText ? rawInputText.split(/\r?\n/).length : 0;
  const charCount = rawInputText.length;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* Top Bar adhering to Top Bar Contract */}
      <Header
        onDownloadCsv={handleDownloadCsv}
        hasData={rows.length > 0}
        totalVerses={rows.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Editorial Hero Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide uppercase">
            <span>Sanskrit Computational Linguistics Engine</span>
            <span aria-hidden="true">·</span>
            <span>Unicode Devanagari Output</span>
            <span aria-hidden="true">·</span>
            <span>RFC 4180 UTF-8 BOM CSV</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 max-w-3xl">
            ISO 15919 & IAST Sanskrit to Structured Devanagari CSV Converter
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
            Automatically sanitize web repository noise, parse distinct logical sections (Title, Dhyāna,
            Main Stotra, Phala Śruthi, Mangalam), extract verse numbers, and transliterate to pure Devanagari with
            correct dandas and avagrahas.
          </p>

          {/* Sample Selectors Bar */}
          <div className="pt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-neutral-500 mr-1 select-none">
              Load Pre-loaded Sample:
            </span>
            {SAMPLE_TEXTS.map(sample => {
              const isSelected = activeSampleId === sample.id;
              return (
                <button
                  key={sample.id}
                  onClick={() => handleLoadSample(sample)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                    isSelected
                      ? 'bg-amber-900 text-white border-amber-950 font-semibold shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:border-amber-400 hover:bg-amber-50/50'
                  }`}
                  title={sample.description}
                >
                  {sample.name}
                </button>
              );
            })}
            {rawInputText && (
              <button
                onClick={handleClear}
                className="px-2.5 py-1.5 text-xs font-medium text-neutral-500 hover:text-rose-600 bg-white border border-neutral-200 hover:border-rose-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ml-auto"
                title="Clear input text"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Workspace: 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Text Input & Sanitization Area (lg:col-span-5) */}
          <section id="input-section" className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden flex flex-col">
              {/* Card Header */}
              <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-800" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
                    Raw Transliterated Sanskrit Text
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono-tabular">
                  <span>{lineCount} lines</span>
                  <span aria-hidden="true">·</span>
                  <span>{charCount.toLocaleString()} chars</span>
                </div>
              </div>

              {/* Quick Diacritics insertion bar */}
              <div className="p-3 border-b border-neutral-100 bg-neutral-50/40">
                <DiacriticsQuickBar onInsertChar={handleInsertDiacritic} />
              </div>

              {/* Textarea */}
              <div className="p-3">
                <textarea
                  ref={textareaRef}
                  value={rawInputText}
                  onChange={e => setRawInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste your ISO 15919 or IAST transliterated Sanskrit text here (e.g. śrī aṣṭabhujāṣṭakam, viṣṇu sahasranāma, stotras)..."
                  rows={16}
                  className="w-full text-xs sm:text-sm font-mono leading-relaxed p-3 bg-neutral-50/30 rounded-lg border border-neutral-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors resize-y text-neutral-900"
                />
              </div>

              {/* Sanitization status & Action bar */}
              <div className="p-3 bg-neutral-50/80 border-t border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-amber-900 transition-colors cursor-pointer py-1"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>
                    Auto-Sanitizer:{' '}
                    <strong className="font-semibold text-neutral-800">
                      {lastSanitizationReport?.totalRemovedLines ?? 0} noise lines filtered
                    </strong>
                  </span>
                  <Settings2 className="w-3.5 h-3.5 text-neutral-400 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={() => handleProcessText()}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
                  title="Sanitize text, extract sections, and transliterate to Devanagari (Ctrl+Enter)"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sanitize & Parse</span>
                </button>
              </div>
            </div>

            {/* Quick Helper Notes */}
            <div className="text-xs text-neutral-500 space-y-1.5 px-1 leading-relaxed">
              <p>
                <strong className="text-neutral-700">Supported Transliteration Standards:</strong> ISO 15919 (with
                macrons <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">ā, ī, ū, ē, ō</code>, vocalic <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">ṛ, ṝ, ḷ</code>, retroflex <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">ṭ, ḍ, ṇ</code>, sibilants <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">ś, ṣ</code>), standard IAST, and Velthuis dandas (<code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">|, ||</code>).
              </p>
              <p>
                <strong className="text-neutral-700">Legacy PDF Font Dandas:</strong> Automatically converts legacy PDF encoding artifacts like <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">Á Á</code> or <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">Á 1 Á Á</code> into proper double dandas (<code className="font-mono text-neutral-800">॥</code>) and divides each row immediately at the verse number.
              </p>
              <p>
                <strong className="text-neutral-700">Auto-Noise Removal:</strong> Redundant headers like <code className="font-mono text-neutral-600">www.prapatti.com</code>, <code className="font-mono text-neutral-600">Page 1 of 3</code>, and PDF attributions are automatically stripped before building rows.
              </p>
            </div>
          </section>

          {/* Right Column: Structured Data Preview Table & Exports (lg:col-span-7) */}
          <section id="preview-section" className="lg:col-span-7 space-y-4">
            {/* Top Toolbar: Metrics & Export Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-amber-800" />
                <div>
                  <h2 className="text-sm font-bold text-neutral-900">
                    Structured Sanskrit Dataset Preview
                  </h2>
                  <p className="text-xs text-neutral-500">
                    4-column output: Section · Verse_Number · ISO_Text · Devanagari_Text
                  </p>
                </div>
              </div>

              {/* Export Button Cluster */}
              <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                <button
                  type="button"
                  onClick={handleCopyCsv}
                  disabled={rows.length === 0}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-2xs"
                  title="Copy full CSV to clipboard"
                >
                  {copiedCsv ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Copy CSV</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTsv}
                  disabled={rows.length === 0}
                  className="px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
                  title="Download TSV"
                >
                  TSV
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJson}
                  disabled={rows.length === 0}
                  className="px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
                  title="Export JSON"
                >
                  JSON
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  disabled={rows.length === 0}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs flex items-center gap-1.5 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none transition-all active:scale-98 cursor-pointer"
                  title="Download CSV with UTF-8 BOM"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>

            {/* Metrics Bar */}
            <MetricsBar
              rows={rows}
              totalSanitizedLines={lastSanitizationReport?.totalRemovedLines ?? 0}
            />

            {/* Interactive Data Preview Table */}
            <DataTable
              rows={rows}
              onUpdateRows={setRows}
              onRenumberVerses={handleRenumberVerses}
            />

            {/* Diacritics Mapping Guide Collapsible */}
            <DiacriticsGuide />
          </section>
        </div>
      </main>

      {/* Sanitizer Settings & Audit Report Modal */}
      <SanitizerSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        options={sanitizerOptions}
        onChangeOptions={opts => {
          setSanitizerOptions(opts);
          // Re-sanitize with updated options
          setTimeout(() => handleProcessText(), 50);
        }}
        lastReport={lastSanitizationReport}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800">Samskrita Lab</span>
            <span aria-hidden="true">·</span>
            <span>Computational Sanskrit Transliteration & CSV Structuring Engine</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-500">
            <span>RFC 4180 CSV with UTF-8 BOM</span>
            <span aria-hidden="true">·</span>
            <span>Unicode 16.0 Devanagari</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
