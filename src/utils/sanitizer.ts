/**
 * Web Noise & Source Attribution Sanitization Engine
 * Filters redundant web headers, footers, URL signatures, page counts, and PDF metadata.
 */

export interface SanitizationOptions {
  stripUrls: boolean;
  stripKnownDomains: boolean;
  stripPageNumbers: boolean;
  stripDocumentMetadata: boolean;
  stripDecorativeBorders: boolean;
  normalizeWhitespace: boolean;
  customRemovalPatterns?: string[];
}

export interface SanitizationResult {
  cleanedText: string;
  removedItems: {
    rule: string;
    description: string;
    count: number;
    examples: string[];
  }[];
  totalRemovedLines: number;
}

const DEFAULT_OPTIONS: SanitizationOptions = {
  stripUrls: true,
  stripKnownDomains: true,
  stripPageNumbers: true,
  stripDocumentMetadata: true,
  stripDecorativeBorders: true,
  normalizeWhitespace: true,
};

// Common religious repository domain names & web signatures
const KNOWN_DOMAINS = [
  'prapatti.com',
  'www.prapatti.com',
  'srivaishnavam.com',
  'sanskritdocuments.org',
  'vedamu.org',
  'celextel.org',
  'kamakoti.org',
  'ramanuja.org',
  'stotram.co.in',
  'stotrasamhita.net',
  'shaivam.org',
  'advaita-vedanta.org',
  'archive.org',
];

export function sanitizeSanskritSourceText(
  rawText: string,
  customOptions?: Partial<SanitizationOptions>
): SanitizationResult {
  const options: SanitizationOptions = { ...DEFAULT_OPTIONS, ...customOptions };
  if (!rawText) {
    return { cleanedText: '', removedItems: [], totalRemovedLines: 0 };
  }

  const lines = rawText.split(/\r?\n/);
  const keptLines: string[] = [];

  const removalsMap: Map<string, { rule: string; description: string; count: number; examples: string[] }> = new Map();

  const recordRemoval = (rule: string, desc: string, sample: string) => {
    if (!removalsMap.has(rule)) {
      removalsMap.set(rule, { rule, description: desc, count: 0, examples: [] });
    }
    const entry = removalsMap.get(rule)!;
    entry.count++;
    if (entry.examples.length < 3 && !entry.examples.includes(sample.trim())) {
      entry.examples.push(sample.trim());
    }
  };

  for (let idx = 0; idx < lines.length; idx++) {
    let line = lines[idx];
    const trimmed = line.trim();

    // Skip empty lines gracefully
    if (!trimmed) {
      keptLines.push('');
      continue;
    }

    // 1. Decorative Borders (e.g., "--------------", "===============", "* * * * *", "___________")
    if (options.stripDecorativeBorders && /^[=\-_*~•#\s]{4,}$/.test(trimmed)) {
      recordRemoval('borders', 'Decorative border lines and dividers', trimmed);
      continue;
    }

    // 2. URLs and Web Signatures
    if (options.stripUrls) {
      if (/^https?:\/\/[^\s]+$/i.test(trimmed) || /^(?:www\.)?[a-zA-Z0-9-]+\.(?:com|org|net|in|edu|gov)(?:\/[^\s]*)?$/i.test(trimmed)) {
        recordRemoval('url', 'Direct URL addresses and web links', trimmed);
        continue;
      }
    }

    // 3. Known domain mentions / headers / footers
    if (options.stripKnownDomains) {
      const lowerTrimmed = trimmed.toLowerCase();
      const hasKnownDomain = KNOWN_DOMAINS.some(domain => lowerTrimmed.includes(domain));
      if (hasKnownDomain) {
        recordRemoval('known_domains', 'Repository signatures (e.g. prapatti.com, sanskritdocuments.org)', trimmed);
        continue;
      }
    }

    // 4. Page numbering & PDF pagination noise
    // Examples: "Page 1 of 4", "Page 2", "- 3 -", "[ 4 ]", "1 / 8", "1 of 12"
    if (options.stripPageNumbers) {
      const isPagePattern =
        /^(?:page|pg\.?)\s*\d+(?:\s*(?:of|\/)\s*\d+)?$/i.test(trimmed) ||
        /^[-–—]\s*\d+\s*[-–—]$/.test(trimmed) ||
        /^\[\s*\d+\s*\]$/.test(trimmed) ||
        /^\(\s*\d+\s*\)$/.test(trimmed) && trimmed.length < 6 ||
        /^\d+\s*(?:of|\/)\s*\d+$/i.test(trimmed);

      if (isPagePattern) {
        recordRemoval('pagination', 'Page numbers and PDF pagination artifacts', trimmed);
        continue;
      }
    }

    // 5. Document Metadata & Source Attributions
    // Examples: "PDF created by ...", "Encoded by ...", "Proofread by ...", "Please send corrections to ...", "Sri Ramanuja Mission", "Desika Stotra Mala"
    if (options.stripDocumentMetadata) {
      const isMetaAttribution =
        /^(?:pdf\s+(?:created|compiled|generated|typeset)\s+by|encoded\s+by|proofread\s+by|transliterated\s+by|source\s*:|compiled\s+by|scanned\s+by)/i.test(trimmed) ||
        /^(?:please\s+send\s+corrections|send\s+corrections\s+to|all\s+rights\s+reserved|copyright\s+©|©\s*copyright)/i.test(trimmed) ||
        /^%\s*(?:file\s+name|author|title|language|transliterated|proofread|description)/i.test(trimmed); // LaTeX/ITRANS metadata tags

      if (isMetaAttribution) {
        recordRemoval('metadata', 'Metadata attributions, encoders, and copyright notices', trimmed);
        continue;
      }
    }

    // 6. Custom removal patterns
    if (options.customRemovalPatterns && options.customRemovalPatterns.length > 0) {
      let matchedCustom = false;
      for (const pattern of options.customRemovalPatterns) {
        if (pattern && trimmed.toLowerCase().includes(pattern.toLowerCase())) {
          recordRemoval('custom', `Custom filter matched: "${pattern}"`, trimmed);
          matchedCustom = true;
          break;
        }
      }
      if (matchedCustom) continue;
    }

    // Clean inline URL artifacts if embedded in a line without removing the whole Sanskrit line
    if (options.stripUrls) {
      line = line.replace(/https?:\/\/[^\s]+/gi, '').replace(/www\.[a-z0-9\-]+\.[a-z]{2,}(?:\/[^\s]*)?/gi, '');
    }

    // Clean inline known domains
    if (options.stripKnownDomains) {
      for (const domain of KNOWN_DOMAINS) {
        line = line.replace(new RegExp(domain, 'gi'), '');
      }
    }

    if (options.normalizeWhitespace) {
      line = line.replace(/[ \t]+/g, ' ');
    }

    if (line.trim().length > 0) {
      keptLines.push(line.trim());
    }
  }

  // Deduplicate consecutive empty lines
  const cleanedLines: string[] = [];
  let prevEmpty = false;
  for (const line of keptLines) {
    if (!line) {
      if (!prevEmpty) {
        cleanedLines.push('');
        prevEmpty = true;
      }
    } else {
      cleanedLines.push(line);
      prevEmpty = false;
    }
  }

  const cleanedText = cleanedLines.join('\n').trim();
  const totalRemovedLines = lines.length - cleanedLines.filter(Boolean).length;

  return {
    cleanedText,
    removedItems: Array.from(removalsMap.values()),
    totalRemovedLines: Math.max(0, totalRemovedLines),
  };
}
