/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = "en" | "hi";

export interface TranslationDict {
  // App Titles & Slogans
  appTitle: string;
  appSubtitle: string;
  focusMode: string;
  exitFocusMode: string;
  currentChantingName: string;
  
  // Tabs
  tabChanting: string;
  tabDarshan: string;
  
  // Keyboard hints
  keyboardHint: string;
  
  // Mala & Controls
  beadNum: string;
  chantAction: string;
  roundsCompleted: string;
  todayCount: string;
  sessionCount: string;
  resetConfirmTitle: string;
  resetConfirmSubtitle: string;
  resetConfirmYes: string;
  resetConfirmNo: string;
  
  // Ambient Music
  ambientMusicTitle: string;
  ambientBellBtn: string;
  ambientDroneVol: string;
  ambientDronePitch: string;
  ambientChantSound: string;
  ambientChantVoice: string;
  ambientChime: string;
  droneDescription: string;
  
  // Auto-Chanter
  autoChanterTitle: string;
  autoPace: string;
  autoSeconds: string;
  autoDescription: string;
  autoStart: string;
  autoStop: string;
  
  // Daily Target
  dailyTargetTitle: string;
  dailyProgress: string;
  adjustTarget: string;
  targetAchieved: string;
  consecutiveStreak: string;
  activeStreak: string;
  lifetimeJaaps: string;
  
  // Daily Ledger/History
  ledgerTitle: string;
  ledgerSubtitle: string;
  manualPlaceholder: string;
  manualBtn: string;
  noHistory: string;
  dateCol: string;
  countCol: string;
  statusCol: string;
  actionCol: string;
  clearAllHistory: string;

