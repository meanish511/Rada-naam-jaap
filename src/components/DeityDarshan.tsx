import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Sparkles, 
  MapPin, 
  Flame, 
  BookOpen, 
  Compass, 
  Volume2, 
  Bell, 
  Music,
  ArrowRight,
  Eye,
  Flower2,
  Bookmark,
  Filter,
  CheckCircle2
} from "lucide-react";
import { soundEngine } from "../utils/audio";
import { Language } from "../utils/translationHelper";

// 7 Goswami Thakurs + 2 Beloved Principal Thakurs
const RADHA_RAMAN_IMAGE = "/src/assets/images/radha_raman_ji_1780798878903.png";
const BANKE_BIHARI_IMAGE = "/src/assets/images/banke_bihari_ji_1780798893320.png";
const RADHA_VALLABH_IMAGE = "/src/assets/images/radha_vallabh_ji_1780798908104.png";
const MADAN_MOHAN_IMAGE = "/src/assets/images/madan_mohan_ji_1780799208610.png";
const GOVIND_DEV_IMAGE = "/src/assets/images/govind_dev_ji_1780799223518.png";
const GOPINATH_IMAGE = "/src/assets/images/gopinath_ji_1780799238861.png";
const DAMODAR_IMAGE = "/src/assets/images/damodar_ji_1780799254796.png";
const SHYAMSUNDAR_IMAGE = "/src/assets/images/shyamsundar_ji_1780799268953.png";
const GOKULANANDA_IMAGE = "/src/assets/images/gokulananda_ji_1780799282807.png";

const TRANSLATIONS_DEITY = {
  hi: {
    titlePrefix: "दिव्य विग्रह साम्राज्य दर्शन",
    title: "वृन्दावन के दिव्य ठाकुरजी",
    titleSubtitle: "वृन्दावन के सप्त देवालयों के ७ मूल ठाकुरजी और सबसे अतिप्रिय लाडले विग्रहों का दिव्य एवं अलौकिक दर्शन मन्दिर सेवा सहित।",
    totalOfferings: "कुल निवेदित आराधना अर्पण सेवा:",
    times: "बार",
    focusReminder: "जाप करते समय भगवान के इस रसीले दिव्य स्वरूप पर ध्यान केन्द्रित करें।",
    soundBell: "मंदिर की पवित्र घंटी व शंख ध्वनि करें",
    received: "अर्पित सेवा संख्या:",
    chronicles: "🌸 श्री विग्रह प्राकट्य लीला और दिव्य इतिहास माहात्म्य",
    pranamTitle: "प्रणाम मन्त्र एवं दिव्य भावार्थ",
    meaningLabel: "भावार्थ:"
  },
  en: {
    titlePrefix: "HOLY SRI VIGRAHA SAMRAJYA",
    title: "Divine Thakurs of Vrindavan",
    titleSubtitle: "Visual Darshan of the 7 Original Goswami Thakurs and the most beloved deities of Sri Vrindavan Dham with interactive temple offerings.",
    totalOfferings: "Total Offerings Offered:",
    times: "Times",
    focusReminder: "Focus on this Divine form while chanting.",
    soundBell: "Sound Temple Bell Chime",
    received: "Received:",
    chronicles: "🌸 DHAM CHRONICLES & DEVOTIONAL ORIGIN",
    pranamTitle: "Pranam Mantra (प्रणाम मन्त्र)",
    meaningLabel: "Meaning:"
  }
};

interface DeityData {
  id: string;
  nameHin: string;
  nameEng: string;
  titleEng: string;
  titleHi: string;
  locationEng: string;
  locationHi: string;
  image: string;
  historyEng: string;
  historyHi: string;
  mantra: string;
  mantraMeaningEng: string;
  mantraMeaningHi: string;
  offeringIcon: "flower" | "diya" | "chamar" | "sweet";
  bgAccent: string;
  borderAccent: string;
  textAccent: string;
  category: "goswami" | "beloved";
}

