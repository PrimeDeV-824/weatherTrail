// AI Weather & Travel Intelligence Assistant Module
// Worldwide Tourist Destination Intelligence: Food, Clothing, History, Heritage & Live Search
// Covers every curated destination and any global destination via live Wikipedia integration.

/**
 * Format markdown and table text into clean, modern human-readable HTML.
 */
export function formatMarkdownToHtml(markdown) {
  if (!markdown) return "";
  let text = String(markdown).trim();

  // Strip <think>...</think> or model reasoning traces
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // Strip any "Question: ... Selection: ..." thinking leakage
  if (text.includes("*   Question:") && text.includes("*Refined Final:*")) {
    const refinedIdx = text.lastIndexOf("*Refined Final:*");
    text = text.slice(refinedIdx + "*Refined Final:*".length).trim();
  }

  // Handle [SWITCH_CITY:CityName] tag
  let switchCityHtml = "";
  const switchMatch = text.match(/\[SWITCH_CITY:(.+?)\]/);
  if (switchMatch) {
    const switchCityName = switchMatch[1].trim();
    switchCityHtml = `
      <div class="switchCityContainer">
        <button type="button" class="switchCityBtn" data-city="${switchCityName}">
          🧭 Load 7-Day Weather Forecast & Attractions for ${switchCityName} ↗
        </button>
      </div>
    `;
    text = text.replace(/\[SWITCH_CITY:.+?\]/, "").trim();
  }

  const lines = text.split(/\r?\n/);
  const output = [];
  let inList = false;
  let inOrderedList = false;
  let tableRows = [];

  function flushList() {
    if (inList) {
      output.push("</ul>");
      inList = false;
    }
    if (inOrderedList) {
      output.push("</ol>");
      inOrderedList = false;
    }
  }

  function flushTable() {
    if (tableRows.length === 0) return;

    const parsedRows = tableRows
      .map((r) => {
        let trimmed = r.trim();
        if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
        if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
        return trimmed.split("|").map((c) => c.trim());
      })
      .filter((cells) => cells.length > 0 && !cells.every((c) => /^[-:\s]+$/.test(c)));

    if (parsedRows.length >= 2) {
      const headerCells = parsedRows[0];
      const dataRows = parsedRows.slice(1);

      output.push('<div class="aiCardsContainer">');
      dataRows.forEach((row) => {
        const title = row[0] || "Recommendation";
        output.push('  <div class="aiRecommendationCard">');
        output.push(`    <div class="aiCardTitle">${formatInline(title)}</div>`);
        output.push('    <div class="aiCardDetails">');
        for (let i = 1; i < row.length; i++) {
          if (!row[i]) continue;
          const label = headerCells[i] || `Detail ${i}`;
          output.push(`      <div class="aiCardRow"><span class="aiCardLabel">${formatInline(label)}:</span> <span class="aiCardVal">${formatInline(row[i])}</span></div>`);
        }
        output.push('    </div>');
        output.push('  </div>');
      });
      output.push('</div>');
    } else if (parsedRows.length === 1) {
      parsedRows[0].forEach((c) => output.push(`<p class="aiParagraph">${formatInline(c)}</p>`));
    }

    tableRows = [];
  }

  function formatInline(str) {
    if (!str) return "";
    let s = str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    s = s.replace(/&lt;br\s*\/?&gt;/gi, "<br />");
    s = s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*(.*?)\*/g, "<em>$1</em>");
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");

    return s;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flushList();
      flushTable();
      continue;
    }

    if (line.includes("|") && (line.startsWith("|") || line.split("|").length >= 3)) {
      flushList();
      tableRows.push(line);
      continue;
    } else {
      flushTable();
    }

    if (line.startsWith("### ")) {
      flushList();
      output.push(`<h4 class="aiHeading">${formatInline(line.slice(4))}</h4>`);
      continue;
    }
    if (line.startsWith("## ")) {
      flushList();
      output.push(`<h3 class="aiHeading">${formatInline(line.slice(3))}</h3>`);
      continue;
    }
    if (line.startsWith("# ")) {
      flushList();
      output.push(`<h3 class="aiHeading">${formatInline(line.slice(2))}</h3>`);
      continue;
    }

    if (/^[•\-\*]\s+/.test(line)) {
      if (inOrderedList) flushList();
      if (!inList) {
        output.push('<ul class="aiAnswerList">');
        inList = true;
      }
      const itemText = line.replace(/^[•\-\*]\s+/, "");
      output.push(`<li>${formatInline(itemText)}</li>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      if (inList) flushList();
      if (!inOrderedList) {
        output.push('<ol class="aiAnswerList">');
        inOrderedList = true;
      }
      const itemText = line.replace(/^\d+\.\s+/, "");
      output.push(`<li>${formatInline(itemText)}</li>`);
      continue;
    }

    flushList();
    output.push(`<p class="aiParagraph">${formatInline(line)}</p>`);
  }

  flushList();
  flushTable();

  if (switchCityHtml) {
    output.push(switchCityHtml);
  }

  return output.join("\n");
}

/**
 * Detect which city/place the user's prompt is targeting
 */
export function detectTargetCity(query = "", defaultCity = "") {
  if (!query) return defaultCity;
  const q = query.toLowerCase();

  const CITY_MATCHERS = [
    { name: "Prayagraj", patterns: ["prayagraj", "allahabad", "sangam", "triveni", "anand bhavan", "khusro bagh"] },
    { name: "Ayodhya", patterns: ["ayodhya", "ram mandir", "ram janmabhoomi", "hanuman garhi", "saryu"] },
    { name: "Agra", patterns: ["agra", "taj mahal", "tajmahal", "fatehpur sikri"] },
    { name: "Varanasi", patterns: ["varanasi", "banaras", "kashi", "dashashwamedh", "sarnath", "ganga ghat"] },
    { name: "Lucknow", patterns: ["lucknow", "awadh", "tunday", "imambara", "bhulbhulaiya"] },
    { name: "Mathura", patterns: ["mathura", "vrindavan", "barsana", "govardhan", "bankey bihari", "prem mandir"] },
    { name: "Mirzapur", patterns: ["mirzapur", "lakhaniya", "rajdari", "devdari", "windom", "chandraprabha"] },
    { name: "Jabalpur", patterns: ["jabalpur", "bhedaghat", "dhuandhar", "marble rocks"] },
    { name: "Pachmarhi", patterns: ["pachmarhi", "bee falls", "duchess fall", "dhoopgarh"] },
    { name: "Khajuraho", patterns: ["khajuraho", "kandariya", "raneh falls"] },
    { name: "Gwalior", patterns: ["gwalior", "gwalior fort", "jai vilas", "scindia"] },
    { name: "Ujjain", patterns: ["ujjain", "mahakal", "mahakaleshwar", "shipra"] },
    { name: "Rewa", patterns: ["rewa", "chachai", "keoti", "bahuti"] },
    { name: "Matheran", patterns: ["matheran", "charlotte lake", "louisa point", "panorama point"] },
    { name: "Lonavala", patterns: ["lonavala", "khandala", "kune falls", "tiger point", "bhushi dam", "karla caves"] },
    { name: "Satara", patterns: ["satara", "thoseghar", "vajrai", "kaas plateau", "valley of flowers"] },
    { name: "Bhandardara", patterns: ["bhandardara", "karjat", "randha falls", "umbrella falls", "kalsubai"] },
    { name: "Mumbai", patterns: ["mumbai", "bombay", "marine drive", "gateway of india", "elephanta"] },
    { name: "Goa", patterns: ["goa", "dudhsagar", "panaji", "calangute", "baga", "anjuna"] },
    { name: "Kerala", patterns: ["kerala", "alleppey", "alappuzha", "munnar", "athirappilly", "kochi", "cochin"] },
    { name: "Ladakh", patterns: ["ladakh", "leh", "pangong", "nubra", "thiksey"] },
    { name: "Rishikesh", patterns: ["rishikesh", "haridwar", "triveni ghat", "ram jhula", "neer garh"] },
    { name: "Jaipur", patterns: ["jaipur", "pink city", "amber fort", "hawa mahal", "jantar mantar"] },
    { name: "Delhi", patterns: ["delhi", "new delhi", "red fort", "qutub minar", "chandni chowk", "humayun"] },
    { name: "Hampi", patterns: ["hampi", "vijayanagara", "virupaksha", "vittala"] },
    { name: "Kyoto", patterns: ["kyoto", "fushimi inari", "kinkaku", "arashiyama", "gion"] },
    { name: "Tokyo", patterns: ["tokyo", "shinjuku", "shibuya", "ginza", "akihabara", "senso-ji"] },
    { name: "Paris", patterns: ["paris", "eiffel", "louvre", "notre dame", "champs"] },
    { name: "New York", patterns: ["new york", "nyc", "manhattan", "brooklyn", "central park", "times square"] },
    { name: "Rome", patterns: ["rome", "roma", "colosseum", "vatican", "trevi", "pantheon"] },
    { name: "London", patterns: ["london", "big ben", "westminster", "thames", "buckingham"] },
    { name: "Dubai", patterns: ["dubai", "burj khalifa", "deira"] },
    { name: "Singapore", patterns: ["singapore", "marina bay", "sentosa"] },
    { name: "Hyderabad", patterns: ["hyderabad", "charminar", "golconda", "biryani"] },
    { name: "Kolkata", patterns: ["kolkata", "calcutta", "howrah", "victoria memorial"] },
    { name: "Bengaluru", patterns: ["bengaluru", "bangalore", "cubbon park", "lalbagh"] }
  ];

  for (const item of CITY_MATCHERS) {
    if (item.patterns.some((p) => q.includes(p))) {
      return item.name;
    }
  }

  // Preposition matches: "in <City>", "about <City>", "for <City>"
  const matchPrep = q.match(/\b(?:in|at|about|for|of|to)\s+([a-zA-Z\s]{2,25})\b/i);
  if (matchPrep && matchPrep[1]) {
    const candidate = matchPrep[1].trim().split(/\s+/)[0];
    const ignoreWords = ["the", "this", "my", "our", "a", "an", "what", "where", "best", "good", "cheap", "today", "tomorrow", "travel", "weather"];
    if (!ignoreWords.includes(candidate.toLowerCase()) && candidate.length >= 3) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
    }
  }

  return defaultCity || "Destination";
}

/**
 * Fetch real-time live Wikipedia extracts & latest search summaries for any place or topic
 */
export async function fetchLiveWikipediaKnowledge(city, topic = "") {
  try {
    const queryTerm = topic ? `${city} ${topic}` : `${city} tourism attractions history`;
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(queryTerm)}&utf8=&format=json&origin=*`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) return null;
    const data = await res.json();
    const searchResults = data?.query?.search || [];
    if (!searchResults.length) return null;

    const cleanSnippets = searchResults.slice(0, 3).map((item) => {
      const cleanText = item.snippet
        .replace(/<[^>]+>/g, "")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&")
        .trim();
      return `• **${item.title}**: ${cleanText}...`;
    });

    return cleanSnippets.join("\n");
  } catch (err) {
    return null;
  }
}

