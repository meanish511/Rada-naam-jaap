/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface JaapLog {
  date: string; // YYYY-MM-DD
  count: number;
  rounds: number;
}

export interface SacredQuote {
  verse?: string;
  transliteration?: string;
  translation: string;
  source?: string;
}

export interface SoundConfig {
  droneVolume: number; // 0 to 1
  dronePitch: number; // Base frequency in Hz (e.g. 130.81 for C3)
  bellVolume: number; // 0 to 1
  isDronePlaying: boolean;
  chantVoice: boolean; // Speak "Radha" or chime
}