  // Extra details
  beadsCountedTotal: string;
  completedRoundsLabel: string;
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  hi: {
    appTitle: "श्री राधा नाम जप साधना",
    appSubtitle: "दिव्य शांति में लीन हों। वास्तविक समय के तंबूरा स्वरों और भौतिक मनकों के साथ पारंपरिक मंदिर का दिव्य वातावरण अनुभव करें।",
    focusMode: "ध्यान मग्न मोड (एकाग्रता)",
    exitFocusMode: "एकाग्रता मोड से बाहर आएं",
    currentChantingName: "वर्तमान जपा जा रहा नाम",
    
    tabChanting: "🕉️ दिव्य नाम जाप (साधना)",
    tabDarshan: "✨ श्री विग्रह दर्शन (लीला दर्शन)",
    
    keyboardHint: "💡 ध्यान करते समय तुरंत जाप संख्या बढ़ाने के लिए कीबोर्ड पर कहीं भी Spacebar दबाएं!",
    
    beadNum: "मनका संख्या #",
    chantAction: "नाम जप करें (पुण्य बढ़ाएं)",
    roundsCompleted: "माला पूर्ण (१०८ मनके)",
    todayCount: "आज का कुल जप",
    sessionCount: "इस सत्र का जप",
    resetConfirmTitle: "जाप संख्या रीसेट करें?",
    resetConfirmSubtitle: "क्या आप वाकई आज की पूरी गिनती और माला को शून्य करना चाहते हैं? यह क्रिया वापस नहीं ली जा सकती।",
    resetConfirmYes: "हाँ, रीसेट करें",
    resetConfirmNo: "नहीं, रद्द करें",
    
    ambientMusicTitle: "तंबूरा संगीत और दिव्य ध्वनि",
    ambientBellBtn: "मंदिर की घंटी",
    ambientDroneVol: "तंबूरा वॉल्यूम (ध्वनि प्रबलता)",
    ambientDronePitch: "तंबूरा स्वर सप्तक (Pitch)",
    ambientChantSound: "जाप गूंज ध्वनि",
    ambientChantVoice: "दिव्य 'राधा' स्वर",
    ambientChime: "तिब्बती घंटी",
    droneDescription: "दिव्य तंबूरा की निरन्तर ध्वनि एकाग्रता को बढ़ाने में मदद करती है। बजाने के लिए प्ले बटन दबाएं।",
    
    autoChanterTitle: "स्वचालित जाप (Auto-Chanter)",
    autoPace: "जाप गति सीमा:",
    autoSeconds: "प्रत्येक {sec} सेकंड में १ जाप",
    autoDescription: "हाथ व्यस्त हैं? स्वचालित जाप चालू करें, मनके स्वयं घूमेंगे और दिव्य ध्वनि उत्पन्न होगी।",
    autoStart: "स्वचालित जाप प्रारम्भ करें",
    autoStop: "स्वचालित जाप रोकें",
    
    dailyTargetTitle: "जाप लक्ष्य निर्धारक",
    dailyProgress: "आज की आध्यात्मिक प्रगति:",
    adjustTarget: "दैनिक लक्ष्य बदलें:",
    targetAchieved: "🎉 बहुत बधाई! आज का दैनिक लक्ष्य पूर्ण हुआ!",
    consecutiveStreak: "अविरल साधना (Streak)",
    activeStreak: "दिनों से लगातार",
    lifetimeJaaps: "जीवनकाल का कुल जप",
    
    ledgerTitle: "दैनिक साधना बहीखाता (Ledger)",
    ledgerSubtitle: "आपकी रोजना की साधना सुरक्षित रूप से आपके डिवाइस में अंकित और संचित रहती है।",
    manualPlaceholder: "उदा. १०८",
    manualBtn: "+ मैन्युअल जाप दर्ज करें",
    noHistory: "अभी कोई इतिहास अंकित नहीं है। अपनी साधना शुरू करें!",
    dateCol: "साधना तिथि",
    countCol: "कुल नाम जप",
    statusCol: "लक्ष्य स्थिति",
    actionCol: "कार्य",
    clearAllHistory: "साधना इतिहास साफ करें",

    beadsCountedTotal: "अब तक जपे गए कुल मनके",
    completedRoundsLabel: "पूर्ण की गई मालाएं"
  },
  en: {
    appTitle: "Shri Radha Nama Jaap",
    appSubtitle: "Drown in spiritual tranquility. Recreate traditional temple ambience with real-time synthesized strings (Tambura) and physical beads.",
    focusMode: "Focus Mode (Distraction-Free)",
    exitFocusMode: "Exit Focus Mode",
    currentChantingName: "Current Chanting Name",
    
    tabChanting: "🕉️ Chanting Oasis (Sadhana)",
    tabDarshan: "✨ Deity Darshan (Vigraha Darshan)",
    
    keyboardHint: "💡 Press Spacebar anywhere to increment counts instantly when meditating!",
    
    beadNum: "Bead Number #",
    chantAction: "Chant Name (Jaap)",
    roundsCompleted: "Completed Rounds",
    todayCount: "Today's Total Jaap",
    sessionCount: "This Session Jaap",
    resetConfirmTitle: "Reset Your Count?",
    resetConfirmSubtitle: "Are you sure you want to reset your active session and daily counts to zero? This action cannot be undone.",
    resetConfirmYes: "Yes, Reset Counts",
    resetConfirmNo: "No, Keep Counts",
    
    ambientMusicTitle: "Ambient Music & Sounds",
    ambientBellBtn: "Temple Bell",
    ambientDroneVol: "Drone Volume",
    ambientDronePitch: "Drone Pitch Balance",
    ambientChantSound: "Chant Response Sound",
    ambientChantVoice: "Radhā Chanted",
    ambientChime: "Tibetan Chime",
    droneDescription: "An authentic, real-time synthesized classic Tambura drone to ground your thoughts. Press play to start.",
    
    autoChanterTitle: "Devotional Auto-Chanter",
    autoPace: "Chanting Pace:",
    autoSeconds: "1 chant every {sec} seconds",
    autoDescription: "Hands-busy meditation? Enable the auto-chanter to automatically rotate the beads and play the sacred sounding string.",
    autoStart: "Start Auto Chanter",
    autoStop: "Stop Auto Chanter",
    
    dailyTargetTitle: "Daily Target Configurator",
    dailyProgress: "Daily Sadhana Margin:",
    adjustTarget: "Adjust Daily Goal:",
    targetAchieved: "🎉 Divine Blessings! Daily chanting target successfully achieved!",
    consecutiveStreak: "Consecutive Sadhana Streak",
    activeStreak: "Consecutive Days Active",
    lifetimeJaaps: "Lifetime Cumulative Jaaps",
    
    ledgerTitle: "Daily Chanting Ledger",
    ledgerSubtitle: "Logs and milestones accumulated across daily routines safely persisted.",
    manualPlaceholder: "Ex. 108",
    manualBtn: "+ Manual Jaap",
    noHistory: "No chanting records saved yet. Begin your sadhana!",
    dateCol: "Sadhana Date",
    countCol: "Chanting Count",
    statusCol: "Goal Status",
    actionCol: "Action",
    clearAllHistory: "Clear Chanting Ledger",

    beadsCountedTotal: "Total Beads Counted",
    completedRoundsLabel: "Completed Rounds"
  }
};