/**
 * Generates an automated travel weather synthesis
 */
export async function generateTravelWeatherBrief(
  destination,
  forecast,
  attractions = [],
  risks = null,
  apiKey = ""
) {
  try {
    const aiResult = await requestAiBrief(destination, forecast, attractions, risks, apiKey);
    if (aiResult) return aiResult;
  } catch (err) {
    console.warn("AI brief notice, engaging smart engine:", err.message);
  }

  return generateSmartTravelBrief(destination, forecast, attractions, risks);
}

export const generateDeterministicBrief = generateSmartTravelBrief;

/**
 * Smart travel forecast synthesizer
 */
export function generateSmartTravelBrief(destination, forecast, attractions = [], risks = null) {
  const current = forecast?.current || {};
  const daily = forecast?.daily || [];

  const scoredDays = daily.map((day) => {
    let score = 100;
    score -= (day.precipitationProbability || 0) * 0.7;
    score -= (day.precipitationSum || 0) * 2;
    if (day.maxTemp > 35) score -= (day.maxTemp - 35) * 4;
    if (day.maxTemp < 10) score -= (10 - day.maxTemp) * 4;
    if (day.windSpeedMax > 30) score -= (day.windSpeedMax - 30) * 1.5;
    if ([95, 96, 99].includes(day.weatherCode)) score -= 50;

    return { ...day, score };
  });

  scoredDays.sort((a, b) => b.score - a.score);
  const bestDay = scoredDays[0];
  const mostChallengingDay = scoredDays[scoredDays.length - 1];

  const rainyDays = daily.filter((d) => (d.precipitationProbability || 0) >= 40 || (d.precipitationSum || 0) >= 2);
  const hotDays = daily.filter((d) => d.maxTemp >= 35);
  const stormDays = daily.filter((d) => [95, 96, 99].includes(d.weatherCode));

  let summary = `In ${destination}, conditions are currently ${current.description?.toLowerCase() || "fair"} at ${Math.round(current.temp || 20)}°C (feels like ${Math.round(current.feelsLike || current.temp || 20)}°C). `;
  if (stormDays.length > 0) {
    summary += `Active thunderstorms are forecast on ${stormDays.map((d) => d.date).join(", ")}, requiring indoor shelter. `;
  } else if (rainyDays.length > 0) {
    summary += `Rain or showers are expected on ${rainyDays.length} of the next 7 days (${rainyDays.map((d) => d.date).join(", ")}). `;
  } else {
    summary += `The next 7 days show generally dry and stable conditions. `;
  }

  if (hotDays.length > 0) {
    summary += `Expect warm afternoon conditions exceeding 35°C on ${hotDays.length} day(s).`;
  }

  const topAttractionNames = attractions.slice(0, 3).map((a) => a.name).join(", ");
  let activityAdvice = "";
  if (rainyDays.length > 0 || stormDays.length > 0) {
    activityAdvice = `Reserve indoor attractions (${topAttractionNames || "local museums, palaces, and galleries"}) for days with higher rain chances. Schedule outdoor walks and photography during dry morning windows.`;
  } else {
    activityAdvice = `Favorable weather for extensive outdoor walking and sightseeing at ${topAttractionNames || "local heritage monuments"}. Early morning hours offer optimal photography light.`;
  }

  let bestDays = "";
  if (bestDay) {
    bestDays = `Top sightseeing day: ${bestDay.date} (${bestDay.description}, High ${Math.round(bestDay.maxTemp)}°C, ${bestDay.precipitationProbability}% rain chance). Most challenging day: ${mostChallengingDay?.date} (${mostChallengingDay?.description}).`;
  }

  const precautions = [];
  if (current.uvIndex >= 7 || daily.some((d) => (d.uvIndexMax || 0) >= 7)) {
    precautions.push("High UV index: Apply broad-spectrum sunscreen and wear sunglasses between 11 AM and 3 PM.");
  }
  if (hotDays.length > 0) {
    precautions.push("Hydration: Carry water and electrolytes for daytime monument visits.");
  }
  if (rainyDays.length > 0) {
    precautions.push("Rain gear: Carry a compact wind-resistant umbrella or waterproof jacket.");
  }
  if (daily.some((d) => (d.windSpeedMax || 0) >= 35)) {
    precautions.push("Brisk winds: Secure loose hats and gear when visiting high viewpoints or rooftops.");
  }
  if (!precautions.length) {
    precautions.push("General: Comfortable walking shoes and standard seasonal clothing are sufficient.");
  }

  return {
    isAiGenerated: false,
    engineLabel: "✨ Smart AI Travel Intelligence",
    summary,
    activityAdvice,
    bestDays,
    precautions
  };
}

