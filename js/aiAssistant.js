// AI Weather & Travel Intelligence Assistant Module
// Connects to free cloud AI services (Google Gemini, OpenAI, or zero-key Free Cloud AI),
// and provides rich offline local knowledge for weather, food, clothing, and attractions.

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
  // Try AI completion (server proxy or client free AI)
  try {
    const aiResult = await requestAiBrief(destination, forecast, attractions, risks, apiKey);
    if (aiResult) return aiResult;
  } catch (err) {
    console.warn("AI brief generation notice, falling back to rule-based engine:", err);
  }

  // Deterministic fallback if AI is unreachable
  return generateDeterministicBrief(destination, forecast, attractions, risks);
}

/**
 * Deterministic rule-based forecast interpreter.
 */
export function generateDeterministicBrief(destination, forecast, attractions = [], risks = null) {
  const current = forecast?.current || {};
  const daily = forecast?.daily || [];

  const scoredDays = daily.map((day) => {
    let score = 100;
    score -= day.precipitationProbability * 0.7;
    score -= day.precipitationSum * 2;
    if (day.maxTemp > 35) score -= (day.maxTemp - 35) * 4;
    if (day.maxTemp < 10) score -= (10 - day.maxTemp) * 4;
    if (day.windSpeedMax > 30) score -= (day.windSpeedMax - 30) * 1.5;
    if ([95, 96, 99].includes(day.weatherCode)) score -= 50;

    return { ...day, score };
  });

  scoredDays.sort((a, b) => b.score - a.score);
  const bestDay = scoredDays[0];
  const mostChallengingDay = scoredDays[scoredDays.length - 1];

  const rainyDays = daily.filter((d) => d.precipitationProbability >= 40 || d.precipitationSum >= 2);
  const hotDays = daily.filter((d) => d.maxTemp >= 35);
  const stormDays = daily.filter((d) => [95, 96, 99].includes(d.weatherCode));

  let summary = `In ${destination}, conditions are currently ${current.description?.toLowerCase() || "fair"} at ${Math.round(current.temp)}°C (feels like ${Math.round(current.feelsLike)}°C). `;
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
  if (current.uvIndex >= 7 || daily.some((d) => d.uvIndexMax >= 7)) {
    precautions.push("High UV index: Apply broad-spectrum sunscreen and wear sunglasses between 11 AM and 3 PM.");
  }
  if (hotDays.length > 0) {
    precautions.push("Hydration: Carry water and electrolytes for daytime monument visits.");
  }
  if (rainyDays.length > 0) {
    precautions.push("Rain gear: Carry a compact wind-resistant umbrella or waterproof jacket.");
  }
  if (daily.some((d) => d.windSpeedMax >= 35)) {
    precautions.push("Brisk winds: Secure loose hats and gear when visiting high viewpoints or rooftops.");
  }
  if (!precautions.length) {
    precautions.push("General: Comfortable walking shoes and standard seasonal clothing are sufficient.");
  }

  return {
    isAiGenerated: false,
    engineLabel: "Deterministic Rule-Based Intelligence (Offline / Free Fallback)",
    summary,
    activityAdvice,
    bestDays,
    precautions
  };
}

/**
 * Handle interactive user questions (AI First with offline local fallback)
 */
export async function askAssistantQuestion(
  question,
  destination,
  forecast,
  attractions = [],
  risks = null,
  apiKey = ""
) {
  if (!question || !question.trim()) return "Please enter a question about your travel weather or destination.";

  // 1. Try server AI endpoint (supports Gemini, OpenAI, and free cloud AI)
  try {
    const response = await requestAiChat(question, destination, forecast, attractions, risks, apiKey);
    if (response && response.trim().length > 0) return response;
  } catch (err) {
    console.warn("Server AI chat unavailable, trying direct free AI...", err);
  }

  // 2. Try direct free cloud AI completion
  try {
    const directAi = await requestDirectFreeAi(question, destination, forecast);
    if (directAi && directAi.trim().length > 0) return directAi;
  } catch (err2) {
    console.warn("Direct free AI unavailable, falling back to local knowledge responder...", err2);
  }

  // 3. High quality local knowledge responder (handles food, clothes, weather, packing)
  return answerQuestionDeterministically(question, destination, forecast, attractions, risks);
}

