/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Plus, 
  Bell, 
  Music, 
  VolumeX, 
  CheckCircle, 
  Sparkles, 
  Sun, 
  Calendar,
  Speech,
  Disc,
  X,
  Eye,
  EyeOff,
  Languages
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { soundEngine } from "./utils/audio";

const spiritualBg = "/src/assets/images/spiritual_bg_1780798221376.png";
import { MalaVisualization } from "./components/MalaVisualization";
import { DailyStats } from "./components/DailyStats";
import { ShlokaSanctuary } from "./components/ShlokaSanctuary";
import { AshtayamaClock } from "./components/AshtayamaClock";
import { PranayamaSync } from "./components/PranayamaSync";
import { NamanjaliExplorer } from "./components/NamanjaliExplorer";
import { AchievementsTracker } from "./components/AchievementsTracker";
import { PremanandVani } from "./components/PremanandVani";
import { DeityDarshan } from "./components/DeityDarshan";
import { SACRED_NAMES_108 } from "./data/sacredNames108";
import { JaapLog, SoundConfig } from "./types";
import { Language, TRANSLATIONS } from "./utils/translationHelper";

const SACRED_NAMES = SACRED_NAMES_108;

export default function App() {
  // Global Language Configuration state (syncs across all segments!)
  const [language, setLanguage] = useState<Language>("hi");
  const t = TRANSLATIONS[language];

  // State 1: Active beads tracking
  const [currentBead, setCurrentBead] = useState<number>(0); // 0 to 107
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);

  // State 2: Daily historical logs
  const [logs, setLogs] = useState<JaapLog[]>([]);
  const [dailyTarget, setDailyTarget] = useState<number>(108);

  // State 3: Sound & Music configuration
  const [audioInited, setAudioInited] = useState<boolean>(false);
  const [soundConfig, setSoundConfig] = useState<SoundConfig>({
    droneVolume: 0.60,
    dronePitch: 130.81, // C3
    bellVolume: 0.90,
    isDronePlaying: false,
    chantVoice: false, // false = metal chime, true = speak "Radha" voice
  });

  // State 4: Auto-chant Timer state
  const [autoChantActive, setAutoChantActive] = useState<boolean>(false);
  const [autoChantSpeed, setAutoChantSpeed] = useState<number>(2.5); // speed in seconds per jaap
  const autoChantTimerRef = useRef<number | null>(null);

  // State 5: Modals or UI utilities
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [manualCountInput, setManualCountInput] = useState<string>("");
  const [isKeyboardHintVisible, setIsKeyboardHintVisible] = useState<boolean>(true);
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"chanting" | "darshan">("chanting");
  const [particles, setParticles] = useState<{ id: number; text: string; x: number }[]>([]);
  const [isBgPulsing, setIsBgPulsing] = useState<boolean>(false);

  // Compute active consecutive days streak
  const streak = useMemo(() => {
    if (logs.length === 0) return todayCount > 0 ? 1 : 0;
    
    const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    const todayStr = new Date().toISOString().split("T")[0];
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let activeStreak = 0;
    let checkDate = new Date();
    
    const hasTodayRecord = sortedLogs.some(l => l.date === todayStr && l.count > 0) || todayCount > 0;
    const hasYesterdayRecord = sortedLogs.some(l => l.date === yesterdayStr && l.count > 0);

    if (!hasTodayRecord && !hasYesterdayRecord) {
      return 0;
    }

    if (!hasTodayRecord && hasYesterdayRecord) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      const logForDate = sortedLogs.find(l => l.date === dateStr);
      const dayIsToday = dateStr === todayStr;

      if ((dayIsToday && todayCount > 0) || (logForDate && logForDate.count > 0)) {
        activeStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return activeStreak;
  }, [logs, todayCount]);

  // Compute total lifetime counts
  const totalLifetimeCount = useMemo(() => {
    const historicalTotal = logs.reduce((acc, log) => acc + log.count, 0);
    const todayStr = new Date().toISOString().split("T")[0];
    const historicalIncludesToday = logs.some((l) => l.date === todayStr);

    return historicalTotal + (historicalIncludesToday ? 0 : todayCount);
  }, [logs, todayCount]);

  // Pitch options for Tambura
  const PITCHES = [
    { name: "C Scale (Root)", hz: 130.81 },
    { name: "A# Scale (Deep)", hz: 116.54 },
    { name: "D Scale (Bright)", hz: 146.83 },
    { name: "G Scale (Alto)", hz: 196.00 },
  ];

  // Load state from localStorage on mount
  useEffect(() => {
    // 0. Language
    try {
      const savedLang = localStorage.getItem("radha_jaap_language");
      if (savedLang === "en" || savedLang === "hi") {
        setLanguage(savedLang);
      }
    } catch (e) {}

    // 1. Logs
    try {
      const savedLogs = localStorage.getItem("radha_jaap_history");
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
    } catch (e) {
      console.error("Failed to load jaap history", e);
    }

    // 2. Daily target
    try {
      const savedTarget = localStorage.getItem("radha_jaap_target");
      if (savedTarget) {
        setDailyTarget(Number(savedTarget));
      }
    } catch (e) {}

    // Initialize counts for today
    const todayStr = new Date().toISOString().split("T")[0];
    try {
      const savedLogs = localStorage.getItem("radha_jaap_history");
      if (savedLogs) {
        const parsed: JaapLog[] = JSON.parse(savedLogs);
        const todayRecord = parsed.find((l) => l.date === todayStr);
        if (todayRecord) {
          setTodayCount(todayRecord.count);
          setRoundsCompleted(todayRecord.rounds);
          // Set current bead remainder position
          setCurrentBead(todayRecord.count % 108);
        }
      }
    } catch (e) {}

    // Add keyboard listener for spacebar chanting
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling if pressing spacebar inside the app context
      if (e.code === "Space") {
        e.preventDefault();
        triggerSingleJaap();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (autoChantTimerRef.current) {
        clearInterval(autoChantTimerRef.current);
      }
      soundEngine.stopDrone();
    };
  }, []);

  const handleToggleLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("radha_jaap_language", lang);
    soundEngine.playChime(0.2);
  };

  // Update localStorage when logs or targets change
  const saveLogsToStorage = (updatedLogs: JaapLog[]) => {
    setLogs(updatedLogs);
    try {
      localStorage.setItem("radha_jaap_history", JSON.stringify(updatedLogs));
    } catch (e) {
      console.error("Failed to persist logs", e);
    }
  };

  const handleUpdateTarget = (newTarget: number) => {
    setDailyTarget(newTarget);
    localStorage.setItem("radha_jaap_target", String(newTarget));
  };

  // Sound Engine initializations
  const handleToggleDrone = () => {
    if (!audioInited) {
      setAudioInited(true);
    }
    
    setSoundConfig((prev) => {
      const newPlaying = !prev.isDronePlaying;
      if (newPlaying) {
        soundEngine.startDrone(prev.dronePitch, prev.droneVolume);
      } else {
        soundEngine.stopDrone();
      }
      return { ...prev, isDronePlaying: newPlaying };
    });
  };

  // Update pitch/volume real-time controllers
  const handlePitchChange = (hz: number) => {
    setSoundConfig((prev) => {
      const updated = { ...prev, dronePitch: hz };
      if (updated.isDronePlaying) {
        soundEngine.updateDroneSettings(updated.dronePitch, updated.droneVolume);
      }
      return updated;
    });
  };

  const handleVolumeChange = (volArr: number) => {
    setSoundConfig((prev) => {
      const updated = { ...prev, droneVolume: volArr };
      if (updated.isDronePlaying) {
        soundEngine.updateDroneSettings(updated.dronePitch, updated.droneVolume);
      }
      return updated;
    });
  };

  const toggleVoiceMode = () => {
    setSoundConfig((prev) => ({ ...prev, chantVoice: !prev.chantVoice }));
  };

  // Reset current round counter
  const handleResetCounter = () => {
    setCurrentBead(0);
    setSessionCount(0);
    setShowResetConfirm(false);
  };

  // Perform one single Jaap increment (Central action!)
  const triggerSingleJaap = () => {
    // Lazy-init audio context on first click if drone is idle to avoid browser safety locks
    if (!audioInited) {
      setAudioInited(true);
    }

    // Play reactive feedback sound
    if (soundConfig.chantVoice) {
      soundEngine.speakRadha();
    } else {
      soundEngine.playChime(soundConfig.bellVolume);
    }

    // Trigger VFX background soft pulse
    setIsBgPulsing(true);
    setTimeout(() => {
      setIsBgPulsing(false);
    }, 150);

    // Main count calculations
    setSessionCount((prev) => prev + 1);
    
    let nextBead = currentBead + 1;
    let nextRounds = roundsCompleted;

    const completedRoundThisClick = nextBead >= 108;
    if (completedRoundThisClick) {
      nextBead = 0; // reset bead ring
      nextRounds += 1;
      // Trigger magical metal Temple Bell upon completing a full round of 108!
      soundEngine.playTempleBell(soundConfig.bellVolume * 1.3);
    }

    // Generate floating mantra vibration particle (VFX)
    const activeText = currentBead % 2 === 0 ? "रा" : "धा";
    const newParticle = {
      id: Date.now() + Math.random(),
      text: activeText,
      x: Math.random() * 260 - 130
    };
    setParticles((prev) => [...prev.slice(-15), newParticle]);

    setCurrentBead(nextBead);
    setRoundsCompleted(nextRounds);

    const checkNewTodayCount = todayCount + 1;
    setTodayCount(checkNewTodayCount);

    // Save back to historical logs of daily naap jaap
    const todayStr = new Date().toISOString().split("T")[0];
    const existingLogIdx = logs.findIndex((l) => l.date === todayStr);
    
    let updatedLogs = [...logs];
    if (existingLogIdx >= 0) {
      updatedLogs[existingLogIdx] = {
        date: todayStr,
        count: checkNewTodayCount,
        rounds: Math.floor(checkNewTodayCount / 108),
      };
    } else {
      updatedLogs.push({
        date: todayStr,
        count: checkNewTodayCount,
        rounds: Math.floor(checkNewTodayCount / 108),
      });
    }

    saveLogsToStorage(updatedLogs);
  };

  // Manual input counter integration (for physical rosaries)
  const handleManualIncrement = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(manualCountInput, 10);
    if (isNaN(parsed) || parsed <= 0) return;

    const checkNewTodayCount = todayCount + parsed;
    setTodayCount(checkNewTodayCount);
    setCurrentBead((currentBead + parsed) % 108);
    setRoundsCompleted(Math.floor(checkNewTodayCount / 108));

    // Save
    const todayStr = new Date().toISOString().split("T")[0];
    const existingLogIdx = logs.findIndex((l) => l.date === todayStr);

    let updatedLogs = [...logs];
    if (existingLogIdx >= 0) {
      updatedLogs[existingLogIdx] = {
        date: todayStr,
        count: checkNewTodayCount,
        rounds: Math.floor(checkNewTodayCount / 108),
      };
    } else {
      updatedLogs.push({
        date: todayStr,
        count: checkNewTodayCount,
        rounds: Math.floor(checkNewTodayCount / 108),
      });
    }

    saveLogsToStorage(updatedLogs);
    setManualCountInput("");
    soundEngine.playTempleBell(soundConfig.bellVolume);
  };

  // Clear total logs
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all historical logs? This cannot be undone.")) {
      saveLogsToStorage([]);
      setTodayCount(0);
      setRoundsCompleted(0);
      setCurrentBead(0);
    }
  };

  // Auto-chant automatic timer scheduler
  useEffect(() => {
    if (autoChantActive) {
      autoChantTimerRef.current = window.setInterval(() => {
        triggerSingleJaap();
      }, autoChantSpeed * 1000);
    } else {
      if (autoChantTimerRef.current) {
        clearInterval(autoChantTimerRef.current);
        autoChantTimerRef.current = null;
      }
    }

    return () => {
      if (autoChantTimerRef.current) {
        clearInterval(autoChantTimerRef.current);
      }
    };
  }, [autoChantActive, autoChantSpeed, currentBead, todayCount, soundConfig, audioInited]);

  // Derive Radha's active syllable based on current bead to toggle Ra-Dha rhythm sync
  const chantSyllable = useMemo(() => {
    return currentBead % 2 === 0 ? "रा" : "धा";
  }, [currentBead]);

  // Get active Sanskrit title matching current bead index (changes names every bead to create focus)
  const currentSacredName = useMemo(() => {
    const nameIdx = currentBead % SACRED_NAMES.length;
    return SACRED_NAMES[nameIdx];
  }, [currentBead]);

  return (
    <div
      id="applet-viewport"
      className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans p-3 md:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden"
    >
      {/* HD Spiritual Background Image */}
      <div className="absolute inset-0 w-full h-full z-[-20] overflow-hidden pointer-events-none">
        <img
          src={spiritualBg}
          alt="Peaceful Spiritual Background"
          className={`w-full h-full object-cover select-none transition-all duration-700 ${isBgPulsing ? "scale-[1.015] opacity-25 brightness-110 saturate-125" : "scale-100 blur-xs opacity-20"}`}
          referrerPolicy="no-referrer"
        />
        {/* Soft Golden & Rose Divine Mask overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#faf8f5]/90 via-[#fffbf9]/80 to-[#faf8f5]/95 mix-blend-multiply" />
      </div>

      {/* Decorative Warm Backgound Ornaments */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-orange-100/30 blur-3xl pointer-events-none z-[-10]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl pointer-events-none z-[-10]" />

      {/* Floating Mantra Particle VFX */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-[-5]">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.5, y: 120, x: p.x }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                scale: [0.6, 1.25, 1, 0.7], 
                y: -180, 
                rotate: p.x > 0 ? 12 : -12 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute left-1/2 bottom-1/3 -translate-x-1/2 text-orange-600/75 font-serif font-black select-none pointer-events-none drop-shadow-[0_0_15px_rgba(251,146,60,0.4)]"
            >
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl tracking-wide">{p.text}</span>
                <Sparkles className="w-4 h-4 text-amber-500/85 animate-pulse mt-0.5" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {focusMode ? (
        <div
          id="focus-mode-chassis"
          className="w-full max-w-xl bg-stone-50/50 backdrop-blur-xl border border-stone-200/40 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col items-center justify-between min-h-[580px] transition-all duration-500"
        >
          {/* Top Bar inside Focus Mode */}
          <div className="w-full flex items-center justify-between border-b border-orange-100/20 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-stone-500 font-serif">
                Distraction-Free Focus
              </span>
            </div>
            
            <button
              onClick={() => {
                setFocusMode(false);
                soundEngine.playTempleBell(0.35);
              }}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-850 hover:text-rose-950 text-[10px] font-bold uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5 text-rose-500" /> Exit Focus
            </button>
          </div>

          {/* Main Focus container */}
          <div className="w-full flex-1 flex flex-col items-center justify-center gap-6 py-4">
            {/* Active Name indicator at the very top of Focus view */}
            <div className="text-center animate-fade-in">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-600">
                Bead #{currentBead === 0 && roundsCompleted > 0 ? 108 : currentBead} / 108 • Round #{roundsCompleted}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-black text-stone-850 mt-2 select-none tracking-wide">
                {currentSacredName.sanskrit}
              </h1>
              <p className="text-base font-sans font-medium text-amber-900/70 mt-1 select-none">
                ({currentSacredName.transliteration})
              </p>
              <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto italic mt-2 select-none">
                "{currentSacredName.meaning}"
              </p>
            </div>

            {/* Mala Visualization */}
            <div className="relative py-4 w-full scale-100 md:scale-110 flex items-center justify-center">
              <MalaVisualization
                currentBead={currentBead}
                roundsCompleted={roundsCompleted}
                onIncrement={triggerSingleJaap}
                beadSyllable={chantSyllable}
              />
              {/* Centered Syllable overlay (for visual reference) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-center">
                <span className="text-3xl font-serif font-black text-orange-600/90 animate-pulse">
                  {chantSyllable}
                </span>
              </div>
            </div>

            {/* Big Tap Area and Controls */}
            <div className="w-full max-w-sm flex flex-col items-center gap-3 mt-2">
              <button
                onClick={triggerSingleJaap}
                className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white rounded-2xl py-4 px-6 font-extrabold tracking-wider text-xs text-center shadow-lg shadow-orange-100 hover:shadow-orange-200 transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:brightness-105 active:scale-95 animate-pulse"
              >
                <Plus className="w-5 h-5 shrink-0 animate-spin" style={{ animationDuration: "12s" }} />
                <span>CHANT (SPACEBAR / CLICK)</span>
              </button>
              
              <div className="flex items-center justify-between w-full px-2 text-[10px] text-stone-400 font-mono font-bold uppercase">
                <span>Streak: {streak} Days</span>
                <span>Total: {totalLifetimeCount} Jaaps</span>
              </div>
            </div>
          </div>

          {/* Focus Mode Audio Controls at bottom bar */}
          <div className="w-full border-t border-stone-200/50 pt-4 mt-4 flex items-center justify-between gap-4">
            {/* Drone Config */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleDrone}
                className={`p-2 rounded-lg border transition-all ${
                  soundConfig.isDronePlaying
                    ? "bg-orange-500 text-white border-orange-600 shadow-sm"
                    : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                }`}
                title="Toggle Background Tambura String Drone"
              >
                {soundConfig.isDronePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <div className="hidden sm:block text-left">
                <p className="text-[10px] font-bold text-stone-600 leading-tight">Tambura Drone</p>
                <p className="text-[8px] text-stone-400">Background string</p>
              </div>
            </div>

            {/* Chime feedback toggler */}
            <button
              onClick={toggleVoiceMode}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-1.5 text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              {soundConfig.chantVoice ? (
                <>
                  <Speech className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-[10px] uppercase font-bold tracking-tight">Radhā Chanted</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[10px] uppercase font-bold tracking-tight">Tibetan Chime</span>
                </>
              )}
            </button>

            {/* Session count */}
            <div className="text-right">
              <span className="text-[9px] font-mono font-bold text-stone-400 uppercase">
                Session: {sessionCount}
              </span>
              <div className="w-20 bg-stone-200 h-1 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-orange-500 transition-all duration-305"
                  style={{ width: `${Math.min((sessionCount / 108) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Container main chassis */
        <div
          id="applet-chassis"
          className="w-full max-w-5xl bg-stone-50/50 backdrop-blur-xl border border-stone-200/40 rounded-3xl p-5 md:p-8 shadow-xl relative overflow-hidden"
        >
          
          {/* Divine Header Banner */}
          <header id="divine-header" className="relative mb-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 border-b border-orange-100/40 pb-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100/50 text-amber-850 font-serif font-extrabold shadow-sm select-none">
                <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "12s" }} />
                <span className="text-[10px] uppercase font-bold tracking-widest">
                  {language === "hi" ? "श्री राधा साधना धाम" : "Divine Mantra Oasis"}
                </span>
              </div>
  
              <div className="flex items-baseline gap-2 mt-2">
                <h1 className="text-4xl font-extrabold text-stone-850 tracking-tight font-serif select-none">
                  {language === "hi" ? "श्री राधा " : "Radha "}<span className="text-orange-600">{language === "hi" ? "नाम जप" : "Naam Jaap"}</span>
                </h1>
                <span className="text-stone-300 font-serif text-3xl hidden md:inline">|</span>
                <span className="text-xs uppercase font-semibold text-stone-400 tracking-widest hidden md:inline">
                  {language === "hi" ? "दैनिक माला एवं तंबूरा राग" : "Daily Rosary & Audio Drone"}
                </span>
              </div>
  
              <p className="text-xs text-stone-500 mt-1 max-w-lg leading-relaxed">
                {t.appSubtitle}
              </p>
            </div>
  
            {/* Master quick info indicator */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
              {/* Beautiful Language Switcher */}
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-100/50 rounded-full px-2 py-1 select-none shadow-3xs">
                <Languages className="w-3.5 h-3.5 text-amber-600" />
                <button
                  onClick={() => handleToggleLanguage("hi")}
                  className={`text-[9.5px] uppercase font-black tracking-tight px-2.5 py-0.5 rounded-full cursor-pointer transition-all ${
                    language === "hi" ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs" : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => handleToggleLanguage("en")}
                  className={`text-[9.5px] uppercase font-black tracking-tight px-2.5 py-0.5 rounded-full cursor-pointer transition-all ${
                    language === "en" ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs" : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                onClick={() => {
                  setFocusMode(true);
                  soundEngine.playTempleBell(0.4);
                }}
                className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-850 hover:text-rose-950 font-serif text-[11px] font-extrabold uppercase rounded-full shadow-xs select-none transition-all duration-300 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                title="Enter Distraction-Free Chanting Focus Mode"
              >
                <Eye className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> {language === "hi" ? "एकाग्रता मोड" : "Focus Mode"}
              </button>

              <div className="text-right hidden sm:block">
                <p className="text-[9px] uppercase font-bold tracking-wider text-stone-400">{t.currentChantingName}</p>
                <p className="text-xs font-serif font-semibold text-amber-900">{currentSacredName.sanskrit} ({currentSacredName.transliteration})</p>
              </div>
              
              <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shadow-inner select-none font-serif text-xl font-bold animate-pulse">
                {chantSyllable}
              </div>
            </div>
          </header>

          {/* Main Tab Controller */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6 border-b border-orange-100/30 pb-4">
            <button
              onClick={() => {
                setActiveTab("chanting");
                soundEngine.playChime(0.2);
              }}
              className={`px-4.5 py-2.5 rounded-xl font-serif text-xs uppercase font-extrabold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "chanting"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-100/50"
                  : "bg-white hover:bg-stone-50 border border-stone-200/50 text-stone-600 hover:text-stone-850"
              }`}
            >
              <span>🕉️ {language === "hi" ? "मंत्र साधना (Chanting)" : "Chanting Oasis (साधना)"}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("darshan");
                soundEngine.playTempleBell(0.4);
              }}
              className={`px-4.5 py-2.5 rounded-xl font-serif text-xs uppercase font-extrabold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "darshan"
                  ? "bg-gradient-to-r from-amber-650 to-orange-600 bg-amber-600 text-white shadow-md shadow-amber-100/50"
                  : "bg-white hover:bg-stone-50 border border-stone-200/50 text-stone-600 hover:text-stone-850"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse animate-spin" style={{ animationDuration: "12s" }} />
              <span>✨ {language === "hi" ? "श्री विग्रह दर्शन (Darshan)" : "Deity Darshan (विग्रह दर्शन)"}</span>
            </button>
          </div>
  
          {activeTab === "chanting" ? (
            <>
              {/* Keyboard shortcut reminder bar */}
              {isKeyboardHintVisible && (
            <div className="w-full bg-stone-100 border border-stone-200/50 rounded-xl px-4 py-2.5 mb-6 text-xs flex items-center justify-between text-stone-500 shadow-sm">
              <span className="font-medium">
                {language === "hi" ? (
                  <span>💡 ध्यान करते समय तुरंत जाप संख्या बढ़ाने के लिए कहीं भी <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-stone-300 text-stone-700 font-bold">Spacebar</span> दबाएं!</span>
                ) : (
                  <span>💡 Press <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-stone-300 text-stone-700 font-bold">Spacebar</span> anywhere to increment counts instantly when meditating!</span>
                )}
              </span>
              <button
                onClick={() => setIsKeyboardHintVisible(false)}
                className="text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 p-0.5 rounded-lg transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
  
          {/* Active Grid Setup */}
          <div id="main-content-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Column A (LEFT): The Beads Console (7 cells weight on large screens) */}
          <section id="column-mala-console" className="lg:col-span-7 flex flex-col items-center justify-between bg-white border border-amber-50/50 rounded-2xl p-4 md:p-6 shadow-sm">
            
            {/* The Mala Component */}
            <MalaVisualization
              currentBead={currentBead}
              roundsCompleted={roundsCompleted}
              onIncrement={triggerSingleJaap}
              beadSyllable={chantSyllable}
              language={language}
            />

            {/* Syllable detail panel under the Mala */}
            <div className="w-full text-center mt-2 p-3.5 bg-stone-50 rounded-xl border border-stone-100 relative">
              <p className="text-[10px] uppercase font-semibold text-amber-800 tracking-wider">
                {language === "hi" ? "नाम संख्या" : "Name"} #{currentBead === 0 && roundsCompleted > 0 ? 108 : currentBead}:
              </p>
              <h2 className="text-xl font-serif font-bold text-stone-850 mt-0.5">
                {currentSacredName.sanskrit}{" "}
                <span className="text-xs font-sans font-medium text-amber-900/60 font-mono italic">
                  ({currentSacredName.transliteration})
                </span>
              </h2>
              <p className="text-xs text-stone-500 italic mt-1 font-sans">
                {language === "hi" ? currentSacredName.translationHin : currentSacredName.meaning}
              </p>
            </div>

            {/* Quick helper controls row */}
            <div className="w-full flex items-center gap-3 mt-4">
              <button
                onClick={triggerSingleJaap}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl py-3.5 px-4 font-bold tracking-tight text-center shadow-lg shadow-orange-100 hover:shadow-orange-200 transition-all flex items-center justify-center gap-2 group cursor-pointer hover:brightness-105 active:scale-98"
              >
                <Plus className="w-5 h-5 shrink-0 group-hover:rotate-90 transition-transform" />
                <span>{language === "hi" ? "नाम जाप करें (Jaap)" : "Chant Name (Jaap)"}</span>
              </button>

              <button
                onClick={() => setShowResetConfirm(true)}
                className="p-3.5 rounded-xl border border-stone-200 text-stone-500 hover:text-red-500 hover:bg-stone-50 transition-colors"
                title="Reset active counters"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

          </section>

          {/* Column B (RIGHT): Sound & Audio config / Quotes (5 cells weight) */}
          <section id="column-sound-contemplation" className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Ambient Sound Console */}
            <div id="ambient-audio-console" className="bg-white rounded-2xl p-6 border border-amber-50/50 shadow-sm relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-orange-600 animate-bounce" />
                  <h3 className="text-sm uppercase tracking-wider font-extrabold text-stone-700">{t.ambientMusicText}</h3>
                </div>

                <div className="inline-flex gap-1">
                  <button
                    onClick={() => soundEngine.playTempleBell(soundConfig.bellVolume)}
                    className="p-1 px-2 border border-stone-100 hover:bg-stone-50 rounded-lg text-amber-700 text-[10px] uppercase font-bold flex items-center gap-1 transition-all pointer-events-auto"
                    title="Play meditative bell"
                  >
                    <Bell className="w-3.5 h-3.5" /> {language === "hi" ? "घंटी बजाएं" : "Bell"}
                  </button>
                </div>
              </div>

              {/* Drone Player Row */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 mb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-stone-800">{t.tamburaDroneText}</h4>
                  <p className="text-[10px] text-stone-400">{t.tamburaSubtitleText}</p>
                </div>

                <button
                  onClick={handleToggleDrone}
                  className={`p-2.5 rounded-full shadow-md transition-all ${
                    soundConfig.isDronePlaying
                      ? "bg-orange-500 text-white shadow-orange-100"
                      : "bg-white text-stone-700 hover:bg-stone-100"
                  }`}
                  aria-label="Toggle background chant drone"
                >
                  {soundConfig.isDronePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              {/* Controllers row */}
              <div className="space-y-4">
                
                {/* Volume Slider */}
                <div>
                  <div className="flex justify-between text-xs text-stone-500 mb-1">
                    <span className="flex items-center gap-1">
                      {soundConfig.droneVolume > 0 ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                      <span>{t.droneVolumeText}</span>
                    </span>
                    <span className="font-mono">{Math.round(soundConfig.droneVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundConfig.droneVolume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full accent-orange-500 bg-stone-100 h-1.5 rounded-full cursor-pointer"
                  />
                </div>

                {/* Pitch Grid keys */}
                <div>
                  <span className="text-xs text-stone-400 block mb-1.5">{t.harmonicTuningText}</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PITCHES.map((p) => (
                      <button
                        key={p.hz}
                        onClick={() => handlePitchChange(p.hz)}
                        className={`py-1 text-[10px] font-bold rounded-lg border tracking-tight transition-all uppercase ${
                          soundConfig.dronePitch === p.hz
                            ? "bg-amber-100 border-amber-400 text-amber-800"
                            : "bg-white border-stone-100 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        {p.name.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chime feedback trigger choice */}
                <div className="border-t border-stone-100 pt-4 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-stone-800">{t.chantResponseSoundText}</h5>
                    <p className="text-[9px] text-stone-400">{t.chantResponseSubtext}</p>
                  </div>

                  <button
                    onClick={toggleVoiceMode}
                    className="flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-1.5 text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    {soundConfig.chantVoice ? (
                      <>
                        <Speech className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-[10px] uppercase font-bold tracking-tight">{language === "hi" ? "श्री राधा उच्चारण" : "Radhā Chanted"}</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-[10px] uppercase font-bold tracking-tight">{language === "hi" ? "तिब्बती घंटी" : "Tibetan Chime"}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* Auto-chant Wheel Console */}
            <div id="auto-chant-timer-console" className="bg-white rounded-2xl p-6 border border-amber-50/50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                <Disc className="w-20 h-20 text-orange-600 animate-spin" style={{ animationDuration: "15s" }} />
              </div>

              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm uppercase tracking-wider font-extrabold text-stone-700">{t.autoChanterTitle}</h3>
                <span className="px-2 py-0.5 rounded bg-orange-50 text-[9px] font-bold text-orange-600 border border-orange-100/50">
                  {autoChantActive ? (language === "hi" ? "सक्रिय" : "ACTIVE") : (language === "hi" ? "निष्क्रिय" : "OFFLINE")}
                </span>
              </div>

              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                {t.autoChanterSub}
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-xs text-stone-500 block">{t.chantingPaceText}</span>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {language === "hi" ? `हर ${autoChantSpeed} सेकंड में १ जाप` : `1 chant every {autoChantSpeed} seconds`.replace("{autoChantSpeed}", String(autoChantSpeed))}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={autoChantSpeed}
                    disabled={autoChantActive}
                    onChange={(e) => setAutoChantSpeed(parseFloat(e.target.value))}
                    className="w-28 accent-orange-500 bg-stone-100 h-1.5 rounded-full cursor-pointer disabled:opacity-50"
                  />
                </div>

                <button
                  onClick={() => setAutoChantActive(!autoChantActive)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    autoChantActive
                      ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                      : "bg-orange-50 hover:bg-orange-100 text-orange-850 border border-orange-200"
                  }`}
                >
                  {autoChantActive ? (language === "hi" ? "ऑटो-जाप रोकें" : "Stop Auto Chanter") : (language === "hi" ? "ऑटो-जाप शुरू करें" : "Start Auto Chanter")}
                </button>
              </div>
            </div>

            {/* Pranayama Breath Synchronizer */}
            <PranayamaSync language={language} />

            {/* Ashtayama Lila traditional Clock */}
            <AshtayamaClock language={language} />

            {/* Divine Shloka Sanctuary and Interactive Altar */}
            <ShlokaSanctuary language={language} />

            {/* Namanjali 108 Sacred Names Explorer */}
            <NamanjaliExplorer
              currentBeadIndex={currentBead}
              onSelectName={(index) => setCurrentBead(index)}
              language={language}
            />

          </section>

        </div>

        {/* Premanand Maharaj Daily Vani and Spiritual News */}
        <div className="mb-8">
          <PremanandVani language={language} />
        </div>

        {/* Achievements tracker section */}
        <div className="mb-8">
          <AchievementsTracker
            totalCount={totalLifetimeCount}
            streak={streak}
            roundsCompleted={roundsCompleted}
          />
        </div>

        {/* Statistical Records Compartment (Daily Naap Jaap history) */}
        <section id="historical-analytics-section" className="border-t border-orange-100/20 pt-8 mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-serif font-extrabold text-stone-850">
                {language === "hi" ? "दैनिक साधना सूची (Ledger)" : "Daily Chanting Ledger"}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === "hi" 
                  ? "दैनिक साधना और प्रगति का सुरक्षित संचित लेखा-जोखा।" 
                  : "Logs and milestones accumulated across daily routines safely persisted."}
              </p>
            </div>

            {/* Manual increment logging submission form */}
            <form onSubmit={handleManualIncrement} className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="number"
                placeholder={language === "hi" ? "जैसे. 108" : "Ex. 108"}
                value={manualCountInput}
                onChange={(e) => setManualCountInput(e.target.value)}
                className="bg-white border border-stone-250 rounded-xl px-3 py-2 text-xs w-full md:w-28 text-center font-mono font-bold focus:ring-1 focus:ring-orange-200"
                min="1"
              />
              <button
                type="submit"
                className="bg-stone-800 text-white rounded-xl text-xs font-bold px-4 py-2 hover:bg-stone-900 transition-all shadow shrink-0 cursor-pointer"
              >
                + {language === "hi" ? "मैन्युअल जाप जोड़ें" : "Manual Jaap"}
              </button>
            </form>
          </div>

          <DailyStats
            logs={logs}
            todayCount={todayCount}
            dailyTarget={dailyTarget}
            onUpdateTarget={handleUpdateTarget}
            onClearHistory={handleClearHistory}
            language={language}
          />
        </section>
            </>
          ) : (
            <div className="animate-fade-in">
              <DeityDarshan language={language} />
            </div>
          )}

        {/* Reset Confirmation Overlay Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-stone-105 shadow-2xl relative">
              <h3 className="text-md font-bold font-serif text-stone-850">
                {language === "hi" ? "सक्रिय काउंटर रीसेट करें?" : "Reset Active Counter?"}
              </h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed font-sans">
                {language === "hi" 
                  ? "यह आपकी वर्तमान माला की स्थिति और सत्र जाप संख्या को ० पर रीसेट कर देगा। आज के इतिहास आंकड़े प्रभावित नहीं होंगे।" 
                  : "This will reset your current round's bead position and your current session count to 0. Historical logs for today will not be affected."}
              </p>

              <div className="flex items-center gap-2 mt-5">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 text-stone-500 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold cursor-pointer"
                >
                  {language === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  onClick={handleResetCounter}
                  className="flex-1 py-2 text-white bg-red-650 hover:bg-red-700 bg-red-600 rounded-xl text-xs font-bold cursor-pointer"
                >
                  {language === "hi" ? "रीसेट करें" : "Reset"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fine, humble Footer info */}
        <footer id="developer-credits" className="text-center text-[10px] text-stone-400 border-t border-orange-100/10 pt-6 mt-8">
          <p>
            {language === "hi" 
              ? "© २०२६ श्री राधा नाम जाप काउंटर। दिव्य तरंगें अनंत और शाश्वत हैं।" 
              : "© 2026 Sri Radha Naam Jaap Counter. Divine vibrations are eternal."}
          </p>
        </footer>

      </div>
      )}
    </div>
  );
}