/**
 * Handle interactive user questions
 */
export async function askAssistantQuestion(
  question,
  destination,
  forecast,
  attractions = [],
  risks = null,
  apiKey = ""
) {
  if (!question || !question.trim()) {
    return "Please enter a question about travel weather, food, clothing, history, or sightseeing.";
  }

  const cleanQ = question.trim();
  const targetCity = detectTargetCity(cleanQ, destination);
  const cacheKey = `wt_ai_${targetCity}_${cleanQ.toLowerCase()}`;

  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch {}

  // 1. Try server AI endpoint with fast 1.2s timeout
  try {
    const response = await requestAiChat(cleanQ, targetCity, forecast, attractions, risks, apiKey);
    if (response && response.trim().length > 0) {
      let finalRes = response;
      if (targetCity.toLowerCase() !== (destination || "").toLowerCase()) {
        finalRes += `\n\n[SWITCH_CITY:${targetCity}]`;
      }
      try { sessionStorage.setItem(cacheKey, finalRes); } catch {}
      return finalRes;
    }
  } catch (err) {
    console.warn("Server AI chat notice:", err.message);
  }

  // 2. High quality smart knowledge responder
  let smartAnswer = await answerTravelQuestionSmart(cleanQ, targetCity, forecast, attractions, risks);
  if (targetCity.toLowerCase() !== (destination || "").toLowerCase()) {
    smartAnswer += `\n\n[SWITCH_CITY:${targetCity}]`;
  }

  try { sessionStorage.setItem(cacheKey, smartAnswer); } catch {}
  return smartAnswer;
}

export const answerQuestionDeterministically = answerTravelQuestionSmart;

/**
 * High quality comprehensive travel knowledge responder
 * Covers Food, Clothing, History, Heritage & Sightseeing for every destination
 */
