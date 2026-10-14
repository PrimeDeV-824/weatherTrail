# WeatherTrail 🧭

> **Weather Intelligence, Worldwide Tourism Discovery & Web3 Attestation**

WeatherTrail upgrades an existing weather application into an integrated Weather Intelligence and Tourism platform. It preserves the original OpenWeatherMap workflow while adding worldwide geocoding, 7-day forecasts, algorithmic travel-risk warnings, live attraction discovery (with priority for Indian destinations), an AI travel assistant with offline fallback, and on-chain forecast attestation on the Ethereum Sepolia testnet.

---

## 🌟 Key Features

1. **Original Weather App Preserved & Extended**:
   - Maintains the original search input, submit button, styling, OpenWeatherMap integration (`getWeatherData`), and card layout (`.cityDisplay`, `.tempDisplay`, `.humidityDisplay`, `.descDisplay`, `.weatherEmoji`).
   - Adds global geocoding autocomplete with region/country disambiguation.
   - 7-day meteorological forecast strip (high/low temps, precipitation probability, weather codes, and icons).
   - Instant °C / °F temperature conversion toggle.

2. **Worldwide Tourism Discovery (India Priority + Global)**:
   - **India Priority**: Agra & Taj Mahal, Jaipur, Varanasi, Goa, Kerala (Alleppey), Hampi, Ladakh (Leh), Rishikesh, Kaziranga, Andaman & Nicobar, and Mumbai.
   - **International**: Kyoto, Paris, Rome, Bali, Singapore, Cape Town, Machu Picchu, New York, Tehran, and Damascus.
   - **Live Attraction Discovery**: Queries Wikipedia GeoSearch and OpenStreetMap for real nearby attractions with verified summaries, distances, thumbnail images, Wikipedia links, and a 1-click "Check Weather" action for any attraction.
   - Seamless fallback to curated guides when external services are rate-limited or offline.

3. **Weather-Risk Warning Engine**:
   - Deterministic, configurable rule engine evaluating extreme heat (≥38°C), freezing cold (≤0°C), heavy rainfall (≥15mm or ≥65% chance), active thunderstorms (WMO codes 95, 96, 99), and gale-force winds (≥60 km/h).
   - Generates four severity levels (`Low`, `Moderate`, `High`, `Severe`) with specific trigger conditions, travel impacts, and practical precautions.
   - Includes transparent safety disclaimers distinguishing application alerts from official government meteorological warnings.

4. **AI Weather Intelligence & Travel Assistant**:
   - Generates weather summaries, activity guidance (indoor vs. outdoor recommendations), optimal sightseeing day identification, and packing precautions.
   - Interactive Q&A chat box strictly grounded in the displayed forecast and nearby attractions.
   - **Truthful Architecture**: Configurable for Google Gemini or OpenAI via the server proxy (`/api/ai-chat`). When no API key is provided or the service is offline, it transparently falls back to a deterministic rule-based analysis labeled `Deterministic Rule-Based Intelligence (Offline / Free Fallback)`—never fabricating an AI response.