/**
 * Direct client call to free AI completion API
 */
async function requestDirectFreeAi(question, destination, forecast) {
  const curTemp = forecast?.current?.temp ? `${Math.round(forecast.current.temp)}°C` : "moderate";
  const curCond = forecast?.current?.description || "fair";

  const prompt = `You are a friendly, expert local travel and weather guide for ${destination}.
Current weather in ${destination}: ${curCond}, ${curTemp}.
User Question: "${question}"
Provide a helpful, direct, and specific answer (bullet points where appropriate) covering local recommendations, food, clothing, or sightseeing based on the question.`;

  const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const text = await res.text();
  return text?.trim() || null;
}

/**
 * Local deterministic knowledge responder (offline fallback)
 */
function answerQuestionDeterministically(q, destination, forecast, attractions, risks) {
  const query = q.toLowerCase();
  const destLower = (destination || "").toLowerCase();
  const daily = forecast?.daily || [];
  const current = forecast?.current || {};

  // Food / Dining / Eat questions
  if (query.includes("food") || query.includes("eat") || query.includes("dish") || query.includes("restaurant") || query.includes("cuisine") || query.includes("dinner") || query.includes("lunch")) {
    if (destLower.includes("new york")) {
      return `🍕 Best Food in New York City:
• New York-Style Pizza: Classic thin crust folded slices at Joe's Pizza (West Village), Scarr's, or Prince St. Pizza.
• Bagels with Schmear: Freshly boiled and baked bagels with scallion cream cheese and lox at Russ & Daughters or Ess-a-Bagel.
• Pastrami on Rye: Mile-high hot pastrami on double-baked rye with deli mustard at legendary Katz's Delicatessen.
• Street Cart Halal: Spiced chicken and gyro over saffron rice with white sauce from The Halal Guys (53rd & 6th).
• NY Cheesecake: Rich, creamy dessert slices at Junior's (Brooklyn / Times Square).`;
    }
    if (destLower.includes("prayagraj") || destLower.includes("allahabad")) {
      return `🍲 Best Food in Prayagraj (Allahabad):
• Netram Mulchand & Sons: Famous morning desi ghee Kachori-Sabzi, crispy jalebis, and gulab jamuns in Katra.
• Loknath Street Food: Iconic dahi-jalebi, chaat, spicy samosas, and rabri in the historic old city.
• Dehati Rasgulle: Melt-in-mouth hot dark gulab jamuns on the way to Naini.
• Kamdhenu Sweets: Fresh dairy sweets and lassi in Civil Lines.
• Allahabadi Amrood: World-famous red-cored sweet guavas (during winter season).`;
    }
    if (destLower.includes("matheran")) {
      return `🍬 Best Food in Matheran:
• Fresh Chikki & Fudge: Famous handmade chocolate, walnut, and almond fudge at Nariman Chikki or Purohit Chikki.
• Maharashtrian Thali & Misal: Piping hot spicy Misal Pav with farsan and lemon at local bazaar eateries.
• Kokam Sharbat & Solkadhi: Refreshing cooling coastal berry drinks after trekking.`;
    }
    if (destLower.includes("agra")) {
      return `🥘 Best Food in Agra:
• Panchi Petha: World-famous authentic Agra ash gourd sweet (Angoori, Kesar, and Chocolate petha).
• Bedmi Puri & Aloo: Spicy morning urad-dal stuffed puris with tangy potato gravy at Deviram Sweets.
• Mughlai Cuisine: Slow-cooked mutton kebabs, chicken tikka, and biryani near Fatehabad Road.`;
    }
    if (destLower.includes("varanasi")) {
      return `🍵 Best Food in Varanasi:
• Banarasi Paan: Celebrated sweet betel leaf with gulkand and fragrant spices at Godowlia.
• Malaiyo: Ethereal winter saffron milk froth served in earthen clay kulhads.
• Tamatar Chaat & Palak Chaat: Piping hot savory street treats at Kashi Chaat Bhandar.
• Blue Lassi Shop: Thick curd lassi topped with fresh fruit, rabri, and dry fruits.`;
    }
    if (destLower.includes("lucknow")) {
      return `🍢 Best Food in Lucknow:
• Tunday Kababi: World-renowned melt-in-mouth buffalo and mutton Galawati Kebabs with Mughlai parathas.
• Awadhi Dum Biryani: Fragrant slow-cooked royal mutton biryani at Idris or Dastarkhwan.
• Prakash Kulfi: Rich falooda kulfi in the bustling Aminabad food market.`;
    }
    if (destLower.includes("mumbai")) {
      return `🍔 Best Food in Mumbai:
• Vada Pav: Mumbai's favorite spiced potato fritter in fresh pav with garlic chutney (Ashok Vada Pav near Kirti College).
• Pav Bhaji: Buttery mashed vegetable curry at Sardar Pav Bhaji or Cannon Pav Bhaji.
• Coastal Seafood: Fresh Bombil fry (Bombay Duck) and surmai curry at Mahesh Lunch Home or Highway Gomantak.`;
    }
    return `🍴 Food in ${destination}: Explore vibrant local street food markets and central eateries. Check local ratings for authentic specialties!`;
  }

  // Clothes / Shopping / Markets
  if (query.includes("cloth") || query.includes("shopping") || query.includes("buy") || query.includes("shop") || query.includes("fashion") || query.includes("market") || query.includes("bazaar") || query.includes("dress")) {
    if (destLower.includes("new york")) {
      return `🛍️ Best Clothes to Buy in New York & Where to Shop:
• SoHo (Broadway & Prince St): Flagship streetwear boutiques, denim studios, and designer concept stores.
• Fifth Avenue: Luxury department stores (Saks Fifth Avenue, Bergdorf Goodman) and iconic flagships.
• East Village & Brooklyn (Williamsburg): Curated vintage leather, designer thrift, and unique local label apparel at Beacon's Closet and Housing Works.
• Outerwear & Layers: Stylish wool trench coats, packable puffers, and walking sneakers suited to city walking.`;
    }
    if (destLower.includes("prayagraj") || destLower.includes("allahabad")) {
      return `🛍️ Shopping in Prayagraj:
• Katra Bazaar: Bustling hub for traditional Indian wear, vibrant kurtis, sarees, and winter shawls.
• Civil Lines: Branded fashion outlets, bookstores, and modern apparel showrooms.
• Chowk Bazaar: Traditional brassware, religious souvenirs, and perfumes (ittar).`;
    }
    if (destLower.includes("matheran")) {
      return `🛍️ Shopping in Matheran:
• Handmade Leather Footwear: Renowned Kolhapuri chappals, leather sandals, and belts along the central Mall Road.
• Cane & Bamboo Handicrafts: Sturdy handmade walking sticks, baskets, and hat accessories.
• Pure Forest Honey: Locally harvested wild bee honey from the Sahyadri forests.`;
    }
    if (destLower.includes("lucknow")) {
      return `🛍️ Shopping in Lucknow:
• Authentic Chikankari Work: Fine hand-embroidered shadow-work cotton and georgette kurtas, dupattas, and sarees in Aminabad and Chowk.
• Ittar: Traditional floral essential oil perfumes.`;
    }
    if (destLower.includes("varanasi")) {
      return `🛍️ Shopping in Varanasi:
• Banarasi Silk Sarees: World-famous handwoven pure Katan silk and Zari brocades at Thatheri Bazaar and Chowk.
• Gulabi Minakari: Handcrafted pink enamelled jewelry and wooden lacquer toys.`;
    }
    if (destLower.includes("agra")) {
      return `🛍️ Shopping in Agra:
• Sadar Bazaar: Premium handmade leather boots, jackets, and bags at government-approved emporiums.
• Pietra Dura: Marble inlay boxes and coasters crafted by descendants of Taj Mahal artisans.`;
    }
    return `🛍️ Shopping in ${destination}: Visit the central bazaar and cultural markets for regional handicrafts and seasonal wear.`;
  }

  // Rain / Umbrella questions
  if (query.includes("rain") || query.includes("umbrella") || query.includes("wet")) {
    const rainDays = daily.filter((d) => d.precipitationProbability >= 35 || d.precipitationSum >= 1);
    if (rainDays.length === 0) {
      return `[Weather Intelligence]: No significant rain is forecast for ${destination} over the next 7 days (rain probabilities below 35%). You likely do not need an umbrella, but check morning updates.`;
    }
    const details = rainDays.map((d) => `${d.date} (${d.precipitationProbability}% chance, ~${d.precipitationSum}mm)`).join("; ");
    return `[Weather Intelligence]: Rain is expected in ${destination} on: ${details}. Bringing an umbrella or waterproof jacket is strongly recommended.`;
  }

  // Packing questions
  if (query.includes("pack") || query.includes("wear") || query.includes("jacket")) {
    const minTemp = Math.min(...daily.map((d) => d.minTemp), current.temp);
    const maxTemp = Math.max(...daily.map((d) => d.maxTemp), current.temp);
    let advice = `For ${destination}, temperatures range between ${Math.round(minTemp)}°C and ${Math.round(maxTemp)}°C. `;
    if (maxTemp > 32) advice += "Pack breathable, lightweight cotton or linen clothing, a sun hat, and sunglasses for hot afternoons. ";
    if (minTemp < 15) advice += "Pack a warm sweater or light jacket for cool mornings/evenings. ";
    if (daily.some((d) => d.precipitationProbability >= 40)) advice += "Include compact rain gear. ";
    advice += "Comfortable walking shoes are essential for exploring.";
    return advice;
  }

  // Best day for sightseeing
  if (query.includes("best day") || query.includes("when should") || query.includes("sightseeing") || query.includes("visit")) {
    const scored = [...daily].sort((a, b) => {
      const penaltyA = a.precipitationProbability + (a.maxTemp > 35 ? (a.maxTemp - 35) * 5 : 0);
      const penaltyB = b.precipitationProbability + (b.maxTemp > 35 ? (b.maxTemp - 35) * 5 : 0);
      return penaltyA - penaltyB;
    });
    const best = scored[0];
    return `The most favorable day for sightseeing in ${destination} is ${best.date}. Forecast: ${best.description}, High ${Math.round(best.maxTemp)}°C, Low ${Math.round(best.minTemp)}°C, with only a ${best.precipitationProbability}% chance of rain.`;
  }

  // Fallback grounded answer
  return `In ${destination}, current weather is ${current.description || "clear"} (${Math.round(current.temp)}°C, humidity ${current.humidity}%, wind ${Math.round(current.windSpeed)} km/h). 7-day temperature range is ${Math.round(Math.min(...daily.map((d) => d.minTemp)))}°C to ${Math.round(Math.max(...daily.map((d) => d.maxTemp)))}°C.`;
}