export async function answerTravelQuestionSmart(q, destination, forecast, attractions, risks) {
  const query = q.toLowerCase();
  const targetCity = detectTargetCity(q, destination);
  const cityLower = targetCity.toLowerCase();
  const daily = forecast?.daily || [];
  const current = forecast?.current || {};

  // Check intent categories
  const isHistory =
    query.includes("history") ||
    query.includes("heritage") ||
    query.includes("culture") ||
    query.includes("origin") ||
    query.includes("ancient") ||
    query.includes("founded") ||
    query.includes("story") ||
    query.includes("background") ||
    query.includes("kumbh") ||
    query.includes("sangam") ||
    query.includes("fort") ||
    query.includes("monument") ||
    query.includes("palace") ||
    query.includes("dynasty") ||
    query.includes("who built");

  const isFood =
    query.includes("food") ||
    query.includes("eat") ||
    query.includes("dish") ||
    query.includes("restaurant") ||
    query.includes("cuisine") ||
    query.includes("dinner") ||
    query.includes("lunch") ||
    query.includes("breakfast") ||
    query.includes("snack") ||
    query.includes("sweet") ||
    query.includes("chaat") ||
    query.includes("drink");

  const isClothes =
    query.includes("cloth") ||
    query.includes("shopping") ||
    query.includes("buy") ||
    query.includes("shop") ||
    query.includes("fashion") ||
    query.includes("market") ||
    query.includes("bazaar") ||
    query.includes("dress") ||
    query.includes("wear") ||
    query.includes("saree") ||
    query.includes("textile") ||
    query.includes("craft") ||
    query.includes("souvenir");

  const isWeather =
    query.includes("rain") ||
    query.includes("umbrella") ||
    query.includes("wet") ||
    query.includes("pack") ||
    query.includes("jacket") ||
    query.includes("best day");

  // ==========================================================
  // CURATED DESTINATION PROFILES (INDIA & GLOBAL HIGHLIGHTS)
  // ==========================================================
  const KNOWLEDGE_BASE = {
    prayagraj: {
      food: `### 🍲 Iconic Food Guide to Prayagraj (Allahabad)

• **Netram Mulchand & Sons (Katra)**: Heritage desi ghee **Kachori-Sabzi**, served with spiced pumpkin curry, dry aloo, and piping hot saffron **jalebis**.
• **Loknath Street Food (Old City)**: Famous dahi-jalebi, spicy samosas, rabri, and **Hari Ram & Sons** heritage namkeens (established 1890).
• **Dehati Rasgulle (Naini Highway)**: Legendary hot, melt-in-the-mouth dark brown gulab jamuns in fragrant cardamom syrup.
• **Allahabadi Amrood**: Celebrated sweet, pink-cored river-basin guavas (winter harvest).
• **Kamdhenu & Niranjan Sweets**: Creamy kulhad lassi topped with malai and chenna toast.
• **Mughlai in Chowk**: Slow-cooked mutton seekh kebabs, Awadhi biryani, and roomali roti.`,
      clothes: `### 🛍️ Clothes & Shopping Guide for Prayagraj

• **Katra Market**: Women's traditional wear, vibrant cotton kurtis, Chanderi sarees, and Kashmiri shawls.
• **Chowk Bazaar**: Heritage brassware, temple pooja artifacts, and authentic natural floral ittar (perfumes).
• **Civil Lines**: High-end fashion showrooms, handloom emporiums, and modern apparel.
• **Kumbh Mela Souvenirs**: Authentic rudraksha beads, river stones, brass diyas, and Ganga jal containers.`,
      history: `### 🏛️ History & Heritage of Prayagraj (Allahabad)

• **Ancient Prayag & Triveni Sangam**: Revered in the *Rigveda* and *Mahabharata* as the sacred confluence of the Ganga, Yamuna, and subterranean Saraswati.
• **Mughal Fort of Akbar (1583)**: Colossal sandstone fortress on the Yamuna housing the 3rd-century BCE **Ashoka Pillar** and immortal **Akshayavat** tree.
• **Khusro Bagh**: Mughal walled funerary garden containing carved sandstone mausoleums of Prince Khusrau and Sultan Begum.
• **Freedom Movement Cradle**: **Anand Bhavan** and **Swaraj Bhavan**, ancestral estates of the Nehru-Gandhi family where pivotal independence strategies were forged.
• **Maha Kumbh Mela**: The world's largest peaceful spiritual gathering, drawing hundreds of millions of pilgrims every 12 years.`
    },

    ayodhya: {
      food: `### 🍲 Traditional Food of Ayodhya

• **Ayodhya Peda & Laddu**: Rich caramelized milk pedas and pure desi ghee Besan laddus offered as sacred prasad.
• **Ram Ki Paidi Street Treats**: Evening savory chaat, golgappe, and sizzling jalebis along the illuminated Sarayu riverfront.
• **Bedmi Puri & Tangy Aloo**: Traditional temple breakfast of crispy spiced urad-dal puris and tangy potato gravy.
• **Makhan Malai & Rabri**: Ethereal whipped winter milk froth garnished with saffron and pistachios.`,
      clothes: `### 🛍️ Shopping & Apparel in Ayodhya

• **Pilgrimage Keepsakes**: Intricately carved wooden khadau (sandals), brass Ram Darbar idols, and Tulsi mala rosaries.
• **Religious Textiles**: Vibrant yellow and saffron Ram-naam stoles, embroidered puja dupattas, and pure cotton dhotis.
• **Sarayu River Souvenirs**: Brass lamps, engraved temple bells, and sacred conch shells (shankh).`,
      history: `### 🏛️ Ancient History of Ayodhya

• **Birthplace of Lord Rama**: Revered worldwide as **Ram Janmabhoomi**, the sacred capital of the ancient Suryavanshi Solar Dynasty and Kosala Kingdom.
• **The Grand Ram Mandir**: Monumental Nagara-style stone temple marking the sacred Ram Janmabhoomi site.
• **Hanuman Garhi**: 10th-century fortress temple dedicated to Lord Hanuman, perched atop 76 steep stone stairs.
• **Kanak Bhavan**: Royal palace-temple gifted to Sita, featuring golden-crowned deities.
• **Saryu River Ghats & Deepotsav**: Historic bathing ghats where millions of terracotta earthen lamps are lit during the annual Diwali Deepotsav.`
    },

    agra: {
      food: `### 🥘 Best Food to Eat in Agra

• **Panchi Petha**: Authentic Agra ash gourd sweet—Angoori, Kesar, and Chocolate petha.
• **Bedmi Puri & Aloo (Deviram Sweets)**: Crisp urad-dal puris with spiced potato gravy.
• **Mughlai Delicacies**: Slow-cooked Galawati kebabs, butter chicken, and biryani on Fatehabad Road.
• **Dalmoth**: Crispy spiced lentil, melon seed, and cashew namkeen.`,
      clothes: `### 🛍️ Shopping in Agra

• **Sadar Bazaar**: Government-approved emporiums for genuine handmade leather shoes, boots, jackets, and bags.
• **Pietra Dura Inlay**: Exquisite white marble inlay plates, tabletops, and boxes crafted by descendants of Taj artisans.
• **Kinari Bazaar**: Zardozi embroidered fabrics, bridal borders, and silver jewelry.`,
      history: `### 🏛️ Imperial History of Agra

• **Imperial Mughal Seat**: Golden capital under Akbar, Jahangir, and Shah Jahan (16th–17th centuries).
• **The Taj Mahal (UNESCO)**: Radiant white Makrana marble mausoleum built by Shah Jahan (1631–1648) for Mumtaz Mahal.
• **Agra Fort (UNESCO)**: Mighty red sandstone citadel housing the Jahangiri Mahal, Khas Mahal, and Sheesh Mahal.
• **Fatehpur Sikri**: Imperial ghost city featuring the monumental 54m Buland Darwaza gateway.`
    },

    varanasi: {
      food: `### 🍵 Street Food of Varanasi (Kashi)

• **Banarasi Paan**: Celebrated sweet betel leaf with gulkand and fragrant spices at Godowlia.
• **Malaiyo**: Ethereal winter saffron milk froth served in earthen kulhads.
• **Tamatar Chaat**: Savory spiced tomato chaat simmered in clay handis at Kashi Chaat Bhandar.
• **Blue Lassi Shop**: Thick curd lassi piled high with fresh seasonal fruits and rabri.`,
      clothes: `### 🛍️ Shopping in Varanasi

• **Banarasi Silk Sarees**: Pure Katan silk with genuine Zari brocade in Thatheri Bazaar and Chowk.
• **Gulabi Minakari**: Rare pink enamel jewelry on silver and gold.
• **Bhadohi Carpets**: Hand-knotted heirloom carpets from the nearby carpet corridor.`,
      history: `### 🏛️ Sacred History of Varanasi

• **World's Oldest Living City**: Inhabited continuously for over 3,000 years on the sacred Ganga.
• **Kashi Vishwanath Jyotirlinga**: Golden-spired temple dedicated to Lord Shiva, heart of spiritual India.
• **Historic Ganga Ghats**: Dashashwamedh (Ganga Aarti), Manikarnika (cremation ghat), and Assi Ghat.
• **Sarnath**: Just 10 km away, where Lord Buddha gave his first sermon in 528 BCE.`
    },

    lucknow: {
      food: `### 🍢 Royal Awadhi Food in Lucknow

• **Tunday Kababi**: World-renowned melt-in-the-mouth Galawati kebabs with flaky Mughlai parathas.
• **Awadhi Dum Biryani**: Charcoal slow-cooked royal mutton biryani at Idris or Dastarkhwan.
• **Prakash Kulfi**: Creamy falooda kulfi in Aminabad.
• **Sheermal & Malai Gilori**: Saffron flatbreads and delicate condensed milk paan sweets.`,
      clothes: `### 🛍️ Shopping in Lucknow

• **Chikankari Hand Embroidery**: Shadow-work georgette, cotton, and silk kurtas in Aminabad & Chowk.
• **Natural Floral Ittar**: Hand-distilled rose, khus, and shamama perfumes.
• **Zardozi Metallic Embroidery**: Opulent gold and silver thread craftsmanship.`,
      history: `### 🏛️ Royal History of Lucknow

• **Nawabs of Awadh**: Flourished in the 18th–19th centuries as the capital of Awadhi court culture.
• **Bara Imambara (1784)**: Colossal arched hall constructed without pillars, housing the intricate Bhulbhulaiya labyrinth.
• **Rumi Darwaza**: 60-foot Turkish gateway built by Nawab Asaf-ud-Daula.`
    },

    mathura: {
      food: `### 🍬 Food of Mathura & Vrindavan

• **Mathura ke Pede**: Caramelized condensed milk fudge with cardamom and boora sugar.
• **Crisp Kachori & Jalebi**: Traditional morning street breakfast with tangy pumpkin-potato curry.
• **Makhan Mishri**: Freshly churned white butter with crystallized rock sugar.`,
      clothes: `### 🛍️ Shopping in Mathura & Vrindavan

• **Deity Attire**: Poshak dresses, mukut crowns, and flute ornaments for Krishna idols.
• **Tulsi & Sandalwood Malas**: Handcrafted prayer beads from certified temple artisans.`,
      history: `### 🏛️ Heritage of Mathura & Vrindavan

• **Braj Bhoomi**: Sacred birthplace of Lord Krishna at the Krishna Janmasthan temple.
• **Vrindavan Temples**: Historic Bankey Bihari shrine, Radha Raman, and the white Italian marble Prem Mandir.`
    },

    matheran: {
      food: `### 🍬 Food & Dining in Matheran

• **Handmade Fudge & Chikki**: Nariman and Purohit chocolate-walnut fudge and peanut chikki along Mall Road.
• **Maharashtrian Thali & Misal**: Hot spicy Misal Pav with farsan and freshly sliced lemon.
• **Kokam Sharbat**: Cooling coastal berry juice after scenic cliff walks.`,
      clothes: `### 🛍️ Shopping in Matheran

• **Leather Footwear**: Genuine Kolhapuri chappals, sandals, and belts handcrafted on Mall Road.
• **Cane Handicrafts**: Sturdy walking sticks and woven wicker hats.
• **Pure Forest Honey**: Locally harvested wild bee honey from Sahyadri jungles.`,
      history: `### 🌲 History of Matheran

• **Asia's Only Automobile-Free Hill Station**: Discovered in 1850 by British Collector Hugh Poyntz Malet.
• **Red Laterite Paths**: Preserved eco-sensitive zone with no motorized vehicles; travel is by horseback, hand rickshaw, or foot.
• **Key Points**: Charlotte Lake, Panorama Point (360° vistas), and Louisa Point cliffs.`
    },

    jaipur: {
      food: `### 🍛 Royal Food of Jaipur

• **Dal Baati Churma**: Baked wheat dough balls dipped in desi ghee with spiced lentil curry and sweetened churma.
• **Laal Maas**: Fiery Rajasthani mutton curry simmered with Mathania red chillies.
• **Pyaaz Kachori & Ghevar**: Crispy onion kachoris and honeycomb-patterned disc sweets at Rawat.`,
      clothes: `### 🛍️ Shopping in Jaipur

• **Johari Bazaar**: World capital for precious gemstones, Kundan, and Meenakari enamel jewelry.
• **Bapu Bazaar**: Traditional camel-leather mojari shoes and Jaipuri cotton quilts (Razai).
• **Sanganeri Prints**: Hand-block stamped cotton shirts, kurtas, and bedsheets.`,
      history: `### 🏛️ Royal History of Jaipur

• **The Pink City (1727)**: Founded by astronomer-king Maharaja Sawai Jai Singh II.
• **Amber Fort**: Hilltop fortress housing the glittering Sheesh Mahal (Mirror Palace).
• **Hawa Mahal**: 1799 pink sandstone facade featuring 953 latticed windows.`
    },

    mumbai: {
      food: `### 🍔 Iconic Food of Mumbai

• **Vada Pav**: Spiced golden potato fritter in fresh pav with garlic chutney (Ashok Vada Pav).
• **Pav Bhaji**: Buttery mashed vegetable curry at Sardar or Cannon Pav Bhaji.
• **Coastal Seafood**: Bombil fry (Bombay Duck) and Surmai curry at Mahesh Lunch Home.`,
      clothes: `### 🛍️ Shopping in Mumbai

• **Colaba Causeway & Fashion Street**: Vibrant street fashion, accessories, and antique artifacts.
• **Chor Bazaar**: Antique brass clocks, vintage Bollywood posters, and gramophones.`,
      history: `### 🏛️ Heritage of Mumbai

• **City of Dreams**: Seven fishing islands transformed into India's financial and cultural powerhouse.
• **Gateway of India**: 1924 basalt triumphal arch on Mumbai Harbour.
• **Marine Drive**: 3.6km coastal promenade celebrated as the Queen's Necklace.`
    },

    goa: {
      food: `### 🍤 Goan Culinary Highlights

• **Goan Fish Curry Thali**: Fresh kingfish or pomfret in tangy coconut-kokum curry with steamed rice.
• **Pork Vindaloo & Chicken Xacuti**: Traditional Portuguese-influenced slow-cooked spiced gravies.
• **Bebinca**: Rich 7-layer traditional Indo-Portuguese baked dessert with coconut milk.`,
      clothes: `### 🛍️ Shopping in Goa

• **Anjuna Flea Market**: Bohemian resort wear, crochet dresses, and handmade leather bags.
• **Panaji Fontainhas**: Hand-painted blue Portuguese azulejos ceramic tiles and cashew feni.`,
      history: `### 🏛️ Colonial Heritage of Goa

• **Portuguese Rule (1510–1961)**: Distinctive Indo-Portuguese architecture and Latin quarters.
• **Old Goa Churches (UNESCO)**: Basilica of Bom Jesus housing the sacred relics of St. Francis Xavier.
• **Dudhsagar Falls**: Four-tiered 310m "Sea of Milk" cascade on the Mandovi River.`
    },

    kerala: {
      food: `### 🥥 Traditional Food of Kerala

• **Kerala Sadya**: Grand vegetarian feast served on banana leaf with sambar, avial, and payasam.
• **Appam with Stew**: Delicate fermented rice hoppers with fragrant coconut milk stew.
• **Karimeen Pollichathu**: Pearl spot fish marinated in masala and wrapped in banana leaf.`,
      clothes: `### 🛍️ Shopping in Kerala

• **Kasavu Sarees & Mundus**: Traditional off-white cotton handlooms with woven golden borders.
• **Fresh Hill Spices**: Cardamom, cinnamon, cloves, and black pepper from Wayanad and Munnar.`,
      history: `### 🏛️ Heritage of Kerala

• **Ancient Spice Route**: Maritime hub trading with Phoenicians, Romans, and Arabs for thousands of years.
• **Backwaters of Alleppey**: Serene network of lagoons navigated by traditional kettuvallam houseboats.
• **Athirappilly Falls**: 80-foot wide thundering forest waterfall known as the "Niagara of India".`
    },

    ladakh: {
      food: `### 🥟 Food of Ladakh

• **Steaming Momos & Thukpa**: Hand-rolled dumplings and hot noodle soup with mountain herbs.
• **Gur Gur Chai**: Traditional salty butter tea churned with yak butter.
• **Tingmo & Skyu**: Fluffy steamed buns and hearty slow-cooked barley vegetable stew.`,
      clothes: `### 🛍️ Shopping in Ladakh

• **Authentic Pashmina & Cashmere**: Handwoven ultra-soft goat wool shawls and stoles.
• **Tibetan Curios**: Hand-carved singing bowls, turquoise jewelry, and colorful prayer flags.`,
      history: `### 🏛️ History of Ladakh

• **Land of High Passes**: Historic crossroads of the Silk Road between Kashmir and Tibet.
• **Monasteries**: Spectacular cliff-perched gompas including Thiksey, Hemis, and Diskit.
• **Pangong Tso**: High-altitude endorheic lake (4,225m) famous for shifting turquoise waters.`
    },

    rishikesh: {
      food: `### 🥗 Sattvic Food of Rishikesh

• **Chotiwala Thali**: Heritage pure vegetarian North Indian and Garhwali thalis near Swarg Ashram.
• **Ayurvedic Organic Cafes**: Fresh smoothie bowls, herbal teas, and wood-fired sourdough pizzas in Tapovan.`,
      clothes: `### 🛍️ Shopping in Rishikesh

• **Yoga Apparel**: Organic cotton kurtas, linen meditation pants, and natural cork mats.
• **Rudraksha Beads**: Certified natural seed rosaries and brass puja vessels.`,
      history: `### 🏛️ Sacred Heritage of Rishikesh

• **Yoga Capital of the World**: Ancient meditation retreat of rishis and sages along the emerald Ganges.
• **Triveni Ghat**: Sacred bathing ghat renowned for the grand evening Ganga Aarti.
• **Neer Garh Waterfalls**: Natural multi-tiered limestone cascade tucked in Himalayan jungles.`
    },

    new_york: {
      food: `### 🍕 Iconic Food Guide to New York City

• **New York-Style Pizza**: Thin-crust foldable slices at **Joe's Pizza** (West Village) and **Scarr's**.
• **Classic Bagel & Schmear**: Hand-rolled boiled bagels with scallion cream cheese at **Russ & Daughters**.
• **Katz's Delicatessen**: Legendary mile-high hot pastrami on double-baked rye with deli mustard.
• **The Halal Guys (53rd & 6th)**: Aromatic chicken and gyro over saffron rice with famous white sauce.
• **Junior's Cheesecake**: Ultra-rich, dense baked Brooklyn cheesecake.`,
      clothes: `### 🛍️ Shopping in New York City

• **SoHo**: Flagship designer concept stores, premium denim boutiques, and streetwear studios.
• **Fifth Avenue**: Grand luxury department stores (Saks Fifth Avenue, Bergdorf Goodman).
• **Williamsburg & East Village**: Curated designer resale and thrift apparel at Beacon's Closet.`,
      history: `### 🏛️ History of New York City

• **Lenape Origins & New Amsterdam (1624)**: Dutch trading post turned premier global metropolis.
• **First US Capital (1789)**: George Washington was inaugurated at Federal Hall on Wall Street.
• **Statue of Liberty & Ellis Island**: Gateway through which over 12 million immigrants entered America.`
    },

    paris: {
      food: `### 🥐 Parisian Culinary Essentials

• **Artisanal Boulangeries**: Flaky croissants and pain au chocolat at Du Pain et des Idées.
• **Classic Bistros**: Steak frites with béarnaise and duck confit at Bouillon Chartier.
• **Pierre Hermé & Angelina**: Delicate macarons and thick African hot chocolate.`,
      clothes: `### 🛍️ Shopping in Paris

• **Le Marais**: Independent French fashion concept stores, perfume ateliers, and vintage boutiques.
• **Boulevard Haussmann**: Grand historic department stores Galeries Lafayette and Printemps.`,
      history: `### 🏛️ History of Paris

• **City of Light**: Founded on Île de la Cité in the 3rd century BCE by the Celtic Parisii tribe.
• **Haussmannian Grandeur**: Iconic 19th-century boulevards and uniform limestone facades.
• **Cultural Icons**: The Eiffel Tower (1889), Notre-Dame Cathedral (1163), and the Louvre Palace.`
    },

    kyoto: {
      food: `### 🍜 Culinary Highlights of Kyoto & Tokyo

• **Kaiseki Dining**: Multi-course seasonal culinary art honoring Japanese balance and philosophy.
• **Uji Matcha**: Ceremonial green tea, matcha soft-serve, and parfaits in historic Gion.
• **Artisanal Ramen & Sushi**: Rich tonkotsu broth at Ichiran and fresh nigiri sushi.`,
      clothes: `### 🛍️ Shopping in Kyoto

• **Nishijin Textiles**: Handwoven pure silk kimono fabrics and obi sashes.
• **Traditional Crafts**: Kiyomizu-yaki hand-painted pottery and handmade Japanese kitchen knives.`,
      history: `### 🏛️ Heritage of Kyoto

• **Imperial Capital (794–1868)**: Center of classic Japanese culture, Zen philosophy, and tea ceremonies.
• **Fushimi Inari-taisha**: Mountain shrine famous for its thousands of vermilion torii gates.
• **Kinkaku-ji**: The Zen Golden Pavilion whose top floors are completely clad in pure gold leaf.`
    },

    rome: {
      food: `### 🍝 Roman Food Specialties

• **The Four Iconic Pastas**: Carbonara, Cacio e Pepe, Amatriciana, and Gricia in Trastevere.
• **Pizza al Taglio**: Roman airy pan pizza slices with crispy base at Pizzarium Bonci.
• **Giolitti Gelato**: Handcrafted pistachio and dark chocolate gelato near the Pantheon.`,
      clothes: `### 🛍️ Shopping in Rome

• **Via del Corso & Via Condotti**: Luxury Italian leather goods, shoes, and designer fashion.
• **Trastevere Boutiques**: Independent leather artisans crafting custom belts and bags.`,
      history: `### 🏛️ Ancient History of Rome

• **The Eternal City (753 BCE)**: Heart of the Roman Empire and Western civilization.
• **Colosseum & Forum**: Monumental gladiatorial arena and ancient political heart.
• **Vatican City**: St. Peter's Basilica and the Sistine Chapel with Michelangelo's frescoes.`
    }
  };

  // Find curated city key
  let cityKey = null;
  for (const k of Object.keys(KNOWLEDGE_BASE)) {
    if (cityLower.includes(k) || k.includes(cityLower)) {
      cityKey = k;
      break;
    }
  }

  // If matched curated city, return requested topic
  if (cityKey && KNOWLEDGE_BASE[cityKey]) {
    const entry = KNOWLEDGE_BASE[cityKey];
    if (isHistory && entry.history) return entry.history;
    if (isFood && entry.food) return entry.food;
    if (isClothes && entry.clothes) return entry.clothes;
  }

  // ==========================================================
  // DYNAMIC LIVE WIKIPEDIA KNOWLEDGE ENGINE (ANY PLACE ON EARTH)
  // ==========================================================
  let searchTopic = "tourism attractions history";
  if (isFood) searchTopic = "cuisine food dishes restaurants";
  if (isClothes) searchTopic = "shopping markets clothing textiles";
  if (isHistory) searchTopic = "history heritage ancient";

  const liveWiki = await fetchLiveWikipediaKnowledge(targetCity, searchTopic);

  if (liveWiki) {
    let headerTitle = `### 🧭 Comprehensive Travel Guide for ${targetCity}`;
    if (isFood) headerTitle = `### 🍽️ Culinary & Food Guide for ${targetCity}`;
    if (isClothes) headerTitle = `### 🛍️ Clothes, Shopping & Bazaars in ${targetCity}`;
    if (isHistory) headerTitle = `### 🏛️ Complete History & Heritage of ${targetCity}`;

    return `${headerTitle}

${liveWiki}

• **Current Weather**: ${current.description || "Clear sky"} at ${Math.round(current.temp || 22)}°C.
• **Travel Advice**: Explore the historic center, local culinary bazaars, and renowned monuments during favorable morning hours.`;
  }

  // Weather Fallback
  if (isWeather) {
    const rainDays = daily.filter((d) => (d.precipitationProbability || 0) >= 35);
    if (rainDays.length > 0) {
      const details = rainDays.map((d) => `• **${d.date}**: ${d.precipitationProbability}% rain chance`).join("\n");
      return `### 🌧️ Rain Forecast for ${targetCity}\n\nRain or showers are expected on:\n${details}\n\nCarry a compact umbrella or rain shell when outdoors.`;
    }
    return `### ☀️ Weather Outlook for ${targetCity}\n\nConditions are dry and pleasant over the next 7 days. Standard walking gear and seasonal clothing are suitable.`;
  }

  // General Overview
  return `### 🧭 Travel Overview for ${targetCity}

• **Current Conditions**: ${current.description || "Clear sky"} at ${Math.round(current.temp || 22)}°C (Humidity: ${current.humidity || 50}%, Wind: ${Math.round(current.windSpeed || 10)} km/h).
• **7-Day Outlook**: Daily temperatures range from ${Math.round(Math.min(...daily.map((d) => d.minTemp || 15)))}°C to ${Math.round(Math.max(...daily.map((d) => d.maxTemp || 25)))}°C.
• **Nearby Points of Interest**: ${attractions.slice(0, 4).map((a) => a.name).join(", ") || "Historic monuments and cultural landmarks"}.`;
}

