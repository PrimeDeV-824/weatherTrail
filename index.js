// WeatherTrail — Main Application Controller
// Preserves and enhances original OpenWeatherMap functionality with
// 7-day forecasts, tourism discovery, risk warning engine, AI assistance, and Web3 attestation.

import {
  searchLocations,
  getDetailedForecast,
  formatTemp,
  toFahrenheit,
  WMO_WEATHER_MAP
} from "./js/weatherService.js";
import {
  CURATED_DESTINATIONS,
  fetchNearbyAttractions,
  getCategoryFallback
} from "./js/tourismService.js";
import {
  evaluateWeatherRisks,
  SEVERITY_NAMES
} from "./js/warningEngine.js";
import {
  generateTravelWeatherBrief,
  askAssistantQuestion
} from "./js/aiAssistant.js";
import {
  buildCanonicalSnapshot,
  computeHashes,
  Web3AttestationManager,
  SEPOLIA_CHAIN_ID_DEC
} from "./js/web3Attestation.js";

/* ============================================================
   ORIGINAL CONSTANTS AND SELECTORS PRESERVED
   ============================================================ */

const weatherForm = document.querySelector(".weatherInput");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "ae5ec943abf34721262af7d2a9b23575";

/* ============================================================
   EXTENDED STATE & SELECTORS
   ============================================================ */

let currentUnit = "C"; // "C" or "F"
let currentCityName = "";
let currentCoords = null; // { lat, lon }
let currentDetailedForecast = null;
let currentAttractions = [];
let currentRiskEvaluation = null;
let currentCanonicalSnapshot = null;
let currentForecastHash = null;
let currentPlaceHash = null;

const searchSuggestions = document.getElementById("searchSuggestions");
const curatedChips = document.getElementById("curatedChips");
const forecastSection = document.getElementById("forecastSection");
const forecastGrid = document.getElementById("forecastGrid");
const risksSection = document.getElementById("risksSection");
const overallRiskBadge = document.getElementById("overallRiskBadge");
const warningsList = document.getElementById("warningsList");
const riskDisclaimer = document.getElementById("riskDisclaimer");
const aiSection = document.getElementById("aiSection");
const aiEngineBadge = document.getElementById("aiEngineBadge");
const aiSummaryText = document.getElementById("aiSummaryText");
const aiActivityText = document.getElementById("aiActivityText");
const aiBestDaysText = document.getElementById("aiBestDaysText");
const aiPrecautionsList = document.getElementById("aiPrecautionsList");
const aiQuestionInput = document.getElementById("aiQuestionInput");
const btnAskAi = document.getElementById("btnAskAi");
const chatAnswerBox = document.getElementById("chatAnswerBox");
const chatAnswerText = document.getElementById("chatAnswerText");
const tourismSection = document.getElementById("tourismSection");
const attractionsGrid = document.getElementById("attractionsGrid");
const attractionsSourceBadge = document.getElementById("attractionsSourceBadge");
const web3Section = document.getElementById("web3Section");
const web3NetworkBadge = document.getElementById("web3NetworkBadge");
const snapshotPre = document.getElementById("snapshotPre");
const calculatedHashText = document.getElementById("calculatedHashText");
const placeHashText = document.getElementById("placeHashText");
const btnConnectWallet = document.getElementById("btnConnectWallet");
const btnAnchorForecast = document.getElementById("btnAnchorForecast");
const walletAddressText = document.getElementById("walletAddressText");
const contractAddressInput = document.getElementById("contractAddressInput");
const txStatusText = document.getElementById("txStatusText");
const txExplorerLinkContainer = document.getElementById("txExplorerLinkContainer");
const btnVerifyHash = document.getElementById("btnVerifyHash");
const verificationResult = document.getElementById("verificationResult");
const btnCelsius = document.getElementById("btnCelsius");
const btnFahrenheit = document.getElementById("btnFahrenheit");

const web3Manager = new Web3AttestationManager();

/* ============================================================
   ORIGINAL EVENT LISTENER (PRESERVED & EXTENDED)
   ============================================================ */

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value;
  if (city) {
    await handleCitySearch(city);
  } else {
    displayError("Please Enter A City");
  }
});

/* ============================================================
   ORIGINAL WEATHER FUNCTIONS (PRESERVED EXACTLY)
   ============================================================ */

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could Not Fetch Data");
  }

  return await response.json();
}