const DEITIES_POOL: DeityData[] = [
  {
    id: "radha-raman",
    nameHin: "श्री राधा रमण लाल जी",
    nameEng: "Shri Radha Raman Dev Ji",
    titleEng: "The Self-Manifest Divine Sweetheart",
    titleHi: "स्वयं-प्रकट दिव्य प्राणप्रिय विग्रह",
    locationEng: "Shri Radha Raman Temple, Vrindavan Dham",
    locationHi: "श्री राधा रमण मंदिर, श्री वृन्दावन धाम",
    image: RADHA_RAMAN_IMAGE,
    historyEng: "Self-manifested from a sacred Damodara Shaligram Shila in 1542 AD to fulfill the yearning devotion of Sri Gopal Bhatta Goswami. Remarkably, he is one of the very few original deities of the Vrindavan Goswamis who never left the holy town of Vrindavan. His sweet facial expression changes throughout the day, shining with deep pure mercy.",
    historyHi: "श्री गोपाल भट्ट गोस्वामी जी की अनन्य साधना और तीव्र लालसा के कारण सन् १५४२ ई० में एक दिव्य दामोदर शालिग्राम शिला से स्वयं प्रकट हुए। वृन्दावन के गोस्वामी ठाकुरों में से ये एकमात्र ऐसे मूल विग्रह हैं जो कभी वृन्दावन छोड़कर सुदूर क्षेत्रों में नहीं गए। दिन में कई बार आपके मुखमंडल का अलौकिक श्वेत-श्याम सिंगार बदलता है।",
    mantra: "ॐ नमः श्री राधा रमणाय देवदेवाय सर्वज्ञाय सर्वलोकेश्वराय नमः",
    mantraMeaningEng: "I offer my humble salutations to the divine Lord Radharaman, the supreme Lord of lords, the all-knowing ruler of the entire cosmos.",
    mantraMeaningHi: "मैं परम रहस्यमयी दीप्ति वाले, सर्वज्ञ, समस्त ब्रह्मांड के स्वामी श्री राधारमण देव के चरणों में बारम्बार सादर प्रणाम करता हूँ।",
    offeringIcon: "flower",
    bgAccent: "from-amber-50 to-orange-50/60",
    borderAccent: "border-amber-200/50",
    textAccent: "text-amber-850",
    category: "goswami"
  },
  {
    id: "madan-mohan",
    nameHin: "श्री राधा मदन मोहन जी",
    nameEng: "Shri Radha Madan Mohan Ji",
    titleEng: "The Deity of Sambandha Jñana (Eternal Relationship)",
    titleHi: "सम्बन्ध ज्ञान के आदि अधिपति विग्रह",
    locationEng: "Madan Mohan Temple, Vrindavan Dham",
    locationHi: "श्री मदन मोहन मंदिर, श्री वृन्दावन धाम",
    image: MADAN_MOHAN_IMAGE,
    historyEng: "Established by Srila Sanatana Goswami. This historic Deity represents Sambandha-jñāna, our eternal relationship with the Supreme Lord. When the original deity was moved to Rajasthan during foreign invasions, a beloved Pratibhu-vigraha was established here in Vrindavan which radiates the identical sweet and solemn mercy.",
    historyHi: "श्रील सनातन गोस्वामी जी द्वारा स्थापित। यह ऐतिहासिक विग्रह हमारे भगवान के साथ शाश्वत संबंध (सम्बन्ध-ज्ञान) का प्रतिनिधित्व करता है। मुग़ल आक्रमण के समय मूल विग्रह राजस्थान ले जाया गया और यहाँ उनके प्रतिभू स्वरूप की प्राण-प्रतिष्ठा की गई।",
    mantra: "ॐ श्री राधा मदन मोहनाय नमः सर्वतापादिहन्त्रे नमः",
    mantraMeaningEng: "I bow to the beautiful Lord Madan Mohan, who infuses our hearts with sweet eternal relationships, destroys all material worries, and conquers Cupid himself.",
    mantraMeaningHi: "मैं कोटि-कन्दर्प-दर्प-हारी श्री मदन मोहन जी के चरणों में वंदन करता हूँ, जो हमारे हृदयों में भक्ति का संचार करते हैं और त्रितापों को हरते हैं।",
    offeringIcon: "diya",
    bgAccent: "from-orange-50 to-amber-50/60",
    borderAccent: "border-orange-200/50",
    textAccent: "text-orange-900",
    category: "goswami"
  },
  {
    id: "govind-dev",
    nameHin: "श्री राधा गोविंद देव जी",
    nameEng: "Shri Radha Govind Dev Ji",
    titleEng: "The Deity of Abhidheya (Active Divine Service)",
    titleHi: "अभिधेय ज्ञान (सक्रिय भक्ति सेवा) के स्वामी",
    locationEng: "Govindaji Temple, Vrindavan Dham",
    locationHi: "श्री गोविन्द देव मंदिर, श्री वृन्दावन धाम",
    image: GOVIND_DEV_IMAGE,
    historyEng: "Established by Srila Rupa Goswami in 1590 under the patronage of Raja Man Singh. Govinda Dev Ji is the Lord of our active devotional service (Abhidheya). His original grand red sandstone temple stands as an architectural and spiritual wonder of global heritage.",
    historyHi: "सन् १५९० में राजा मानसिंह के संरक्षण में महान वैष्णव आचार्य श्रील रूप गोस्वामी जी द्वारा प्रतिष्ठित। गोविन्द देवजी हमारी सक्रिय भक्ति सेवा (अभिधेय-तत्व) के अधिष्ठाता देव हैं। इनका गगनचुम्बी लाल बलुआ पत्थर का मंदिर वास्तुकला की एक नायाब मिसाल है।",
    mantra: "ॐ क्लीं कृष्णाय गोविन्दाय गोपीजनवल्लभाय स्वाहा",
    mantraMeaningEng: "I surrender to Govinda, the protector of cows and the life-breath of the damsels of Vraja, who establishes our loving actions.",
    mantraMeaningHi: "गौओं के रक्षक और ब्रज के गोपियों के प्राण-आधार श्री गोविन्द देवजी महाराज के चरणों में मैं पूर्ण आत्मसमर्पण करता हूँ।",
    offeringIcon: "chamar",
    bgAccent: "from-yellow-50 to-amber-50/60",
    borderAccent: "border-yellow-200/50",
    textAccent: "text-yellow-950",
    category: "goswami"
  },
  {
    id: "gopinath",
    nameHin: "श्री राधा गोपीनाथ जी",
    nameEng: "Shri Radha Gopinath Ji",
    titleEng: "The Deity of Prayojana (The Ultimate Goal of Love)",
    titleHi: "प्रयोजन (परम प्रेम-रस प्राप्ति) स्वरूप",
    locationEng: "Gopinath Temple, Vrindavan Dham",
    locationHi: "श्री गोपीनाथ मंदिर, श्री वृन्दावन धाम",
    image: GOPINATH_IMAGE,
    historyEng: "Discovered at Vansi Vat under the beloved banyan tree where Rasa Lila occurred, and lovingly established by Madhu Pandita Goswami. Represents the ultimate stage of love (Prayojana). His sweet posture and flute invite the soul to transcend material dualities and step into complete divine surrender.",
    historyHi: "श्री वंशीवट के निकट पावन वटवृक्ष के नीचे प्रकट हुए और श्री मधु पंडित गोस्वामी जी द्वारा सेवित। यह विग्रह जीव की साधना के अंतिम लक्ष्य यानी परम भगवद-प्रेम (प्रयोजन) को निर्देशित करता है।",
    mantra: "ॐ गोपीनाथाय नमः सर्वक्लेशहराय अच्युताय नमः",
    mantraMeaningEng: "My salutations to Gopinatha, the Lord of Gopis, who destroys all worldly suffering and remains ever infallible.",
    mantraMeaningHi: "भक्तों के समस्त सांसारिक क्लेशों को हरने वाले अच्युत स्वरूप श्री गोपीनाथ जी महाराज को कोटि-कोटि नमन।",
    offeringIcon: "sweet",
    bgAccent: "from-sky-50 to-blue-50/60",
    borderAccent: "border-blue-200/50",
    textAccent: "text-blue-900",
    category: "goswami"
  },
  {
    id: "radha-damodar",
    nameHin: "श्री राधा दामोदर जी",
    nameEng: "Shri Radha Damodar Ji",
    titleEng: "Guardian of Srila Prabhupada & Jiva Goswami's Bhajan",
    titleHi: "श्रील जीव गोस्वामी एवं प्रभुपाद जी की साधना स्थली",
    locationEng: "Radha Damodar Temple, Vrindavan Dham",
    locationHi: "श्री राधा दामोदर मंदिर, श्री वृन्दावन धाम",
    image: DAMODAR_IMAGE,
    historyEng: "Formed and hand-carved by Srila Rupa Goswami himself, who lovingly gifted Him to Srila Jiva Goswami. This temple is home to the Govardhan Shila displaying the footprint of Lord Krishna, gifted to Sanatana Goswami. It was also the home of Srila Prabhupada prior to starting the global Hare Krishna movement.",
    historyHi: "श्रील रूप गोस्वामी जी ने अपने हाथों से इस विग्रह को आकार दिया था और अपने प्रिय शिष्य श्रील जीव गोस्वामी जी को सेवा हेतु सौंपा था। यहाँ श्यामसुन्दर द्वारा सनातन गोस्वामीजी को दी गई गिरराज शिला मौजूद है। जगद्गुरु श्रील प्रभुपाद जी ने इसी मंदिर में भजन कुटीर में वर्षों तपस्या की थी।",
    mantra: "ॐ राधा दामोदराय विद्महे दामोदराय धीमहि तन्नो देवः प्रचोदयात्",
    mantraMeaningEng: "Let us meditate upon Sri Radha Damodara, the divine Lord bound with cords of love by His mother and devotees.",
    mantraMeaningHi: "प्रेम और भक्ति की डोर से बंधे हुए और माता यशोदा के वात्सल्य के पात्र श्री राधा दामोदर देव जी महाराज की हम प्रेमपूर्वक वंदना करते हैं।",
    offeringIcon: "flower",
    bgAccent: "from-rose-50 to-red-50/60",
    borderAccent: "border-rose-200/40",
    textAccent: "text-rose-900",
    category: "goswami"
  },
  {
    id: "radha-shyamsundar",
    nameHin: "श्री राधा श्यामुन्दर जी",
    nameEng: "Shri Radha Shyamsundar Ji",
    titleEng: "The Crown Jewel Manifested from Radharani's Heart",
    titleHi: "श्रीजी के करुणामई हृदय से आविर्भूत महामुकुट",
    locationEng: "Shri Radha Shyamsundar Temple, Vrindavan Dham",
    locationHi: "श्री राधा श्यामसुन्दर मंदिर, श्री वृन्दावन धाम",
    image: SHYAMSUNDAR_IMAGE,
    historyEng: "Uniquely materialized from Srimati Radharani's own heart and gifted directly to Sri Shyamananda Goswami. When Shyamananda found her lost anklet in the sacred groves of Seva Kunj, Radharani pressed this small, beautiful black deity into his hands. His beauty is considered incomparable.",
    historyHi: "यह अनूठा और अलौकिक विग्रह साक्षात् श्रीमती राधा रानी ने अपने हृदय से प्रकट कर श्री श्यामानंद गोस्वामी को उपहार में दिया था, जब उन्हें सेवाकुंज में श्रीजी का पवित्र नूपुर मिला था।",
    mantra: "श्री श्यामसुन्दर देव जू की जय, श्री श्यामानन्द चरणेभ्यो नमः",
    mantraMeaningEng: "Glory to the magnificent Lord Shyamsundar, and deep respects to the memory of saint Shyamananda Goswami.",
    mantraMeaningHi: "अनोखे और अति सुंदर श्यामसुन्दर देव जी महाराज की सर्वदा विजय हो, और उनके अनन्य भक्त श्यामानन्द जी के चरणों में सादर प्रणाम।",
    offeringIcon: "chamar",
    bgAccent: "from-teal-50 to-emerald-50/65",
    borderAccent: "border-teal-200/40",
    textAccent: "text-teal-950",
    category: "goswami"
  },
  {
    id: "radha-gokulananda",
    nameHin: "श्री राधा गोकुलानन्द जी",
    nameEng: "Shri Radha Gokulananda Ji",
    titleEng: "The Self-Manifest Deities of Sri Lokanatha Goswami",
    titleHi: "श्रील लोकनाथ गोस्वामी जी के आराध्य देव",
    locationEng: "Shri Radha Gokulananda Temple, Vrindavan Dham",
    locationHi: "श्री राधा गोकुलानन्द मंदिर, श्री वृन्दावन धाम",
    image: GOKULANANDA_IMAGE,
    historyEng: "Lovingly worshiped by Srila Lokanatha Goswami, the intimate associate of Chaitanya Mahaprabhu. The deity is historically unique as it consolidates several worshiped deities of other great Goswamis, including Sri Radha-Vinoda of Lokanatha Goswami and Vijay Govinda of Ganga Mata Goswamini.",
    historyHi: "चैतन्य महाप्रभु के परम सखा श्रील लोकनाथ गोस्वामीजी द्वारा सेवित। इस मंदिर में कई अनन्य आचार्यों के पावन विग्रह जैसे गंगामाता स्वामिनी जी का विजय गोविंद विग्रह भी विराजित हैं।",
    mantra: "ॐ गोकुला नन्दाय नमः श्रीकृष्णाय मदनगोपालाय विनीत नमः",
    mantraMeaningEng: "Salutations to Gokulananda, the ecstatic son of Gokula, who rewards all devotees with joyful spiritual nectar.",
    mantraMeaningHi: "गोकुल के परम आनंद स्वरूप, मदनगोपाल श्री कृष्ण भगवान के विनीत चरणों में सादर नमस्कार।",
    offeringIcon: "sweet",
    bgAccent: "from-indigo-50 to-violet-50/55",
    borderAccent: "border-indigo-200/40",
    textAccent: "text-indigo-950",
    category: "goswami"
  },
  {
    id: "banke-bihari",
    nameHin: "श्री बांके बिहारी लाल जी",
    nameEng: "Shri Banke Bihari Maharaj",
    titleEng: "The Heartbeat of Nidhivan & Vrindavan",
    titleHi: "श्री निधिवन राज के लाडले प्राणधन",
    locationEng: "Shri Banke Bihari Temple, Vrindavan Dham",
    locationHi: "श्री बांके बिहारी मंदिर, श्री वृन्दावन धाम",
    image: BANKE_BIHARI_IMAGE,
    historyEng: "Lovingly manifested from Nidhivan by Swami Haridas Ji, the master musician saint and guru of Tansen. Swami Haridas evoked the Divine Couple, Radha and Krishna, who merged into this singular captivating form of black marble to reside forever on earth. In his temple, curtains are pulled frequently so visitors don't lose consciousness under his hypnotic loving gaze.",
    historyHi: "संगीत सम्राट स्वामी हरिदास जी महाराज के अथाह प्रेमपूर्ण राग भजनों के प्रभाव से निधिवन राज के रसिक निकुंजों से प्रकट हुए। युगल सरकार राधा-कृष्ण ने रसिक संत हरिदास जी के प्रेम के वशीभूत होकर बिहारीजी के इस इकलौते त्रिभंगी ललित श्याम विग्रह में समाहित होना स्वीकार किया।",
    mantra: "श्री कुंज बिहारी श्री हरिदास, बांके बिहारी लाल की जय!",
    mantraMeaningEng: "Glory be to the dweller of sacred cooling groves, Swami Haridas's beloved Lord, the beautiful bent-form Banke Bihari.",
    mantraMeaningHi: "कुंज बिहारी श्री हरिदास के प्यारे बांके बिहारी लाल जी महाराज की सदा ही जय जयकार हो!",
    offeringIcon: "diya",
    bgAccent: "from-blue-50 to-indigo-50/60",
    borderAccent: "border-indigo-200/50",
    textAccent: "text-indigo-900",
    category: "beloved"
  },
  {
    id: "radha-vallabh",
    nameHin: "श्री राधा वल्लभ लाल जू",
    nameEng: "Shri Radha Vallabh Lal Ju",
    titleEng: "Embodiment of Pure Non-Dual Prema",
    titleHi: "शुद्ध रसोपासना और अद्वैत प्रेम के साक्षात् रूप",
    locationEng: "Shri Radha Vallabh Temple, Vrindavan Dham",
    locationHi: "श्री राधा वल्लभ मंदिर, श्री वृन्दावन धाम",
    image: RADHA_VALLABH_IMAGE,
    historyEng: "Brought to Vrindavan with deep ecstasy by Sri Hith Harivansh Mahaprabhu, who established the Radhavallabhi tradition. In this sweet sampradaya, Shri Radha is worshiped as the supreme queen of the soul, and Radha-Krishna are seen as inseparable, non-dual lovers existing in eternal sweet Rasa. The deity manifests incomparable grace.",
    historyHi: "श्री हित हरिवंश महाप्रभु द्वारा वृन्दावन लाकर स्थापित। इस सम्प्रदाय में श्री राधा रानी को जीवात्मा की परम आराध्या और सहचरी स्वामिनी मानकर 'राधावल्लभ' स्वरूप की अनन्य निष्काम भाव से रसोपासना की जाती है।",
    mantra: "श्री राधा वल्लभ श्री हरिवंश, राधा वल्लभो विजयतेतराम!",
    mantraMeaningEng: "Victory to Radha Vallabh, the beloved divine couple, and Sri Hit Harivansh. May supreme non-dual love conquer all.",
    mantraMeaningHi: "युगल सरकार श्री राधा वल्लभ और रसिक प्रवर श्री हित हरिवंश महाप्रभु की सदा ही जय हो!",
    offeringIcon: "sweet",
    bgAccent: "from-rose-50 to-red-50/60",
    borderAccent: "border-rose-200/50",
    textAccent: "text-rose-900",
    category: "beloved"
  }
];

