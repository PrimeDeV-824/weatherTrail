// AI Weather Intelligence & Travel Assistant Module
// Strictly grounds all advice and answers in the real forecast data and attraction list.
// Truthfully falls back to structured deterministic rule-based analysis when no AI key is configured.

/**
 * Generates an automated travel weather synthesis
 * @param {string} destination - e.g. "Agra, Uttar Pradesh, India"
 * @param {Object} forecast - detailed forecast object with current and daily
 * @param {Array} attractions - nearby points of interest
 * @param {Object} risks - calculated risk warnings
 * @param {string} apiKey - optional AI provider API key
 * @returns {Promise<Object>} { summary, activityAdvice, bestDays, precautions, isAiGenerated: boolean }
 */
export async function generateTravelWeatherBrief(
  destination,
  forecast,
  attractions = [],
  risks = null,
  apiKey = ""
) {
  // If an AI API key or backend endpoint is available, try server/LLM completion
  if (apiKey || window.WEATHERTRAIL_USE_AI_BACKEND) {
    try {
      const aiResult = await requestAiBrief(destination, forecast, attractions, risks, apiKey);
      if (aiResult) return aiResult;
    } catch (err) {
      console.warn("AI generation error, falling back to rule-based engine:", err);
    }
  }

  // Truthful deterministic fallback
  return generateDeterministicBrief(destination, forecast, attractions, risks);
}

/**
 * Deterministic rule-based forecast interpreter.
 * Transparent, grounded, and clearly labeled.
 */
export function generateDeterministicBrief(destination, forecast, attractions = [], risks = null) {
  const current = forecast?.current || {};
  const daily = forecast?.daily || [];

  // Identify best days (lowest precipitation, comfortable temperatures 18-30°C, low wind)
  const scoredDays = daily.map((day) => {
    let score = 100;
    // Penalize rain
    score -= day.precipitationProbability * 0.7;
    score -= day.precipitationSum * 2;
    // Penalize extreme temperatures
    if (day.maxTemp > 35) score -= (day.maxTemp - 35) * 4;
    if (day.maxTemp < 10) score -= (10 - day.maxTemp) * 4;
    // Penalize wind
    if (day.windSpeedMax > 30) score -= (day.windSpeedMax - 30) * 1.5;
    // Penalize storms
    if ([95, 96, 99].includes(day.weatherCode)) score -= 50;

    return { ...day, score };
  });

  scoredDays.sort((a, b) => b.score - a.score);
  const bestDay = scoredDays[0];
  const mostChallengingDay = scoredDays[scoredDays.length - 1];

  // Rain summary
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
    summary += `Expect hot afternoon conditions exceeding 35°C on ${hotDays.length} day(s).`;
  }

  // Activity recommendations
  const topAttractionNames = attractions.slice(0, 3).map((a) => a.name).join(", ");
  let activityAdvice = "";
  if (rainyDays.length > 0 || stormDays.length > 0) {
    activityAdvice = `Reserve indoor attractions (${topAttractionNames || "local museums, palaces, and galleries"}) for days with higher rain chances. Schedule outdoor walks and photography during dry morning windows.`;
  } else {
    activityAdvice = `Favorable weather for extensive outdoor walking and sightseeing at ${topAttractionNames || "local heritage monuments"}. Early morning hours (8 AM - 11 AM) offer optimal photography light.`;
  }

  // Best days explanation
  let bestDays = "";
  if (bestDay) {
    bestDays = `Top sightseeing day: ${bestDay.date} (${bestDay.description}, High ${Math.round(bestDay.maxTemp)}°C, ${bestDay.precipitationProbability}% rain chance). Most challenging day: ${mostChallengingDay?.date} (${mostChallengingDay?.description}).`;
  }

  // Precautions
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
 * Handle interactive user questions grounded strictly in forecast & attraction data
 */
export async function askAssistantQuestion(
  question,
  destination,
  forecast,
  attractions = [],
  risks = null,
  apiKey = ""
) {
  if (!question || !question.trim()) return "Please enter a question about your travel weather.";

  // If server or API key is available, call LLM
  if (apiKey || window.WEATHERTRAIL_USE_AI_BACKEND) {
    try {
      const response = await requestAiChat(question, destination, forecast, attractions, risks, apiKey);
      if (response) return response;
    } catch (err) {
      console.warn("AI chat endpoint unavailable, falling back to rule responder:", err);
    }
  }

  // Deterministic grounded response
  return answerQuestionDeterministically(question, destination, forecast, attractions, risks);
}

