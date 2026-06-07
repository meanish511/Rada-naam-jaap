/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "../utils/translationHelper";
import { 
  Heart, 
  Sparkles, 
  Volume2, 
  Newspaper, 
  Flame, 
  BookOpen, 
  Compass, 
  Calendar,
  Share2,
  ChevronRight,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { soundEngine } from "../utils/audio";

interface UpadeshData {
  id: string;
  hindi: string;
  english: string;
  topic: string;
}

// 12 Authentic and powerful teachings of Pujya Premanand Maharaj Ji centering on Radha Naam, pure character, and Vraja Bhakti
const PREMANAND_UPADESH: UpadeshData[] = [
  {
    id: "upadesh-1",
    topic: "नाम जप की महिमा (Glory of Naam)",
    hindi: "तुम चाहे कितने भी बड़े पापी क्यों न हो, यदि तुमने जीभ से 'राधा-राधा' कहना शुरू कर दिया, तो राधा रानी तुम्हें अपना लेंगी और सारे पाप भस्म हो जाएंगे।",
    english: "No matter how much of a sinner you might think you are, if you begin uttering 'Radha Radha' with your tongue, Sri Radha Rani will instantly embrace you as Her own, and all karmas will turn to ashes."
  },
  {
    id: "upadesh-2",
    topic: "चरित्र की पवित्रता (Purity of Character)",
    hindi: "अपने चरित्र को गिरने मत देना। जिस पुरुष या स्त्री का चरित्र पवित्र है, उसके हृदय में साक्षात् भगवान विराजमान रहते हैं।",
    english: "Never let your moral character fall. Within the pure heart of a person possessing pristine character, the Supreme Lord resides directly."
  },
  {
    id: "upadesh-3",
    topic: "क्रोध पर विजय (Overcoming Anger)",
    hindi: "कोई तुम्हें गाली दे, बुरा कहे, तो तुम चुपचाप मुस्कुराकर 'राधा-राधा' बोलो। उसका अपमान उसी के पास रह जाएगा और तुम्हें दिव्य शान्ति मिलेगी।",
    english: "If someone abuses you or speaks ill, simply remain silent, smile, and chant 'Radha Radha'. Their insult remains with them, and you will receive divine tranquility."
  },
  {
    id: "upadesh-4",
    topic: "निशकाम सेवा (Selfless Service)",
    hindi: "संसार से सुख की इच्छा करना ही सारे दुखों की जड़ है। केवल भगवान को रिझाने के लिए कर्म करो, किसी से प्रशंसा की उम्मीद मत रखो।",
    english: "Desiring happiness from this temporary material world is the root of all miseries. Perform your duties solely to please the Divine, harboring no expectations for praise."
  },
  {
    id: "upadesh-5",
    topic: "सच्चा सुख (True Happiness)",
    hindi: "सच्चा सुख महलों में या धन में नहीं है। वह तो यमुना किनारे बैठकर, तुलसी माला हाथ में लेकर 'राधा' नाम पुकारने में है।",
    english: "True happiness is found neither in grand palaces nor in massive wealth. It is found sitting on the bank of Yamuna, holding Tulsi beads, and crying out 'Radha'."
  },
  {
    id: "upadesh-6",
    topic: "संतों की कृपा (Mercy of Saints)",
    hindi: "संत कभी किसी का बुरा नहीं चाह सकते। उनके कड़वे वचन भी हमारे संचित पापों को धोकर हमें दिव्य प्रेम पथ पर चलाने के लिए दवा का काम करते हैं।",
    english: "A true saint can never desire ill for anyone. Even their sharp corrections function as medicine to wash our accumulated flaws, pointing us toward divine love."
  },
  {
    id: "upadesh-7",
    topic: "चिंता का त्याग (Releasing Anxiety)",
    hindi: "जब तुमने अपना भार राधा रानी के चरणों में सौंप दिया, तो अब चिंता कैसी? जो होगा, वह उनकी इच्छा से परम कल्याणकारी ही होगा।",
    english: "Since you have surrendered your entire burden at the lotus feet of Sri Radha, why worry anymore? Whatever unfolds, happens by Her grace, and will naturally lead to your spiritual evolution."
  },
  {
    id: "upadesh-8",
    topic: "माता-पिता की सेवा (Revering Parents)",
    hindi: "यदि तुम अपने माता-पिता को रुलाकर भगवान की पूजा कर रहे हो, तो वह पूजा कभी स्वीकार नहीं होगी। माता-पिता की सेवा ही प्रथम धर्म है।",
    english: "If you worship the Lord while making your parents weep, that worship will never be accepted. Loving and serving your parents is your very first spiritual duty."
  },
  {
    id: "upadesh-9",
    topic: "वृन्दावन वास (Vrindavan Consciousness)",
    hindi: "वृन्दावन का अर्थ केवल भौगोलिक स्थान नहीं है। जहाँ भी 'राधा राधा' का कीर्तन और परम दया का भाव है, वहीं वृन्दावन प्रकट हो जाता है।",
    english: "Vrindavan is not simply a geographical location on a map. Wherever the loving chant of 'Radha Radha' and deep compassion reside, Vrindavan manifests right there."
  },
  {
    id: "upadesh-10",
    topic: "जगत कल्याण (Universal Wellness)",
    hindi: "सबके कल्याण की प्रार्थना करो। जब तुम दूसरों के लिए मंगल कामना करते हो, तो तुम्हारे भीतर का कचरा अपने आप साफ़ हो जाता है।",
    english: "Pray for the welfare of all living beings. When you genuinely wish well for others, all internal mental impurities dissolve automatically."
  }
];

// Spiritual News Bulletins (dynamic updates about Vrindavan, holy festivals, and peace guidance)
interface SpiritualNews {
  title: string;
  category: "Festival" | "Live Darshan" | "Satsang Update" | "Vrindavan Dham";
  time: string;
  contentHin: string;
  contentEng: string;
}

const SPIRITUAL_NEWS_POOL: SpiritualNews[] = [
  {
    title: "Upcoming Ekadashi Alert",
    category: "Festival",
    time: "Next 48 Hours",
    contentHin: "निर्जला एकादशी की पवित्र तिथियां घोषित! वृन्दावन में भव्य पंचकोसी परिक्रमा और पवित्र यमुना स्नान की तैयारियां पूरी।",
    contentEng: "Nirjala Ekadashi fasting protocols announced! Massive preparations for holy Yamuna bath and Panchakosi Parikrama in Vrindavan."
  },
  {
    title: "Barsana Shriji Temple Darshan Hours",
    category: "Live Darshan",
    time: "Today Active",
    contentHin: "वर्षाना श्री लाडली लाल मन्दिर में नवीन ग्रीष्मकालीन दर्शन समय लागू। दोपहर १२ से ४ मन्दिर पट बन्द रहेंगे, आरती शाम ७ बजे।",
    contentEng: "New Summer Darshan guidelines initiated at Shriji Temple Barsana. Altar closed 12 PM - 4 PM. Maha-Evening sandhya arati starts at 7:00 PM."
  },
  {
    title: "Chariot Festival (Ratha Yatra) Vrindavan",
    category: "Festival",
    time: "Upcoming Event",
    contentHin: "वृन्दावन रमण रेती से इस्कॉन मन्दिर तक भगवान जगन्नाथ की भव्य रथयात्रा उत्सव हेतु फूलों की विशेष सजावट शुरू।",
    contentEng: "Special floral decorations set up for the upcoming grand Ratha Yatra from Raman Reti to the Krishna Balaram Temple (ISKCON)."
  },
  {
    title: "Yavat forest preservation project starts",
    category: "Vrindavan Dham",
    time: "Active",
    contentHin: "श्री राधा के पैतृक गृह स्थल यावट के प्राचीन तपोवन और सघन लताओं के संरक्षण हेतु स्थानीय संतों द्वारा सामूहिक वृक्षारोपण आरम्भ।",
    contentEng: "Local ashram saints coordinate a major tree plantation project to protect ancient cooling groves of Yavat forest."
  },
  {
    title: "Daily Satsang by Premanand Ji Maharaj",
    category: "Satsang Update",
    time: "3:00 AM Daily",
    contentHin: "वृन्दावन 'श्री हित राधा केलि कुंज' पर पूज्य महाराज श्री का प्रातः कालीन सुलभ दर्शन एवं दिव्य एकांतिक वार्तालाप सत्संग चल रहा है।",
    contentEng: "Pujya Premanand Ji's dynamic daily morning satsang and question-response assemblies actively running at Shri Hit Radha Keli Kunj, Vrindavan."
  }
];

interface PremanandVaniProps {
  language?: Language;
}

export const PremanandVani: React.FC<PremanandVaniProps> = ({ language = "hi" }) => {
  const [lang, setLang] = useState<"hin" | "eng">(language === "hi" ? "hin" : "eng");

  useEffect(() => {
    setLang(language === "hi" ? "hin" : "eng");
  }, [language]);
  const [upadeshIndex, setUpadeshIndex] = useState(0);
  const [isPronouncing, setIsPronouncing] = useState(false);
  const [newsAlertIndex, setNewsAlertIndex] = useState(0);

  // Derive "Daily" quote & news based on the day of the year to make it perfectly dynamic
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );

  // Automatically fetch static index based on day hash (remains same for the whole day, but changes daily!)
  const dailyUpadesh = useMemo(() => {
    const idx = (dayOfYear + upadeshIndex) % PREMANAND_UPADESH.length;
    return PREMANAND_UPADESH[idx];
  }, [dayOfYear, upadeshIndex]);

  const dailyNews = useMemo(() => {
    const idx = (dayOfYear + newsAlertIndex) % SPIRITUAL_NEWS_POOL.length;
    return SPIRITUAL_NEWS_POOL[idx];
  }, [dayOfYear, newsAlertIndex]);

  const handleNextUpadesh = () => {
    setUpadeshIndex((prev) => (prev + 1) % PREMANAND_UPADESH.length);
    soundEngine.playChime(0.15);
  };

  const handleNextNews = () => {
    setNewsAlertIndex((prev) => (prev + 1) % SPIRITUAL_NEWS_POOL.length);
    soundEngine.playChime(0.2);
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    setIsPronouncing(true);

    window.speechSynthesis.cancel();
    
    // Choose Hindi voice for Maharaj Ji's direct quotes
    const textToSpeak = lang === "hin" ? dailyUpadesh.hindi : dailyUpadesh.english;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === "hin" ? "hi-IN" : "en-IN";
    utterance.rate = 0.8; // beautiful serene discourse speed
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPronouncing(false);
    utterance.onerror = () => setIsPronouncing(false);

    window.speechSynthesis.speak(utterance);
    soundEngine.playTempleBell(0.15);
  };

  return (
    <div 
      id="premanand-vani-bulletin"
      className="w-full bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20 rounded-2xl p-5 md:p-6 border border-orange-100/60 shadow-sm relative overflow-hidden transition-all duration-300"
    >
      {/* Background Divine Silhouette ornament style */}
      <div className="absolute -bottom-10 -left-10 opacity-5 pointer-events-none select-none">
        <Compass className="w-48 h-48 text-orange-600 animate-spin" style={{ animationDuration: "35s" }} />
      </div>

      {/* Header and Language selection */}
      <div className="flex items-center justify-between gap-3 mb-5 border-b border-orange-100/30 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-orange-100/50 border border-orange-200/40 flex items-center justify-center text-orange-600 shrink-0">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest font-extrabold text-orange-700 font-mono block">
              Vrindavan Satsang Live
            </span>
            <h3 className="text-sm uppercase tracking-wider font-extrabold text-stone-850 font-serif">
              Premanand Ji Vāni & Spiritual News
            </h3>
          </div>
        </div>

        {/* Translation buttons */}
        <div className="flex items-center gap-1 bg-stone-50 border border-stone-200/40 rounded-xl px-1.5 py-1">
          <button
            onClick={() => setLang("hin")}
            className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded ${
              lang === "hin" ? "bg-orange-500 text-white shadow-sm" : "text-stone-400 hover:text-stone-700"
            }`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => setLang("eng")}
            className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded ${
              lang === "eng" ? "bg-orange-500 text-white shadow-sm" : "text-stone-400 hover:text-stone-700"
            }`}
          >
            Eng
          </button>
        </div>
      </div>

      {/* Dual Layout Grid: Left Upadesh, Right Live Spiritual News */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left component: Premanand Ji Maharaj Vani Quote card */}
        <div className="flex flex-col justify-between bg-gradient-to-tr from-amber-500/5 to-orange-500/5 border border-orange-200/40 rounded-xl p-4 md:p-5 relative min-h-[220px]">
          
          <div className="absolute top-3 right-3 text-[10px] text-orange-600 font-bold bg-amber-100/50 rounded-full px-2 py-0.5 flex items-center gap-1 select-none">
            <UserCheck className="w-3 h-3 text-orange-500" /> Premanand Maharaj Ji
          </div>

          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-stone-400 font-mono block mb-2">
              • Upadesh Sūtra: {dailyUpadesh.topic}
            </span>

            {/* Teaching Text quote */}
            <p className="text-sm md:text-15px font-serif leading-relaxed text-stone-850 font-extrabold tracking-wide mb-4 whitespace-normal select-text">
              "{lang === "hin" ? dailyUpadesh.hindi : dailyUpadesh.english}"
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between border-t border-orange-100/40 pt-3">
            {/* Listen Button */}
            <button
              onClick={handleSpeech}
              disabled={isPronouncing}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                isPronouncing
                  ? "bg-orange-500 text-white border-orange-650 animate-pulse"
                  : "text-orange-700 bg-white border-orange-100 hover:bg-orange-50/50"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              {isPronouncing ? "Discourse playing..." : "Listen Maharaj Ji's Vāni"}
            </button>

            {/* Next Teaching */}
            <button
              onClick={handleNextUpadesh}
              className="text-[10px] tracking-wider uppercase font-extrabold text-stone-400 hover:text-orange-700 flex items-center gap-0.5 transition-all"
            >
              Next Teachings <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Right component: Spiritual News Bulletin Board */}
        <div className="flex flex-col justify-between bg-white border border-stone-200/60 rounded-xl p-4 md:p-5 min-h-[220px]">
          
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-orange-600 animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 font-mono">
                  Weekly Vrindavan Digest
                </span>
              </div>
              <span className="text-[9px] font-extrabold font-mono text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full select-none">
                {dailyNews.time}
              </span>
            </div>

            <div className="mb-4">
              <span className="text-[9px] bg-stone-100 border border-stone-200/50 rounded px-1.5 py-0.5 text-stone-500 uppercase tracking-wide font-extrabold font-sans">
                {dailyNews.category}
              </span>
              <h4 className="text-sm font-sans font-black text-stone-850 mt-1.5 font-extrabold leading-tight tracking-tight">
                {dailyNews.title}
              </h4>
              <p className="text-xs text-stone-605 leading-relaxed text-stone-600 mt-1.5 select-text">
                {lang === "hin" ? dailyNews.contentHin : dailyNews.contentEng}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between border-t border-stone-100 mt-2 pt-3">
            <span className="text-[9px] font-mono font-bold text-stone-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Updated Daily
            </span>

            <button
              onClick={handleNextNews}
              className="text-[10px] tracking-wider uppercase font-extrabold text-stone-400 hover:text-stone-700 flex items-center gap-0.5 transition-all"
            >
              Next Bulletin <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
