/**
 * Sanskrit Computational Linguistics Engine
 * Accurate ISO 15919 & IAST to Unicode Devanagari (देवनागरी) Transliteration
 * Handles vowel matras, virama (halant), consonant conjuncts, anusvara, visarga, avagraha, dandas, and Vedic accents.
 */

export interface TransliterateOptions {
  convertNumerals?: boolean; // 0-9 -> ०-९
  convertDandas?: boolean;   // | -> ।, || -> ॥
  preserveCase?: boolean;
}

// Independent Vowels (Svara)
const INDEPENDENT_VOWELS: Record<string, string> = {
  'a': 'अ',
  'ā': 'आ',
  'i': 'इ',
  'ī': 'ई',
  'u': 'उ',
  'ū': 'ऊ',
  'ṛ': 'ऋ',
  'ṝ': 'ॠ',
  'ḷ': 'ऌ',
  'ḹ': 'ॡ',
  'e': 'ए',
  'ē': 'ए',
  'ê': 'ऍ',
  'ai': 'ऐ',
  'o': 'ओ',
  'ō': 'ओ',
  'ô': 'ऑ',
  'au': 'औ',
  'ou': 'औ',
};

// Dependent Vowel Signs (Matras)
const DEPENDENT_VOWELS: Record<string, string> = {
  'a': '', // Inherent vowel
  'ā': 'ा',
  'i': 'ि',
  'ī': 'ी',
  'u': 'ु',
  'ū': 'ू',
  'ṛ': 'ृ',
  'ṝ': 'ॄ',
  'ḷ': 'ॢ',
  'ḹ': 'ॣ',
  'e': 'े',
  'ē': 'े',
  'ê': 'ॅ',
  'ai': 'ै',
  'o': 'ो',
  'ō': 'ो',
  'ô': 'ॉ',
  'au': 'ौ',
  'ou': 'ौ',
};

// Consonants (Vyanjana) without inherent vowel (with virama)
const CONSONANTS: Record<string, string> = {
  // Guttural / Velar
  'k': 'क',
  'kh': 'ख',
  'g': 'ग',
  'gh': 'घ',
  'ṅ': 'ङ',
  'n̄': 'ङ',

  // Palatal
  'c': 'च',
  'ch': 'छ',
  'j': 'ज',
  'jh': 'झ',
  'ñ': 'ञ',

  // Retroflex
  'ṭ': 'ट',
  'ṭh': 'ठ',
  'ḍ': 'ड',
  'ḍh': 'ढ',
  'ṇ': 'ण',

  // Dental
  't': 'त',
  'th': 'थ',
  'd': 'द',
  'dh': 'ध',
  'n': 'न',

  // Labial
  'p': 'प',
  'ph': 'फ',
  'b': 'ब',
  'bh': 'भ',
  'm': 'म',

  // Semivowels
  'y': 'य',
  'r': 'र',
  'l': 'ल',
  'v': 'व',
  'w': 'व',

  // Sibilants & Aspirate
  'ś': 'श',
  'ṣ': 'ष',
  's': 'स',
  'h': 'ह',

  // Vedic & Dravidian extensions in ISO 15919
  'ḻ': 'ळ',
  'ḻh': 'ऴ',
  'ṟ': 'ऱ',
  'ṉ': 'ऩ',
  'kṣ': 'क्ष',
  'jñ': 'ज्ञ',
};

// Modifiers & Accents
const MODIFIERS: Record<string, string> = {
  'ṃ': 'ं', // Anusvara
  'ṁ': 'ं',
  'm̐': 'ँ', // Candrabindu / Anunasika
  'ḥ': 'ः', // Visarga
  '’': 'ऽ', // Avagraha
  "'": 'ऽ',
  '`': 'ऽ',
  'ऽ': 'ऽ',
  'ẖ': 'ᳵ', // Jihvamuliya
  'ḫ': 'ᳶ', // Upadhmaniya
};

// Numerals
const NUMERALS: Record<string, string> = {
  '0': '०',
  '1': '१',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९',
};

// Sorted multi-character keys for greedy matching
const MULTI_CONSONANTS = Object.keys(CONSONANTS).sort((a, b) => b.length - a.length);
const MULTI_VOWELS = Object.keys(INDEPENDENT_VOWELS).sort((a, b) => b.length - a.length);

const VIRAMA = '्';

/**
 * Converts ISO 15919 / IAST transliterated string to Devanagari script.
 */
