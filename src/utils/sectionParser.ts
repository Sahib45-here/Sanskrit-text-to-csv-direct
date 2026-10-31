/**
 * Sanskrit Section & Verse Parsing Engine
 * Classifies logical sections (Title, Dhyāna Ślōka, Main Stotra, Phala Śruthi, Conclusion, Mangalam)
 * and extracts/assigns verse numbering with parallel Devanagari conversion.
 * Robustly normalizes legacy PDF font danda encodings (Á Á -> ॥, Á -> ।)
 * and divides rows cleanly after every verse number.
 */

import {
  transliterateIsoToDevanagari,
  normalizeLegacyFontDandas,
  TransliterateOptions,
} from './sanskritTransliterate';

export type SectionType =
  | 'Title'
  | 'Dhyāna Ślōka'
  | 'Main Stotra'
  | 'Phala Śruthi'
  | 'Conclusion'
  | 'Mangalam/Vāzhuthi';

export const SECTION_TYPES: SectionType[] = [
  'Title',
  'Dhyāna Ślōka',
  'Main Stotra',
  'Phala Śruthi',
  'Conclusion',
  'Mangalam/Vāzhuthi',
];

export interface ParsedVerseRow {
  id: string;
  section: SectionType;
  verseNumber: string;
  isoText: string;
  devanagariText: string;
  padas?: string[];
  isManualOverride?: boolean;
}

export interface ParseOptions extends TransliterateOptions {
  autoAssignVerseNumbers?: boolean;
  trimTrailingVerseNumberFromText?: boolean;
  collapseLineBreaksInVerse?: boolean;
}

// Regex patterns to detect section header markers in transliterated text
const TITLE_MARKERS = [
  /^(?:atha\s+)?(?:śrī|sri|om|oṁ)?\s*([a-zāīūṛṝḷḹeēoōṃḥśṣṭḍṇñṅ\s-]+(?:stōtram|stotram|aṣṭakam|astakam|sahasranāma|kavacam|stutiḥ|stuti|mālā|suprabhātam|pañcaratnam|catuḥślokī))/i,
  /^(?:atha\s+)?(?:śrī|sri)\s+[a-zāīūṛṝḷḹeēoōṃḥśṣṭḍṇñṅ\s-]+(?:viracitam|kṛtam)/i,
];

const DHYANA_MARKERS = [
  /^(?:atha\s+)?dhyānam?/i,
  /^(?:atha\s+)?dhyāna\s*śl[oō]k[aā]/i,
  /^pūrvapīṭhikā/i,
  /^viniy[oō]gaḥ?/i,
  /^saṅkalpaḥ?/i,
  /^nyāsaḥ?/i,
  /^dhyāyet/i,
];

const PHALASRUTHI_MARKERS = [
  /^(?:atha\s+)?phala\s*śrut[ih]/i,
  /^(?:atha\s+)?phala\s*stut[ih]/i,
  /^phala\s*prāpt[ih]/i,
  /^iti\s+[a-zāīūṛṝḷḹeēoōṃḥśṣṭḍṇñṅ\s-]+phala/i,
  /^yaḥ\s+paṭhet/i,
  /^imam\s+stavam/i,
  /^idaṁ\s+stotraṁ/i,
];

const CONCLUSION_MARKERS = [
  /^iti\s+(?:śrī|sri)/i,
  /^samāptam/i,
  /^sampūrṇam/i,
  /^kavitārkika\s*siṁh/i,
  /^kavitārkika\s*kēsar/i,
  /^śubhamastu/i,
  /^hariḥ\s*om/i,
];

const MANGALAM_MARKERS = [
  /^(?:atha\s+)?maṅgala(?:m|śl[oō]k[aā]|śāsanam)/i,
  /^maṅgalam\s+bhagavān/i,
  /^vāzhuth[iy]/i,
  /^vāḻi\s+thirunāmam/i,
  /^sarva\s*maṅgala/i,
  /^manga[lḷ]am/i,
];

/**
 * Normalizes danda tokens for ISO transliterated text representation.
 * Converts legacy PDF font artifacts:
 *   Á Á, ÁÁ, á á -> ||
 *   Á, á -> |
 */
export function normalizeIsoDandas(text: string): string {
  if (!text) return '';
  return text
    // Double dandas
    .replace(/(?:Á\s*Á|ÁÁ|á\s*á|áá|॥)/g, '||')
    // Single dandas
    .replace(/(?:Á|á|।)/g, '|')
    // Clean multiple consecutive pipes into double pipe
    .replace(/\|{3,}/g, '||')
    // Ensure clean spacing around dandas
    .replace(/([^\s|])\|([^\s|])/g, '$1 | $2');
}

/**
 * Splits raw input into normalized lines, guaranteeing that if a verse number
 * occurs mid-line (e.g. `prapadye Á 1 Á Á tvadekaśeṣo...` or `... || 1 || tvadeka...`),
 * the line is partitioned right after the verse marker.
 */
