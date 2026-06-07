/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { Clock, Star, Sunrise, Sunset, Moon, Sparkles, Bell } from "lucide-react";
import { soundEngine } from "../utils/audio";
import { Language } from "../utils/translationHelper";

interface LilaPeriod {
  nameSanskrit: string;
  nameTranslit: string;
  nameTranslitHi: string;
  startHour: number; // 24h format decimal (e.g. 3.75 for 3:45)
  endHour: number;
  timeRange: string;
  timeRangeHi: string;
  colors: string; // Tailwind gradient classes
  description: string;
  descriptionHi: string;
  spiritQuote: string;
  spiritQuoteHi: string;
}

// Famous 8-fold daily divine division of Vrindavan's pastimes
const ASHTAYAMA_DIVISIONS: LilaPeriod[] = [
  {
    nameSanskrit: "निशान्त लीला",
    nameTranslit: "Niśānta Līlā (Awakening)",
    nameTranslitHi: "निशान्त लीला (जागरण एवं मंगला)",
    startHour: 3.75, // 03:45 AM
    endHour: 6.0,  // 06:00 AM
    timeRange: "03:45 AM - 06:00 AM",
    timeRangeHi: "प्रातः ०३:४५ - प्रातः ०६:००",
    colors: "from-indigo-900 via-purple-900 to-orange-900/50 text-orange-200 border-indigo-850",
    description: "The dawn awakening in the secret forest bowers. High-frequency time for spiritual chanting (Brahma Muhurta).",
    descriptionHi: "गुप्त निकुंजों में प्रातःकालीन जागरण। ब्रह्म मुहूर्त में नाम जप साधना के लिए सर्वोत्तम समय।",
    spiritQuote: "Awakening Radha-Govinda with soft morning prayers & melodic birds singing.",
    spiritQuoteHi: "मृदु प्रभाती प्रार्थनाओं और पक्षियों के मधुर कलरव से श्री राधा-गोविंद को जगाना।"
  },
  {
    nameSanskrit: "प्रातः लीला",
    nameTranslit: "Prātaḥ Līlā (Morning Devotions)",
    nameTranslitHi: "प्रातः लीला (श्रृंगार व सेवा)",
    startHour: 6.0,   // 06:00 AM
    endHour: 8.4,   // 08:24 AM
    timeRange: "06:00 AM - 08:24 AM",
    timeRangeHi: "प्रातः ०६:०० - प्रातः ०८:२४",
    colors: "from-amber-500 via-orange-400 to-yellow-105 text-stone-900 border-amber-300",
    description: "Morning baths, glowing decoration, and cows departing to the sweet meadows under golden sunshine.",
    descriptionHi: "प्रातःकाल स्नान, मनमोहक दिव्य श्रृंगार, और स्वर्णिम धूप में गौ माता का चरागाह गमन।",
    spiritQuote: "Sandalwood applications, decoration with forest flowers, and morning arati offerings.",
    spiritQuoteHi: "चन्दन लेपन, वन पुष्प श्रृंगार और दिव्य मंगला/प्रातः आरती समर्पण।"
  },
  {
    nameSanskrit: "पूर्वाह्न लीला",
    nameTranslit: "Pūrvāhna Līlā (Pre-Noon)",
    nameTranslitHi: "पूर्वाह्न लीला (गोचारण व रसोई)",
    startHour: 8.4,   // 08:24 AM
    endHour: 10.8,  // 10:48 AM
    timeRange: "08:24 AM - 10:48 AM",
    timeRangeHi: "प्रातः ०८:२४ - प्रातः १०:४८",
    colors: "from-sky-300 via-amber-100 to-orange-50 text-stone-855 border-orange-200/50",
    description: "Preparation of pristine sweet recipes at Yavat, while anticipation of meeting builds near Radha Kund.",
    descriptionHi: "जावट में श्री राधा रानी द्वारा दिव्य व्यंजनों का निर्माण और श्री राधा कुंड पर मिलन की आतुरता।",
    spiritQuote: "Radha cooks celestial delicacies with ultimate affection for Sri Krishna's pleasure.",
    spiritQuoteHi: "श्री कृष्ण की प्रसन्नता के लिए श्री प्रिया जी द्वारा असीम स्नेह से पकवान बनाना।"
  },
  {
    nameSanskrit: "मध्याह्न लीला",
    nameTranslit: "Madhyāhna Līlā (Midday Ecstasy)",
    nameTranslitHi: "मध्याह्न लीला (निकुंज विलास व विश्राम)",
    startHour: 10.8,  // 10:48 AM
    endHour: 15.6,  // 03:36 PM
    timeRange: "10:48 AM - 03:36 PM",
    timeRangeHi: "प्रातः १०:४८ - दोपहर ०३:३६",
    colors: "from-emerald-800/80 via-teal-900 to-amber-50/70 text-emerald-950 border-emerald-350",
    description: "Splendid assembly in the cool forest shades. Water-splashing pastimes, flower swings, and deep rest.",
    descriptionHi: "शीतल घने कुंजों में जल-क्रीड़ा, पुष्प झूला, हास्य-परिहास एवं मध्यान विश्राम।",
    spiritQuote: "Gathering at the lotus-filled Radha-Kunda for sweet playful conversations and swings.",
    spiritQuoteHi: "कमल पुष्पों से सजे श्री राधा-कुंड तट पर सखियों संग दिव्य विलास।"
  },
  {
    nameSanskrit: "अपराह्न लीला",
    nameTranslit: "Aparāhna Līlā (Afternoon Return)",
    nameTranslitHi: "अपराह्न लीला (गोधूलि वेला)",
    startHour: 15.6,  // 03:36 PM
    endHour: 18.0,  // 06:00 PM
    timeRange: "03:36 PM - 06:00 PM",
    timeRangeHi: "दोपहर ०३:३६ - सायं ०६:००",
    colors: "from-orange-400 via-amber-200 to-stone-50 text-amber-950 border-orange-255",
    description: "Krishna's return from pastures with the cows, kicking up golden holy dust (Godhuli Vela) as Radha watches.",
    descriptionHi: "कन्हैया का गौ माता संग वन से गृह की ओर प्रत्यावर्तन। खुरों से उड़ती स्वर्णिम गोधूलि रज।",
    spiritQuote: "Waiting on the high balcony of Yavat, eager to catch a glance of Krishna's peacock feather.",
    spiritQuoteHi: "अटारी पर बैठकर कन्हैया के मयूर पंख और बंसी की मधुर तान की प्रतीक्षा करना।"
  },
  {
    nameSanskrit: "सायं सन्ध्या लीला",
    nameTranslit: "Sāyaṁ Sandhyā Līlā (Twilight)",
    nameTranslitHi: "सायं संध्या लीला (आरती व दीपदान)",
    startHour: 18.0,  // 06:00 PM
    endHour: 20.4,  // 08:24 PM
    timeRange: "06:00 PM - 08:24 PM",
    timeRangeHi: "सायं ०६:०० - रात्रि ०८:२४",
    colors: "from-pink-600 via-purple-900 to-indigo-950 text-pink-100 border-purple-800/60",
    description: "Grand twilight camphor lamp arati in all Vrindavan temples. Lighting deep clay lamps under Tulsi plants.",
    descriptionHi: "श्री वृन्दावन के सभी देवालयों में भव्य संध्या आरती। तुलसी जी के समीप दीपदान।",
    spiritQuote: "Temples ringing with bells and conch shells while the supreme couple sits on their throne.",
    spiritQuoteHi: "शंख, घंटे और मृदंग की मधुर ध्वनि के बीच युगल सरकार का दर्शन।"
  },
  {
    nameSanskrit: "प्रदोष लीला",
    nameTranslit: "Pradoṣa Līlā (Evening Assembly)",
    nameTranslitHi: "प्रदोष लीला (गृह मिलाप व विश्राम)",
    startHour: 20.4,  // 08:24 PM
    endHour: 22.8,  // 10:48 PM
    timeRange: "08:24 PM - 10:48 PM",
    timeRangeHi: "रात्रि ०८:२४ - रात्रि १०:४८",
    colors: "from-indigo-950 via-slate-900 to-stone-900 text-indigo-200 border-indigo-900",
    description: "Feasting on warm milk, listening to sweet flute recitals and storytelling under the moonlight canopy.",
    descriptionHi: "शीतल चांदनी में मधुर वंशी वादन श्रवण, रात्रि दुग्ध पान एवं लीला चिंतन।",
    spiritQuote: "Deep heart-to-heart devotional talks, gathering of loving companions to prepare pastimes.",
    spiritQuoteHi: "प्रिय सखाओं और सखियों संग अंतरंग वार्तालाप एवं विश्राम की तैयारी।"
  },
  {
    nameSanskrit: "निशीथ लीला",
    nameTranslit: "Niśītha Līlā (Midnight Rasa)",
    nameTranslitHi: "निशीथ लीला (दिव्य महारास)",
    startHour: 22.8,  // 10:48 PM
    endHour: 24.0,   // Midnight to 03:45 AM (falls back here)
    timeRange: "10:48 PM - 03:45 AM",
    timeRangeHi: "रात्रि १०:४८ - प्रातः ०३:४५",
    colors: "from-violet-950 via-stone-900 to-[#0e0a07] text-[#fed7aa] border-orange-950",
    description: "The ultimate confidential Rasa dance inside the illuminated forest bowers on the banks of Yamuna.",
    descriptionHi: "श्री यमुना तट पर निकुंज वन की दिव्य चांदनी में महारास और निकुंज विलास।",
    spiritQuote: "The peak of pure divine ecstasy, resting in the absolute silent garden bowers of Goloka.",
    spiritQuoteHi: "परम दिव्य रस की पराकाष्ठा, गोलोक वृन्दावन निकुंज में शयन सुख।"
  }
];

