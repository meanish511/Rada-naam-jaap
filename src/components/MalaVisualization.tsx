/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "../utils/translationHelper";

interface MalaVisualizationProps {
  currentBead: number; // 0 to 107 (for 108 beads)
  roundsCompleted: number;
  onIncrement: () => void;
  beadSyllable: string; // The current holy syllable displayed inside the hub, e.g. "रा" or "धा"
  language?: Language;
}

export const MalaVisualization: React.FC<MalaVisualizationProps> = ({
  currentBead,
  roundsCompleted,
  onIncrement,
  beadSyllable,
  language = "hi",
}) => {
  const svgSize = 340;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const radius = 135; // optimal radius to fit 108 beads plus margins

  // Memorize the bead coordinate offsets
  const beads = useMemo(() => {
    const list = [];
    for (let i = 0; i < 108; i++) {
      // Offset by -90 degrees so the first bead sits exactly at the top (under Sumeru)
      const angle = (i * 360) / 108 - 90;
      const angleRad = (angle * Math.PI) / 180;
      const x = cx + radius * Math.cos(angleRad);
      const y = cy + radius * Math.sin(angleRad);
      list.push({ index: i, x, y, angle });
    }
    return list;
  }, [cx, cy, radius]);

  // Determine if a bead has been chanted in the current round
  const getBeadStatus = (index: number) => {
    if (index === currentBead) return "active";
    if (index < currentBead) return "chanted";
    return "pending";
  };

  return (
    <div id="mala-visualizer-container" className="relative flex flex-col items-center justify-center p-2 select-none">
      {/* Glow highlight rings */}
      <div className="absolute inset-0 bg-amber-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* SVG Canvas for mala beads */}
      <svg
        id="mala-svg"
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="relative overflow-visible"
      >
        <defs>
          {/* Flame lamp glow definition */}
          <radialGradient id="active-bead-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
            <stop offset="40%" stopColor="#d97706" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>

          {/* Wooden texture gradient for chanted beads */}
          <linearGradient id="chanted-bead-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>

          {/* Sandalwood paste gradient for pending beads */}
          <linearGradient id="pending-bead-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fcd34d" />
          </linearGradient>
        </defs>

        {/* The Sacred String holding the beads */}
        <circle
          id="mala-string"
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#fed7aa"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />

        {/* Traditional Sumeru Bead decoration (at the bottom or top? Let's place it at the top 0 index) */}
        {/* Sumeru Tassel lines representing the thread tassel */}
        <g id="sumeru-tassel" transform={`translate(${cx}, ${cy - radius - 15})`}>
          <path
            d="M 0 0 C -12 15, -6 35, 0 45 C 6 35, 12 15, 0 0 Z"
            fill="#dc2626"
            opacity="0.15"
          />
          {/* Tassel fringe */}
          <line x1="0" y1="5" x2="-6" y2="28" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="5" x2="0" y2="30" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="0" y1="5" x2="6" y2="28" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
          {/* Little golden ring holding the tassel */}
          <circle cx="0" cy="5" r="3.5" fill="#d97806" />
        </g>

        {/* Render the 108 Beads */}
        <g id="mala-beads-group">
          {beads.map((bead) => {
            const status = getBeadStatus(bead.index);
            const isSumeru = bead.index === 0;

            return (
              <g key={bead.index}>
                {/* Visual Glow around the active bead */}
                {status === "active" && (
                  <circle
                    cx={bead.x}
                    cy={bead.y}
                    r="14"
                    fill="url(#active-bead-glow)"
                    className="animate-pulse"
                  />
                )}

                {/* The Interactive Bead Circle */}
                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r={isSumeru ? "6.5" : status === "active" ? "5.5" : "4.2"}
                  fill={
                    status === "active"
                      ? "#f59e0b"
                      : status === "chanted"
                      ? "url(#chanted-bead-grad)"
                      : "url(#pending-bead-grad)"
                  }
                  stroke={status === "active" ? "#fff" : isSumeru ? "#b45309" : "#d97706"}
                  strokeWidth={status === "active" ? "1.5" : "0.5"}
                  className="transition-all duration-300 ease-out"
                  style={{
                    filter: status === "active" ? "drop-shadow(0 0 4px #f59e0b)" : "none",
                  }}
                />

                {/* Tiny numbers for the quarters (1st, 27th, 54th, 81st bead markers for navigation) */}
                {bead.index !== 0 && bead.index % 27 === 0 && (
                  <text
                    x={bead.x + (bead.index === 54 ? 0 : bead.index === 27 ? 12 : -12)}
                    y={bead.y + (bead.index === 54 ? 14 : 3)}
                    textAnchor="middle"
                    className="font-mono text-[9px] font-semibold fill-amber-700/60 select-none"
                  >
                    {bead.index}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Sumeru Big Outer Ring marker (bead 0 is Sumeru) */}
        <circle
          cx={cx}
          cy={cy - radius}
          r="8"
          fill="none"
          stroke="#dc2626"
          strokeWidth="1.5"
          className="animate-ping opacity-25"
          style={{ animationDuration: "3s" }}
        />
      </svg>

      {/* Intimate Center Hub - The Holy Tap Capsule */}
      <div
        id="mantra-central-interactive-hub"
        onClick={onIncrement}
        className="absolute w-44 h-44 rounded-full flex flex-col items-center justify-center cursor-pointer group active:scale-95 transition-all duration-150 shadow-lg hover:shadow-orange-100 border border-orange-100 bg-white/90 backdrop-blur-md"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="absolute inset-2 rounded-full border border-dashed border-orange-200 group-hover:rotate-45 transition-transform duration-1000" />
        
        {/* Soft Background Ripples */}
        <div className="absolute inset-0 rounded-full group-hover:scale-105 bg-gradient-to-tr from-amber-50 to-orange-50/70 -z-10 transition-transform duration-350" />

        <div className="text-center z-10 py-1">
          {/* Sanskrit syllable flashing */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={beadSyllable + currentBead}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.15, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="text-3xl font-bold tracking-widest text-orange-600 font-serif"
            >
              {beadSyllable}
            </motion.div>
          </AnimatePresence>

          <p className="text-[10px] uppercase tracking-widest text-amber-600 font-sans font-medium mt-1">
            {language === "hi" ? "जाप के लिए छुएं" : "Tap to Chant"}
          </p>

          <div className="mt-2 flex flex-col items-center">
            <span className="font-mono text-2xl font-bold text-stone-800 tracking-tight">
              {currentBead === 0 && roundsCompleted > 0 ? 108 : currentBead}
              <span className="text-stone-400 font-normal text-xs">/108</span>
            </span>
            <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100/50">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-medium text-amber-800 uppercase tracking-wider font-sans">
                {language === "hi" ? "आवृत्ति (Mala)" : "Round"} {roundsCompleted + 1}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
