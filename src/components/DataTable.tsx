import React, { useState } from 'react';
import {
  ParsedVerseRow,
  SectionType,
  SECTION_TYPES,
} from '../utils/sectionParser';
import { transliterateIsoToDevanagari } from '../utils/sanskritTransliterate';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Copy,
  Check,
  Edit2,
  FileSpreadsheet,
} from 'lucide-react';

interface DataTableProps {
  rows: ParsedVerseRow[];
  onUpdateRows: (rows: ParsedVerseRow[]) => void;
  onRenumberVerses: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  rows,
  onUpdateRows,
  onRenumberVerses,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter rows based on search and section filter
  const filteredRows = rows.filter(row => {
    const matchesSection = selectedSection === 'ALL' || row.section === selectedSection;
    if (!matchesSection) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      row.verseNumber.toLowerCase().includes(query) ||
      row.section.toLowerCase().includes(query) ||
      row.isoText.toLowerCase().includes(query) ||
      row.devanagariText.toLowerCase().includes(query)
    );
  });

  const handleFieldChange = (
    id: string,
    field: keyof ParsedVerseRow,
    value: string
  ) => {
    const updated = rows.map(r => {
      if (r.id !== id) return r;
      const updatedRow = { ...r, [field]: value, isManualOverride: true };

      // If user edits ISO text, automatically sync Devanagari unless it was independently customized
      if (field === 'isoText') {
        updatedRow.devanagariText = transliterateIsoToDevanagari(value);
      }
      return updatedRow;
    });
    onUpdateRows(updated);
  };

  const handleSyncRowDevanagari = (id: string) => {
    const updated = rows.map(r => {
      if (r.id !== id) return r;
      return {
        ...r,
        devanagariText: transliterateIsoToDevanagari(r.isoText),
      };
    });
    onUpdateRows(updated);
  };

  const handleDeleteRow = (id: string) => {
    const updated = rows.filter(r => r.id !== id);
    onUpdateRows(updated);
  };

  const handleMoveRow = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= rows.length) return;

    const newRows = [...rows];
    const [moved] = newRows.splice(index, 1);
    newRows.splice(targetIndex, 0, moved);
    onUpdateRows(newRows);
  };

  const handleAddRow = (afterIndex: number) => {
    const newRow: ParsedVerseRow = {
      id: `row-${Date.now()}`,
      section: 'Main Stotra',
      verseNumber: String(rows.length + 1),
      isoText: '',
      devanagariText: '',
    };
    const newRows = [...rows];
    newRows.splice(afterIndex + 1, 0, newRow);
    onUpdateRows(newRows);
    setEditingRowId(newRow.id);
  };

  const handleCopyRow = (row: ParsedVerseRow) => {
    const line = `${row.section}\t${row.verseNumber}\t${row.isoText}\t${row.devanagariText}`;
    navigator.clipboard.writeText(line);
    setCopiedId(row.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Section badge coloring
  const getSectionBadgeColor = (sec: SectionType) => {
    switch (sec) {
      case 'Title':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Dhyāna Ślōka':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Main Stotra':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Phala Śruthi':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Conclusion':
        return 'text-neutral-700 bg-neutral-100 border-neutral-300';
      case 'Mangalam/Vāzhuthi':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-neutral-700 bg-neutral-100 border-neutral-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden flex flex-col">
      {/* Table Controls & Filters */}
      <div className="p-4 border-b border-neutral-200 bg-neutral-50/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search verses, transliterated text, or Devanagari..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
          />
        </div>

        {/* Section Filter and Utilities */}
        <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 cursor-pointer"
            >
              <option value="ALL">All Sections ({rows.length})</option>
              {SECTION_TYPES.map(sec => {
                const count = rows.filter(r => r.section === sec).length;
                return (
                  <option key={sec} value={sec}>
                    {sec} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          <button
            onClick={onRenumberVerses}
            title="Auto-renumber Main Stotra verses from 1"
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
            <span>Auto-Renumber Verses</span>
          </button>

          <button
            onClick={() => handleAddRow(rows.length - 1)}
            className="px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>
      </div>

      {/* Table Viewport */}
      <div className="overflow-x-auto min-h-[300px]">
        {filteredRows.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 flex flex-col items-center justify-center space-y-2">
            <FileSpreadsheet className="w-8 h-8 text-neutral-300" />
            <p className="text-sm font-medium text-neutral-700">No verses found</p>
            <p className="text-xs text-neutral-400">
              {rows.length === 0
                ? 'Paste Sanskrit text above or load a sample stotra to view the parsed table.'
                : 'No rows match your current filter or search criteria.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-100/70 text-neutral-600 font-semibold text-[11px] uppercase tracking-wider select-none">
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-3 w-40">Section</th>
                <th className="py-3 px-3 w-24 text-center">Verse_No</th>
                <th className="py-3 px-4 min-w-[280px]">ISO_Text (Transliterated)</th>
                <th className="py-3 px-4 min-w-[320px]">Devanagari_Text (देवनागरी)</th>
                <th className="py-3 px-3 w-28 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredRows.map((row, idx) => {
                const globalIndex = rows.findIndex(r => r.id === row.id);
                const isEditing = editingRowId === row.id;

                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-amber-50/40 transition-colors group ${
                      isEditing ? 'bg-amber-50/60' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-3 px-3 text-center text-neutral-400 font-mono-tabular text-xs">
                      {globalIndex + 1}
                    </td>

                    {/* Section Selector */}
                    <td className="py-3 px-3 align-top">
                      <select
                        value={row.section}
                        onChange={e =>
                          handleFieldChange(
                            row.id,
                            'section',
                            e.target.value as SectionType
                          )
                        }
                        className={`text-xs font-medium px-2 py-1 rounded border focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer ${getSectionBadgeColor(
                          row.section
                        )}`}
                      >
                        {SECTION_TYPES.map(sec => (
                          <option key={sec} value={sec}>
                            {sec}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Verse Number */}
                    <td className="py-3 px-3 align-top text-center">
                      <input
                        type="text"
                        value={row.verseNumber}
                        onChange={e =>
                          handleFieldChange(row.id, 'verseNumber', e.target.value)
                        }
                        className="w-16 text-center font-mono-tabular font-semibold text-xs px-2 py-1 bg-white border border-neutral-200 rounded focus:border-amber-600 focus:outline-none"
                      />
                    </td>

                    {/* ISO Transliterated Text */}
                    <td className="py-3 px-4 align-top">
                      <textarea
                        rows={Math.max(2, row.isoText.split('\n').length)}
                        value={row.isoText}
                        onChange={e =>
                          handleFieldChange(row.id, 'isoText', e.target.value)
                        }
                        className="w-full text-xs font-mono bg-transparent hover:bg-white focus:bg-white p-1.5 rounded border border-transparent hover:border-neutral-200 focus:border-amber-600 focus:outline-none transition-colors resize-y leading-relaxed text-neutral-800"
                        placeholder="Enter ISO transliterated text..."
                      />
                    </td>

                    {/* Devanagari Text */}
                    <td className="py-3 px-4 align-top">
                      <div className="relative">
                        <textarea
                          rows={Math.max(2, row.devanagariText.split('\n').length)}
                          value={row.devanagariText}
                          onChange={e =>
                            handleFieldChange(
                              row.id,
                              'devanagariText',
                              e.target.value
                            )
                          }
                          className="w-full text-sm font-sanskrit bg-transparent hover:bg-white focus:bg-white p-1.5 rounded border border-transparent hover:border-neutral-200 focus:border-amber-600 focus:outline-none transition-colors resize-y leading-relaxed text-neutral-900"
                          placeholder="देवनागरी पाठ..."
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 align-top text-right pr-4">
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleCopyRow(row)}
                          title="Copy Row"
                          className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
                        >
                          {copiedId === row.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSyncRowDevanagari(row.id)}
                          title="Re-convert ISO to Devanagari"
                          className="p-1 text-neutral-400 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveRow(globalIndex, 'up')}
                          disabled={globalIndex === 0}
                          title="Move Up"
                          className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 rounded transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveRow(globalIndex, 'down')}
                          disabled={globalIndex === rows.length - 1}
                          title="Move Down"
                          className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 rounded transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(row.id)}
                          title="Delete Row"
                          className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Table Footer with Summary */}
      <div className="p-3 border-t border-neutral-200 bg-neutral-50/70 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="text-neutral-700 font-mono-tabular">{filteredRows.length}</strong> of{' '}
            <strong className="text-neutral-700 font-mono-tabular">{rows.length}</strong> verses
          </span>
          {filteredRows.length < rows.length && (
            <span className="text-neutral-400">· (Filtered by search or section)</span>
          )}
        </div>
        <div className="text-[11px] text-neutral-400">
          Tip: Edits in ISO_Text automatically re-generate the parallel Devanagari script.
        </div>
      </div>
    </div>
  );
};