5. **Web3 Blockchain Forecast Attestation**:
   - Minimal Solidity smart contract `ForecastAnchor.sol` with `anchorForecast(bytes32 forecastHash, bytes32 placeHash, uint8 riskLevel)` and `ForecastAnchored` event.
   - Canonical deterministic snapshot generation (lexicographically sorted JSON keys) and Keccak-256 cryptographic hashing.
   - Direct MetaMask integration (`window.ethereum`) with automatic Ethereum Sepolia testnet detection and 1-click network switching.
   - Real-time transaction status lifecycle and direct link to confirmed transactions on [Sepolia Etherscan](https://sepolia.etherscan.io).
   - Integrated on-chain verification tool to compare local hashes with stored contract records.

---

## 🛠️ Technology Stack & Data Providers

- **Frontend**: Vanilla HTML5, CSS3 (responsive pixel/warm aesthetic), Modern ES Modules, and Ethers.js v6.
- **Runtime & Tools**: Deno 2 / Node.js.
- **Smart Contract & Compiler**: Solidity `^0.8.20`, compiled with `solc` (v0.8.37).
- **Data Providers**:
  - [OpenWeatherMap API](https://openweathermap.org): Preserved current weather provider.
  - [Open-Meteo](https://open-meteo.com): Free global geocoding, 7-day daily forecast, UV index, and precipitation probability (non-commercial, attribution preserved).
  - [Wikipedia GeoSearch API](https://www.mediawiki.org/wiki/API:Geosearch): Public API for real nearby points of interest, summaries, and images.
  - [Ethereum Sepolia Testnet](https://sepolia.etherscan.io): Testnet blockchain for decentralized forecast attestations.

---

## 📂 Project Structure

```
TourismApp/
├── index.html               # Main entry point (preserves original markup & layout)
├── style.css                # Preserved baseline styles + WeatherTrail extensions
├── index.js                 # Application coordinator (preserves original weather logic)
├── server.js                # Lightweight static server & optional AI proxy
├── .env.example             # Safe environment variable configuration template
├── README.md                # Documentation and operational manual
├── js/
│   ├── weatherService.js    # Global geocoding, Open-Meteo 7-day forecast, unit converter
│   ├── tourismService.js    # Curated Indian/Global destinations & Wikipedia GeoSearch
│   ├── warningEngine.js     # Deterministic weather risk rules & precautions
│   ├── aiAssistant.js       # Grounded travel recommendations & interactive Q&A
│   ├── web3Attestation.js   # MetaMask connector, canonical hashing & contract calls
│   └── contractAbi.js       # Compiled Solidity ABI & bytecode
├── contracts/
│   └── ForecastAnchor.sol   # Solidity smart contract
├── scripts/
│   ├── compile.js           # Smart contract compilation script (solc)
│   └── deploy.js            # Sepolia testnet deployment script (ethers)
└── tests/
    ├── contract.test.js     # Contract ABI, signature, and encoder/decoder tests
    ├── warningEngine.test.js# Automated rule thresholds & severity tests
    └── weatherService.test.js# Temperature formatting & canonical hash tests
```

---

## 🚀 Getting Started

### 1. Prerequisites

This repository runs seamlessly with **Deno** (installed on your system).

### 2. Running the Application

To start the local development server:

```powershell
deno run -A server.js
```

Or specify a custom port:

```powershell
$env:PORT="3000"; deno run -A server.js
```

Then open your browser at `http://localhost:3000`.

*(Alternatively, because this is a standard web application, `index.html` can also be served using any local HTTP server like Python `python -m http.server 3000` or VS Code Live Server).*

---

## 🧪 Running Tests

WeatherTrail includes automated tests covering the risk engine, weather formatting, deterministic hashing, and smart contract specifications.

Run all tests:

```powershell
deno test -A tests/
```

Results:
```
running 1 test from ./tests/contract.test.js
ForecastAnchor Contract - ABI and Bytecode Integrity ... ok (6ms)
running 4 tests from ./tests/warningEngine.test.js
Warning Engine - Safe clear conditions yield Low risk ... ok (0ms)
Warning Engine - Thunderstorm triggers Severe risk ... ok (0ms)
Warning Engine - Heavy Rain triggers High risk ... ok (0ms)
Warning Engine - Extreme Heat triggers High risk with hydration advice ... ok (0ms)
running 2 tests from ./tests/weatherService.test.js
Weather Service - Condition Mapping & Conversions ... ok (0ms)
Web3 Attestation - Deterministic Canonical Snapshot & Hashing ... ok (1ms)

ok | 7 passed | 0 failed (132ms)
```

---

## ⛓️ Smart Contract: Compile & Deploy

### 1. Compile

The contract compilation script uses `solc` to compile `contracts/ForecastAnchor.sol` and updates `js/contractAbi.js`:

```powershell
deno run -A scripts/compile.js
```

### 2. Deploy to Sepolia Testnet

1. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Set your `SEPOLIA_RPC_URL` and `PRIVATE_KEY` with testnet Sepolia ETH (from a faucet such as [Google Cloud Web3 Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) or [Sepolia PoW Faucet](https://sepolia-faucet.pk910.de/)).
3. Execute the deployment script:
   ```powershell
   $env:SEPOLIA_RPC_URL="https://rpc.sepolia.org"; $env:PRIVATE_KEY="0xYourPrivateKey"; deno run -A scripts/deploy.js
   ```
4. Copy the resulting contract address and paste it into the UI under **Smart Contract** in the Web3 section, or update `DEFAULT_CONTRACT_ADDRESS` in `js/contractAbi.js`.

---

## 🤖 Configuring Optional AI Provider

By default, WeatherTrail functions 100% offline using its built-in **Deterministic Rule-Based Intelligence engine**, which analyzes precipitation, temperature ranges, and outdoor feasibility without an API key.

To enable LLM generation:
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/) or OpenAI.
2. Provide the key in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```
   or enter it when prompted in the UI.

---

## 🔒 Security & Safe Practice Reminders

- **No Committed Secrets**: Never commit `.env` or files containing private keys or secret API tokens.
- **Client-Side Wallet Safety**: Never share or paste private keys into the frontend. The application uses standard MetaMask transaction prompts (`window.ethereum.request`).
- **Safety Disclaimer**: Algorithmic weather risk indicators are calculated from open meteorological data and do not substitute for official civil defense or national weather service alerts.
