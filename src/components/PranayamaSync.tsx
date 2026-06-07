/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wind, Heart, Play, Pause, ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { soundEngine } from "../utils/audio";
import { Language } from "../utils/translationHelper";

interface BreathPhase {
  name: string;
  nameHin: string;
  sanskrit: string;
  sanskritHin: string;
  duration: number; // in seconds
  color: string; // Tailwind colors
  instruction: string;
  instructionHin: string;
  mantra: string;
  mantraHin: string;
}

// 4-step pranayama breathing cycle matching the divine mantra vibrations
const PRANAYAMA_PHASES: BreathPhase[] = [
  {
    name: "Inhale (पूरक)",
    nameHin: "भीतर भरें (पूरक)",
    sanskrit: "Poorak",
    sanskritHin: "पूरक प्राणायाम",
    duration: 4,
    color: "from-amber-400 to-orange-500 shadow-orange-100",
    instruction: "Draw divine love down into your solar plexus",
    instructionHin: "दिव्य प्रेम और ऊर्जा को अपने भीतर आत्मसात करें",
    mantra: "रा (Rā)",
    mantraHin: "रा",
  },
  {
    name: "Hold-In (अन्तर् कुम्भक)",
    nameHin: "भीतर रोकें (कुम्भक)",
    sanskrit: "Antar Kumbhak",
    sanskritHin: "अन्तः कुम्भक",
    duration: 2,
    color: "from-orange-500 to-red-500 shadow-red-100",
    instruction: "Circulate the sound of Radha in the peaceful chambers of your heart",
    instructionHin: "राधा नाम की निर्मल गूंज को हृदय के शांत गृह में महसूस करें",
    mantra: "Hold Prana",
    mantraHin: "रोकें",
  },
  {
    name: "Exhale (रेचक)",
    nameHin: "बाहर छोड़ें (रेचक)",
    sanskrit: "Rechak",
    sanskritHin: "रेचक प्राणायाम",
    duration: 4,
    color: "from-red-500 to-pink-500 shadow-pink-100",
    instruction: "Release stress, anxiety, and ego back into Goloka",
    instructionHin: "क्रोध, चिंता और अहंकार को बाहर छोड़ें",
    mantra: "धा (Dhā)",
    mantraHin: "धा",
  },
  {
    name: "Hold-Out (बाह्य कुम्भक)",
    nameHin: "बाहर रोकें (शून्य)",
    sanskrit: "Bahya Kumbhak",
    sanskritHin: "बाह्य कुम्भक",
    duration: 2,
    color: "from-pink-500 to-purple-600 shadow-purple-100",
    instruction: "Enjoy the pristine silence of pure empty consciousness",
    instructionHin: "परम शांति और शून्य आनंद का अनुभव करें",
    mantra: "Quiet Peace",
    mantraHin: "शान्त",
  },
];

interface PranayamaSyncProps {
  language?: Language;
}

