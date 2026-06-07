/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Volume2, 
  Heart, 
  Sparkles, 
  BookOpen, 
  Check, 
  HelpCircle,
  Award,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { SACRED_NAMES_108, SacredName } from "../data/sacredNames108";
import { soundEngine } from "../utils/audio";
import { Language } from "../utils/translationHelper";

interface NamanjaliExplorerProps {
  currentBeadIndex: number;
  onSelectName: (index: number) => void;
  language?: Language;
}

export const NamanjaliExplorer: React.FC<NamanjaliExplorerProps> = ({
  currentBeadIndex,
  onSelectName,
  language = "hi"
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Language state for translation display
  const [lang, setLang] = useState<"hin" | "eng">(language === "hi" ? "hin" : "eng");
  const [pronounceVoiceIdx, setPronounceVoiceIdx] = useState<number | null>(null);

  React.useEffect(() => {
    setLang(language === "hi" ? "hin" : "eng");
  }, [language]);

  // Search filter
  const filteredNames = useMemo(() => {
    return SACRED_NAMES_108.map((item, idx) => ({ ...item, originalIdx: idx })).filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        item.sanskrit.includes(q) ||
        item.transliteration.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.translationHin.includes(q)
      );
    });
  }, [searchQuery]);

  // Handle pagination calculation safely
  const totalPages = Math.ceil(filteredNames.length / itemsPerPage) || 1;
  const paginatedNames = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredNames.slice(start, start + itemsPerPage);
  }, [filteredNames, page]);

  // Adjust page query if search dramatically reduces entries count
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Handle voice speech pronunciation of specific name
  const handlePronounceName = (item: SacredName & { originalIdx: number }) => {
    if (!('speechSynthesis' in window)) return;
    setPronounceVoiceIdx(item.originalIdx);

    // Cancel ongoing speech synthesis
    window.speechSynthesis.cancel();

    // Utterance configurations
    const utterance = new SpeechSynthesisUtterance("ॐ " + item.sanskrit + " नमः");
    utterance.lang = "hi-IN";
    utterance.rate = 0.7; // beautiful contemplative slower speed
    utterance.pitch = 1.05;

    utterance.onend = () => setPronounceVoiceIdx(null);
    utterance.onerror = () => setPronounceVoiceIdx(null);

    window.speechSynthesis.speak(utterance);
    // Play sweet chime in the background
    soundEngine.playChime(0.25);
  };

  const handleSelectActiveFocus = (originalIdx: number) => {
    onSelectName(originalIdx);
    soundEngine.playTempleBell(0.35);
  };

  return (
    <div 
      id="namanjali-108-explorer"
      className="w-full bg-white rounded-2xl p-5 md:p-6 border border-rose-100 shadow-sm relative overflow-hidden transition-all duration-300"
    >
      {/* Background floral decoration or spiritual light effect */}
      <div className="absolute top-0 left-0 w-44 h-44 rounded-full bg-rose-50/50 blur-3xl pointer-events-none -z-10" />

      {/* Title & Language Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-rose-500 animate-pulse" />
          <div>
            <h3 className="text-sm uppercase tracking-widest font-extrabold text-stone-700 font-serif">
              Nāmāñjali 108 Explorer
            </h3>
            <p className="text-[10px] text-stone-400 font-sans">
              Sri Radha Ashtottara Shatanamavali — The 108 Holy Names
            </p>
          </div>
        </div>

        {/* Translation switches toggler */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-rose-50/60 rounded-xl px-2.5 py-1 border border-rose-100/40">
          <button
            onClick={() => setLang("hin")}
            className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded transition-all ${
              lang === "hin" ? "bg-rose-500 text-white shadow-sm" : "text-stone-400 hover:text-stone-700"
            }`}
          >
            भावार्थ (हिन्दी)
          </button>
          <button
            onClick={() => setLang("eng")}
            className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded transition-all ${
              lang === "eng" ? "bg-rose-500 text-white shadow-sm" : "text-stone-400 hover:text-stone-700"
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Description text */}
      <p className="text-xs text-stone-500 leading-relaxed mb-4 font-sans italic">
        "Chanting these names brings ultimate concentration, quietude, and triggers deep flow states. Filter through all 108 Names below and click any to make it your current active bead meditation goal!"
      </p>

      {/* Search Input Bar */}
      <div className="relative mb-5">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Sanskrit, transliteration, or spiritual meaning..."
          className="w-full bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-200/60 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400 hover:text-stone-700 uppercase"
          >
            Clear
          </button>
        )}
      </div>

      {/* Names Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-5">
        {paginatedNames.length > 0 ? (
          paginatedNames.map((item) => {
            const isCurrentlyActive = currentBeadIndex === item.originalIdx;
            const isSpeakingThis = pronounceVoiceIdx === item.originalIdx;

            return (
              <div
                key={item.originalIdx}
                className={`p-4 rounded-xl border transition-all duration-300 relative flex flex-col justify-between min-h-[115px] group ${
                  isCurrentlyActive
                    ? "bg-gradient-to-br from-rose-50/70 to-rose-100/30 border-rose-300 shadow-sm shadow-rose-100"
                    : "bg-stone-50/50 hover:bg-white border-stone-200/50 hover:border-rose-200/70"
                }`}
              >
                {/* Bead number watermark */}
                <span className="absolute top-2 right-3 text-[10px] font-mono font-bold text-stone-300 pointer-events-none select-none">
                  Bead #{item.originalIdx + 1}
                </span>

                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <h4 className="text-sm font-serif font-extrabold text-stone-850">
                      {item.sanskrit}
                    </h4>
                    <span className="text-[10px] font-sans text-stone-400 font-medium italic">
                      ({item.transliteration})
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500 leading-relaxed font-sans max-w-[90%]">
                    {lang === "hin" ? item.translationHin : item.meaning}
                  </p>
                </div>

                {/* Card Action Controls footer */}
                <div className="flex items-center justify-between border-t border-stone-100 mt-3 pt-2">
                  {/* Pronunciation voice button */}
                  <button
                    onClick={() => handlePronounceName(item)}
                    className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md transition-all ${
                      isSpeakingThis
                        ? "bg-rose-100 text-rose-700 animate-pulse"
                        : "text-stone-400 hover:text-rose-600 hover:bg-rose-50/40"
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {isSpeakingThis ? "Speaking..." : "Listen"}
                  </button>

                  {/* Active lock activator button */}
                  <button
                    onClick={() => handleSelectActiveFocus(item.originalIdx)}
                    className={`text-[9px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                      isCurrentlyActive
                        ? "bg-rose-500 text-white border-rose-600 shadow"
                        : "bg-white hover:bg-rose-50/30 text-stone-500 hover:text-rose-700 border-stone-200 hover:border-rose-300"
                    }`}
                  >
                    {isCurrentlyActive ? (
                      <>
                        <Check className="w-3 h-3" /> Active Focus
                      </>
                    ) : (
                      "Set as bead focus"
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-8 text-center bg-stone-50 rounded-xl border border-stone-100 flex flex-col items-center justify-center">
            <BookOpen className="w-8 h-8 text-stone-300 mb-2" />
            <p className="text-xs text-stone-400 font-medium">No sacred names match search query.</p>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-2">
          <p className="text-[10px] font-mono text-stone-400 uppercase font-bold">
            Showing {Math.min(filteredNames.length, (page - 1) * itemsPerPage + 1)}-
            {Math.min(filteredNames.length, page * itemsPerPage)} of {filteredNames.length} Names
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent text-stone-600 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-stone-500">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent text-stone-600 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
