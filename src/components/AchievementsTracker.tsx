/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Compass, 
  Heart, 
  Award, 
  CheckCircle2, 
  Activity,
  Sun,
  ShieldCheck
} from "lucide-react";
import { soundEngine } from "../utils/audio";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "count" | "streak" | "special";
  icon: React.ComponentType<{ className?: string }>;
  targetValue: number;
  currentValue: number;
  unit: string;
  colorClass: string;
  isUnlocked: boolean;
}

interface AchievementsTrackerProps {
  totalCount: number;
  streak: number;
  roundsCompleted: number;
}

export const AchievementsTracker: React.FC<AchievementsTrackerProps> = ({
  totalCount,
  streak,
  roundsCompleted
}) => {
  // Define Achievements list based on dynamic counters
  const achievements: Achievement[] = useMemo(() => {
    return [
      {
        id: "first_step",
        title: "Divine Spark",
        description: "Began your chanting journey with the first Radha Naam Jaap.",
        category: "count",
        icon: Sparkles,
        targetValue: 1,
        currentValue: totalCount,
        unit: "jaap",
        colorClass: "from-amber-450 to-amber-500 text-amber-600 bg-amber-50 border-amber-200",
        isUnlocked: totalCount >= 1
      },
      {
        id: "first_mala",
        title: "Mala Completed",
        description: "Completed one full sacred round of 108 beads.",
        category: "count",
        icon: Compass,
        targetValue: 108,
        currentValue: totalCount,
        unit: "jaap",
        colorClass: "from-rose-400 to-pink-500 text-rose-500 bg-rose-50 border-rose-200",
        isUnlocked: totalCount >= 108 || roundsCompleted >= 1
      },
      {
        id: "spiritual_habit",
        title: "3-Day Devotion",
        description: "Constructed a habit of daily remembrance for 3 consecutive days.",
        category: "streak",
        icon: Flame,
        targetValue: 3,
        currentValue: streak,
        unit: "day",
        colorClass: "from-orange-400 to-red-500 text-orange-600 bg-orange-50 border-orange-200",
        isUnlocked: streak >= 3
      },
      {
        id: "seven_day_streak",
        title: "Vraja Resonance",
        description: "Chanted daily for 7 days. Your heart resonates with peacfulness.",
        category: "streak",
        icon: Sun,
        targetValue: 7,
        currentValue: streak,
        unit: "day",
        colorClass: "from-yellow-450 to-amber-500 text-yellow-600 bg-yellow-50 border-yellow-250",
        isUnlocked: streak >= 7
      },
      {
        id: "thousand_jaaps",
        title: "Devotional Summit",
        description: "Reached a grand lifetime total of 1,000 holy chants.",
        category: "count",
        icon: Trophy,
        targetValue: 1000,
        currentValue: totalCount,
        unit: "jaap",
        colorClass: "from-purple-500 to-indigo-600 text-purple-650 bg-purple-50 border-purple-200",
        isUnlocked: totalCount >= 1000
      },
      {
        id: "radhavallabh",
        title: "Premanjali Champion",
        description: "Chanted 5,000 times. Anchored completely in absolute spiritual shelter.",
        category: "count",
        icon: Heart,
        targetValue: 5000,
        currentValue: totalCount,
        unit: "jaap",
        colorClass: "from-emerald-400 to-teal-500 text-emerald-600 bg-emerald-50 border-emerald-250",
        isUnlocked: totalCount >= 5000
      }
    ];
  }, [totalCount, streak, roundsCompleted]);

  // Derived completion stats
  const unlockedCount = useMemo(() => {
    return achievements.filter(a => a.isUnlocked).length;
  }, [achievements]);

  const handlePlayAchievementSound = () => {
    soundEngine.playTempleBell(0.45);
    setTimeout(() => {
      soundEngine.playChime(0.35);
    }, 280);
  };

  return (
    <div 
      id="spiritual-achievements-console"
      className="w-full bg-white rounded-2xl p-5 md:p-6 border border-rose-100 shadow-sm relative overflow-hidden transition-all duration-300"
    >
      {/* Decorative top right burst */}
      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* Header section with cumulative badge counts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-rose-100/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-widest font-extrabold text-stone-750 font-serif">
              Mantra Milestones & Badges
            </h3>
            <p className="text-[10px] text-stone-400 font-sans">
              Achievements earned on your path of meditation & quietude
            </p>
          </div>
        </div>

        {/* Unified Score Indicator counter */}
        <div 
          onClick={handlePlayAchievementSound}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-rose-50/60 hover:from-amber-100/80 hover:to-rose-100/80 border border-amber-100 px-3 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95 group"
        >
          <Award className="w-4 h-4 text-rose-500 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-mono font-bold text-stone-700">
            {unlockedCount} / {achievements.length} Unlocked
          </span>
        </div>
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((item) => {
          const Icon = item.icon;
          const pct = Math.min(Math.round((item.currentValue / item.targetValue) * 100), 100);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border relative flex flex-col justify-between min-h-[145px] transition-all duration-300 ${
                item.isUnlocked
                  ? "bg-gradient-to-b from-white to-stone-50/20 border-rose-150 shadow-sm"
                  : "bg-stone-50/30 border-stone-150 opacity-75 hover:opacity-100 hover:border-stone-250"
              }`}
            >
              {/* Unlocked checkmark indicator */}
              {item.isUnlocked && (
                <div className="absolute top-3 right-3 text-rose-500" title="Achievement Unlocked!">
                  <CheckCircle2 className="w-4 h-4 fill-rose-50 animate-bounce" />
                </div>
              )}

              {/* Icon & Title Row */}
              <div>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                    item.isUnlocked 
                      ? "bg-rose-50 text-rose-600 border-rose-200" 
                      : "bg-stone-100 text-stone-400 border-stone-200"
                  }`}>
                    <Icon className={`w-5 h-5 ${item.isUnlocked ? "animate-pulse" : ""}`} />
                  </div>
                  <div>
                    <h4 className={`text-xs font-serif font-extrabold tracking-tight ${
                      item.isUnlocked ? "text-stone-850" : "text-stone-500"
                    }`}>
                      {item.title}
                    </h4>
                    <p className={`text-[10px] leading-relaxed font-sans mt-0.5 ${
                      item.isUnlocked ? "text-stone-500" : "text-stone-400"
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress track row */}
              <div className="mt-4 pt-3 border-t border-stone-100/65">
                <div className="flex justify-between text-[9px] font-mono font-bold text-stone-400 mb-1">
                  <span>
                    {item.currentValue} / {item.targetValue} {item.unit}{item.currentValue !== 1 ? "s" : ""}
                  </span>
                  <span>{pct}%</span>
                </div>

                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.isUnlocked
                        ? "bg-gradient-to-r from-rose-450 to-rose-500 bg-rose-500"
                        : "bg-stone-300"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
