/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { Award, Calendar, Flame, History, Settings, TrendingUp, Trophy } from "lucide-react";
import { JaapLog } from "../types";

interface DailyStatsProps {
  logs: JaapLog[];
  todayCount: number;
  dailyTarget: number;
  onUpdateTarget: (target: number) => void;
  onClearHistory: () => void;
}

export const DailyStats: React.FC<DailyStatsProps> = ({
  logs,
  todayCount,
  dailyTarget,
  onUpdateTarget,
  onClearHistory,
}) => {
  // Current streak (consecutive days with at least 1 jaap)
  const streak = useMemo(() => {
    if (logs.length === 0) return todayCount > 0 ? 1 : 0;
    
    // Sort logs descending by date
    const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    
    const todayStr = new Date().toISOString().split("T")[0];
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Check if user chanted today or yesterday to maintain the streak
    let activeStreak = 0;
    let checkDate = new Date();
    
    // If today hasn't started yet but yesterday has records, start yesterday, otherwise start today
    const hasTodayRecord = sortedLogs.some(l => l.date === todayStr && l.count > 0) || todayCount > 0;
    const hasYesterdayRecord = sortedLogs.some(l => l.date === yesterdayStr && l.count > 0);

    if (!hasTodayRecord && !hasYesterdayRecord) {
      return 0; // Streak broken
    }

    if (!hasTodayRecord && hasYesterdayRecord) {
      checkDate.setDate(checkDate.getDate() - 1); // Start checking from yesterday
    }

    // Go backwards day by day and verify
    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      const logForDate = sortedLogs.find(l => l.date === dateStr);
      const dayIsToday = dateStr === todayStr;

      if ((dayIsToday && todayCount > 0) || (logForDate && logForDate.count > 0)) {
        activeStreak++;
        checkDate.setDate(checkDate.getDate() - 1); // Go back one day
      } else {
        break; // Streak ends
      }
    }

    return activeStreak;
  }, [logs, todayCount]);

  // Compute total jaaps across all history (including today)
  const totalLifetimeCount = useMemo(() => {
    const historicalTotal = logs.reduce((acc, log) => acc + log.count, 0);
    const todayStr = new Date().toISOString().split("T")[0];
    const historicalIncludesToday = logs.some((l) => l.date === todayStr);

    return historicalTotal + (historicalIncludesToday ? 0 : todayCount);
  }, [logs, todayCount]);

  // Last 7 days visual chart data
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      
      const log = logs.find((l) => l.date === dateStr);
      let count = log ? log.count : 0;
      
      // If date is today, inject live runtime state count
      if (dateStr === today.toISOString().split("T")[0]) {
        count = todayCount;
      }

      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const formattedDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      data.push({
        dateStr,
        dayName,
        formattedDate,
        count,
      });
    }
    return data;
  }, [logs, todayCount]);

  const maxChartCount = useMemo(() => {
    const max = Math.max(...chartData.map((d) => d.count), dailyTarget);
    return max > 0 ? max : 108;
  }, [chartData, dailyTarget]);

  // Progress percentage for today
  const progressPercent = Math.min(Math.round((todayCount / dailyTarget) * 100), 100);

  return (
    <div id="stats-panel-root" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      
      {/* Target and Today Goal Tracker */}
      <div id="target-tracker-card" className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-amber-100/60 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-stone-500">Daily Target</h3>
            <Settings className="w-4 h-4 text-stone-400 cursor-pointer hover:text-amber-600 transition-colors" />
          </div>

          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-mono text-4xl font-bold tracking-tight text-amber-700">{todayCount}</span>
            <span className="text-stone-400 text-sm">/ {dailyTarget} jaaps</span>
          </div>

          {/* Core progress meter string */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-medium text-stone-500 mb-1.5">
              <span>Goal Progress</span>
              <span className="text-amber-800 font-semibold">{progressPercent}%</span>
            </div>
            
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200/50">
              <div
                className="bg-gradient-to-r from-orange-400 to-amber-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Target configuration picker */}
        <div className="mt-5 border-t border-amber-100/30 pt-4">
          <p className="text-[11px] text-stone-500 font-medium mb-2.5">Adjust Daily Jaap Goal:</p>
          <div className="grid grid-cols-3 gap-2">
            {[108, 540, 1008].map((val) => (
              <button
                key={val}
                onClick={() => onUpdateTarget(val)}
                className={`py-1.5 px-1 rounded-xl text-xs font-semibold tracking-tight transition-all border ${
                  dailyTarget === val
                    ? "bg-amber-50 border-amber-400 text-amber-800 shadow-sm shadow-amber-50"
                    : "bg-white border-stone-100 text-stone-600 hover:bg-stone-50"
                }`}
              >
                {val} Jaaps
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Streak and Lifetime totals */}
      <div id="streak-scores-card" className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-amber-100/60 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-stone-500">Divine Consistency</h3>
            <Award className="w-4 h-4 text-orange-500" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="p-3 bg-gradient-to-br from-orange-50 to-amber-50/45 rounded-xl border border-orange-100/40 relative overflow-hidden group">
              <div className="absolute top-1 right-1 opacity-10 group-hover:scale-110 transition-transform">
                <Flame className="w-8 h-8 text-orange-600" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-700/80">Active Streak</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="font-mono text-3xl font-extrabold text-stone-850">{streak}</span>
                <span className="text-xs font-semibold text-stone-500">{streak === 1 ? "Day" : "Days"}</span>
              </div>
            </div>

            <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50/40 rounded-xl border border-amber-100/40 relative overflow-hidden group">
              <div className="absolute top-1 right-1 opacity-10 group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-amber-600" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700/80">Total Chanted</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-mono text-2xl font-extrabold text-stone-850">
                  {totalLifetimeCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-[11px] text-stone-500 flex items-center gap-1.5 bg-stone-50 px-3 py-2 rounded-xl">
          <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            {streak >= 3
              ? "Wonderful consistency! The divine power of sound stabilizes the heart."
              : "Set a peaceful routine to chant Radha Naam daily at the same time."}
          </span>
        </div>
      </div>

      {/* Daily Progress Trends Chart (Past 7 Days Bar Chart) */}
      <div id="progress-chart-card" className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-amber-100/60 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs uppercase tracking-widest font-bold text-stone-500">7-Day Jaap History</h3>
            <TrendingUp className="w-4 h-4 text-stone-400" />
          </div>

          {/* Visual SVG bar chart */}
          <div className="h-28 flex items-end justify-between gap-1.5 pt-3">
            {chartData.map((d) => {
              const heightPercent = maxChartCount > 0 ? (d.count / maxChartCount) * 100 : 0;
              const isToday = d.dateStr === new Date().toISOString().split("T")[0];
              
              return (
                <div key={d.dateStr} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Hover tooltip for exact figures */}
                  <div className="absolute -top-6 scale-0 group-hover:scale-100 transition-transform bg-stone-800 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow z-20 whitespace-nowrap pointer-events-none">
                    {d.count} jaaps
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full relative rounded-t-md overflow-visible bg-stone-105 min-h-[4px] h-full flex items-end">
                    <div
                      style={{ height: `${Math.max(heightPercent, 4)}%` }}
                      className={`w-full rounded-t-[4px] transition-all duration-500 ${
                        isToday
                          ? "bg-gradient-to-t from-orange-500 to-amber-500 ring-2 ring-orange-200"
                          : d.count > 0
                          ? "bg-gradient-to-t from-stone-400 to-stone-505 bg-amber-600/70"
                          : "bg-stone-200/70"
                      }`}
                    />
                  </div>

                  {/* Day Label */}
                  <span className={`text-[10px] mt-1.5 font-bold ${
                    isToday ? "text-orange-600 font-extrabold" : "text-stone-400"
                  }`}>
                    {d.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 text-[10px] text-stone-400 border-t border-stone-100 pt-2.5">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Daily Jaap Log</span>
          </div>
          <button
            onClick={onClearHistory}
            className="hover:text-red-500 transition-colors uppercase font-semibold hover:underline"
          >
            Clear Records
          </button>
        </div>
      </div>

    </div>
  );
};
