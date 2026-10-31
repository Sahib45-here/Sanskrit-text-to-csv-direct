import React from 'react';

interface DiacriticsQuickBarProps {
  onInsertChar: (char: string) => void;
}

const SANSKRIT_DIACRITICS = [
  { char: 'ā', name: 'long a' },
  { char: 'ī', name: 'long i' },
  { char: 'ū', name: 'long u' },
  { char: 'ṛ', name: 'vocalic r' },
  { char: 'ṝ', name: 'long vocalic r' },
  { char: 'ḷ', name: 'vocalic l' },
  { char: 'ḹ', name: 'long vocalic l' },
  { char: 'ē', name: 'long e' },
  { char: 'ō', name: 'long o' },
  { char: 'ṃ', name: 'anusvāra' },
  { char: 'ḥ', name: 'visarga' },
  { char: 'ś', name: 'palatal s' },
  { char: 'ṣ', name: 'retroflex s' },
  { char: 'ṭ', name: 'retroflex t' },
  { char: 'ṭh', name: 'retroflex th' },
  { char: 'ḍ', name: 'retroflex d' },
  { char: 'ḍh', name: 'retroflex dh' },
  { char: 'ṇ', name: 'retroflex n' },
  { char: 'ñ', name: 'palatal n' },
  { char: 'ṅ', name: 'velar n' },
  { char: 'ḻ', name: 'retroflex l' },
  { char: '|', name: 'single danda' },
  { char: '||', name: 'double danda' },
  { char: "'", name: 'avagraha' },
];

export const DiacriticsQuickBar: React.FC<DiacriticsQuickBarProps> = ({ onInsertChar }) => {
  return (
    <div className="flex items-center gap-1.5 flex-wrap py-1.5 px-2 bg-neutral-100/70 border border-neutral-200 rounded-lg text-xs">
      <span className="text-neutral-500 font-medium mr-1 text-[11px] select-none">Diacritics:</span>
      {SANSKRIT_DIACRITICS.map(({ char, name }) => (
        <button
          key={char}
          type="button"
          onClick={() => onInsertChar(char)}
          title={`Insert ${char} (${name})`}
          className="px-2 py-0.5 bg-white hover:bg-amber-50 hover:border-amber-400 border border-neutral-300 rounded text-neutral-800 hover:text-amber-900 transition-colors font-medium active:scale-95 text-xs shadow-2xs"
        >
          {char}
        </button>
      ))}
    </div>
  );
};
