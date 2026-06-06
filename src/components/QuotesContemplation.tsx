/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { SacredQuote } from "../types";

const SACRED_VERSES: SacredQuote[] = [
  {
    verse: "तप्त-काञ्चन-गौराङ्गि राधे वृन्दावनेश्वरि।\nवृषभानु-सुते देवि प्रणमामि हरि-प्रिये॥",
    transliteration: "tapta-kāñcana-gaurāṅgi rādhe vṛndāvaneśvari\nvṛṣabhānu-sute devi praṇamāmi hari-priye",
    translation: "I offer my respects to Radharani, whose complexion is like molten gold and who is the Queen of Vrindavana. You are the daughter of King Vrishabhanu, and You are very dear to Lord Krishna.",
    source: "Pranama Mantra"
  },
  {
    verse: "कमलनयन-लोला-नूतनाभीष्ट-रागा\nमृदु-चरण-सरोज-स्पर्श-हर्षोत्सवाङ्गी।",
    transliteration: "kamala-nayana-lolā-nūtanābhīṣṭa-rāgā\nmṛdu-caraṇa-saroja-sparśa-harṣotsavāṅgī",
    translation: "Her lotus eyes rest on Krishna. Her soft lotus feet bring joyful festivals of devotional ecstasy to those who contemplate Her lotus lotus trace.",
    source: "Radha Rasa Sudhanidhi"
  },
  {
    verse: "राधा-नाम-परं जप्त्वाराधा-चरण-संस्मरन्।\nराधा-लीलां सदा ध्यायन् राधा-लोके महीयते॥",
    transliteration: "rādhā-nāma-paraṁ japtvā rādhā-caraṇa-saṁsmaran\nrādhā-līlāṁ sadā dhyāyan rādhā-loke mahīyate",
    translation: "By chanting the holy name of Radha, remembering Her lotus feet, and constantly meditating upon Her divine pastimes, one resides eternally in Her transcendental realm.",
    source: "Padma Purana"
  },
  {
    verse: "आनन्दमयोऽभ्यासात्। ह्लादिनी सन्धिनी संवित्‌।",
    transliteration: "ānandamayo'bhyāsāt | hlādinī sandhinī saṁvit",
    translation: "She is the Hladini Shakti—the internal pleasure-giving potency of the Supreme Consciousness. Her names embody pure divine love, peace, and spiritual illumination.",
    source: "Vedanta Sutra & Upanishads"
  },
  {
    verse: "श्री-वृषभानु-नन्दिनी राधा सर्व-लक्ष्मी-मयी तथा।\nकृष्ण-वक्षः-स्थले स्थिता नित्या चिन्मयी रस-दायिनी॥",
    transliteration: "śrī-vṛṣabhānu-nandinī rādhā sarva-lakṣmī-mayī tathā\nkṛṣṇa-vakṣaḥ-sthale sthitā nityā cinmayī rasa-dāyinī",
    translation: "The beautiful daughter of Vrishabhanu, Radha is the source of all spiritual opulences (Lakshmis). Resting eternally on Krishna’s chest, She is the eternal giver of pure transcendental nectar.",
    source: "Gautamiya Tantra"
  }
];

export const QuotesContemplation: React.FC = () => {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? SACRED_VERSES.length - 1 : prevIndex - 1));
  };

  const next = () => {
    setIndex((prevIndex) => (prevIndex === SACRED_VERSES.length - 1 ? 0 : prevIndex + 1));
  };

  // Auto rotate quotes every 25 seconds for slow serene background reading
  useEffect(() => {
    const timer = setInterval(next, 25000);
    return () => clearInterval(timer);
  }, []);

  const activeQuote = SACRED_VERSES[index];

  return (
    <div id="quotes-contemplation-card" className="w-full bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-amber-100/60 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]">
      <div className="absolute top-0 right-0 p-3 opacity-15 pointer-events-none">
        <BookOpen className="w-20 h-20 text-orange-600" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-600" />
        <span className="text-xs uppercase tracking-wider font-semibold text-amber-800">
          Sacred Contemplation • {activeQuote.source}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center px-2">
        {activeQuote.verse && (
          <p className="text-md md:text-lg font-serif text-stone-800 font-semibold leading-relaxed whitespace-pre-line mb-2 select-text">
            {activeQuote.verse}
          </p>
        )}
        
        {activeQuote.transliteration && (
          <p className="text-xs italic text-amber-900/70 font-sans tracking-wide mb-3 select-text">
            {activeQuote.transliteration}
          </p>
        )}

        <p className="text-xs md:text-sm text-stone-600 leading-relaxed max-w-lg select-text font-sans">
          "{activeQuote.translation}"
        </p>
      </div>

      {/* Control row with dots indicators */}
      <div className="flex items-center justify-between mt-4 border-t border-amber-100/40 pt-3">
        <button
          onClick={prev}
          className="p-1 px-2 text-stone-400 hover:text-amber-700 transition-colors rounded-lg hover:bg-stone-50"
          aria-label="Previous verse"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {SACRED_VERSES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === index ? "bg-amber-600 w-3" : "bg-stone-300"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="p-1 px-2 text-stone-400 hover:text-amber-700 transition-colors rounded-lg hover:bg-stone-50"
          aria-label="Next verse"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
