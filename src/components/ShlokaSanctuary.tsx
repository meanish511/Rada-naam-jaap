import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Languages, 
  Volume2, 
  Flame, 
  Wind, 
  Compass,
  Maximize2,
  Minimize2
} from "lucide-react";
import { soundEngine } from "../utils/audio";
import { Language } from "../utils/translationHelper";

interface ShlokaData {
  id: string;
  category: string;
  categoryHi: string;
  titleSanskrit: string;
  titleEnglish: string;
  verse: string;
  transliteration: string;
  translationEng: string;
  translationHin: string;
  significance: string;
  significanceHi: string;
}

// 8 exquisite, famous, and sacred Shlokas centered around Sri Radha's glory, mercy, and sweet nature
const SHLOKAS_DATABASE: ShlokaData[] = [
  {
    id: "radha-pranama",
    category: "Pranama Mantra",
    categoryHi: "प्रणाम मन्त्र",
    titleSanskrit: "श्री राधा प्रणाम मन्त्र",
    titleEnglish: "Radha Pranama Mantra",
    verse: "तप्त-काञ्चन-गौराङ्गि राधे वृन्दावनेश्वरि ।\nवृषभानु-सुते देवि प्रणमामि हरि-प्रिये ॥",
    transliteration: "tapta-kāñcana-gaurāṅgi rādhe vṛndāvaneśvari\nvṛṣabhānu-sute devi praṇamāmi hari-priye",
    translationEng: "I offer my respectful obeisances unto Srimati Radharani, whose bodily complexion is like molten gold and who is the Queen of Vrindavana. You are the daughter of King Vrishbhanu, and You are very dear to Lord Krishna.",
    translationHin: "तप्त सोने के समान गौरवर्ण वाली, श्री वृन्दावन की स्वामिनी, राजा वृषभानु की सुपुत्री और श्री कृष्ण की प्राणप्रिया श्री राधा रानी के चरणों में मैं बारम्बार प्रणाम करता हूँ।",
    significance: "Chanted to invoke Her divine mercy before commencing any Naam Jaap or sweet meditation.",
    significanceHi: "नाम जाप या साधना शुरू करने से पहले श्री प्रिया जी की असीम कृपा प्राप्त करने के लिए।"
  },
  {
    id: "kripa-kataksha-1",
    category: "Kripa Kataksha",
    categoryHi: "कृपा कटाक्ष स्तोत्र",
    titleSanskrit: "राधा कृपा कटाक्ष स्तोत्र - श्लोक १",
    titleEnglish: "Sri Radha Kripa Kataksha - Vers. 1",
    verse: "मुनीन्द्र-वृन्द-वन्दिते त्रिलोक-शोक-हारिणी ।\nप्रसन्न-वक्त्र-पङ्कजे निकुञ्ज-भू-विलासनी ॥",
    transliteration: "munīndra-vṛnda-vandite triloka-śoka-hāriṇī\nprasanna-vaktra-paṅkaje nikuñja-bhū-vilāsanī",
    translationEng: "O You who are worshipped by the assembly of greatest sages! O You who dispel the miseries of all three worlds! O You whose cheerful face is like a blooming lotus, eternally sporting in the sacred forest groves of Vrindavan!",
    translationHin: "हे मुनिराजों के समूह द्वारा वंदित! हे तीनों लोकों के दुखों को हरने वाली! हे खिले हुए कमल के समान प्रसन्न मुख वाली और निकुंजों की भूमि में विलास-क्रीड़ा करने वाली श्री राधे!",
    significance: "Composed by Lord Shiva in Urdhvamnaya Tantra to seek Sri Radha's side-glance of causeless grace.",
    significanceHi: "श्रीमती राधा रानी की अहैतुकी दृष्टि और दिव्य कृपा प्राप्त करने के लिए भगवान शिव द्वारा रचित।"
  },
  {
    id: "kripa-kataksha-10",
    category: "Kripa Kataksha",
    categoryHi: "कृपा कटाक्ष स्तोत्र",
    titleSanskrit: "राधा कृपा कटाक्ष स्तोत्र - श्लोक १०",
    titleEnglish: "Sri Radha Kripa Kataksha - Vers. 10",
    verse: "कराग्र-सत्-प्रसन्न-काञ्चनोल्लसत्-कणन्-मणू-\nप्रणीत-हेम-मण्डिका-विचित्र-शिञ्जिते-भगे ।",
    transliteration: "karāgra-sat-prasanna-kāñcanollasat-kaṇan-maṇū\npraṇīta-hema-maṇḍikā-vicitra-śiñjite-bhage",
    translationEng: "On the tips of Your gentle hands shine golden bangles and jeweled ornaments that chime sweetness; Your movements fill the spiritual atmosphere with transcendental ringing echoes.",
    translationHin: "जिनके कर-कमल के अग्रभागों में सुवर्ण के सुंदर और प्रसन्न कंगन खनखना रहे हैं, तथा रत्नजड़ित स्वर्णिम आभूषणों की छनकार से पूरा वातावरण गुंजायमान रहता है।",
    significance: "A high-vibrational description of Sri Radha's spiritual body which activates inner sound meditation.",
    significanceHi: "श्री प्रिया जी के पावन दिव्य विग्रह का यह ध्यान भीतर अलौकिक शांति भर देता है।"
  },
  {
    id: "yugal-stotram",
    category: "Yugal Stotram",
    categoryHi: "युगल स्तोत्रम",
    titleSanskrit: "श्री राधा कृष्ण युगल ध्यानम्",
    titleEnglish: "Divine Yugal Dhyana Verse",
    verse: "राधा-विहार-मध्याह्न-लीला-सङ्कल्प-मन्दिरम् ।\nवृषभानु-सुता-चित्त-तप्त-हाटक-मञ्जरी ॥",
    transliteration: "rādhā-vihāra-madhyāhna-līlā-saṅkalpa-mindiram\nvṛṣabhānu-sutā-citta-tapta-hāṭaka-mañjarī",
    translationEng: "Contemplating the mid-day pastimes of Yugal Sarkar in the deep cool groves of Govardhan; Sri Radha's pure loving intent is like a golden flower blossom wrapping the heart of Govinda.",
    translationHin: "मध्याह्न काल में निकुंजों के भीतर विहार करने वाले युगल सरकार का ध्यान, जहाँ श्री वृषभानु नंदिनी का चित्त तपे हुए स्वर्ण मंजरी की भांति श्री कृष्ण के अनुराग में डूबा रहता है।",
    significance: "Used to develop intense absorption in the deep, selfless transcendental love of Vraja.",
    significanceHi: "ब्रज के निष्काम और निःस्वार्थ प्रेम भाव में अंतःकरण को सराबोर करने के लिए दिव्य ध्यान श्लोक।"
  },
  {
    id: "radhavas-1",
    category: "Radha Rasa Sudhanidhi",
    categoryHi: "रस सुधानिधि",
    titleSanskrit: "राधा रस सुधानिधि - श्लोक ७",
    titleEnglish: "Radha Rasa Sudhanidhi - Vers. 7",
    verse: "यस्याः कदापि चरणालक-राग-रेखा-\nमञ्जीर-मञ्जु-कल-शिञ्जित-मन्द-मन्दम्।\nध्यायन्ति चेतसि मुदा मुनि-सिद्ध-सङ्घाः ॥",
    transliteration: "yasyāḥ kadāpi caraṇālaka-rāga-rekhā\nmañjīra-mañju-kala-śiñjita-manda-mandam\ndhyāyanti cetasi mudā muni-siddha-saṅghāḥ",
    translationEng: "Whose reddish ankle-paste markings and the sweet, gentle jingle of Her ankle bells are joyfully meditated upon within the purified hearts of great sages and self-realized souls.",
    translationHin: "जिनके श्री चरणों के लाल महावर की रेखाओं एवं पैरों के नूपुरों की मन्द-मन्द मीठी झंकार का ध्यान सिद्ध संतजन और ऋषिगण अपने हृदयों में परम आनंद के साथ करते हैं।",
    significance: "Exquisite verse written by Srila Prabodhananda Sarasvati depicting the supreme status of Radha's foot trace.",
    significanceHi: "श्री चरणों के पावन महावर और दिव्य नूपुर की मधुर ध्वनि का ध्यान मन को निर्मल बनाता है।"
  },
  {
    id: "prem-path-1",
    category: "Prema Bhakti",
    categoryHi: "प्रेम भक्ति",
    titleSanskrit: "चैतन्य चरितामृतम् लोक कथन",
    titleEnglish: "Chaitanya Charitamrita Absolute Love",
    verse: "कृष्ण-मयी कृष्ण-गृह-वासिनी कृष्ण-प्राणा रूपिणी ।\nराधा-नामे सकल पातक नाशन परम कल्प-मयी ॥",
    transliteration: "kṛṣṇa-mayī kṛṣṇa-gṛha-vāsinī kṛṣṇa-prāṇā rūpiṇī\nrādhā-nāme sakala pātaka nāśana parama kalpa-mayī",
    translationEng: "She is fully saturated of Krishna; She resides in the spiritual home of Krishna; She is the very life-force and eternal form of Krishna. Her holy name destroys all weaknesses of the material mind.",
    translationHin: "श्री राधा पूरी तरह कृष्णमय हैं, वे कृष्ण के गृह में निवास करती हैं और कृष्ण का प्राण-रूप ही हैं। श्री राधा जी का दिव्य नाम समस्त बुराइयों को नष्ट करने वाला परम कल्पवृक्ष है।",
    significance: "Highlighting the non-differentiation between the energetic Lord and His loving energy.",
    significanceHi: "गोपियों और श्री प्रियाजी की कृष्ण भक्ति और प्रेम में तन्मयता को स्थापित करने वाला पवित्र सूत्र।"
  }
];

