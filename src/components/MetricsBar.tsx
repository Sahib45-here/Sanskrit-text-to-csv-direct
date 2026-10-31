import React from 'react';
import { ParsedVerseRow } from '../utils/sectionParser';

interface MetricsBarProps {
  rows: ParsedVerseRow[];
  totalSanitizedLines: number;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ rows, totalSanitizedLines }) => {
  const mainStotraCount = rows.filter(r => r.section === 'Main Stotra').length;
  const dhyanaCount = rows.filter(r => r.section === 'Dhyāna Ślōka').length;
  const phalaCount = rows.filter(r => r.section === 'Phala Śruthi').length;
  const otherCount = rows.length - mainStotraCount - dhyanaCount - phalaCount;

  const totalIsoChars = rows.reduce((acc, r) => acc + r.isoText.length, 0);
  const totalDevChars = rows.reduce((acc, r) => acc + r.devanagariText.length, 0);

  return (
    <div className="flex items-center gap-4 sm:gap-6 flex-wrap py-2 px-1 text-xs text-neutral-500 border-b border-neutral-200">
      <div className="flex items-center gap-1.5">
        <span className="text-neutral-400">Total Verses:</span>
        <span className="font-semibold text-neutral-800 font-mono-tabular">{rows.length}</span>
      </div>

      <span className="text-neutral-300" aria-hidden="true">·</span>

      <div className="flex items-center gap-1.5">
        <span className="text-neutral-400">Main Stotra:</span>
        <span className="font-medium text-emerald-800 font-mono-tabular">{mainStotraCount}</span>
      </div>

      {dhyanaCount > 0 && (
        <>
          <span className="text-neutral-300" aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">Dhyāna:</span>
            <span className="font-medium text-purple-800 font-mono-tabular">{dhyanaCount}</span>
          </div>
        </>
      )}

      {phalaCount > 0 && (
        <>
          <span className="text-neutral-300" aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">Phala Śruthi:</span>
            <span className="font-medium text-amber-800 font-mono-tabular">{phalaCount}</span>
          </div>
        </>
      )}

      {totalSanitizedLines > 0 && (
        <>
          <span className="text-neutral-300" aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">Web Artifacts Filtered:</span>
            <span className="font-medium text-neutral-700 font-mono-tabular">{totalSanitizedLines} lines</span>
          </div>
        </>
      )}

      <span className="text-neutral-300" aria-hidden="true">·</span>

      <div className="flex items-center gap-1.5">
        <span className="text-neutral-400">Devanagari Unicode Glyphs:</span>
        <span className="font-mono-tabular text-neutral-700">{totalDevChars.toLocaleString()}</span>
      </div>
    </div>
  );
};