function displayWeatherInfo(data) {
  console.log(data);
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
    coord
  } = data;

  if (coord) {
    currentCoords = { lat: coord.lat, lon: coord.lon };
  }

  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  cityDisplay.textContent = city;
  cityDisplay.classList.add("cityDisplay");
  card.appendChild(cityDisplay);

  const celsiusVal = temp - 273.15;
  tempDisplay.textContent = formatTemp(celsiusVal, currentUnit);
  tempDisplay.classList.add("tempDisplay");
  card.appendChild(tempDisplay);

  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  humidityDisplay.classList.add("humidityDisplay");
  card.appendChild(humidityDisplay);

  descDisplay.textContent = description;
  descDisplay.classList.add("descDisplay");
  card.appendChild(descDisplay);

  weatherEmoji.textContent = displayEmoji(id);
  weatherEmoji.classList.add("weatherEmoji");
  card.appendChild(weatherEmoji);
}

function displayEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "🌩️";

    case weatherId >= 300 && weatherId < 400:
      return "🌧️";

    case weatherId >= 400 && weatherId < 500:
      return "⛈️";

    case weatherId >= 500 && weatherId < 600:
      return "🌧️";

    case weatherId >= 600 && weatherId < 700:
      return "🌨️";

    case weatherId >= 700 && weatherId < 800:
      return "༄.°";

    case weatherId === 800:
      return "⛅";

    case weatherId >= 800 && weatherId < 900:
      return "☁️";

    default:
      return "❓";
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");
  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}

/* ============================================================
   EXTENDED CITY SEARCH & PIPELINE COORDINATOR
   ============================================================ */

async function handleCitySearch(query, preferredCoords = null) {
  hideSuggestions();
  currentCityName = query;

  let owmSucceeded = false;
  // Step 1: Execute original OpenWeatherMap display
  try {
    const weatherData = await getWeatherData(query);
    displayWeatherInfo(weatherData);
    owmSucceeded = true;
  } catch (err) {
    console.warn("OpenWeatherMap direct search note:", err);
  }

  // Step 2: Determine coordinates
  let lat = preferredCoords?.lat;
  let lon = preferredCoords?.lon;
  let destinationName = query;

  if (!lat || !lon) {
    const locations = await searchLocations(query);
    if (locations && locations.length > 0) {
      lat = locations[0].latitude;
      lon = locations[0].longitude;
      destinationName = locations[0].displayName;
      currentCoords = { lat, lon };
    }
  }

  if (!lat || !lon) {
    if (!owmSucceeded) {
      displayError(`Could not find weather data for "${query}". Please check spelling.`);
    }
    return;
  }

  // If OWM did not succeed but geocoding did, show basic card info from Open-Meteo
  if (!owmSucceeded) {
    card.textContent = "";
    card.style.display = "flex";
    const cityDisplay = document.createElement("h1");
    cityDisplay.textContent = destinationName;
    cityDisplay.classList.add("cityDisplay");
    card.appendChild(cityDisplay);
  }

  // Step 3: Fetch 7-day detailed forecast from Open-Meteo
  try {
    const detailedForecast = await getDetailedForecast(lat, lon);
    currentDetailedForecast = detailedForecast;

    // Render 7-day forecast cards
    renderForecast(detailedForecast);

    // Step 4: Run Weather-Risk Warning Engine
    const riskEval = evaluateWeatherRisks(detailedForecast);
    currentRiskEvaluation = riskEval;
    renderRisks(riskEval);

    // Step 5: Discover Nearby Attractions
    const attractions = await fetchNearbyAttractions(lat, lon, query);
    currentAttractions = attractions;
    renderAttractions(attractions, query);

    // Step 6: Generate AI / Rule-Based Travel Brief
    const brief = await generateTravelWeatherBrief(
      destinationName,
      detailedForecast,
      attractions,
      riskEval
    );
    renderAiBrief(brief);

    // Step 7: Build Canonical Web3 Snapshot & Hashes
    await setupWeb3Attestation(destinationName, detailedForecast, riskEval.overallRiskLevel);
  } catch (err) {
    console.error("Error loading extended weather and tourism data:", err);
  }
}

/* ============================================================
   UI RENDERERS FOR EXTENDED FEATURES
   ============================================================ */

