import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const MAPPING_REFERENCE = [
  { group: 'Vowels (Svara)', examples: [
    { iso: 'a', dev: 'अ / —', name: 'Short a' },
    { iso: 'ā', dev: 'आ / ा', name: 'Long a' },
    { iso: 'i', dev: 'इ / ि', name: 'Short i' },
    { iso: 'ī', dev: 'ई / ी', name: 'Long i' },
    { iso: 'u', dev: 'उ / ु', name: 'Short u' },
    { iso: 'ū', dev: 'ऊ / ू', name: 'Long u' },
    { iso: 'ṛ', dev: 'ऋ / ृ', name: 'Vocalic r' },
    { iso: 'ṝ', dev: 'ॠ / ॄ', name: 'Long vocalic r' },
    { iso: 'ḷ', dev: 'ऌ / ॢ', name: 'Vocalic l' },
    { iso: 'e / ē', dev: 'ए / े', name: 'Long e' },
    { iso: 'ai', dev: 'ऐ / ै', name: 'Diphthong ai' },
    { iso: 'o / ō', dev: 'ओ / ो', name: 'Long o' },
    { iso: 'au', dev: 'औ / ौ', name: 'Diphthong au' },
  ]},
  { group: 'Consonants (Vyañjana)', examples: [
    { iso: 'k, kh, g, gh, ṅ', dev: 'क ख ग घ ङ', name: 'Velar (Kaṇṭhya)' },
    { iso: 'c, ch, j, jh, ñ', dev: 'च छ ज झ ञ', name: 'Palatal (Tālavya)' },
    { iso: 'ṭ, ṭh, ḍ, ḍh, ṇ', dev: 'ट ठ ड ढ ण', name: 'Retroflex (Mūrdhanya)' },
    { iso: 't, th, d, dh, n', dev: 'त थ द ध न', name: 'Dental (Dantya)' },
    { iso: 'p, ph, b, bh, m', dev: 'प फ ब भ म', name: 'Labial (Oṣṭhya)' },
    { iso: 'y, r, l, v', dev: 'य र ल व', name: 'Antastha (Semivowels)' },
    { iso: 'ś, ṣ, s, h', dev: 'श ष स ह', name: 'Ūṣman (Sibilants & Aspirate)' },
    { iso: 'ḻ, kṣ, jñ', dev: 'ळ क्ष ज्ञ', name: 'Vedic ḻ & Conjuncts' },
  ]},
  { group: 'Modifiers & Punctuation', examples: [
    { iso: 'ṃ / ṁ', dev: 'ं', name: 'Anusvāra (Bindu)' },
    { iso: 'm̐', dev: 'ँ', name: 'Candrabindu (Anunāsika)' },
    { iso: 'ḥ', dev: 'ः', name: 'Visarga' },
    { iso: "' / ’", dev: 'ऽ', name: 'Avagraha' },
    { iso: '| or .', dev: '।', name: 'Single Danda (विराम)' },
    { iso: '|| or ..', dev: '॥', name: 'Double Danda (पूर्णविराम)' },
  ]}
];

export const DiacriticsGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="guide-section" className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-neutral-50/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-amber-800" />
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              ISO 15919 & IAST Transliteration Reference Table
            </h3>
            <p className="text-xs text-neutral-500">
              Computational mapping guide for vowels, conjuncts, dandas, and avagrahas
            </p>
          </div>
        </div>
        <div className="text-neutral-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-neutral-200 bg-neutral-50/30 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {MAPPING_REFERENCE.map(section => (
            <div key={section.group} className="space-y-2">
              <h4 className="font-semibold text-neutral-800 border-b border-neutral-200 pb-1">
                {section.group}
              </h4>
              <div className="space-y-1.5 font-mono text-[11px]">
                {section.examples.map(ex => (
                  <div
                    key={ex.name}
                    className="flex items-center justify-between p-1.5 bg-white rounded border border-neutral-200/80"
                  >
                    <span className="font-semibold text-neutral-800">{ex.iso}</span>
                    <span className="font-sanskrit text-sm text-amber-900 font-bold">{ex.dev}</span>
                    <span className="text-[10px] text-neutral-400 font-sans">{ex.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