function preSplitAtVerseBoundaries(rawText: string): string[] {
  // Normalize legacy PDF font dandas in the raw string first
  let text = rawText
    .replace(/(?:Á\s*Á|ÁÁ|á\s*á|áá)/g, '॥')
    .replace(/(\s)Á(?=\s|$|[0-9०-९])/g, '$1।')
    .replace(/(\s)á(?=\s|$|[0-9०-९])/g, '$1।')
    .replace(/\bÁ\b/g, '।')
    .replace(/Á/g, '।');

  const lines = text.split(/\r?\n/);
  const result: string[] = [];

  // Regex to match verse termination patterns followed by subsequent text on same line
  // e.g., "॥ 1 ॥ tvadekaśeṣo" or "|| 1 || tvadekaśeṣo" or "Á 1 Á Á tvadekaśeṣo"
  const midLineVerseEndRegex = /((?:(?:॥|\|\||।|\|)\s*(?:[०-९\d]+)\s*(?:॥|\|\||।|\|)|(?:\(|\[|—)\s*(?:[०-९\d]+)\s*(?:\)|\]|—)|(?:॥|\|\|)\s*(?:[०-९\d]+)?))\s+(?=[a-zA-Z\u0100-\u024F\u1E00-\u1EFF])/;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      result.push('');
      continue;
    }

    let remaining = trimmed;
    while (remaining) {
      const match = remaining.match(midLineVerseEndRegex);
      if (match && match.index !== undefined) {
        const splitPoint = match.index + match[1].length;
        const head = remaining.substring(0, splitPoint).trim();
        remaining = remaining.substring(splitPoint).trim();
        if (head) result.push(head);
      } else {
        result.push(remaining);
        break;
      }
    }
  }

  return result;
}

/**
 * Parses transliterated text into structured verse rows with sections and Devanagari conversion.
 */