function renderForecast(forecast) {
  forecastSection.style.display = "block";
  forecastGrid.innerHTML = "";

  const daily = forecast.daily || [];
  daily.slice(0, 7).forEach((day, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "forecastDayCard";

    const dateObj = new Date(day.date);
    const dayLabel = index === 0 ? "Today" : dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    const maxT = formatTemp(day.maxTemp, currentUnit);
    const minT = formatTemp(day.minTemp, currentUnit);

    cardEl.innerHTML = `
      <div class="forecastDayDate">${dayLabel}</div>
      <div class="forecastDayEmoji">${day.emoji}</div>
      <div class="forecastDayTemps"><strong>${maxT}</strong> / ${minT}</div>
      <div class="forecastDayPrecip">🌧️ ${day.precipitationProbability}%</div>
    `;
    forecastGrid.appendChild(cardEl);
  });
}

function renderRisks(riskEval) {
  risksSection.style.display = "block";
  overallRiskBadge.textContent = `Risk Level: ${riskEval.overallRiskName}`;
  overallRiskBadge.className = `riskBadge risk-${riskEval.overallRiskName.toLowerCase()}`;
  riskDisclaimer.textContent = riskEval.disclaimer;

  warningsList.innerHTML = "";
  if (!riskEval.warnings || riskEval.warnings.length === 0) {
    const noRiskEl = document.createElement("div");
    noRiskEl.className = "warningCard";
    noRiskEl.innerHTML = `
      <div class="warningHeader"><span>✅ Favorable Travel Weather</span></div>
      <p class="warningImpact">No significant weather hazards or disruptions detected in the 7-day outlook.</p>
      <p class="warningPrecaution">Standard sightseeing precautions apply.</p>
    `;
    warningsList.appendChild(noRiskEl);
    return;
  }

  riskEval.warnings.forEach((w) => {
    const wEl = document.createElement("div");
    wEl.className = `warningCard severity-${w.severity}`;
    wEl.innerHTML = `
      <div class="warningHeader">
        <span>⚠️ ${w.condition}</span>
        <span style="font-size: 0.95rem; font-weight: normal; color: #555;">${w.date}</span>
      </div>
      <p class="warningImpact"><strong>Impact:</strong> ${w.impact}</p>
      <p class="warningPrecaution"><strong>Precaution:</strong> ${w.precaution}</p>
    `;
    warningsList.appendChild(wEl);
  });
}

function renderAttractions(attractions, queryCity) {
  tourismSection.style.display = "block";
  attractionsGrid.innerHTML = "";

  if (!attractions || !attractions.length) {
    attractionsGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">No tourist attractions found for this area.</p>`;
    return;
  }

  attractionsSourceBadge.textContent = attractions[0]?.source || "Wikipedia GeoSearch";

  attractions.forEach((attr) => {
    const cardEl = document.createElement("div");
    cardEl.className = "attractionCard";

    const fallbackImg = getCategoryFallback(attr.category, attr.name);
    const initialImg = attr.imageUrl || fallbackImg;

    const imgTag = `<img src="${initialImg}" alt="${attr.name}" class="attractionImg" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${fallbackImg}';" />`;

    cardEl.innerHTML = `
      ${imgTag}
      <div class="attractionBody">
        <div class="attractionHeaderRow">
          <h4 class="attractionTitle">${attr.name}</h4>
          <span class="attractionDistance">${attr.distanceKm} km</span>
        </div>
        <p class="attractionDesc">${attr.description}</p>
        <div class="attractionFooter">
          <a href="${attr.url}" target="_blank" rel="noopener noreferrer" class="attractionLink">Learn More ↗</a>
          <button type="button" class="checkWeatherBtn" data-lat="${attr.lat}" data-lon="${attr.lon}" data-name="${attr.name}">Check Weather</button>
        </div>
      </div>
    `;

    // Hook up Check Weather button
    cardEl.querySelector(".checkWeatherBtn").addEventListener("click", () => {
      cityInput.value = attr.name;
      handleCitySearch(attr.name, { lat: attr.lat, lon: attr.lon });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    attractionsGrid.appendChild(cardEl);
  });
}

function renderAiBrief(brief) {
  aiSection.style.display = "block";
  aiEngineBadge.textContent = brief.engineLabel;
  aiSummaryText.textContent = brief.summary;
  aiActivityText.textContent = brief.activityAdvice;
  aiBestDaysText.textContent = brief.bestDays;

  aiPrecautionsList.innerHTML = "";
  (brief.precautions || []).forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p;
    aiPrecautionsList.appendChild(li);
  });
}

