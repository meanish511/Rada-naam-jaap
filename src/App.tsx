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
  X
} from "lucide-react";
import { soundEngine } from "./utils/audio";
import { MalaVisualization } from "./components/MalaVisualization";
import { DailyStats } from "./components/DailyStats";
import { QuotesContemplation } from "./components/QuotesContemplation";
import { JaapLog, SoundConfig } from "./types";

// 24 Sweet names of Sri Radha Rani to rotate on every complete bead
const SACRED_NAMES = [
  { sanskrit: "श्री राधा", transliteration: "Śrī Rādhā", meaning: "The ultimate worshipper of Sri Krishna" },
  { sanskrit: "राधिका", transliteration: "Rādhikā", meaning: "She who bestows pure devotional ecstasy" },
  { sanskrit: "वृन्दावनेश्वरी", transliteration: "Vṛndāvaneśvarī", meaning: "The eternal Queen of holy Vrindavan forest" },
  { sanskrit: "गान्धर्विका", transliteration: "Gāndharvikā", meaning: "Celestial singer eternally praising divine love" },
  { sanskrit: "वृषभानु-नन्दिनी", transliteration: "Vṛṣabhānu-Nandinī", meaning: "The beloved daughter of King Vrishabhanu" },
  { sanskrit: "गोविन्द-नन्दिनी", transliteration: "Govinda-Nandinī", meaning: "She who gives eternal pleasure to Govinda" },
  { sanskrit: "कृष्ण-कान्ता", transliteration: "Kṛṣṇa-Kāntā", meaning: "The soulmate and supreme beloved of Krishna" },
  { sanskrit: "हरि-प्रिया", transliteration: "Hari-Priyā", meaning: "Dearer to Hari than His own life-force" },
  { sanskrit: "ललिता-प्राण", transliteration: "Lalitā-Prāṇa", meaning: "The very life-breath of Her best helper Lalita Sakhi" },
  { sanskrit: "करुणामयी", transliteration: "Karuṇāmayī", meaning: "The absolute reservoir of maternal grace and mercy" },
  { sanskrit: "माधवी", transliteration: "Mādhavī", meaning: "Sweeter than the spring honey of Vrindavan" },
  { sanskrit: "रसिक-शेखरा", transliteration: "Rasika-Śekharā", meaning: "The crown ornament of divine transcendental taste" },
  { sanskrit: "भक्ति-देवी", transliteration: "Bhakti-Devī", meaning: "The presiding goddess of pure devotional service" },
  { sanskrit: "प्रेम-स्वरुपिणी", transliteration: "Prema-Svarūpiṇī", meaning: "Whose spiritual body is composed purely of divine love" },
  { sanskrit: "नित्य-किशोरी", transliteration: "Nitya-Kiśorī", meaning: "The ever-youthful spiritual teenager of Goloka" },
  { sanskrit: "निकुञ्ज-निवासिनी", transliteration: "Nikuñja-Nivāsinī", meaning: "She who dwells in the secluded forest bowers" },
  { sanskrit: "कृष्ण-वक्षः-स्थिता", transliteration: "Kṛṣṇa-Vakṣaḥ-Sthitā", meaning: "Eternally resting in the chest of Lord Krishna" },
  { sanskrit: "गोपीनाथ-प्रिया", transliteration: "Gopīnātha-Priyā", meaning: "The sweetheart of the ultimate Lord of Gopis" },
  { sanskrit: "कृपा-सिन्धु", transliteration: "Kṛpā-Sindhu", meaning: "The limitless ocean of causeless spiritual mercy" },
  { sanskrit: "शरणागत-वत्सला", transliteration: "Śaraṇāgata-Vatsalā", meaning: "Nurturer of all surrendered souls seeking shelter" },
  { sanskrit: "त्रैलोक्य-सुन्दरी", transliteration: "Trailokya-Sundarī", meaning: "The most beautiful queen in all three worlds" },
  { sanskrit: "गोकुल-पूज्या", transliteration: "Gokula-Pūjyā", meaning: "Worshipped with loving devotion by all residents of Gokula" },
  { sanskrit: "गोपी-मुकुट", transliteration: "Gopī-Mukuṭa", meaning: "The crown jewel among all cowherd girls of Vraja" },
  { sanskrit: "राधे राधे", transliteration: "Rādhe Rādhe", meaning: "The dynamic loving caller of the divine soul" }
];

