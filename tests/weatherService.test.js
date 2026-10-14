// Unit tests for weatherService and canonical snapshot hashing
import { assertEquals, assert } from "jsr:@std/assert";
import {
  WMO_WEATHER_MAP,
  getWeatherCondition,
  toFahrenheit,
  formatTemp
} from "../js/weatherService.js";
import { buildCanonicalSnapshot, computeHashes } from "../js/web3Attestation.js";

Deno.test("Weather Service - Condition Mapping & Conversions", () => {
  // Clear sky
  const clear = getWeatherCondition(0);
  assertEquals(clear.desc, "Clear sky");
  assertEquals(clear.emoji, "☀️");

  // Thunderstorm
  const storm = getWeatherCondition(95);
  assertEquals(storm.desc, "Thunderstorm");
  assertEquals(storm.emoji, "🌩️");

  // Temperature conversions
  assertEquals(toFahrenheit(0), 32);
  assertEquals(toFahrenheit(100), 212);
  assertEquals(formatTemp(25.4, "C"), "25°C");
  assertEquals(formatTemp(25.4, "F"), "78°F");
  assertEquals(formatTemp(null), "--");
});

Deno.test("Web3 Attestation - Deterministic Canonical Snapshot & Hashing", async () => {
  const dummyForecast = {
    current: {
      temp: 28.3,
      description: "Mainly clear"
    },
    daily: [
      {
        date: "2026-10-15",
        maxTemp: 31.2,
        minTemp: 21.0,
        precipitationProbability: 15
      }
    ]
  };

  const { snapshotObj, canonicalJson } = buildCanonicalSnapshot("Agra, India", dummyForecast, 1);

  // Check sorted keys
  const keys = Object.keys(JSON.parse(canonicalJson));
  const expectedKeys = [
    "condition",
    "date",
    "destination",
    "maxTemp",
    "minTemp",
    "precipitationProbability",
    "riskLevel"
  ];
  assertEquals(keys, expectedKeys);

  // Check deterministic hash computation
  const { forecastHash, placeHash, algorithm } = await computeHashes(canonicalJson, "Agra, India");
  assert(forecastHash.startsWith("0x"), "forecastHash must be 0x-prefixed hex");
  assert(placeHash.startsWith("0x"), "placeHash must be 0x-prefixed hex");
  assertEquals(forecastHash.length, 66, "forecastHash must be 32 bytes (64 hex + 0x)");
  assertEquals(placeHash.length, 66, "placeHash must be 32 bytes (64 hex + 0x)");
});