interface AshtayamaClockProps {
  language?: Language;
}

export const AshtayamaClock: React.FC<AshtayamaClockProps> = ({ language = "hi" }) => {
  const isHindi = language === "hi";
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // 30s checks
    return () => clearInterval(timer);
  }, []);

  // Compute active lila period based on hours of current time
  const currentPeriod = useMemo((): LilaPeriod => {
    const hours = currentTime.getHours() + currentTime.getMinutes() / 60;
    
    // Exception: 12:00 AM up to 3:45 AM belongs to Nishitha Rasa Lila (category 8)
    if (hours >= 0 && hours < 3.75) {
      return ASHTAYAMA_DIVISIONS[7];
    }

    // Standard interval lookup
    const found = ASHTAYAMA_DIVISIONS.find(
      (p) => hours >= p.startHour && hours < p.endHour
    );

    return found || ASHTAYAMA_DIVISIONS[7];
  }, [currentTime]);

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const getPhaseIcon = (id: string) => {
    if (id.includes("Awakening")) return <Sunrise className="w-5 h-5 text-orange-400" />;
    if (id.includes("Morning")) return <Star className="w-5 h-5 text-yellow-400 animate-pulse" />;
    if (id.includes("Noon")) return <Clock className="w-5 h-5 text-sky-400" />;
    if (id.includes("Twilight")) return <Sunset className="w-5 h-5 text-pink-400" />;
    return <Moon className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: "60s" }} />;
  };

  const handleSoundCheck = () => {
    soundEngine.playTempleBell(0.3);
  };

  return (
    <div
      id="ashtayama-lila-clock-box"
      className="w-full bg-white rounded-2xl p-5 border border-amber-100/60 shadow-sm transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-orange-600" />
          <h3 className="text-sm uppercase tracking-wider font-extrabold text-stone-700">
            {isHindi ? "अष्टयाम लीला घड़ी" : "Ashtayama Lila Watch"}
          </h3>
        </div>

        {/* Current system clock badge */}
        <div className="px-2.5 py-1 bg-stone-100 border border-stone-200/50 rounded-lg text-xs font-mono font-bold text-stone-700 flex items-center gap-1">
          <Star className="w-3 h-3 text-orange-500 animate-spin" style={{ animationDuration: "8s" }} /> {timeString}
        </div>
      </div>

      {/* Hero Display Panel matching the current lila color mood */}
      <div
        className={`w-full p-4 rounded-xl bg-gradient-to-br ${currentPeriod.colors} border shadow-inner transition-all duration-500 flex flex-col justify-between min-h-[140px]`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-extrabold opacity-75 block">
              {isHindi ? "सक्रिय लीला काल:" : "Active Vrindavan Period:"}
            </span>
            <div className="flex flex-wrap items-baseline gap-1.5 mt-0.5">
              <h4 className="text-2xl font-serif font-extrabold tracking-wide">
                {currentPeriod.nameSanskrit}
              </h4>
              <span className="text-xs opacity-80">
                ({isHindi ? currentPeriod.nameTranslitHi.split(" ")[1] : currentPeriod.nameTranslit.replace(/.*\((.*)\)/, "$1")})
              </span>
            </div>
            <p className="text-[10px] font-mono tracking-tight opacity-90 font-semibold mt-1">
              ⌛ {isHindi ? currentPeriod.timeRangeHi : currentPeriod.timeRange}
            </p>
          </div>

          <button
            onClick={handleSoundCheck}
            className="p-2 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 text-white transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer ring-1 ring-white/10"
            title={isHindi ? "मंदिर की घंटी" : "Aura Temple Bell"}
          >
            {getPhaseIcon(currentPeriod.nameTranslit)}
          </button>
        </div>

        {/* Meditation focus target description */}
        <div className="border-t border-white/10 pt-3 mt-3">
          <p className="text-xs leading-normal opacity-95 italic font-sans font-medium">
            "{isHindi ? currentPeriod.spiritQuoteHi : currentPeriod.spiritQuote}"
          </p>
          <p className="text-[11px] leading-relaxed opacity-75 font-sans mt-1">
            {isHindi ? currentPeriod.descriptionHi : currentPeriod.description}
          </p>
        </div>
      </div>

      {/* Traditional Timeline horizontal progress mapping */}
      <div className="grid grid-cols-8 gap-1.5 mt-4">
        {ASHTAYAMA_DIVISIONS.map((div, idx) => {
          const isActive = div.nameSanskrit === currentPeriod.nameSanskrit;
          return (
            <div
              key={div.nameSanskrit}
              className={`h-2 rounded-md transition-all duration-500 ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 ring-2 ring-orange-200"
                  : "bg-stone-100"
              }`}
              title={isHindi ? `${div.nameSanskrit} (${div.timeRangeHi})` : `${div.nameTranslit} (${div.timeRange})`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[8px] text-stone-400 mt-1 font-mono uppercase font-bold px-0.5">
        <span>०३:४५ AM</span>
        <span>{isHindi ? "मध्याह्न" : "Noon"}</span>
        <span>{isHindi ? "सायं संध्या" : "Saym Sandhya"}</span>
        <span>०३:४५ AM</span>
      </div>
    </div>
  );
};