export function transliterateIsoToDevanagari(
  input: string,
  options: TransliterateOptions = {}
): string {
  const { convertNumerals = true, convertDandas = true } = options;
  if (!input) return '';

  let output = '';
  let i = 0;
  const len = input.length;

  // Helper to match longest key at index
  const matchAt = (list: string[], text: string, pos: number): string | null => {
    for (const key of list) {
      if (text.substring(pos, pos + key.length).toLowerCase() === key.toLowerCase()) {
        return key;
      }
    }
    return null;
  };

  let prevWasConsonant = false;

  while (i < len) {
    const char = input[i];
    const charLower = char.toLowerCase();

    // Check for double danda (||, ॥, .., Á Á, ÁÁ, á á, áá, ! !)
    if (
      convertDandas &&
      (input.substring(i, i + 2) === '||' ||
        input.substring(i, i + 2) === '॥' ||
        input.substring(i, i + 2) === '..' ||
        input.substring(i, i + 2) === 'ÁÁ' ||
        input.substring(i, i + 2) === 'áá' ||
        input.substring(i, i + 3) === 'Á Á' ||
        input.substring(i, i + 3) === 'á á' ||
        input.substring(i, i + 2) === '!!')
    ) {
      output += '॥';
      if (input.substring(i, i + 3) === 'Á Á' || input.substring(i, i + 3) === 'á á') {
        i += 3;
      } else {
        i += 2;
      }
      prevWasConsonant = false;
      continue;
    }

    // Check for single danda (|, ।, ., Á, á, /)
    if (
      convertDandas &&
      (char === '|' || char === '।' || char === '.' || char === 'Á' || char === 'á')
    ) {
      // Don't treat decimal point as danda if surrounded by digits
      if (char === '.') {
        const prev = i > 0 ? input[i - 1] : '';
        const next = i + 1 < len ? input[i + 1] : '';
        if (/\d/.test(prev) && /\d/.test(next)) {
          output += '.';
          i++;
          prevWasConsonant = false;
          continue;
        }
      }
      output += '।';
      i++;
      prevWasConsonant = false;
      continue;
    }

    // Check for Vedic accent markers
    if (char === '॑' || char === '॒') {
      output += char;
      i++;
      continue;
    }

    // Check for Candrabindu (m̐)
    if (input.substring(i, i + 2).toLowerCase() === 'm̐') {
      output += 'ँ';
      i += 2;
      prevWasConsonant = false;
      continue;
    }

    // Check for modifiers (anusvara, visarga, avagraha)
    if (MODIFIERS[char] || MODIFIERS[charLower]) {
      output += MODIFIERS[char] || MODIFIERS[charLower];
      i++;
      prevWasConsonant = false;
      continue;
    }

    // Check for numerals
    if (convertNumerals && NUMERALS[char]) {
      output += NUMERALS[char];
      i++;
      prevWasConsonant = false;
      continue;
    }

    // Check for consonants first (prioritizing longer matching keys like kṣ, jñ, kh, etc.)
    const matchedConsonantKey = matchAt(MULTI_CONSONANTS, input, i);

    if (matchedConsonantKey) {
      const devConsonant = CONSONANTS[matchedConsonantKey];
      i += matchedConsonantKey.length;

      // Lookahead for vowel
      const matchedVowelKey = matchAt(MULTI_VOWELS, input, i);

      if (matchedVowelKey) {
        // Consonant + Vowel
        const matra = DEPENDENT_VOWELS[matchedVowelKey];
        output += devConsonant + matra;
        i += matchedVowelKey.length;
        prevWasConsonant = false;
      } else {
        // Consonant followed by another consonant or end of word/punctuation:
        // In Sanskrit, if followed immediately by another consonant (no space), it forms a conjunct (Halant + consonant)
        // If followed by space or punctuation or end of string, standard Sanskrit convention assigns Virama (halant)
        // Check if next character is a letter
        const nextChar = i < len ? input[i] : '';
        const nextIsLetter = /[a-zA-Z\u0100-\u024F\u1E00-\u1EFF]/.test(nextChar);

        if (nextIsLetter) {
          // Part of a consonant cluster (e.g. "ṣṇ" in viṣṇu)
          output += devConsonant + VIRAMA;
          prevWasConsonant = true;
        } else {
          // Trailing consonant (e.g. "bhagavān", "stotram" ending in m with virama, or "namas")
          // In classical Sanskrit poetry, a solitary final consonant has virama (्)
          // except if it is commonly written with inherent 'a'. For strict IAST/ISO, absent vowel 'a' = virama!
          output += devConsonant + VIRAMA;
          prevWasConsonant = false;
        }
      }
      continue;
    }

    // Check for independent vowels
    const matchedVowelKey = matchAt(MULTI_VOWELS, input, i);
    if (matchedVowelKey) {
      output += INDEPENDENT_VOWELS[matchedVowelKey];
      i += matchedVowelKey.length;
      prevWasConsonant = false;
      continue;
    }

    // Whitespace, punctuation, or unmapped characters
    output += char;
    i++;
    prevWasConsonant = false;
  }

  return output;
}

/**
 * Normalizes legacy PDF font danda encodings (such as Á Á -> ॥, Á -> ।)
 */
export function normalizeLegacyFontDandas(raw: string): string {
  if (!raw) return '';
  return raw
    // Double dandas: Á Á, ÁÁ, á á, áá, ||
    .replace(/(?:Á\s*Á|ÁÁ|á\s*á|áá)/g, '॥')
    // Single dandas: Á, á at word/pada boundary or surrounded by space
    .replace(/(^|\s)Á(?=\s|$|[0-9०-९])/g, '$1।')
    .replace(/(^|\s)á(?=\s|$|[0-9०-९])/g, '$1।')
    .replace(/\bÁ\b/g, '।')
    .replace(/\bá\b/g, '।')
    .replace(/Á/g, '।');
}

/**
 * Normalize and clean up ISO/IAST diacritics
 */
export function normalizeIsoTransliteration(raw: string): string {
  if (!raw) return '';
  return normalizeLegacyFontDandas(raw)
    .normalize('NFC')
    .replace(/\bOm\b/gi, 'oṁ')
    .replace(/\bAum\b/gi, 'oṁ');
}
