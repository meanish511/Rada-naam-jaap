/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Synthesizer utility using Web Audio API to create real-time devotional atmosphere.

class SacredSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneInterval: number | null = null;
  private activeOscillators: Array<{ osc: OscillatorNode; gain: GainNode }> = [];
  
  // Settings
  private baseFrequency = 130.81; // C3
  private volume_drone = 0.5;
  private volume_bell = 0.9;
  private currentString = 0;

  constructor() {
    // Lazy-initialized on user interaction to abide by modern browser policies
  }

  private initCtx() {
    if (!this.ctx) {
      // Handle browser compatibility
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(this.volume_drone, this.ctx.currentTime);
      this.droneGain.connect(this.masterGain);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public startDrone(baseFreq: number, vol: number) {
    this.initCtx();
    if (!this.ctx || !this.droneGain) return;

    this.baseFrequency = baseFreq;
    this.volume_drone = vol;
    this.droneGain.gain.setTargetAtTime(this.volume_drone, this.ctx.currentTime, 0.2);

    // Stop existing loop if any
    this.stopDrone();

    // Start a sequential string-plucking chain simulating a Tambura drone
    const intervalTime = 1200; // time in ms between string plucks
    this.pluckTamburaString(); // pluck immediately
    
    this.droneInterval = window.setInterval(() => {
      this.pluckTamburaString();
    }, intervalTime);
  }

  public updateDroneSettings(baseFreq: number, vol: number) {
    this.baseFrequency = baseFreq;
    this.volume_drone = vol;
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.setTargetAtTime(this.volume_drone, this.ctx.currentTime, 0.1);
    }
  }

  public stopDrone() {
    if (this.droneInterval) {
      clearInterval(this.droneInterval);
      this.droneInterval = null;
    }
    // Clean up all active string harmonics smoothly
    const now = this.ctx ? this.ctx.currentTime : 0;
    this.activeOscillators.forEach(({ gain, osc }) => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setTargetAtTime(0, now, 0.4);
        setTimeout(() => {
          try {
            osc.stop();
          } catch (e) {}
        }, 1500);
      } catch (e) {}
    });
    this.activeOscillators = [];
  }

  /**
   * Simulates a single pluck of a 4-stringed instrument.
   * Traditional Tambura tuning relative to Root (Sa):
   * String 1: Pa (dominant - Perfect Fifth) or Ma (Perfect Fourth)
   * String 2: Sa (higher octave)
   * String 3: Sa (higher octave)
   * String 4: Sa (lower root)
   */
  private pluckTamburaString() {
    if (!this.ctx || !this.droneGain) return;
    const now = this.ctx.currentTime;
    
    // Choose string ratio based on the 4-string cycle
    let frequencyRatio = 1.0;
    switch (this.currentString) {
      case 0:
        frequencyRatio = 1.5; // Perfect 5th (Pa)
        break;
      case 1:
        frequencyRatio = 2.0; // Higher Octave (Sa)
        break;
      case 2:
        frequencyRatio = 2.02; // Higher Octave with slight detuning for rich chorus chorus
        break;
      case 3:
        frequencyRatio = 1.0; // Low Root (Sa)
        break;
    }

    const pluckFreq = this.baseFrequency * frequencyRatio;
    this.stringSynthesizer(pluckFreq, now);

    // Increment string counter
    this.currentString = (this.currentString + 1) % 4;
  }

  /**
   * Synthesizes complex string vibrations with bridge buzz (metallic harmonics)
   */
  private stringSynthesizer(frequency: number, startTime: number) {
    if (!this.ctx || !this.droneGain) return;

    // Tambura of Vrindavan sounds rich because of Javari (cotton thread under string)
    // We recreate this using a Fundamental wave + rich high-resonance harmonics
    const stringDuration = 4.0; // Long ringing string
    const stringGain = this.ctx.createGain();
    
    // Smooth envelope
    stringGain.gain.setValueAtTime(0, startTime);
    stringGain.gain.linearRampToValueAtTime(0.12, startTime + 0.1); // Quick soft pluck
    stringGain.gain.exponentialRampToValueAtTime(0.001, startTime + stringDuration); // long sustain decay
    stringGain.connect(this.droneGain);

    // Harmonic ratios for authentic Indian string timbres
    const harmonics = [
      { r: 1.0, a: 1.0, type: "triangle" as OscillatorType }, // Fundamental
      { r: 2.0, a: 0.4, type: "triangle" as OscillatorType }, // Octave
      { r: 3.0, a: 0.25, type: "sawtooth" as OscillatorType }, // Buzz overtone
      { r: 4.0, a: 0.15, type: "sawtooth" as OscillatorType }, // Rich ring
      { r: 5.0, a: 0.08, type: "triangle" as OscillatorType }  // Warmth
    ];

    harmonics.forEach(({ r, a, type }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const hGain = this.ctx.createGain();

      // Set shape and freq
      osc.type = type;
      osc.frequency.setValueAtTime(frequency * r, startTime);
      
      // Detune slightly for lush chorus effect
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, startTime);

      hGain.gain.setValueAtTime(a, startTime);
      
      osc.connect(hGain);
      hGain.connect(stringGain);
      
      osc.start(startTime);
      osc.stop(startTime + stringDuration);

      this.activeOscillators.push({ osc, gain: stringGain });
    });

    // Clean up reference in cache after it stops playing
    setTimeout(() => {
      this.activeOscillators = this.activeOscillators.filter(item => item.gain !== stringGain);
    }, stringDuration * 1000 + 500);
  }

  /**
   * Synthesizes a golden brass Temple Bell
   */
  public playTempleBell(vol: number) {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    this.volume_bell = vol;
    
    // Core master bell gain
    const bellGain = this.ctx.createGain();
    bellGain.gain.setValueAtTime(0, now);
    bellGain.gain.linearRampToValueAtTime(this.volume_bell, now + 0.01); // Instant percussion hit
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5); // Warm decaying ring
    bellGain.connect(this.masterGain!);

    // Frequencies of a dynamic metal bell (inharmonics create rich chime)
    // Fundamental around 520Hz (C5-ish) with golden overtones
    const bellFreq = 523.25;
    const overtones = [
      { f: 1.0, a: 1.0, detune: 0 },
      { f: 1.22, a: 0.6, detune: 5 },  // Metallic buzz
      { f: 1.50, a: 0.4, detune: -5 }, // Dominant fifth overtone
      { f: 2.0, a: 0.55, detune: 2 },
      { f: 2.65, a: 0.3, detune: 10 },
      { f: 3.10, a: 0.2, detune: -10 },
      { f: 4.25, a: 0.1, detune: 15 }
    ];

    overtones.forEach(({ f, a, detune }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const hGain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(bellFreq * f, now);
      osc.detune.setValueAtTime(detune, now);
      
      hGain.gain.setValueAtTime(a * 0.3, now);
      // Give higher overtones slightly quicker decay for realistic physics
      hGain.gain.exponentialRampToValueAtTime(0.001, now + (3.5 / f));

      osc.connect(hGain);
      hGain.connect(bellGain);

      osc.start(now);
      osc.stop(now + 4.0);
    });
  }

  /**
   * Synthesizes a soft, sweet finger chime (Manjira) for regular increments
   */
  public playChime(vol: number) {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    const chimeGain = this.ctx.createGain();
    chimeGain.gain.setValueAtTime(0, now);
    chimeGain.gain.linearRampToValueAtTime(vol * 0.6, now + 0.005);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    chimeGain.connect(this.masterGain!);

    // High pitch chime (e.g. 1800Hz)
    const baseChime = 1864.66; // A#6
    const ringFreqs = [1.0, 1.414, 1.732, 2.0];

    ringFreqs.forEach((mult) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const hGain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseChime * mult, now);
      
      hGain.gain.setValueAtTime(0.25, now);
      hGain.gain.exponentialRampToValueAtTime(0.001, now + (1.0 / mult));

      osc.connect(hGain);
      hGain.connect(chimeGain);

      osc.start(now);
      osc.stop(now + 1.5);
    });
  }

  /**
   * Native TTS generator for speaking "Radhe Radhe" or "Radha Nam"
   */
  public speakRadha() {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance("Radhā");
    utterance.lang = "hi-IN"; // Hindi vocal accent for Sanskrit names
    utterance.rate = 0.9;     // Calmer, slower speed
    utterance.pitch = 1.1;    // Gentle, bright pitch
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  }
}

// Export single instance for application use
export const soundEngine = new SacredSoundEngine();