export function parseTransliteratedText(
  text: string,
  options: ParseOptions = {}
): ParsedVerseRow[] {
  const {
    autoAssignVerseNumbers = true,
    trimTrailingVerseNumberFromText = true,
    convertNumerals = true,
    convertDandas = true,
  } = options;

  if (!text || !text.trim()) return [];

  // Pre-split to ensure rows divide after verse numbers
  const rawLines = preSplitAtVerseBoundaries(text).map(l => l.trim()).filter(Boolean);
  if (rawLines.length === 0) return [];

  const rows: ParsedVerseRow[] = [];
  let currentSection: SectionType = 'Title';
  let verseCounter = 1;
  let dhyanaCounter = 1;

  let currentBlockLines: string[] = [];

  const checkSectionHeader = (line: string): SectionType | null => {
    const cleanLine = line.replace(/[॥।|\-—_Áá]/g, '').trim().toLowerCase();

    for (const pat of MANGALAM_MARKERS) {
      if (pat.test(cleanLine)) return 'Mangalam/Vāzhuthi';
    }
    for (const pat of CONCLUSION_MARKERS) {
      if (pat.test(cleanLine)) return 'Conclusion';
    }
    for (const pat of PHALASRUTHI_MARKERS) {
      if (pat.test(cleanLine)) return 'Phala Śruthi';
    }
    for (const pat of DHYANA_MARKERS) {
      if (pat.test(cleanLine)) return 'Dhyāna Ślōka';
    }
    for (const pat of TITLE_MARKERS) {
      if (pat.test(cleanLine)) return 'Title';
    }
    return null;
  };

  const flushBlock = (lines: string[], explicitSection?: SectionType) => {
    if (lines.length === 0) return;
    const combinedRaw = lines.join('\n');
    let sectionToUse = explicitSection || currentSection;

    // Normalize any legacy Á / Á Á in raw block
    let normalizedBlock = combinedRaw
      .replace(/(?:Á\s*Á|ÁÁ|á\s*á|áá)/g, '॥')
      .replace(/(^|\s)Á(?=\s|$|[0-9०-९])/g, '$1।')
      .replace(/(^|\s)á(?=\s|$|[0-9०-९])/g, '$1।')
      .replace(/\bÁ\b/g, '।')
      .replace(/Á/g, '।');

    // Detect if this block has an embedded verse number:
    // Formats: "॥ 1 ॥", "|| 1 ||", "| 1 |", "। 1 ।", "(1)", "[1]", "— 1 —", "॥ 1", "1 ॥"
    let extractedNumber = '';
    let cleanedIso = normalizedBlock;

    const verseNumRegex = /(?:(?:॥|\|\||।|\|)\s*([०-९\d]+)\s*(?:॥|\|\||।|\|)|(?:\(|\[|—)\s*([०-९\d]+)\s*(?:\)|\]|—)|(?:\s*([०-९\d]+)\s*(?:॥|\|\|)$)|(?:(?:॥|\|\|)\s*([०-९\d]+)$))/;
    const numMatch = normalizedBlock.match(verseNumRegex);

    if (numMatch) {
      extractedNumber = numMatch[1] || numMatch[2] || numMatch[3] || numMatch[4] || '';
      if (trimTrailingVerseNumberFromText) {
        cleanedIso = normalizedBlock.replace(numMatch[0], '').trim();
        // Ensure proper closing danda in ISO representation
        if (!/(?:\|\||॥|\||।)$/.test(cleanedIso)) {
          cleanedIso += ' ||';
        }
      }
    }

    // Determine verse number assignment
    let finalVerseNumber = extractedNumber;
    if (!finalVerseNumber) {
      if (sectionToUse === 'Main Stotra') {
        finalVerseNumber = String(verseCounter++);
      } else if (sectionToUse === 'Dhyāna Ślōka') {
        finalVerseNumber = dhyanaCounter > 1 ? `D-${dhyanaCounter}` : 'D-1';
        dhyanaCounter++;
      } else if (sectionToUse === 'Title') {
        finalVerseNumber = '—';
      } else if (sectionToUse === 'Phala Śruthi') {
        finalVerseNumber = `P-${rows.filter(r => r.section === 'Phala Śruthi').length + 1}`;
      } else if (sectionToUse === 'Mangalam/Vāzhuthi') {
        finalVerseNumber = `M-${rows.filter(r => r.section === 'Mangalam/Vāzhuthi').length + 1}`;
      } else if (sectionToUse === 'Conclusion') {
        finalVerseNumber = '—';
      }
    } else {
      // If we extracted a numeric number and section is still Title, promote to Main Stotra!
      if (sectionToUse === 'Title' && /^\d+$/.test(finalVerseNumber)) {
        sectionToUse = 'Main Stotra';
        currentSection = 'Main Stotra';
      }
    }

    // Ensure ISO text uses standard clean ISO dandas (|| for double, | for single)
    const displayIsoText = normalizeIsoDandas(cleanedIso);

    // Transliterate to Devanagari
    const devanagariText = transliterateIsoToDevanagari(cleanedIso, {
      convertNumerals,
      convertDandas,
    });

    rows.push({
      id: `row-${rows.length + 1}-${Date.now().toString(36)}`,
      section: sectionToUse,
      verseNumber: finalVerseNumber,
      isoText: displayIsoText,
      devanagariText,
      padas: lines,
    });
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const detectedHeader = checkSectionHeader(line);

    // If line is a section header marker
    if (detectedHeader) {
      // Flush any pending lines before switching sections
      if (currentBlockLines.length > 0) {
        flushBlock(currentBlockLines);
        currentBlockLines = [];
      }

      currentSection = detectedHeader;

      // Standalone title or header line flush
      const isShortHeader = line.length < 90 && !/(?:\|\||॥|Á\s*Á|ÁÁ)/.test(line);
      if (
        isShortHeader &&
        (detectedHeader === 'Title' ||
          detectedHeader === 'Conclusion' ||
          /^(?:atha|dhyānam|phala|iti)/i.test(line))
      ) {
        flushBlock([line], detectedHeader);
        if (detectedHeader === 'Title') {
          currentSection = 'Main Stotra';
        }
        continue;
      }
    }

    currentBlockLines.push(line);

    // Comprehensive verse ending detection:
    // Matches:
    // 1) "॥ 1 ॥", "|| 1 ||", "Á 1 Á Á", "Á 1 Á", "| 1 |", "। 1 ।"
    // 2) Double danda at line end: "॥", "||", "Á Á", "ÁÁ"
    // 3) Trailing verse number: "(1)", "[1]", "1 ॥", "1 ||", "1 Á Á", "— 1 —"
    const hasVerseEnding =
      /(?:(?:॥|\|\||।|\||Á\s*Á|ÁÁ|Á)\s*(?:[०-९\d]+)\s*(?:॥|\|\||।|\||Á\s*Á|ÁÁ|Á))\s*$/.test(line) ||
      /(?:(?:॥|\|\||Á\s*Á|ÁÁ)\s*(?:[०-९\d]+)?)\s*$/.test(line) ||
      /(?:\|\||॥|Á\s*Á|ÁÁ)/.test(line) ||
      /(?:\(|\[|—)\s*\d+\s*(?:\)|\]|—)\s*$/.test(line) ||
      /\b\d+\s*(?:॥|\|\||Á\s*Á|ÁÁ)\s*$/.test(line);

    if (hasVerseEnding) {
      if (currentSection === 'Title') {
        currentSection = 'Main Stotra';
      }
      flushBlock(currentBlockLines, currentSection);
      currentBlockLines = [];
    }
  }

  // Flush any remaining lines
  if (currentBlockLines.length > 0) {
    flushBlock(currentBlockLines, currentSection);
  }

  // Post-processing check: If all rows ended up as 'Title', let's properly partition
  if (rows.length > 1 && rows.every(r => r.section === 'Title')) {
    rows[0].section = 'Title';
    for (let j = 1; j < rows.length; j++) {
      rows[j].section = 'Main Stotra';
      if (rows[j].verseNumber === '—') {
        rows[j].verseNumber = String(j);
      }
    }
  }

  return rows;
}
