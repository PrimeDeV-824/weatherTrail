# WeatherTrail 🧭

A handcrafted weather intelligence and travel discovery companion built for travelers, digital nomads, and explorers. 

WeatherTrail pairs live meteorological data with contextual travel guidance—answering not just *"what is the temperature?"* but *"what should I pack, what local food should I try, what is the history of this place, and are there weather hazards today?"*—alongside real-time nearby attraction discovery and optional Web3 forecast anchoring on Ethereum.

---

## 🧭 Why WeatherTrail?

Most weather apps only show you a couple of icons and temperature numbers. If you're heading out to Varanasi, Paris, Prayagraj, or Kyoto, numbers alone don't tell you:
- What fabrics to wear for the humidity and cultural sites
- Which famous street foods and regional delicacies to seek out
- The historical backdrop of where you're walking
- How to plan your itinerary around the best weather days of the week

WeatherTrail integrates live meteorological feeds, dynamic attraction discovery, and a responsive Travel Assistant into a single, cohesive dashboard with an earthy, warm artisan theme.

---

## ✨ Features

### 1. Live Weather & 7-Day Meteorological Forecast
- **Dual Engine**: Keeps OpenWeatherMap for instant current conditions while pulling hourly/daily trends (precipitation probability, high/low curves, UV index, and WMO weather codes) from Open-Meteo.
- **One-Click Unit Toggle**: Seamlessly switch between Celsius (°C) and Fahrenheit (°F) across all cards, forecast columns, and advisory widgets.
- **Global Search + Curated Chips**: Search any city or town worldwide with live geocoding autocomplete, or tap curated chips for top heritage and travel hubs across India and the globe.