export default function App() {
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
    droneVolume: 0.25,
    dronePitch: 130.81, // C3
    bellVolume: 0.45,
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

  // Pitch options for Tambura
  const PITCHES = [
    { name: "C Scale (Root)", hz: 130.81 },
    { name: "A# Scale (Deep)", hz: 116.54 },
    { name: "D Scale (Bright)", hz: 146.83 },
    { name: "G Scale (Alto)", hz: 196.00 },
  ];

  // Load state from localStorage on mount
  useEffect(() => {
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
      {/* Decorative Warm Backgound Ornaments */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-orange-100/30 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl pointer-events-none -z-10" />
      
      {/* Container main chassis */}
      <div
        id="applet-chassis"
        className="w-full max-w-5xl bg-stone-50/50 backdrop-blur-xl border border-stone-200/40 rounded-3xl p-5 md:p-8 shadow-xl relative overflow-hidden"
      >
        
        {/* Divine Header Banner */}
        <header id="divine-header" className="relative mb-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 border-b border-orange-100/40 pb-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100/50 text-amber-850 font-serif font-extrabold shadow-sm select-none">
              <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "12s" }} />
              <span className="text-[10px] uppercase font-bold tracking-widest">Divine Mantra Oasis</span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <h1 className="text-4xl font-extrabold text-stone-850 tracking-tight font-serif select-none">
                Radha <span className="text-orange-600">Naam Jaap</span>
              </h1>
              <span className="text-stone-300 font-serif text-3xl hidden md:inline">|</span>
              <span className="text-xs uppercase font-semibold text-stone-400 tracking-widest hidden md:inline">
                Daily Rosary & Audio Drone
              </span>
            </div>

            <p className="text-xs text-stone-500 mt-1 max-w-lg leading-relaxed">
              Drown in spiritual tranquility. Recreate traditional temple ambience with real-time synthesized strings (Tambura) and physical beads.
            </p>
          </div>

          {/* Master quick info indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] uppercase font-bold tracking-wider text-stone-400">Current Chanting Name</p>
              <p className="text-xs font-serif font-semibold text-amber-900">{currentSacredName.sanskrit} ({currentSacredName.transliteration})</p>
            </div>
            
            <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shadow-inner select-none font-serif text-xl font-bold animate-pulse">
              {chantSyllable}
            </div>
          </div>
        </header>

        {/* Keyboard shortcut reminder bar */}
        {isKeyboardHintVisible && (
          <div className="w-full bg-stone-100 border border-stone-200/50 rounded-xl px-4 py-2.5 mb-6 text-xs flex items-center justify-between text-stone-500 shadow-sm">
            <span className="font-medium">
              💡 Press <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-stone-300 text-stone-700 font-bold">Spacebar</span> anywhere to increment counts instantly when meditating!
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
            />

            {/* Syllable detail panel under the Mala */}
            <div className="w-full text-center mt-2 p-3.5 bg-stone-50 rounded-xl border border-stone-100 relative">
              <p className="text-[10px] uppercase font-semibold text-amber-800 tracking-wider">
                Name #{currentBead === 0 && roundsCompleted > 0 ? 108 : currentBead}:
              </p>
              <h2 className="text-xl font-serif font-bold text-stone-850 mt-0.5">
                {currentSacredName.sanskrit}{" "}
                <span className="text-xs font-sans font-medium text-amber-900/60 font-mono italic">
                  ({currentSacredName.transliteration})
                </span>
              </h2>
              <p className="text-xs text-stone-500 italic mt-1 font-sans">
                {currentSacredName.meaning}
              </p>
            </div>

            {/* Quick helper controls row */}
            <div className="w-full flex items-center gap-3 mt-4">
              <button
                onClick={triggerSingleJaap}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl py-3.5 px-4 font-bold tracking-tight text-center shadow-lg shadow-orange-100 hover:shadow-orange-200 transition-all flex items-center justify-center gap-2 group cursor-pointer hover:brightness-105 active:scale-98"
              >
                <Plus className="w-5 h-5 shrink-0 group-hover:rotate-90 transition-transform" />
                <span>Chant Name (Jaap)</span>
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
                  <h3 className="text-sm uppercase tracking-wider font-extrabold text-stone-700">Ambient Music</h3>
                </div>

                <div className="inline-flex gap-1">
                  <button
                    onClick={() => soundEngine.playTempleBell(soundConfig.bellVolume)}
                    className="p-1 px-2 border border-stone-100 hover:bg-stone-50 rounded-lg text-amber-700 text-[10px] uppercase font-bold flex items-center gap-1 transition-all pointer-events-auto"
                    title="Play meditative bell"
                  >
                    <Bell className="w-3.5 h-3.5" /> Bell
                  </button>
                </div>
              </div>

              {/* Drone Player Row */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 mb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-stone-800">Synthetic Indian Tambura Drone</h4>
                  <p className="text-[10px] text-stone-400">Hypnotic physical string strings drone</p>
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
                      <span>Drone Volume</span>
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
                  <span className="text-xs text-stone-400 block mb-1.5">Harmonic Tuning / Scale Root:</span>
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
                    <h5 className="text-xs font-semibold text-stone-800">Chant Response Sound</h5>
                    <p className="text-[9px] text-stone-400">Triggered on every bead pressed</p>
                  </div>

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
                </div>

              </div>
            </div>

            {/* Auto-chant Wheel Console */}
            <div id="auto-chant-timer-console" className="bg-white rounded-2xl p-6 border border-amber-50/50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                <Disc className="w-20 h-20 text-orange-600 animate-spin" style={{ animationDuration: "15s" }} />
              </div>

              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm uppercase tracking-wider font-extrabold text-stone-700">Devotional Auto-Chanter</h3>
                <span className="px-2 py-0.5 rounded bg-orange-50 text-[9px] font-bold text-orange-600 border border-orange-100/50">
                  {autoChantActive ? "ACTIVE" : "OFFLINE"}
                </span>
              </div>

              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                Hands-busy meditation? Enable the auto-chanter to automatically rotate the beads and play the sacred sounding string.
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-xs text-stone-500 block">Chanting Pace:</span>
                    <span className="text-[10px] text-stone-400 font-medium">1 chant every {autoChantSpeed} seconds</span>
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
                  {autoChantActive ? "Stop Auto Chanter" : "Start Auto Chanter"}
                </button>
              </div>
            </div>

            {/* Sacred contemplating text */}
            <QuotesContemplation />

          </section>

        </div>

        {/* Statistical Records Compartment (Daily Naap Jaap history) */}
        <section id="historical-analytics-section" className="border-t border-orange-100/20 pt-8 mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-serif font-extrabold text-stone-850">Daily Chanting Ledger</h2>
              <p className="text-xs text-stone-500 mt-0.5">Logs and milestones accumulated across daily routines safely persisted.</p>
            </div>

            {/* Manual increment logging submission form */}
            <form onSubmit={handleManualIncrement} className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="number"
                placeholder="Ex. 108"
                value={manualCountInput}
                onChange={(e) => setManualCountInput(e.target.value)}
                className="bg-white border border-stone-250 rounded-xl px-3 py-2 text-xs w-full md:w-28 text-center font-mono font-bold focus:ring-1 focus:ring-orange-200"
                min="1"
              />
              <button
                type="submit"
                className="bg-stone-800 text-white rounded-xl text-xs font-bold px-4 py-2 hover:bg-stone-900 transition-all shadow shrink-0"
              >
                + Manual Jaap
              </button>
            </form>
          </div>

          <DailyStats
            logs={logs}
            todayCount={todayCount}
            dailyTarget={dailyTarget}
            onUpdateTarget={handleUpdateTarget}
            onClearHistory={handleClearHistory}
          />
        </section>

        {/* Reset Confirmation Overlay Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-stone-105 shadow-2xl relative">
              <h3 className="text-md font-bold font-serif text-stone-850">Reset Active Counter?</h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                This will reset your current round's bead position and your current session count to 0. Historical logs for today will not be affected.
              </p>

              <div className="flex items-center gap-2 mt-5">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 text-stone-500 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetCounter}
                  className="flex-1 py-2 text-white bg-red-650 hover:bg-red-700 bg-red-600 rounded-xl text-xs font-bold"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fine, humble Footer info */}
        <footer id="developer-credits" className="text-center text-[10px] text-stone-400 border-t border-orange-100/10 pt-6 mt-8">
          <p>© 2026 Sri Radha Naam Jaap Counter. Divine vibrations are eternal.</p>
        </footer>

      </div>
    </div>
  );
}