export const PranayamaSync: React.FC<PranayamaSyncProps> = ({ language = "hi" }) => {
  const isHindi = language === "hi";
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(PRANAYAMA_PHASES[0].duration);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [playBreathChimes, setPlayBreathChimes] = useState<boolean>(true);

  const currentPhase = useMemo(() => PRANAYAMA_PHASES[phaseIndex], [phaseIndex]);

  // Main countdown scheduler
  useEffect(() => {
    let timer: number | null = null;

    if (isActive) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next breath phase
            const nextIdx = (phaseIndex + 1) % PRANAYAMA_PHASES.length;
            setPhaseIndex(nextIdx);
            
            // Loop round completed
            if (nextIdx === 0) {
              setCycleCount((c) => c + 1);
            }

            // Play small cue bell sounds to avoid looking at the screen when meditating
            if (playBreathChimes) {
              // Soft chimes on inhale/exhale, a gentle deep bell on holds
              if (nextIdx === 0 || nextIdx === 2) {
                soundEngine.playChime(0.25);
              } else {
                soundEngine.playTempleBell(0.15);
              }
            }

            return PRANAYAMA_PHASES[nextIdx].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, phaseIndex, playBreathChimes]);

  const handleToggle = () => {
    // Lazy audio context trigger
    soundEngine.playChime(0.2);
    setIsActive(!isActive);
    if (!isActive) {
      // Starting: reset states
      setPhaseIndex(0);
      setTimeLeft(PRANAYAMA_PHASES[0].duration);
    }
  };

  const handleSkip = () => {
    const nextIdx = (phaseIndex + 1) % PRANAYAMA_PHASES.length;
    setPhaseIndex(nextIdx);
    setTimeLeft(PRANAYAMA_PHASES[nextIdx].duration);
    soundEngine.playChime(0.15);
  };

  // Expansion scale computation for the breathing balloon visual animation
  const getVisualScale = () => {
    if (!isActive) return 1.0;
    
    const elapsed = currentPhase.duration - timeLeft;
    const progress = elapsed / currentPhase.duration;

    switch (phaseIndex) {
      case 0: // Inhaling: expands from 1.0 up to 1.5
        return 1.0 + progress * 0.45;
      case 1: // Hold In: stays big at 1.45 with subtle breathing vibrations
        return 1.45 + Math.sin(timeLeft * 3) * 0.03;
      case 2: // Exhaling: contracts from 1.45 down to 1.0
        return 1.45 - progress * 0.45;
      case 3: // Hold Out: stays small at 1.0 with subtle vibration
        return 1.0 + Math.sin(timeLeft * 3) * 0.02;
      default:
        return 1.0;
    }
  };

  const activeScale = getVisualScale();

  return (
    <div
      id="pranayama-sync-container"
      className="w-full bg-white rounded-2xl p-6 border border-amber-50/50 shadow-sm relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wind className="w-4.5 h-4.5 text-amber-600 animate-pulse" />
          <h3 className="text-sm uppercase tracking-wider font-extrabold text-stone-700">
            {isHindi ? "प्राणायाम श्वास सामंजस्य" : "Pranayama Breath Sync"}
          </h3>
        </div>

        <button
          onClick={() => setPlayBreathChimes(!playBreathChimes)}
          className={`px-2 py-1 rounded text-[9px] font-bold border transition-colors cursor-pointer ${
            playBreathChimes
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-stone-50 text-stone-400 border-stone-200"
          }`}
          title={isHindi ? "ध्वनि संकेत चालू करें" : "Play subtle audio cues during breathing adjustments"}
        >
          {playBreathChimes 
            ? (isHindi ? "🔔 ध्वनि संकेत" : "🔔 Chime cues") 
            : (isHindi ? "🔇 मौन" : "🔇 Silent")}
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        
        {/* Balloon expanding element */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 bg-stone-50 rounded-full border border-dashed border-stone-200/50" />

          {/* Pulsing Breathing Aura */}
          <motion.div
            style={{ scale: activeScale }}
            className={`w-20 h-20 rounded-full bg-gradient-to-tr ${currentPhase.color} transition-all duration-1000 shadow-xl opacity-80 flex items-center justify-center text-white font-serif text-lg font-bold select-none`}
            animate={
              isActive
                ? {
                    boxShadow: [
                      "0 10px 25px -5px rgba(249, 115, 22, 0.2)",
                      "0 20px 35px -5px rgba(249, 115, 22, 0.45)",
                      "0 10px 25px -5px rgba(249, 115, 22, 0.2)",
                    ],
                  }
                : {}
            }
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={currentPhase.mantra}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.15 }}
                className="drop-shadow-sm font-extrabold"
              >
                {isActive 
                  ? (isHindi ? currentPhase.mantraHin : currentPhase.mantra) 
                  : (isHindi ? "प्रारंभ" : "Start")}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Outer ripples ring */}
          {isActive && (
            <span className="w-28 h-28 rounded-full border border-orange-200 scale-125 opacity-20 animate-ping absolute" style={{ animationDuration: "3.5s" }} />
          )}

          {/* Countdown timer overlay */}
          {isActive && (
            <div className="absolute bottom-1 bg-stone-900/85 text-white font-mono text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full z-10 border border-stone-800">
              {timeLeft}s
            </div>
          )}
        </div>

        {/* Content detail layout */}
        <div className="flex-1 text-center md:text-left flex flex-col justify-between py-1 min-h-[135px]">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <span className="text-[10px] bg-orange-100/50 border border-orange-200/30 rounded-full px-2 py-0.5 text-orange-950 font-bold uppercase tracking-wide">
                {isHindi ? currentPhase.nameHin : currentPhase.name}
              </span>
              {cycleCount > 0 && (
                <span className="text-[10px] text-stone-400 font-bold">
                  • {cycleCount} {isHindi ? "चक्र" : "cycles"}
                </span>
              )}
            </div>

            <h4 className="text-[15px] font-serif font-extrabold text-stone-850 mt-1">
              {isHindi ? `प्राण लय: ${currentPhase.sanskritHin}` : `Prana Wave: ${currentPhase.sanskrit}`}
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed mt-1 max-w-sm">
              {isActive 
                ? (isHindi ? currentPhase.instructionHin : currentPhase.instruction) 
                : (isHindi ? "माला फेरते समय मन को एकाग्र करने के लिए अपनी सांसों को नियंत्रित और समकालिक बनाएं।" : "Synchronize your breathing to relax and lock in deeper concentrations with the holy beads.")}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleToggle}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow ${
                isActive
                  ? "bg-stone-800 hover:bg-stone-900 text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> {isHindi ? "रोके रखें" : "Pause Sync"}
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> {isHindi ? "प्राणायाम शुरू करें" : "Start Breath"}
                </>
              )}
            </button>

            {isActive && (
              <button
                onClick={handleSkip}
                className="py-2 px-3 border border-stone-250 text-stone-600 rounded-xl hover:bg-stone-50 text-xs font-bold tracking-tight transition-all cursor-pointer"
              >
                {isHindi ? "छोड़ें" : "Skip"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