const getOfferingLabel = (icon: "flower" | "diya" | "chamar" | "sweet", isHindi: boolean) => {
  if (isHindi) {
    if (icon === "flower") return "दिव्य कमल समर्पित करें 🪷";
    if (icon === "diya") return "मैया आरती दीप दिखाएं 🔔";
    if (icon === "chamar") return "दिव्य चंवर सेवा अर्पण 🦢";
    if (icon === "sweet") return "दिव्य तुलसी पत्र/प्रसाद 🍁";
  } else {
    if (icon === "flower") return "Offer Sacred Lotus 🪷";
    if (icon === "diya") return "Offer Golden Arati Lamp 🔔";
    if (icon === "chamar") return "Offer Divine Chamar Whisk 🦢";
    if (icon === "sweet") return "Offer Sacred Tulsi Patra 🍁";
  }
  return isHindi ? "अर्पण करें" : "Make Offering";
};

interface DeityDarshanProps {
  language?: Language;
}

export const DeityDarshan: React.FC<DeityDarshanProps> = ({ language = "hi" }) => {
  const isHindi = language === "hi";
  const t = TRANSLATIONS_DEITY[isHindi ? "hi" : "en"];

  const [filter, setFilter] = useState<"all" | "goswami" | "beloved" >("all");
  const [selectedDeity, setSelectedDeity] = useState<DeityData>(DEITIES_POOL[0]);
  const [offeringsCount, setOfferingsCount] = useState<Record<string, number>>({
    "radha-raman": 0,
    "madan-mohan": 0,
    "govind-dev": 0,
    "gopinath": 0,
    "radha-damodar": 0,
    "radha-shyamsundar": 0,
    "radha-gokulananda": 0,
    "banke-bihari": 0,
    "radha-vallabh": 0
  });
  const [isOfferingEffect, setIsOfferingEffect] = useState<boolean>(false);
  const [shaktiParticles, setShaktiParticles] = useState<{ id: number; color: string; scale: number }[]>([]);

  // Filtered pool
  const filteredDeites = DEITIES_POOL.filter(deity => {
    if (filter === "all") return true;
    return deity.category === filter;
  });

  const handleMakeOffering = (deityId: string) => {
    setOfferingsCount(prev => ({
      ...prev,
      [deityId]: prev[deityId] + 1
    }));
    
    soundEngine.playTempleBell(0.65);
    setIsOfferingEffect(true);
    setTimeout(() => setIsOfferingEffect(false), 405);

    // Spawn sparks
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      color: ["#F59E0B", "#F43F5E", "#10B981", "#3B82F6", "#EC4899"][Math.floor(Math.random() * 5)],
      scale: Math.random() * 0.9 + 0.5
    }));
    setShaktiParticles(newParticles);
    setTimeout(() => {
      setShaktiParticles([]);
    }, 1200);
  };

  // Helper to change deity and keep selection clean
  const selectDeityWithSound = (deity: DeityData) => {
    setSelectedDeity(deity);
    soundEngine.playChime(0.25);
  };

  return (
    <div 
      id="deity-darshan-panel"
      className="w-full bg-gradient-to-b from-stone-50/50 to-amber-50/20 backdrop-blur-md rounded-3xl border border-stone-200/50 p-4 md:p-6 shadow-sm relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-orange-100/30 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] tracking-widest font-extrabold text-orange-700 font-mono uppercase">
              {t.titlePrefix}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-black text-stone-850 tracking-tight mt-1">
            {t.title}
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
            {t.titleSubtitle}
          </p>
        </div>

        {/* Total Offerings count badge */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-orange-200/30 rounded-2xl px-3.5 py-1.5 text-stone-700 font-bold text-xs shadow-xs">
          <Bell className="w-4 h-4 text-orange-600 animate-bounce" />
          <span>{t.totalOfferings} {(Object.values(offeringsCount) as number[]).reduce((a: number, b: number) => a + b, 0)} {t.times}</span>
        </div>
      </div>

      {/* Group filters & counters */}
      <div className="flex flex-wrap items-center gap-2 mb-4 bg-stone-100/60 p-1.5 rounded-2xl border border-stone-200/40 md:w-fit">
        <button
          onClick={() => { setFilter("all"); soundEngine.playChime(0.15); }}
          className={`px-3 py-1.5 rounded-xl text-xs font-serif font-extrabold transition-all cursor-pointer ${
            filter === "all" ? "bg-white text-orange-700 shadow-xs border border-orange-200/40" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          {isHindi ? "सभी विग्रह रूप (९)" : "All Deities (9)"}
        </button>
        <button
          onClick={() => { setFilter("goswami"); soundEngine.playChime(0.15); }}
          className={`px-3 py-1.5 rounded-xl text-xs font-serif font-extrabold transition-all cursor-pointer ${
            filter === "goswami" ? "bg-white text-orange-700 shadow-xs border border-orange-200/40" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          {isHindi ? "गोस्वामी सप्तदेवालय विग्रह (७)" : "7 Goswami Temples"}
        </button>
        <button
          onClick={() => { setFilter("beloved"); soundEngine.playChime(0.15); }}
          className={`px-3 py-1.5 rounded-xl text-xs font-serif font-extrabold transition-all cursor-pointer ${
            filter === "beloved" ? "bg-white text-orange-700 shadow-xs border border-orange-200/40" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          {isHindi ? "अन्य रसिक विग्रह (२)" : "Beloved Deities (2)"}
        </button>
      </div>

      {/* Deities scroll select list */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 z-10 relative no-scrollbar scroll-smooth">
        {filteredDeites.map((deity) => {
          const isSelected = selectedDeity.id === deity.id;
          return (
            <button
              key={deity.id}
              onClick={() => selectDeityWithSound(deity)}
              className={`flex items-center gap-3 shrink-0 p-2 pr-4 rounded-2xl transition-all cursor-pointer border ${
                isSelected 
                  ? "bg-white border-orange-300 shadow-sm" 
                  : "bg-white/40 border-stone-200/55 hover:bg-white"
              }`}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner shrink-0 border border-stone-100">
                <img 
                  src={deity.image} 
                  alt={deity.nameEng} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left">
                <p className={`text-xs font-serif font-black ${isSelected ? "text-orange-600" : "text-stone-800"}`}>
                  {isHindi ? deity.nameHin : deity.nameEng}
                </p>
                <p className="text-[9px] text-stone-400 font-medium">
                  {isHindi ? deity.locationHi.split(",")[0] : deity.locationEng.split(",")[0]}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Primary Deity focus area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Deity beautiful portrait view */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-stone-200/40 rounded-2xl p-4 shadow-sm relative overflow-hidden min-h-[360px]">
          {/* Display Image Frame */}
          <div className="relative w-full h-[270px] rounded-xl overflow-hidden shadow-inner border border-stone-200/30">
            <img 
              src={selectedDeity.image} 
              alt={selectedDeity.nameEng}
              className={`w-full h-full object-cover select-none transition-all duration-700 ${isOfferingEffect ? "scale-105 brightness-110" : "scale-100"}`}
              referrerPolicy="no-referrer"
            />
            {/* Elegant overlay shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-stone-900/20" />
            
            {/* Location tag */}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white border border-white/20 rounded-full px-3 py-1 text-[10px] flex items-center gap-1.5 max-w-[90%] truncate animate-fade-in {selectedDeity.id}">
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="font-serif font-bold tracking-tight truncate">
                {isHindi ? selectedDeity.locationHi : selectedDeity.locationEng}
              </span>
            </div>

            {/* Float Sparkles on offering */}
            <AnimatePresence>
              {isOfferingEffect && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.15 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-full h-full bg-amber-500/10 border-double border-4 border-amber-400/30 rounded-xl" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Shakti particle sparks burst */}
            {shaktiParticles.map((sp) => (
              <motion.div
                key={sp.id}
                initial={{ 
                  opacity: 1, 
                  scale: sp.scale, 
                  x: Math.random() * 200 - 100, 
                  y: 120 
                }}
                animate={{ 
                  opacity: [1, 1, 0], 
                  y: [-25, -190, -270],
                  x: Math.random() * 240 - 120
                }}
                transition={{ duration: 1.3, ease: "easeOut" }}
                className="absolute left-1/2 bottom-2 pointer-events-none"
                style={{ color: sp.color }}
              >
                <Sparkles className="w-5 h-5 drop-shadow-[0_0_10px_currentColor]" />
              </motion.div>
            ))}
          </div>

          {/* Devotional Offerings and Bell Interaction */}
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={() => handleMakeOffering(selectedDeity.id)}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl py-2.5 px-4 font-bold text-xs shadow-md shadow-orange-100 hover:shadow-orange-200 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flower2 className="w-4 h-4 shrink-0 animate-pulse text-amber-100" />
              <span>{getOfferingLabel(selectedDeity.offeringIcon, isHindi)}</span>
            </button>

            {/* Individual offering stat badge */}
            <div className="w-full sm:w-auto shrink-0 bg-stone-50 border border-stone-200/60 rounded-xl px-4 py-2.5 flex items-center justify-between sm:justify-start gap-3 text-xs font-mono font-bold text-stone-600">
              <span className="text-[10px] text-stone-400 uppercase">{t.received}</span>
              <span className="text-sm font-sans font-black text-amber-700">
                {offeringsCount[selectedDeity.id] || 0} {t.times}
              </span>
            </div>
          </div>

        </div>

        {/* Right Side: Deity Theology, Story, and Mantra Chant guide */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-gradient-to-br from-amber-50/20 to-orange-50/10 border border-orange-100/30 rounded-2xl p-4 md:p-6 shadow-xs relative">
          
          <div>
            {/* Header Names */}
            <div className="mb-4">
              <span className="text-[10px] text-orange-700 bg-orange-500/10 border border-orange-400/20 rounded-full px-2.5 py-0.5 uppercase tracking-widest font-mono font-black">
                {isHindi ? selectedDeity.titleHi : selectedDeity.titleEng}
              </span>
              <h3 className="text-2xl font-serif font-black text-stone-850 mt-2 leading-tight">
                {selectedDeity.nameHin}
                <span className="block text-base font-serif font-bold text-orange-600 mt-1">
                  ({selectedDeity.nameEng})
                </span>
              </h3>
            </div>

            {/* Deep History and Leela origin */}
            <div className="bg-white/85 backdrop-blur-xs border border-stone-200/40 rounded-xl p-3 md:p-4 mb-4 shadow-3xs">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1.5 font-mono">
                <BookOpen className="w-3.5 h-3.5 text-orange-500" /> {t.chronicles}
              </div>
              <p className="text-xs md:text-[13px] text-stone-600 leading-relaxed font-serif">
                {isHindi ? selectedDeity.historyHi : selectedDeity.historyEng}
              </p>
            </div>

            {/* Sacred Pranam Mantra */}
            <div className="border border-orange-200/40 bg-gradient-to-tr from-orange-50/35 to-amber-50/50 rounded-xl p-3.5 shadow-3xs relative overflow-hidden">
              <div className="absolute top-2.5 right-2.5 text-[8px] tracking-widest text-orange-750 font-mono font-black uppercase">
                • Eternal Sloka
              </div>
              
              <div className="flex items-start gap-2.5 mt-0.5">
                <Bookmark className="w-4.5 h-4.5 text-orange-500 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-[11px] uppercase font-bold tracking-wider text-stone-500 font-mono mb-1">
                    {t.pranamTitle}
                  </h4>
                  <p className="text-sm md:text-15px font-serif font-black text-amber-900 tracking-wide leading-relaxed">
                    "{selectedDeity.mantra}"
                  </p>
                  <p className="text-[11px] text-stone-500 mt-2 italic leading-relaxed">
                    <strong className="text-[9px] uppercase font-black font-sans text-stone-400 block not-italic">{t.meaningLabel}</strong>
                    "{isHindi ? selectedDeity.mantraMeaningHi : selectedDeity.mantraMeaningEng}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom quick focus reminder */}
          <div className="border-t border-orange-100/30 pt-4 mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[10px] font-mono font-bold text-stone-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-600" /> {t.focusReminder}
            </span>
            <button
              onClick={() => {
                soundEngine.playChime(0.2);
                soundEngine.playTempleBell(0.45);
              }}
              className="text-[10px] tracking-wider uppercase font-black text-orange-600 hover:text-orange-850 justify-center flex items-center gap-1 transition-all cursor-pointer"
            >
              {t.soundBell} <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
