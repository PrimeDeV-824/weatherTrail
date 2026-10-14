// Unit tests for Weather-Risk Warning Engine
import { assertEquals, assert } from "jsr:@std/assert";
import { evaluateWeatherRisks, SEVERITY_LEVELS } from "../js/warningEngine.js";

Deno.test("Warning Engine - Safe clear conditions yield Low risk", () => {
  const forecast = {
    current: {
      temp: 24,
      feelsLike: 24,
      humidity: 50,
      windSpeed: 10,
      uvIndex: 4,
      weatherCode: 0,
      description: "Clear sky"
    },
    daily: [
      {
        date: "2026-10-15",
        maxTemp: 26,
        minTemp: 18,
        precipitationProbability: 10,
        precipitationSum: 0,
        windSpeedMax: 12,
        uvIndexMax: 5,
        weatherCode: 0,
        description: "Clear sky"
      }
    ]
  };

  const res = evaluateWeatherRisks(forecast);
  assertEquals(res.overallRiskLevel, SEVERITY_LEVELS.LOW);
  assertEquals(res.overallRiskName, "Low");
  assert(res.disclaimer.includes("Safety Disclaimer"));
});

Deno.test("Warning Engine - Thunderstorm triggers Severe risk", () => {
  const forecast = {
    current: {
      temp: 25,
      weatherCode: 95, // Thunderstorm
      windSpeed: 20,
      uvIndex: 2,
      description: "Thunderstorm"
    },
    daily: [
      {
        date: "2026-10-15",
        maxTemp: 27,
        minTemp: 20,
        precipitationProbability: 80,
        precipitationSum: 15,
        windSpeedMax: 30,
        weatherCode: 95,
        description: "Thunderstorm"
      }
    ]
  };

  const res = evaluateWeatherRisks(forecast);
  assertEquals(res.overallRiskLevel, SEVERITY_LEVELS.SEVERE);
  assertEquals(res.overallRiskName, "Severe");
  assert(res.warnings.some((w) => w.condition.includes("Thunderstorm")));
});

Deno.test("Warning Engine - Heavy Rain triggers High risk", () => {
  const forecast = {
    current: {
      temp: 22,
      weatherCode: 65,
      windSpeed: 15,
      uvIndex: 3,
      description: "Heavy rain"
    },
    daily: [
      {
        date: "2026-10-16",
        maxTemp: 23,
        minTemp: 19,
        precipitationProbability: 85,
        precipitationSum: 25, // 25mm rain
        windSpeedMax: 20,
        weatherCode: 65,
        description: "Heavy rain"
      }
    ]
  };

  const res = evaluateWeatherRisks(forecast);
  assert(res.overallRiskLevel >= SEVERITY_LEVELS.HIGH);
  assert(res.warnings.some((w) => w.impact.includes("waterlogged") || w.condition.includes("Heavy Rain")));
});

Deno.test("Warning Engine - Extreme Heat triggers High risk with hydration advice", () => {
  const forecast = {
    current: {
      temp: 41,
      weatherCode: 0,
      windSpeed: 10,
      uvIndex: 9,
      description: "Clear sky"
    },
    daily: [
      {
        date: "2026-10-17",
        maxTemp: 42,
        minTemp: 28,
        precipitationProbability: 0,
        precipitationSum: 0,
        windSpeedMax: 15,
        uvIndexMax: 9,
        weatherCode: 0,
        description: "Sunny"
      }
    ]
  };

  const res = evaluateWeatherRisks(forecast);
  assertEquals(res.overallRiskLevel, SEVERITY_LEVELS.HIGH);
  assert(res.warnings.some((w) => w.condition.includes("Extreme Heat") || w.condition.includes("Peak Temperature")));
  assert(res.warnings.some((w) => w.precaution.includes("hydrated") || w.precaution.includes("electrolytes")));
});