function answerQuestionDeterministically(q, destination, forecast, attractions, risks) {
  const query = q.toLowerCase();
  const daily = forecast?.daily || [];
  const current = forecast?.current || {};

  // Rain / umbrella questions
  if (query.includes("rain") || query.includes("umbrella") || query.includes("wet")) {
    const rainDays = daily.filter((d) => d.precipitationProbability >= 35 || d.precipitationSum >= 1);
    if (rainDays.length === 0) {
      return `[Rule Analysis]: No significant rain is forecast for ${destination} over the next 7 days. Precipitation probabilities remain below 35%. You likely do not need an umbrella, but check daily updates.`;
    }
    const details = rainDays.map((d) => `${d.date} (${d.precipitationProbability}% chance, ~${d.precipitationSum}mm)`).join("; ");
    return `[Rule Analysis]: Rain is expected in ${destination} on: ${details}. Bringing an umbrella or waterproof jacket is strongly recommended on those days.`;
  }

  // Packing / clothing questions
  if (query.includes("pack") || query.includes("wear") || query.includes("clothing") || query.includes("jacket")) {
    const minTemp = Math.min(...daily.map((d) => d.minTemp), current.temp);
    const maxTemp = Math.max(...daily.map((d) => d.maxTemp), current.temp);
    let advice = `[Rule Analysis]: For ${destination}, temperatures range between ${Math.round(minTemp)}°C and ${Math.round(maxTemp)}°C. `;
    if (maxTemp > 32) advice += "Pack breathable, lightweight cotton or linen clothing, a sun hat, and sunglasses for hot afternoons. ";
    if (minTemp < 15) advice += "Pack a warm sweater or light jacket for cool mornings/evenings. ";
    if (daily.some((d) => d.precipitationProbability >= 40)) advice += "Include compact rain gear. ";
    advice += "Comfortable walking shoes are essential for monument sightseeing.";
    return advice;
  }

  // Best day for sightseeing / Taj Mahal / outdoor visits
  if (query.includes("best day") || query.includes("when should") || query.includes("sightseeing") || query.includes("outdoor")) {
    const scored = [...daily].sort((a, b) => {
      const penaltyA = a.precipitationProbability + (a.maxTemp > 35 ? (a.maxTemp - 35) * 5 : 0);
      const penaltyB = b.precipitationProbability + (b.maxTemp > 35 ? (b.maxTemp - 35) * 5 : 0);
      return penaltyA - penaltyB;
    });
    const best = scored[0];
    return `[Rule Analysis]: The most favorable day for outdoor sightseeing in ${destination} is ${best.date}. Forecast: ${best.description}, High ${Math.round(best.maxTemp)}°C, Low ${Math.round(best.minTemp)}°C, with only a ${best.precipitationProbability}% chance of rain.`;
  }

  // Extreme heat / hot
  if (query.includes("hot") || query.includes("heat") || query.includes("summer") || query.includes("sun")) {
    const hottest = [...daily].sort((a, b) => b.maxTemp - a.maxTemp)[0];
    return `[Rule Analysis]: Peak temperature in ${destination} reaches ${Math.round(hottest.maxTemp)}°C on ${hottest.date}. Current temperature is ${Math.round(current.temp)}°C (feels like ${Math.round(current.feelsLike)}°C). Keep monument walks to early morning (before 10:30 AM).`;
  }

  // Attractions in the area
  if (query.includes("attraction") || query.includes("place") || query.includes("visit") || query.includes("see")) {
    if (attractions.length) {
      const list = attractions.slice(0, 4).map((a) => `${a.name} (${a.distanceKm} km away)`).join(", ");
      return `[Rule Analysis]: Nearby highlights for ${destination} include: ${list}. Review the Attraction Discovery section below for full details and individual weather checks.`;
    }
  }

  // Fallback grounded answer
  return `[Rule Analysis]: In ${destination}, current weather is ${current.description} (${Math.round(current.temp)}°C, humidity ${current.humidity}%, wind ${Math.round(current.windSpeed)} km/h). 7-day temperature range is ${Math.round(Math.min(...daily.map((d) => d.minTemp)))}°C to ${Math.round(Math.max(...daily.map((d) => d.maxTemp)))}°C. Check the 7-day forecast cards for specific day details.`;
}

/**
 * Call server AI proxy or direct provider (Gemini / OpenAI compatible)
 */
async function requestAiBrief(destination, forecast, attractions, risks, apiKey) {
  const prompt = `You are a travel weather intelligence assistant for ${destination}.
Forecast data:
Current: ${JSON.stringify(forecast.current)}
7-Day Daily: ${JSON.stringify(forecast.daily.map(d => ({ date: d.date, high: d.maxTemp, low: d.minTemp, rainChance: d.precipitationProbability, rainMm: d.precipitationSum, condition: d.description })))}
Attractions: ${attractions.map(a => a.name).join(", ")}
Risks: ${risks ? JSON.stringify(risks.warnings) : "None"}

Provide a JSON object with:
"summary": 2-3 sentence overview of upcoming weather and travel implications.
"activityAdvice": Recommendations for indoor vs outdoor activities.
"bestDays": Best days to sightsee and why.
"precautions": Array of 2-4 specific actionable safety/packing precautions.
Output only valid JSON.`;

  // First try backend proxy /api/ai-chat
  const backendRes = await fetch("/api/ai-chat", {
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
          engineLabel: "AI Weather Intelligence (Grounded LLM)",
          summary: parsed.summary,
          activityAdvice: parsed.activityAdvice,
          bestDays: parsed.bestDays,
          precautions: parsed.precautions || []
        };
      } catch {
        return {
          isAiGenerated: true,
          engineLabel: "AI Weather Intelligence (Grounded LLM)",
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
  const prompt = `You are a grounded travel weather assistant for ${destination}.
Question: "${question}"
Current Weather: ${JSON.stringify(forecast.current)}
7-day forecast: ${JSON.stringify(forecast.daily)}
Attractions: ${attractions.map(a => a.name).join(", ")}
Answer the question concisely (2-4 sentences) based ONLY on this provided weather and destination data. Do not make up weather or attractions.`;

  const backendRes = await fetch("/api/ai-chat", {
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
