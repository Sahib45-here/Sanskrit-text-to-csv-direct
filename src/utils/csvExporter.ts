/**
 * CSV / TSV / JSON Export Engine with UTF-8 BOM
 * Guaranteed compatibility with Microsoft Excel, LibreOffice Calc, and Google Sheets.
 */

import { ParsedVerseRow } from './sectionParser';

function escapeCsvField(field: string): string {
  if (field === null || field === undefined) return '""';
  const str = String(field);
  // If string contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Builds UTF-8 CSV string with BOM character prefix
 */
export function generateCsvContent(rows: ParsedVerseRow[]): string {
  const headers = ['Section', 'Verse_Number', 'ISO_Text', 'Devanagari_Text'];
  const headerLine = headers.map(escapeCsvField).join(',');

  const lines = rows.map(row => {
    return [
      escapeCsvField(row.section),
      escapeCsvField(row.verseNumber),
      escapeCsvField(row.isoText),
      escapeCsvField(row.devanagariText),
    ].join(',');
  });

  // \uFEFF is the UTF-8 Byte Order Mark (BOM)
  return '\uFEFF' + [headerLine, ...lines].join('\r\n');
}

/**
 * Builds UTF-8 TSV (Tab Separated) string
 */
export function generateTsvContent(rows: ParsedVerseRow[]): string {
  const headers = ['Section', 'Verse_Number', 'ISO_Text', 'Devanagari_Text'];
  const headerLine = headers.join('\t');

  const lines = rows.map(row => {
    return [
      row.section.replace(/[\t\r\n]/g, ' '),
      row.verseNumber.replace(/[\t\r\n]/g, ' '),
      row.isoText.replace(/[\t]/g, ' ').replace(/\r?\n/g, ' \\n '),
      row.devanagariText.replace(/[\t]/g, ' ').replace(/\r?\n/g, ' \\n '),
    ].join('\t');
  });

  return '\uFEFF' + [headerLine, ...lines].join('\r\n');
}

/**
 * Downloads a text/csv file in the browser
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCsv(rows: ParsedVerseRow[], filename: string = 'sanskrit_verses.csv'): void {
  const csv = generateCsvContent(rows);
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

export function downloadTsv(rows: ParsedVerseRow[], filename: string = 'sanskrit_verses.tsv'): void {
  const tsv = generateTsvContent(rows);
  downloadFile(tsv, filename, 'text/tab-separated-values;charset=utf-8;');
}

export function downloadJson(rows: ParsedVerseRow[], filename: string = 'sanskrit_verses.json'): void {
  const exportData = rows.map(({ id, ...rest }) => rest);
  const json = JSON.stringify(exportData, null, 2);
  downloadFile(json, filename, 'application/json;charset=utf-8;');
}