// Interactive flower petal interface for the petal cascade rendering
interface FloatingPetal {
  id: number;
  x: number; // left percentage (0 to 100)
  size: number; // px size
  color: string; // Tailwind bg-color or color code
  delay: number; // animation delay
  rotation: number; // initial rotate angle
  duration: number; // float duration
  type: "rose" | "marigold" | "jasmine";
}

interface ShlokaSanctuaryProps {
  language?: Language;
}

export const ShlokaSanctuary: React.FC<ShlokaSanctuaryProps> = ({ language = "hi" }) => {
  const isHindi = language === "hi";
  const [shlokaIndex, setShlokaIndex] = useState(0);
  const [lang, setLang] = useState<"eng" | "hin">(language === "hi" ? "hin" : "eng");
  const [expanded, setExpanded] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>(language === "hi" ? "सभी" : "All");

  // Interactive devotional offering states
  const [diyaLit, setDiyaLit] = useState(false);
  const [incenseBurning, setIncenseBurning] = useState(false);
  const [petals, setPetals] = useState<FloatingPetal[]>([]);
  const [isPronouncing, setIsPronouncing] = useState(false);

  // Counter inside sanctuary to know total petal clicks
  const [flowersOfferedCount, setFlowersOfferedCount] = useState(0);

  // Keep lang and filter synced when prop language changes
  useEffect(() => {
    setLang(language === "hi" ? "hin" : "eng");
    setCategoryFilter(language === "hi" ? "सभी" : "All");
  }, [language]);

  // Filtered categories
  const categories = useMemo(() => {
    return isHindi
      ? ["सभी", "प्रणाम मन्त्र", "कृपा कटाक्ष स्तोत्र", "युगल स्तोत्रम", "रस सुधानिधि", "प्रेम भक्ति"]
      : ["All", "Pranama Mantra", "Kripa Kataksha Stotram", "Yugal Stotram", "Rasa Sudhanidhi", "Prema Bhakti"];
  }, [isHindi]);

  // Rotate Shlokas safely within selected category list if filtered
  const filteredShlokas = useMemo(() => {
    return SHLOKAS_DATABASE.filter(s => {
      if (categoryFilter === "All" || categoryFilter === "सभी") return true;
      if (isHindi) {
        if (categoryFilter === "प्रणाम मन्त्र") return s.categoryHi === "प्रणाम मन्त्र";
        if (categoryFilter === "कृपा कटाक्ष स्तोत्र") return s.categoryHi === "कृपा कटाक्ष स्तोत्र";
        if (categoryFilter === "युगल स्तोत्रम") return s.categoryHi === "युगल स्तोत्रम";
        if (categoryFilter === "रस सुधानिधि") return s.categoryHi === "रस सुधानिधि";
        if (categoryFilter === "प्रेम भक्ति") return s.categoryHi === "प्रेम भक्ति";
      } else {
        if (categoryFilter === "Pranama Mantra") return s.category === "Pranama Mantra";
        if (categoryFilter === "Kripa Kataksha Stotram") return s.category === "Kripa Kataksha";
        if (categoryFilter === "Yugal Stotram") return s.category === "Yugal Stotram";
        if (categoryFilter === "Rasa Sudhanidhi") return s.category === "Radha Rasa Sudhanidhi";
        if (categoryFilter === "Prema Bhakti") return s.category === "Prema Bhakti";
      }
      return false;
    });
  }, [categoryFilter, isHindi]);

  // Safeguard index after filtering
  useEffect(() => {
    setShlokaIndex(0);
  }, [categoryFilter]);

  const activeShloka = useMemo(() => {
    if (filteredShlokas.length === 0) return SHLOKAS_DATABASE[0];
    const safeIndex = shlokaIndex % filteredShlokas.length;
    return filteredShlokas[safeIndex < 0 ? 0 : safeIndex];
  }, [filteredShlokas, shlokaIndex]);

  const handleNext = () => {
    soundEngine.playChime(0.15);
    setShlokaIndex(prev => (prev === filteredShlokas.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    soundEngine.playChime(0.15);
    setShlokaIndex(prev => (prev === 0 ? filteredShlokas.length - 1 : prev - 1));
  };

  // Speaks the Sanskrit verse with perfect calm Indian diction
  const handlePronounce = () => {
    if (!('speechSynthesis' in window)) return;
    setIsPronouncing(true);
    
    // Cancel active voice
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(activeShloka.verse);
    utterance.lang = "hi-IN"; // Hindi accent matches Sanskrit perfectly
    utterance.rate = 0.75; // Slower chant pace
    utterance.pitch = 1.05; // Bright soft voice
    
    utterance.onend = () => setIsPronouncing(false);
    utterance.onerror = () => setIsPronouncing(false);

    window.speechSynthesis.speak(utterance);
    // Play a gentle ambient bell background first
    soundEngine.playChime(0.15);
  };

  // Perform virtual flower offering (triggers rose & marigold petal cascading)
  const handleOfferFlowers = () => {
    soundEngine.playChime(0.4);
    setFlowersOfferedCount(prev => prev + 1);

    // Generate 15 temporary floating petal objects
    const petalColors = ["bg-red-400", "bg-orange-400", "bg-yellow-250", "bg-rose-450"];
    const petalTypes: ("rose" | "marigold" | "jasmine")[] = ["rose", "marigold", "jasmine"];

    const newPetals: FloatingPetal[] = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: Math.random() * 100, // random start horizontal line
      size: Math.random() * 14 + 10, // sizes between 10px and 24px
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      delay: Math.random() * 0.4,
      rotation: Math.random() * 360,
      duration: Math.random() * 3 + 2.5, // 2.5 to 5.5 seconds fall duration
      type: petalTypes[Math.floor(Math.random() * petalTypes.length)]
    }));

    // Retain only latest petals to prevent browser slow-downs
    setPetals(prev => [...prev.slice(-30), ...newPetals]);

    // Clean up petals after completion
    setTimeout(() => {
      setPetals(prev => prev.filter(p => !newPetals.find(np => np.id === p.id)));
    }, 6000);
  };

  const handleToggleDiya = () => {
    soundEngine.playTempleBell(0.3);
    setDiyaLit(!diyaLit);
  };

  const handleToggleIncense = () => {
    soundEngine.playChime(0.25);
    setIncenseBurning(!incenseBurning);
  };

  return (
    <div 
      id="shloka-sanctuary-widget" 
      className="w-full bg-gradient-to-br from-white/95 to-amber-50/50 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-orange-100 shadow-md relative overflow-hidden transition-all duration-300"
    >
      {/* Visual background ornament: Sanskrit Om or Mandala glow backdrop */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.06] pointer-events-none select-none">
        <BookOpen className="w-48 h-48 text-orange-600 scale-125" />
      </div>

      {/* Decorative Golden Arches framework */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      {/* Devotional Particle Canvas (Flower Petals cascading) */}
      <div id="flower-cascade-layer" className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        <AnimatePresence>
          {petals.map((petal) => (
            <motion.div
              key={petal.id}
              initial={{ y: -30, x: `${petal.x}%`, opacity: 0, rotate: petal.rotation }}
              animate={{ 
                y: "110%", 
                x: `${petal.x + (Math.sin(petal.id) * 15)}%`, // realistic side sway
                opacity: [0.3, 1, 1, 0],
                rotate: petal.rotation + 360 
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: petal.duration, 
                delay: petal.delay, 
                ease: "linear" 
              }}
              style={{ width: petal.size, height: petal.size }}
              className={`absolute rounded-full shadow-sm filter blur-[0.3px] ${petal.color} ${
                petal.type === "rose" 
                  ? "rounded-tr-[24px] rounded-bl-[20px]" 
                  : petal.type === "marigold" 
                  ? "border border-amber-500 rounded-lg" 
                  : "bg-white border border-stone-200"
              }`}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Header and Filter Menu */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-amber-600" />
            <h3 className="text-sm uppercase tracking-widest font-extrabold text-stone-850 font-serif">
              {isHindi ? "श्रीमद् श्लोक साधना गृह" : "Divine Shloka Sanctuary"}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 bg-orange-50/50 border border-orange-100/40 rounded-xl px-2 py-1">
            <Languages className="w-3.5 h-3.5 text-orange-600" />
            <button
              onClick={() => setLang("hin")}
              className={`text-[9px] uppercase font-bold tracking-tight px-1.5 py-0.5 rounded cursor-pointer ${
                lang === "hin" ? "bg-orange-500 text-white" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang("eng")}
              className={`text-[9px] uppercase font-bold tracking-tight px-1.5 py-0.5 rounded cursor-pointer ${
                lang === "eng" ? "bg-orange-500 text-white" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Small horizontal pills filters category */}
        <div className="flex items-center gap-1 pb-1 overflow-x-auto no-scrollbar scroll-smooth z-10 relative">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-[10px] font-bold py-1 px-3.5 rounded-full shrink-0 border transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "bg-amber-600 text-white border-amber-650 shadow-sm"
                  : "bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Active Shloka Content Window */}
      {filteredShlokas.length > 0 ? (
        <div 
          id="shloka-verse-window" 
          className="bg-stone-50/75 border border-amber-50 rounded-2xl p-5 min-h-[220px] flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
        >
          {/* Subtle floral frame corners */}
          <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-amber-300/40" />
          <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-amber-300/40" />
          <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-amber-300/40" />
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-amber-300/40" />

          <div className="text-center z-10 flex flex-col items-center">
            {/* Category and Pronunciation Row */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] bg-orange-100/55 rounded-full px-2.5 py-0.5 text-orange-850 font-bold tracking-wide uppercase">
                {isHindi ? activeShloka.categoryHi : activeShloka.category}
              </span>
              <button
                onClick={handlePronounce}
                disabled={isPronouncing}
                className={`p-1.5 rounded-full bg-white border border-stone-100 text-orange-600 hover:text-orange-700 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer ${
                  isPronouncing ? "animate-pulse border-orange-200 text-orange-500 bg-orange-50/50" : ""
                }`}
                title={isHindi ? "पवित्र मंत्र का पावन उच्चारण सुनें" : "Hear recitation voice"}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Title */}
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest font-mono mb-3">
              {lang === "hin" ? activeShloka.titleSanskrit : activeShloka.titleEnglish}
            </h4>

            {/* Sacred Devnagari Verse */}
            <p className="text-lg md:text-xl font-serif text-stone-850 font-extrabold leading-relaxed text-center whitespace-pre-line px-1 mb-2 tracking-wide drop-shadow-sm select-text select-all">
              {activeShloka.verse}
            </p>

            {/* Roman Transliteration for english users */}
            <p className="text-[11px] italic text-amber-900/60 font-medium text-center max-w-md mb-4 select-text">
              {activeShloka.transliteration}
            </p>

            {/* Translation text box */}
            <div className="w-full relative px-2 mb-2">
              <p className="text-stone-605 text-xs text-stone-600 leading-relaxed font-sans max-w-xl mx-auto select-text">
                "{lang === "hin" ? activeShloka.translationHin : activeShloka.translationEng}"
              </p>
            </div>

            {/* Significance or Benefit note */}
            {expanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full border-t border-stone-200/50 pt-3 mt-2 text-left"
              >
                <p className="text-[11px] text-stone-550 leading-relaxed">
                  <span className="font-extrabold text-amber-700 uppercase tracking-wide">
                    {isHindi ? "दिव्य माहात्म्य:" : "Divine Benefit:"}
                  </span>{" "}
                  {isHindi ? activeShloka.significanceHi : activeShloka.significance}
                </p>
              </motion.div>
            )}
          </div>

          {/* Controls and navigation row inside verse card */}
          <div className="flex items-center justify-between border-t border-stone-200/40 pt-3 mt-4">
            <button
              onClick={handlePrev}
              className="p-1 px-2 hover:bg-white border border-transparent hover:border-stone-100 rounded-lg text-stone-500 hover:text-stone-700 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> {isHindi ? "पिछला श्लोक" : "Prev"}
            </button>

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] font-bold uppercase text-stone-400 hover:text-amber-800 tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
            >
              {expanded ? (
                <>
                  <Minimize2 className="w-3 h-3" /> {isHindi ? "माहात्म्य छुपाएं" : "Hide Significance"}
                </>
              ) : (
                <>
                  <Maximize2 className="w-3 h-3" /> {isHindi ? "आध्यात्मिक माहात्म्य" : "Spiritual Benefit"}
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-1 px-2 hover:bg-white border border-transparent hover:border-stone-100 rounded-lg text-stone-500 hover:text-stone-700 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {isHindi ? "अगला श्लोक" : "Next"} <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        <div className="bg-stone-50 border border-amber-50 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
          <BookOpen className="w-8 h-8 text-stone-300 mb-2" />
          <p className="text-xs text-stone-400">
            {isHindi ? "इस श्रेणी में कोई श्लोक उपलब्ध नहीं है।" : "No verses available matching filter."}
          </p>
        </div>
      )}

      {/* Devotional Virtual Offering Tray */}
      <div id="virtual-altar-tray" className="mt-5 border-t border-orange-100/40 pt-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-stone-400 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: "18s" }} />
            {isHindi ? "मंदिर वेदी अर्पण" : "Interactive Altar offerings"}
          </span>
          {flowersOfferedCount > 0 && (
            <span className="text-[10px] text-amber-800 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full select-none">
              🌸 {flowersOfferedCount} {isHindi ? "पुष्प अर्पित किए" : "flowers offered"}
            </span>
          )}
        </div>

        {/* 3 Interactive Offering Keys */}
        <div className="grid grid-cols-3 gap-3">
          
          {/* Button 1: Pushpanjali (Flower shower) */}
          <button
            onClick={handleOfferFlowers}
            className="group flex flex-col items-center justify-center bg-white border border-rose-100 p-2.5 rounded-xl text-center hover:bg-rose-50/50 hover:border-rose-300 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <div className="text-xl group-hover:scale-125 transition-transform duration-300">🌸</div>
            <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-tight mt-1.5 font-sans">
              {isHindi ? "पुष्पांजलि" : "Flowers"}
            </span>
            <span className="text-[8px] text-rose-400 font-medium">{isHindi ? "पुष्पम" : "Pushpam"}</span>
          </button>

          {/* Button 2: Light Diya */}
          <button
            onClick={handleToggleDiya}
            className={`group flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all shadow-sm active:scale-95 cursor-pointer border ${
              diyaLit 
                ? "bg-amber-50 border-amber-300 text-amber-900 shadow-amber-50" 
                : "bg-white border-amber-100 hover:bg-amber-50/40 hover:border-amber-250"
            }`}
          >
            {diyaLit ? (
              <div className="relative">
                <Flame className="w-5 h-5 text-orange-500 fill-amber-300 animate-pulse" />
                <span className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-35 animate-ping" />
              </div>
            ) : (
              <Flame className="w-5 h-5 text-stone-400 group-hover:text-orange-400 transition-colors" />
            )}
            <span className="text-[10px] font-extrabold text-amber-850 uppercase tracking-tight mt-1.5 font-sans">
              {diyaLit ? (isHindi ? "दीपक प्रज्ज्वलित" : "Diya Bright") : (isHindi ? "दीपक जलाएं" : "Light Diya")}
            </span>
            <span className="text-[8px] text-amber-500/60 font-medium font-sans">{isHindi ? "दीपम" : "Deepam"}</span>
          </button>

          {/* Button 3: Sweet Incense (Dhupa) */}
          <button
            onClick={handleToggleIncense}
            className={`group flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all shadow-sm active:scale-95 cursor-pointer border ${
              incenseBurning 
                ? "bg-purple-50 border-purple-200 text-purple-900" 
                : "bg-white border-purple-100 hover:bg-purple-50/20 hover:border-purple-200"
            }`}
          >
            {incenseBurning ? (
              <div className="relative flex flex-col items-center h-5 justify-center">
                {/* Waving smoke simulation line */}
                <motion.div
                  animate={{ 
                    y: [-4, -14], 
                    x: [-3, 3, -2, 2], 
                    opacity: [0, 0.8, 0],
                    scale: [0.8, 1.2, 0.7] 
                  }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="w-1 bg-stone-300 rounded-lg absolute h-3 top-0"
                />
                <Wind className="w-4 h-4 text-purple-500" />
              </div>
            ) : (
              <Wind className="w-5 h-5 text-stone-400 group-hover:text-purple-400 transition-colors" />
            )}
            <span className="text-[10px] font-extrabold text-purple-850 uppercase tracking-tight mt-1.5 font-sans">
              {incenseBurning ? (isHindi ? "धूप प्रज्ज्वलित" : "Incense On") : (isHindi ? "धूप जलाएं" : "Burn Incense")}
            </span>
            <span className="text-[8px] text-purple-400/60 font-medium font-sans">{isHindi ? "धूपम" : "Dhupam"}</span>
          </button>

        </div>
      </div>

    </div>
  );
};