/* ============================================================
   WEB3 ATTESTATION SETUP & CONTROLS
   ============================================================ */

async function setupWeb3Attestation(destinationName, forecast, riskLevel) {
  web3Section.style.display = "block";

  const { snapshotObj, canonicalJson } = buildCanonicalSnapshot(destinationName, forecast, riskLevel);
  currentCanonicalSnapshot = canonicalJson;

  snapshotPre.textContent = JSON.stringify(snapshotObj, null, 2);

  const { forecastHash, placeHash } = await computeHashes(canonicalJson, destinationName);
  currentForecastHash = forecastHash;
  currentPlaceHash = placeHash;

  calculatedHashText.textContent = forecastHash;
  placeHashText.textContent = placeHash;

  contractAddressInput.value = web3Manager.contractAddress;

  if (web3Manager.account) {
    btnAnchorForecast.disabled = false;
  }
}

// Connect MetaMask Button
btnConnectWallet.addEventListener("click", async () => {
  try {
    txStatusText.textContent = "Connecting to MetaMask...";
    const { account, chainId, isSepolia } = await web3Manager.connectWallet();
    walletAddressText.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
    btnConnectWallet.textContent = "🦊 Connected";
    btnConnectWallet.style.background = "#2b9348";

    if (!isSepolia) {
      web3NetworkBadge.textContent = `Network: Chain ${chainId} (Switching...)`;
      await web3Manager.switchToSepolia();
      web3NetworkBadge.textContent = "Network: Ethereum Sepolia";
    } else {
      web3NetworkBadge.textContent = "Network: Ethereum Sepolia";
    }

    btnAnchorForecast.disabled = false;
    txStatusText.textContent = "Wallet connected. Ready to record forecast on-chain.";
  } catch (err) {
    console.error("Wallet connection failed:", err);
    txStatusText.textContent = `Wallet Error: ${err.message}`;
  }
});

// Anchor Forecast Button
btnAnchorForecast.addEventListener("click", async () => {
  if (!currentForecastHash || !currentPlaceHash) {
    txStatusText.textContent = "No forecast hash calculated yet.";
    return;
  }

  const customContract = contractAddressInput.value.trim();
  if (customContract) {
    web3Manager.contractAddress = customContract;
    localStorage.setItem("weathertrail_contract_address", customContract);
  }

  btnAnchorForecast.disabled = true;
  txExplorerLinkContainer.innerHTML = "";

  try {
    const riskLevel = currentRiskEvaluation ? currentRiskEvaluation.overallRiskLevel : 0;
    const result = await web3Manager.anchorForecast(
      currentForecastHash,
      currentPlaceHash,
      riskLevel,
      (statusMsg) => {
        txStatusText.textContent = statusMsg;
      }
    );

    txStatusText.textContent = `Forecast anchored on-chain! Block: ${result.blockNumber}`;
    txExplorerLinkContainer.innerHTML = `
      <a href="${result.explorerUrl}" target="_blank" rel="noopener noreferrer" style="color: #2b9348; font-weight: bold; text-decoration: underline;">
        View Confirmed Transaction on Sepolia Etherscan ↗
      </a>
    `;
  } catch (err) {
    console.error("Attestation transaction error:", err);
    txStatusText.textContent = `Transaction failed: ${err.message || err}`;
  } finally {
    btnAnchorForecast.disabled = false;
  }
});

