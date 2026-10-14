// Weather-Risk Warning Engine
// Deterministic, configurable rule evaluation for travel weather hazards

export const SEVERITY_LEVELS = {
  LOW: 0,
  MODERATE: 1,
  HIGH: 2,
  SEVERE: 3
};

export const SEVERITY_NAMES = {
  0: "Low",
  1: "Moderate",
  2: "High",
  3: "Severe"
};

// Configurable baseline thresholds
export const DEFAULT_THRESHOLDS = {
  heavyRainProbability: 65, // %
  heavyRainMm: 15,          // mm
  moderateRainMm: 5,        // mm
  extremeHeatC: 38,         // °C
  highHeatC: 34,            // °C
  extremeColdC: 0,          // °C
  veryHighUv: 8,            // UV index
  extremeUv: 11,            // UV index
  highWindKmH: 40,          // km/h
  galeWindKmH: 60           // km/h
};

/**
 * Evaluates forecast data against deterministic safety rules
 * @param {Object} forecast - Contains `current` and `daily` arrays
 * @param {Object} customThresholds - Optional overrides
 * @returns {Object} { overallRiskLevel: number, overallRiskName: string, warnings: Array, disclaimer: string }
 */
export function evaluateWeatherRisks(forecast, customThresholds = {}) {
  const t = { ...DEFAULT_THRESHOLDS, ...customThresholds };
  const warnings = [];

  if (!forecast) {
    return {
      overallRiskLevel: SEVERITY_LEVELS.LOW,
      overallRiskName: "Low",
      warnings: [],
      disclaimer: "Safety Notice: Application-calculated indicators based on open meteorological data. Not an official alert."
    };
  }

  // 1. Check current conditions if available
  if (forecast.current) {
    const cur = forecast.current;

    // Severe thunderstorm
    if ([95, 96, 99].includes(cur.weatherCode)) {
      warnings.push({
        severity: "severe",
        level: SEVERITY_LEVELS.SEVERE,
        date: "Current",
        condition: `Active Thunderstorm (${cur.description || "Severe weather"})`,
        impact: "Severe hazard for outdoor travel, open heritage sites, water activities, and road travel.",
        precaution: "Seek immediate shelter indoors. Delay driving or boating until storms clear."
      });
    }

    // High current wind
    if (cur.windSpeed >= t.galeWindKmH) {
      warnings.push({
        severity: "severe",
        level: SEVERITY_LEVELS.SEVERE,
        date: "Current",
        condition: `Gale Force Winds (${Math.round(cur.windSpeed)} km/h)`,
        impact: "Risk of flying debris, transport delays, and dangerous conditions on elevated viewpoints or coastal areas.",
        precaution: "Avoid exposed ridges, beaches, and scaffolding. Secure personal belongings."
      });
    } else if (cur.windSpeed >= t.highWindKmH) {
      warnings.push({
        severity: "moderate",
        level: SEVERITY_LEVELS.MODERATE,
        date: "Current",
        condition: `Brisk / High Winds (${Math.round(cur.windSpeed)} km/h)`,
        impact: "Moderate inconvenience for cycling, drone photography, and walking along open waterfronts.",
        precaution: "Wear windproof layers and exercise caution near cliff edges or boat docks."
      });
    }

    // Current temperature extremes
    if (cur.temp >= t.extremeHeatC) {
      warnings.push({
        severity: "high",
        level: SEVERITY_LEVELS.HIGH,
        date: "Current",
        condition: `Extreme Heat (${Math.round(cur.temp)}°C)`,
        impact: "High risk of heat exhaustion and dehydration during daytime monument walking.",
        precaution: "Stay well-hydrated, restrict sightseeing to early morning or late evening, and wear sun protection."
      });
    } else if (cur.temp <= t.extremeColdC) {
      warnings.push({
        severity: "moderate",
        level: SEVERITY_LEVELS.MODERATE,
        date: "Current",
        condition: `Freezing Temperatures (${Math.round(cur.temp)}°C)`,
        impact: "Potential ice on trails or roads; rapid body heat loss.",
        precaution: "Wear thermal layers, waterproof boots, and confirm mountain passes are open."
      });
    }

    // High UV
    if (cur.uvIndex >= t.extremeUv) {
      warnings.push({
        severity: "high",
        level: SEVERITY_LEVELS.HIGH,
        date: "Current",
        condition: `Extreme UV Index (${cur.uvIndex})`,
        impact: "Sunburn can occur in under 15 minutes of direct sunlight.",
        precaution: "Wear SPF 50+ sunscreen, UV-blocking sunglasses, and broad-brimmed hats."
      });
    } else if (cur.uvIndex >= t.veryHighUv) {
      warnings.push({
        severity: "moderate",
        level: SEVERITY_LEVELS.MODERATE,
        date: "Current",
        condition: `Very High UV Index (${cur.uvIndex})`,
        impact: "Increased risk of skin damage during midday hours (11am - 4pm).",
        precaution: "Seek shade during peak afternoon hours and apply sun protection."
      });
    }
  }

  // 2. Evaluate daily forecasts for the next 7 days
  const daily = forecast.daily || [];
  for (const day of daily) {
    const isThunderstorm = [95, 96, 99].includes(day.weatherCode);
    const isHeavyRain =
      day.precipitationSum >= t.heavyRainMm ||
      (day.precipitationProbability >= t.heavyRainProbability && day.precipitationSum >= t.moderateRainMm);
    const isExtremeHeat = day.maxTemp >= t.extremeHeatC;
    const isExtremeCold = day.minTemp <= t.extremeColdC;
    const isGaleWind = day.windSpeedMax >= t.galeWindKmH;

    if (isThunderstorm) {
      warnings.push({
        severity: "severe",
        level: SEVERITY_LEVELS.SEVERE,
        date: day.date,
        condition: `Thunderstorm Forecast (${day.description})`,
        impact: "Outdoor monument visits, boat cruises, and safaris likely to be suspended or disrupted.",
        precaution: "Schedule indoor cultural visits (museums, indoor markets) and check local transport status."
      });
    } else if (isHeavyRain) {
      warnings.push({
        severity: "high",
        level: SEVERITY_LEVELS.HIGH,
        date: day.date,
        condition: `Heavy Rain Expected (${day.precipitationProbability}% chance, ~${day.precipitationSum}mm)`,
        impact: "Waterlogged streets, slippery walking conditions at stone heritage monuments, and low visibility.",
        precaution: "Carry umbrellas and waterproof footwear; plan temple or palace interior tours."
      });
    } else if (day.precipitationProbability >= 50 && day.precipitationSum > 0) {
      warnings.push({
        severity: "moderate",
        level: SEVERITY_LEVELS.MODERATE,
        date: day.date,
        condition: `Scattered Showers (${day.precipitationProbability}% chance)`,
        impact: "Intermittent rain showers may interrupt outdoor sightseeing or photo sessions.",
        precaution: "Keep a compact rain jacket or umbrella handy."
      });
    }

    if (isGaleWind) {
      warnings.push({
        severity: "severe",
        level: SEVERITY_LEVELS.SEVERE,
        date: day.date,
        condition: `High Wind Gusts (${Math.round(day.windSpeedMax)} km/h)`,
        impact: "Cable cars, ferry services, and rooftop viewing decks may be closed.",
        precaution: "Confirm operating hours of exposed attractions in advance."
      });
    }

    if (isExtremeHeat) {
      warnings.push({
        severity: "high",
        level: SEVERITY_LEVELS.HIGH,
        date: day.date,
        condition: `Peak Temperature ${Math.round(day.maxTemp)}°C`,
        impact: "Walking across stone courtyards (e.g. Taj Mahal, Fatehpur Sikri) can be grueling during midday.",
        precaution: "Plan sightseeing before 10:30 AM or after 4:30 PM. Drink plenty of water and electrolytes."
      });
    } else if (isExtremeCold) {
      warnings.push({
        severity: "moderate",
        level: SEVERITY_LEVELS.MODERATE,
        date: day.date,
        condition: `Night / Morning Frost (Min ${Math.round(day.minTemp)}°C)`,
        impact: "Morning fog and cold conditions may delay sunrise tours or flights.",
        precaution: "Dress in warm layers for early morning departures."
      });
    }
  }

  // Calculate maximum severity
  let maxLevel = SEVERITY_LEVELS.LOW;
  for (const w of warnings) {
    if (w.level > maxLevel) maxLevel = w.level;
  }

  return {
    overallRiskLevel: maxLevel,
    overallRiskName: SEVERITY_NAMES[maxLevel],
    warnings: warnings.slice(0, 8), // top warnings
    disclaimer:
      "Safety Disclaimer: Travel risk indicators are computed by algorithmic rules from open meteorological data. They do not constitute official government or meteorological authority warnings. Always verify emergency warnings with local disaster management authorities."
  };
}