/**
 * Call server AI proxy
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

  const endpoint = typeof window !== "undefined" ? "/api/ai-chat" : "http://localhost:3000/api/ai-chat";
  const backendRes = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, destination, apiKey })
  });

  if (backendRes.ok) {
    const data = await backendRes.json();
    if (data.result) {
      try {
        const parsed = JSON.parse(data.result);
        return {
          isAiGenerated: true,
          engineLabel: "AI Weather Intelligence (Cloud AI)",
          summary: parsed.summary,
          activityAdvice: parsed.activityAdvice,
          bestDays: parsed.bestDays,
          precautions: parsed.precautions || []
        };
      } catch {
        return {
          isAiGenerated: true,
          engineLabel: "AI Weather Intelligence (Cloud AI)",
          summary: data.result,
          activityAdvice: "Check daily conditions for outdoor planning.",
          bestDays: "Consult forecast cards.",
          precautions: []
        };
      }
    }
  }
  return null;
}

async function requestAiChat(question, destination, forecast, attractions, risks, apiKey) {
  const prompt = `You are a helpful travel weather guide for ${destination}.
Question: "${question}"
Current Weather: ${JSON.stringify(forecast?.current || {})}
Nearby Attractions: ${attractions.map(a => a.name).join(", ")}
Answer the question thoroughly, engagingly, and concisely (covering food, clothes, shopping, weather, or attractions as requested).`;

  const endpoint = typeof window !== "undefined" ? "/api/ai-chat" : "http://localhost:3000/api/ai-chat";
  const backendRes = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, destination, apiKey })
  });

  if (backendRes.ok) {
    const data = await backendRes.json();
    if (data.result) return data.result;
  }
  return null;
}
