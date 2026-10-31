import React from 'react';
import { X, Check, ShieldCheck, Filter, AlertCircle } from 'lucide-react';
import { SanitizationOptions, SanitizationResult } from '../utils/sanitizer';

interface SanitizerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: SanitizationOptions;
  onChangeOptions: (newOptions: SanitizationOptions) => void;
  lastReport: SanitizationResult | null;
}

export const SanitizerSettingsModal: React.FC<SanitizerSettingsModalProps> = ({
  isOpen,
  onClose,
  options,
  onChangeOptions,
  lastReport,
}) => {
  if (!isOpen) return null;

  const handleToggle = (key: keyof SanitizationOptions) => {
    onChangeOptions({
      ...options,
      [key]: !options[key],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-neutral-200 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <h3 className="text-base font-semibold text-neutral-900">
              Automatic Sanitization Configuration & Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Rules Configuration */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Active Noise Filtering Rules
            </h4>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-neutral-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={options.stripUrls}
                  onChange={() => handleToggle('stripUrls')}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-amber-700 focus:ring-amber-500"
                />
                <div className="text-sm">
                  <span className="font-medium text-neutral-900 block">Filter URLs and Web Links</span>
                  <span className="text-neutral-500 text-xs block">
                    Removes http://, https://, and www.* addresses from headers, footers, and inline lines.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-neutral-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={options.stripKnownDomains}
                  onChange={() => handleToggle('stripKnownDomains')}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-amber-700 focus:ring-amber-500"
                />
                <div className="text-sm">
                  <span className="font-medium text-neutral-900 block">Filter Known Repository Signatures</span>
                  <span className="text-neutral-500 text-xs block">
                    Detects and removes tags like "prapatti.com", "sanskritdocuments.org", "vedamu.org", and email attributions.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-neutral-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={options.stripPageNumbers}
                  onChange={() => handleToggle('stripPageNumbers')}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-amber-700 focus:ring-amber-500"
                />
                <div className="text-sm">
                  <span className="font-medium text-neutral-900 block">Strip Page Numbers & PDF Pagination</span>
                  <span className="text-neutral-500 text-xs block">
                    Cleans "Page 1 of 4", "- 1 -", "[ 2 ]", and standalone page counters.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-neutral-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={options.stripDocumentMetadata}
                  onChange={() => handleToggle('stripDocumentMetadata')}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-amber-700 focus:ring-amber-500"
                />
                <div className="text-sm">
                  <span className="font-medium text-neutral-900 block">Strip Document Metadata & Encoders</span>
                  <span className="text-neutral-500 text-xs block">
                    Removes "PDF created by ...", "Proofread by ...", "Please send corrections", and copyright notices.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-neutral-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={options.stripDecorativeBorders}
                  onChange={() => handleToggle('stripDecorativeBorders')}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-amber-700 focus:ring-amber-500"
                />
                <div className="text-sm">
                  <span className="font-medium text-neutral-900 block">Strip Decorative Borders</span>
                  <span className="text-neutral-500 text-xs block">
                    Filters out decorative lines like "==========", "----------", and "* * * * *".
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Last Sanitization Audit Log */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Last Sanitization Audit Log</span>
              {lastReport && (
                <span className="text-neutral-600 font-mono-tabular lowercase">
                  {lastReport.totalRemovedLines} lines filtered
                </span>
              )}
            </h4>

            {lastReport && lastReport.removedItems.length > 0 ? (
              <div className="border border-neutral-200 rounded-lg overflow-hidden divide-y divide-neutral-100 text-xs">
                {lastReport.removedItems.map((item, i) => (
                  <div key={i} className="p-3 bg-neutral-50/50">
                    <div className="flex items-center justify-between font-medium text-neutral-800">
                      <span>{item.description}</span>
                      <span className="text-amber-800 font-mono-tabular bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                        {item.count} match{item.count > 1 ? 'es' : ''}
                      </span>
                    </div>
                    {item.examples.length > 0 && (
                      <div className="mt-1.5 space-y-1">
                        <span className="text-neutral-400 text-[11px] block">Sample filtered text:</span>
                        {item.examples.map((ex, exI) => (
                          <div key={exI} className="font-mono text-[11px] text-neutral-600 bg-white px-2 py-1 rounded border border-neutral-200 truncate">
                            {ex}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-500 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Text is clean. No noise or redundant headers currently detected.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