/**
 * Call server AI proxy for brief generation with timeout
 */
async function requestAiBrief(destination, forecast, attractions, risks, apiKey) {
  const prompt = `You are a travel weather intelligence assistant for ${destination}.
Forecast: Current ${JSON.stringify(forecast.current)}, 7-day daily ${JSON.stringify(forecast.daily.map(d => ({ date: d.date, high: d.maxTemp, low: d.minTemp, rain: d.precipitationProbability, cond: d.description })))}.
Attractions: ${attractions.map(a => a.name).join(", ")}.

Provide a JSON object with:
"summary": 2-3 sentence overview of upcoming weather and travel implications.
"activityAdvice": Recommendations for indoor vs outdoor activities.
"bestDays": Best days to sightsee and why.
"precautions": Array of 2-4 specific actionable safety/packing precautions.
Output only valid JSON.`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);

  try {
    const endpoint = typeof window !== "undefined" ? "/api/ai-chat" : "http://localhost:3000/api/ai-chat";
    const backendRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, destination, apiKey }),
      signal: controller.signal
    });
    clearTimeout(timer);

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.result) {
        try {
          const parsed = JSON.parse(data.result);
          return {
            isAiGenerated: true,
            engineLabel: "✨ Cloud AI Travel Intelligence",
            summary: parsed.summary,
            activityAdvice: parsed.activityAdvice,
            bestDays: parsed.bestDays,
            precautions: parsed.precautions || []
          };
        } catch {
          return {
            isAiGenerated: true,
            engineLabel: "✨ Cloud AI Travel Intelligence",
            summary: data.result,
            activityAdvice: "Check daily conditions for outdoor planning.",
            bestDays: "Consult forecast cards.",
            precautions: []
          };
        }
      }
    }
  } catch (err) {
    clearTimeout(timer);
  }
  return null;
}

/**
 * Call server AI proxy for chat question with timeout
 */
async function requestAiChat(question, destination, forecast, attractions, risks, apiKey) {
  const prompt = `You are an expert local travel guide for ${destination}.
User Question: "${question}"
Destination: ${destination}
Current Weather: ${JSON.stringify(forecast?.current || {})}
Nearby Attractions: ${attractions.map(a => a.name).join(", ")}
IMPORTANT FORMATTING INSTRUCTIONS:
- Directly answer the question about ${destination} (covering food, clothes, history, heritage, or attractions).
- Write in clean, highly readable paragraphs and bullet points with emojis.
- Never output raw markdown pipe tables (|---|).
- Never output raw HTML tags like <br>.
- Be concise, engaging, and practical.`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1200);

  try {
    const endpoint = typeof window !== "undefined" ? "/api/ai-chat" : "http://localhost:3000/api/ai-chat";
    const backendRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, destination, apiKey }),
      signal: controller.signal
    });
    clearTimeout(timer);

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.result) return data.result;
    }
  } catch (err) {
    clearTimeout(timer);
  }
  return null;
}