### 2. Smart Travel Intelligence Assistant
- **Curated Knowledge Base (33+ Major Destinations)**: Deep, instant dossiers for places like Prayagraj, Agra, Jaipur, Varanasi, Goa, Kerala, Ladakh, Paris, Kyoto, Rome, New York, and many more. Ask about:
  - 🍲 **Best Local Food & Culinary Specialties** (e.g. Prayagraj's *Dam Aloo, Gujiya, Dehati Rasgulle*, Agra's *Petha*, Varanasi's *Kachori Sabzi & Malaiyo*)
  - 👕 **Clothing & Packing Recommendations** (fabrics, sun protection, temple dress codes, rain gear)
  - 🏛️ **History & Heritage Background** (ancient eras, dynasties, architectural milestones)
- **Live Destination Exploration Engine**: If you search a city not in the offline curated list, WeatherTrail connects to Wikipedia's live knowledge base to pull authentic history, landmarks, and travel context on the fly.
- **Blazing Fast (<1ms Cached) & Reliable**: Responses are cached in-memory. If external cloud AI providers are slow or offline, the local intelligence engine answers immediately with rich, human-readable travel advice—no annoying delays, no confusing markdown pipe tables, and no broken layouts.
- **Multi-Model Cloud Proxy**: Built-in support for Google Gemini and OpenAI if you provide an API key in `.env` or during runtime.

### 3. Nearby Attractions & Heritage Discovery
- Uses Wikipedia Live GeoSearch to locate genuine historical and cultural points of interest within radius of your searched coordinates.
- Displays thumbnail imagery, actual distance in kilometers, concise architectural summaries, and a one-click **"Check Weather"** button to inspect weather specifically at that monument.

### 4. Travel Weather Risk & Advisory Engine
- Evaluates real-time meteorological indicators: extreme heat (≥38°C), freezing cold (≤0°C), heavy rainfall, thunderstorms, and high wind gusts.
- Categorizes advisory levels from **Low** to **Severe** with clear, practical precautions (hydration, transport delays, indoor alternatives) rather than cryptic meteorological jargon.

### 5. Web3 Forecast Attestation (Ethereum Sepolia)
- Need an immutable timestamped record of weather conditions (e.g. for parametric travel insurance experiments, event proofs, or decentralized travel logs)?
- WeatherTrail formats a canonical JSON snapshot of the forecast, computes its cryptographic Keccak-256 hash, and lets you anchor it onto the **Ethereum Sepolia Testnet** via MetaMask in a single transaction.
- Includes a built-in on-chain hash verification tool with direct links to [Sepolia Etherscan](https://sepolia.etherscan.io).

---

## 🎨 Visual Identity & Human-Crafted Design

The user interface is designed with a warm, earthy, tactile palette that feels like a traveler's field notebook:
- **Primary Mocha**: `#6c584c` & `#3b2a21` (warm espresso & rich earth tones)
- **Sage Olive**: `#adc178` (fresh nature accents)
- **Terracotta & Sand**: `#a98467` & `#ddbea9` (soft borders and chips)
- **Warm Parchment Canvas**: `#f6f3ee` (soft background that is easy on the eyes)
- **Typography**: Clean, readable typography using Google Fonts **Outfit** for elegant headers and **Plus Jakarta Sans** for crisp, comfortable UI text.
- **Custom Vector Favicon**: A crisp, warm compass-and-mountain emblem (`favicon.svg` and `favicon.ico`) that scales cleanly on desktop tabs, mobile bookmarks, and high-DPI displays.

---

## 🗂️ Project Architecture

```
TourismApp/
├── index.html               # Main dashboard layout (semantic, accessible, responsive)
├── style.css                # Polished theme styles, cards, grids, and responsive media queries
├── index.js                 # Application coordinator & event bus
├── server.js                # Lightweight Deno HTTP server with AI caching & static asset delivery
├── favicon.svg              # Scalable SVG favicon (compass & mountain silhouette)
├── favicon.ico              # Standard binary ICO fallback for legacy browsers & crawlers
├── .env.example             # Clean environment variable template
├── js/
│   ├── aiAssistant.js       # Travel intelligence, 33+ city knowledge base & live Wiki search
│   ├── weatherService.js    # Open-Meteo & OpenWeatherMap integrations, geocoding & unit math
│   ├── tourismService.js    # Wikipedia GeoSearch queries & fallback heritage guides
│   ├── warningEngine.js     # Deterministic risk engine evaluating heat, storms, rain & wind
│   ├── web3Attestation.js   # MetaMask connector, Keccak-256 hasher & smart contract caller
│   └── contractAbi.js       # ForecastAnchor ABI, bytecode & default contract address
├── contracts/
│   └── ForecastAnchor.sol   # Solidity smart contract for Sepolia attestation
├── scripts/
│   ├── compile.js           # Automated solc compiler script
│   └── deploy.js            # Automated Sepolia deployment script via Ethers v6
└── tests/
    ├── contract.test.js     # ABI integrity and event signature validation
    ├── warningEngine.test.js# Risk threshold test suite (safe, heat, rain, thunderstorm)
    └── weatherService.test.js# Unit conversions, WMO mapping & canonical hash tests
```

---

## 🚀 Getting Started

### Prerequisites
- [Deno](https://deno.com) (recommended, pre-installed) OR Node.js / any static web server (like Python `http.server` or VS Code Live Server).

### 1. Launching Locally with Deno

Clone or open the project folder, then run:

```bash
deno run -A server.js
```

The server will start at:
👉 **`http://localhost:3000`**

Open that URL in any modern browser (Chrome, Brave, Edge, Firefox, Safari).

### 2. Running Automated Tests

To run the full unit test suite (7 automated tests covering the risk engine, contract ABI, and cryptographic hashing):

```bash
deno test --allow-read --allow-net --allow-env tests/
```

Expected output:
```
ok | 7 passed | 0 failed
```

---

## 🌐 Deploying to the Web

Because WeatherTrail is written with clean vanilla ES modules and standard web APIs, it can be deployed anywhere in seconds:

- **Vercel / Netlify**: Simply link this repository or drag-and-drop the directory. The static assets (`index.html`, `style.css`, `index.js`, `favicon.svg`, `favicon.ico`, and `js/`) work out of the box with zero build step.
- **GitHub Pages**: Go to repository Settings -> Pages, select the root branch, and your site will be live with full HTTPS.
- **Docker / Cloud VPS**: Use `server.js` with Deno or Node to serve both the static assets and the server-side AI proxy.

---

## 🔑 Optional Cloud AI Configuration

WeatherTrail is completely autonomous and works right out of the box without requiring any API keys. Its built-in Travel Intelligence engine instantly provides food, clothing, history, and weather advice.

If you wish to route questions through Google Gemini or OpenAI:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your Gemini or OpenAI key:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   ```
3. Restart `server.js`. The proxy will automatically use the cloud LLM when available and fall back gracefully if limits are reached.

---

## ⛓️ Blockchain Smart Contract (Sepolia Testnet)

The contract `ForecastAnchor.sol` allows storing an immutable proof of weather on Ethereum Sepolia.

### Contract Functions:
- `anchorForecast(bytes32 forecastHash, bytes32 placeHash, uint8 riskLevel)`: Records the cryptographic hash of the weather snapshot with the sender's address and block timestamp.
- `verifyForecast(bytes32 forecastHash)`: Reads back the attester address, block timestamp, place hash, and risk level.

To deploy your own instance to Sepolia:
```bash
export SEPOLIA_RPC_URL="https://rpc.sepolia.org"
export PRIVATE_KEY="0xYourTestnetPrivateKey"
deno run -A scripts/deploy.js
```
Then paste the newly deployed contract address directly into the **Smart Contract** input field in the web UI.

---

## 📜 Attributions & Data Sources

- **Weather Feeds**: [OpenWeatherMap](https://openweathermap.org) & [Open-Meteo](https://open-meteo.com)
- **Heritage & Geographic Discovery**: [Wikipedia GeoSearch API](https://www.mediawiki.org/wiki/API:Geosearch)
- **Blockchain**: [Ethereum Sepolia Testnet](https://sepolia.etherscan.io) & [Ethers.js v6](https://docs.ethers.org/v6/)
- **Typography**: [Google Fonts (Outfit & Plus Jakarta Sans)](https://fonts.google.com)

---

*Safe travels and happy exploring! Weather conditions can evolve quickly—always pay attention to local advisories and official safety alerts when planning outdoor journeys.*