// Verify Hash Button
btnVerifyHash.addEventListener("click", async () => {
  if (!currentForecastHash) {
    alert("Please search for a destination first to generate a forecast hash.");
    return;
  }

  verificationResult.style.display = "block";
  verificationResult.textContent = "Querying contract records on Sepolia...";

  try {
    const rec = await web3Manager.verifyOnChain(currentForecastHash);
    if (rec.exists) {
      const dateStr = new Date(rec.timestamp * 1000).toLocaleString();
      verificationResult.innerHTML = `
        <strong>✅ On-Chain Verification Passed!</strong><br />
        Publisher: <code>${rec.publisher}</code><br />
        Severity Level: ${rec.riskLevel} (${SEVERITY_NAMES[rec.riskLevel]})<br />
        Recorded Timestamp: ${dateStr}<br />
        Block Number: ${rec.blockNumber}
      `;
    } else {
      verificationResult.innerHTML = `
        <strong>ℹ️ Hash Not Yet Anchored:</strong><br />
        Hash <code>${currentForecastHash.slice(0, 16)}...</code> is not currently recorded on this contract. Click "Record Forecast on Blockchain" to anchor it!
      `;
    }
  } catch (err) {
    verificationResult.textContent = `Verification query error: ${err.message}`;
  }
});

/* ============================================================
   INTERACTIVE AI CHAT ASSISTANT
   ============================================================ */

btnAskAi.addEventListener("click", async () => {
  const question = aiQuestionInput.value.trim();
  if (!question) return;

  chatAnswerBox.style.display = "block";
  chatAnswerText.textContent = "Analyzing forecast data...";

  const answer = await askAssistantQuestion(
    question,
    currentCityName,
    currentDetailedForecast,
    currentAttractions,
    currentRiskEvaluation
  );

  chatAnswerText.textContent = answer;
});

aiQuestionInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    btnAskAi.click();
  }
});

/* ============================================================
   CURATED DESTINATION CHIPS & AUTOCOMPLETE
   ============================================================ */

function initCuratedChips() {
  curatedChips.innerHTML = "";
  CURATED_DESTINATIONS.forEach((dest) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "curatedChip";
    const label = dest.country === "India" ? `${dest.name} (${dest.region})` : `${dest.name} (${dest.country})`;
    chip.textContent = label;
    chip.addEventListener("click", () => {
      cityInput.value = dest.name;
      handleCitySearch(dest.name, { lat: dest.lat, lon: dest.lon });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    curatedChips.appendChild(chip);
  });
}

// Autocomplete debounce
let searchTimeout = null;
cityInput.addEventListener("input", () => {
  const query = cityInput.value.trim();
  clearTimeout(searchTimeout);
  if (query.length < 2) {
    hideSuggestions();
    return;
  }
  searchTimeout = setTimeout(async () => {
    const results = await searchLocations(query);
    showSuggestions(results);
  }, 250);
});

function showSuggestions(locations) {
  if (!locations || !locations.length) {
    hideSuggestions();
    return;
  }
  searchSuggestions.innerHTML = "";
  locations.forEach((loc) => {
    const item = document.createElement("div");
    item.className = "suggestionItem";
    item.textContent = loc.displayName;
    item.addEventListener("click", () => {
      cityInput.value = loc.name;
      hideSuggestions();
      handleCitySearch(loc.name, { lat: loc.latitude, lon: loc.longitude });
    });
    searchSuggestions.appendChild(item);
  });
  searchSuggestions.style.display = "block";
}

function hideSuggestions() {
  searchSuggestions.style.display = "none";
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".inputWrapper")) {
    hideSuggestions();
  }
});

/* ============================================================
   UNIT TOGGLES (°C / °F)
   ============================================================ */

btnCelsius.addEventListener("click", () => {
  if (currentUnit === "C") return;
  currentUnit = "C";
  btnCelsius.classList.add("active");
  btnFahrenheit.classList.remove("active");
  refreshTemps();
});

btnFahrenheit.addEventListener("click", () => {
  if (currentUnit === "F") return;
  currentUnit = "F";
  btnFahrenheit.classList.add("active");
  btnCelsius.classList.remove("active");
  refreshTemps();
});

function refreshTemps() {
  if (currentDetailedForecast) {
    renderForecast(currentDetailedForecast);
    const tempDisplay = document.querySelector(".tempDisplay");
    if (tempDisplay && currentDetailedForecast.current) {
      tempDisplay.textContent = formatTemp(currentDetailedForecast.current.temp, currentUnit);
    }
  }
}

/* ============================================================
   INITIALIZATION
   ============================================================ */

initCuratedChips();

// Automatically load starter destination (Agra / Taj Mahal) on first launch
window.addEventListener("DOMContentLoaded", () => {
  cityInput.value = "Agra";
  handleCitySearch("Agra", { lat: 27.1767, lon: 78.0081 });
});
