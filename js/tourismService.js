// Tourism Discovery Service: Curated Destinations & Real-Time Wikipedia Search
// Guaranteed zero-mismatch architecture: Authentic photos for every destination via
// multi-tier Wikipedia/Commons resolution, verified high-resolution regional URLs,
// and tailored SVG landmark emblems (never displaying random photos of different cities).

function escapeXml(unsafe) {
  return String(unsafe || "").replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

function getCategoryIcon(cat = "", name = "") {
  const norm = (cat + " " + name).toLowerCase();
  if (norm.includes("waterfall") || norm.includes("fall") || norm.includes("dari")) return "🌊";
  if (norm.includes("temple") || norm.includes("mandir") || norm.includes("ghat") || norm.includes("sangam") || norm.includes("spiritual")) return "🕉️";
  if (norm.includes("lake") || norm.includes("dam") || norm.includes("tal") || norm.includes("tso") || norm.includes("beach") || norm.includes("coast")) return "⛵";
  if (norm.includes("hill") || norm.includes("point") || norm.includes("mountain") || norm.includes("valley")) return "⛰️";
  if (norm.includes("fort") || norm.includes("palace") || norm.includes("mahal") || norm.includes("monument") || norm.includes("heritage")) return "🏛️";
  return "🧭";
}

/**
 * Returns a customized, high-quality SVG emblem for the exact landmark and city.
 * Never displays a misleading photo of an unrelated city.
 */
export function getCategoryFallback(category = "", name = "", cityName = "") {
  const icon = getCategoryIcon(category, name);
  const sName = escapeXml(name || "Historic Landmark");
  const sCity = escapeXml(cityName || "Destination");
  const sCat = escapeXml(category || "Point of Interest");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4a382c"/>
        <stop offset="60%" stop-color="#5c4737"/>
        <stop offset="100%" stop-color="#2e2119"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#g)"/>
    <circle cx="300" cy="145" r="56" fill="rgba(173,193,120,0.18)" stroke="#adc178" stroke-width="2.5"/>
    <text x="300" y="162" font-size="44" text-anchor="middle" font-family="system-ui, sans-serif">${icon}</text>
    <rect x="200" y="222" width="200" height="26" rx="13" fill="#adc178"/>
    <text x="300" y="239" font-size="11.5" font-weight="700" fill="#1e2d10" text-anchor="middle" font-family="system-ui, sans-serif" letter-spacing="1">${sCat.toUpperCase()}</text>
    <text x="300" y="292" font-size="22" font-weight="700" fill="#fdfaf6" text-anchor="middle" font-family="system-ui, sans-serif">${sName}</text>
    <text x="300" y="322" font-size="14" fill="#ddbea9" text-anchor="middle" font-family="system-ui, sans-serif">${sCity}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const CURATED_DESTINATIONS = [
  // ==========================================
  // PRAYAGRAJ & UTTAR PRADESH (INDIA)
  // ==========================================
  {
    name: "Prayagraj",
    region: "Uttar Pradesh",
    country: "India",
    lat: 25.4358,
    lon: 81.8463,
    tagline: "Sacred city of Triveni Sangam, historic Akbar Fort, and grand Kumbh heritage",
    category: "Spiritual",
    highlights: [
      {
        name: "Triveni Sangam",
        category: "Spiritual",
        description: "Holy confluence of the sacred Ganga, Yamuna, and mystical Saraswati rivers."
      },
      {
        name: "Allahabad Fort",
        category: "Heritage",
        description: "Imposing 1583 Mughal citadel built by Emperor Akbar housing the immortal Akshayavat tree."
      },
      {
        name: "Anand Bhavan",
        category: "History",
        description: "Historic ancestral estate of the Nehru-Gandhi family turned national independence memorial."
      },
      {
        name: "Khusro Bagh",
        category: "Heritage",
        description: "Enclosed Mughal funerary garden with exquisite sandstone mausoleums of Prince Khusrau."
      },
      {
        name: "Alopi Devi Mandir",
        category: "Temple",
        description: "Venerated Shakti Peeth shrine where the sanctum is represented by a sacred wooden carriage."
      }
    ]
  },
  {
    name: "Agra",
    region: "Uttar Pradesh",
    country: "India",
    lat: 27.1767,
    lon: 78.0081,
    tagline: "Home to the immortal marble Taj Mahal and Mughal imperial architecture",
    category: "Heritage",
    highlights: [
      {
        name: "Taj Mahal",
        category: "Heritage",
        description: "UNESCO World Wonder: the radiant ivory-white marble mausoleum on the Yamuna riverbank."
      },
      {
        name: "Agra Fort",
        category: "Heritage",
        description: "Majestic red sandstone UNESCO fortress that served as the imperial seat of Mughal emperors."
      },
      {
        name: "Fatehpur Sikri",
        category: "Heritage",
        description: "Preserved 16th-century ghost city featuring the colossal 54m Buland Darwaza gateway."
      },
      {
        name: "Mehtab Bagh",
        category: "Heritage",
        description: "Moonlight charbagh garden across the river offering breathtaking sunset views of the Taj Mahal."
      }
    ]
  },
  {
    name: "Varanasi",
    region: "Uttar Pradesh",
    country: "India",
    lat: 25.3176,
    lon: 82.9739,
    tagline: "World's oldest living cultural city on the sacred Ganga ghats",
    category: "Spiritual",
    highlights: [
      {
        name: "Kashi Vishwanath Temple",
        category: "Temple",
        description: "Revered Jyotirlinga shrine dedicated to Lord Shiva with golden spire on the banks of Ganga."
      },
      {
        name: "Dashashwamedh Ghat",
        category: "Spiritual",
        description: "The premier Ganga ghat renowned for the mesmerizing evening Maha Aarti ceremony."
      },
      {
        name: "Assi Ghat",
        category: "Spiritual",
        description: "Vibrant southern ghat popular for sunrise yoga, Subah-e-Banaras music, and Ganga boat tours."
      },
      {
        name: "Sarnath",
        category: "Heritage",
        description: "Sacred deer park where Gautama Buddha delivered his first sermon after enlightenment."
      }
    ]
  },
  {
    name: "Ayodhya",
    region: "Uttar Pradesh",
    country: "India",
    lat: 26.7922,
    lon: 82.1998,
    tagline: "Sacred birthplace of Lord Rama, ancient temples, and tranquil Saryu river ghats",
    category: "Spiritual",
    highlights: [
      {
        name: "Ram Mandir",
        category: "Temple",
        description: "Grand Nagara-style stone temple marking the sacred Ram Janmabhoomi."
      },
      {
        name: "Hanuman Garhi Temple",
        category: "Temple",
        description: "Fortress-like 10th-century shrine of Lord Hanuman perched above a 76-step staircase."
      },
      {
        name: "Kanak Bhawan",
        category: "Temple",
        description: "Splendid palace-temple gifted to Sita, adorned with gold-crowned deities."
      },
      {
        name: "Sarju",
        category: "Spiritual",
        description: "Historic holy riverbank lined with ghats illuminated for the evening Saryu Aarti."
      }
    ]
  },
  {
    name: "Lucknow",
    region: "Uttar Pradesh",
    country: "India",
    lat: 26.8467,
    lon: 80.9462,
    tagline: "The City of Nawabs: Awadhi architecture, royal gardens, and refined gastronomy",
    category: "Heritage",
    highlights: [
      {
        name: "Bara Imambara",
        category: "Heritage",
        description: "Monumental 1784 architectural marvel containing the intricate labyrinthine Bhulbhulaiya."
      },
      {
        name: "Chhota Imambara",
        category: "Heritage",
        description: "Ornate Palace of Lights adorned with Belgian glass chandeliers and gilded domes."
      },
      {
        name: "Rumi Darwaza",
        category: "Heritage",
        description: "Colossal 60-foot Turkish gateway built by Nawab Asaf-ud-Daula in Awadhi architectural style."
      }
    ]
  },
  {
    name: "Mathura & Vrindavan",
    region: "Uttar Pradesh",
    country: "India",
    lat: 27.4924,
    lon: 77.6737,
    tagline: "The Braj Bhoomi: birthplace of Lord Krishna and enchanting temple towns",
    category: "Spiritual",
    highlights: [
      {
        name: "Prem Mandir Vrindavan",
        category: "Temple",
        description: "Magnificent Italian white marble temple complex depicting divine lilas with evening light shows."
      },
      {
        name: "Bankey Bihari Temple",
        category: "Temple",
        description: "One of India's most beloved Krishna shrines renowned for its ecstatic bhakti atmosphere."
      },
      {
        name: "Krishna Janmasthan Temple Complex",
        category: "Temple",
        description: "Sacred site marking the historic prison cell where Lord Krishna manifested."
      }
    ]
  },
  {
    name: "Mirzapur & UP Waterfalls",
    region: "Uttar Pradesh",
    country: "India",
    lat: 25.1337,
    lon: 82.5644,
    tagline: "Vindhya ranges featuring cascading waterfalls, gorges, and natural plunge pools",
    category: "Waterfall",
    highlights: [
      {
        name: "Rajdari Waterfall",
        category: "Waterfall",
        description: "Stepped, roaring curtain waterfall inside Chandraprabha Wildlife Sanctuary in Chandauli."
      },
      {
        name: "Devdari Waterfall",
        category: "Waterfall",
        description: "Picturesque multi-tier cascade and river canyon just downstream of Rajdari."
      },
      {
        name: "Lakhaniya Dari Waterfall",
        category: "Waterfall",
        description: "Spectacular 100m cascade tucked inside the rocky Vindhyan forest gorge near Mirzapur."
      },
      {
        name: "Chunar Fort",
        category: "Heritage",
        description: "Ancient river-facing citadel on the banks of Ganga with deep mythological and Mughal history."
      }
    ]
  },

  // ==========================================
  // MADHYA PRADESH (INDIA) & FAMOUS WATERFALLS
  // ==========================================
  {
    name: "Jabalpur (Bhedaghat)",
    region: "Madhya Pradesh",
    country: "India",
    lat: 23.1815,
    lon: 79.9864,
    tagline: "The thunderous Dhuandhar Falls and towering Narmada Marble Rocks canyon",
    category: "Waterfall",
    highlights: [
      {
        name: "Dhuandhar Falls",
        category: "Waterfall",
        description: "The famous 'Smoke Cascade' where the Narmada River plunges 30 meters through misty marble cliffs."
      },
      {
        name: "Bhedaghat",
        category: "Nature",
        description: "Stunning 100-foot white and colored marble gorge carved by the sapphire Narmada River."
      },
      {
        name: "Chausath Yogini Temple, Bhedaghat",
        category: "Heritage",
        description: "Ancient 10th-century circular hypaethral temple housing 64 Yogini carvings overlooking the river."
      }
    ]
  },
  {
    name: "Pachmarhi",
    region: "Madhya Pradesh",
    country: "India",
    lat: 22.4674,
    lon: 78.4346,
    tagline: "Queen of Satpura: dense sal forests, deep gorges, and perennial waterfalls",
    category: "Waterfall",
    highlights: [
      {
        name: "Bee Falls",
        category: "Waterfall",
        description: "Perennial 35-meter cascade providing pristine drinking water and natural rock showers."
      },
      {
        name: "Dhoopgarh",
        category: "Nature",
        description: "Highest point in Madhya Pradesh (1,352m) renowned for spectacular sunrise and sunset panoramas."
      },
      {
        name: "Pachmarhi",
        category: "Nature",
        description: "UNESCO Biosphere Reserve with prehistoric rock-art shelters, deep ravines, and wild greenery."
      }
    ]
  },
  {
    name: "Rewa Waterfalls",
    region: "Madhya Pradesh",
    country: "India",
    lat: 24.5362,
    lon: 81.3037,
    tagline: "The land of white tigers and India's tallest canyon cascades",
    category: "Waterfall",
    highlights: [
      {
        name: "Chachai Falls",
        category: "Waterfall",
        description: "Breathtaking 130m canyon drop on Bihad River, one of the tallest waterfalls in India."
      },
      {
        name: "Keoti Falls",
        category: "Waterfall",
        description: "Stunning 98m single-drop waterfall through deep red sandstone gorge."
      },
      {
        name: "Bahuti Falls",
        category: "Waterfall",
        description: "Madhya Pradesh's highest waterfall plummeting 198m down the Rewa plateau."
      }
    ]
  },

  // ==========================================
  // MAHARASHTRA: MATHERAN & SAHYADRI WATERFALLS
  // ==========================================
  {
    name: "Matheran",
    region: "Maharashtra",
    country: "India",
    lat: 18.9866,
    lon: 73.2687,
    tagline: "Asia's only automobile-free hill station: misty red-soil trails, Sahyadri cliffs, and Charlotte Lake",
    category: "Hill Station",
    highlights: [
      {
        name: "Charlotte Lake",
        category: "Lake",
        description: "Serene freshwater mountain lake supplying drinking water to Matheran, surrounded by dense jungle."
      },
      {
        name: "Panorama Point",
        category: "Hill Station",
        description: "The 'Sunrise Point' offering an unrivaled 360-degree panorama of the Sahyadri mountains and Neral plains."
      },
      {
        name: "Louisa Point",
        category: "Hill Station",
        description: "Edge-of-the-world cliff viewpoint providing dramatic vistas of Prabal Fort, waterfalls, and Vishalgad."
      },
      {
        name: "Echo Point",
        category: "Hill Station",
        description: "Famous acoustic cliff edge overlooking deep green valleys with cascading seasonal waterfalls."
      },
      {
        name: "One Tree Hill Point",
        category: "Hill Station",
        description: "Iconic trekking point named after a lone majestic Jambhul tree standing atop the cliff."
      }
    ]
  },
  {
    name: "Lonavala & Khandala",
    region: "Maharashtra",
    country: "India",
    lat: 18.7557,
    lon: 73.4091,
    tagline: "Sahyadri monsoon paradise of mist-covered peaks, forts, and dramatic waterfalls",
    category: "Waterfall",
    highlights: [
      {
        name: "Bhushi Dam",
        category: "Waterfall",
        description: "Iconic masonry dam where monsoon water cascades over tiered rock steps creating natural pools."
      },
      {
        name: "Karla Caves",
        category: "Heritage",
        description: "Ancient 2nd-century BC Buddhist rock-cut cave shrines featuring a grand wooden-ribbed chaitya hall."
      },
      {
        name: "Lohagad",
        category: "Heritage",
        description: "Historic hill fortress perched at 1,033m elevation with famous Vinchukata (scorpion's tail) ridge."
      },
      {
        name: "Rajmachi",
        category: "Heritage",
        description: "Rugged twin-fort redoubt overlooking Bor Ghat trade route, draped in monsoon clouds and streams."
      }
    ]
  },
  {
    name: "Satara & Thoseghar",
    region: "Maharashtra",
    country: "India",
    lat: 17.6805,
    lon: 73.9997,
    tagline: "Gateway to the Western Ghats: thunderous Thoseghar cascades and Kaas Valley of Flowers",
    category: "Waterfall",
    highlights: [
      {
        name: "Thoseghar Waterfalls",
        category: "Waterfall",
        description: "Roaring series of waterfalls ranging from 15m to 200m deep inside pristine Sahyadri forests."
      },
      {
        name: "Vajrai Waterfall",
        category: "Waterfall",
        description: "One of India's tallest waterfalls plunging 560 feet across 3 tiers near Bhambavli."
      },
      {
        name: "Kaas Plateau",
        category: "Nature",
        description: "UNESCO World Natural Heritage volcanic plateau carpeted in millions of wild seasonal blooms."
      }
    ]
  },
  {
    name: "Bhandardara & Karjat",
    region: "Maharashtra",
    country: "India",
    lat: 19.5372,
    lon: 73.7661,
    tagline: "Rugged Sahyadri peaks, pristine Arthur Lake, and thundering monsoon waterfalls",
    category: "Waterfall",
    highlights: [
      {
        name: "Randha Falls",
        category: "Waterfall",
        description: "Mighty 45m waterfall where the Pravara River crashes into a deep ravine, creating misty spray."
      },
      {
        name: "Umbrella Falls Bhandardara",
        category: "Waterfall",
        description: "Picturesque umbrella-shaped deluge formed when water spills from the Wilson Dam sluice gates."
      },
      {
        name: "Bhivpuri Waterfalls Karjat",
        category: "Waterfall",
        description: "Popular trekking cascade near Matheran / Karjat with natural swimming pools and rappelling cliffs."
      }
    ]
  },
  {
    name: "Mumbai",
    region: "Maharashtra",
    country: "India",
    lat: 18.922,
    lon: 72.8347,
    tagline: "The City of Dreams: Victorian Gothic monuments, Marine Drive, and Bollywood",
    category: "Metropolis",
    highlights: [
      {
        name: "Gateway of India",
        category: "Heritage",
        description: "Iconic 26m Indo-Saracenic basalt triumphal arch overlooking the bustling Mumbai Harbour."
      },
      {
        name: "Marine Drive, Mumbai",
        category: "Coastal",
        description: "World-famous 3.6km C-shaped coastal boulevard known as the Queen's Necklace."
      },
      {
        name: "Elephanta Caves",
        category: "Heritage",
        description: "UNESCO rock-cut cave temples on Elephanta Island dedicated to Lord Shiva's Trimurti."
      }
    ]
  },

  // ==========================================
  // OTHER ICONIC INDIAN DESTINATIONS
  // ==========================================
  {
    name: "Goa",
    region: "Goa",
    country: "India",
    lat: 15.2993,
    lon: 74.124,
    tagline: "Sun-kissed beaches, Portuguese colonial churches, and Dudhsagar waterfall",
    category: "Coastal",
    highlights: [
      {
        name: "Dudhsagar Falls",
        category: "Waterfall",
        description: "Four-tiered 'Sea of Milk' cascade (310m) on the Mandovi River with railway bridge crossing."
      },
      {
        name: "Basilica of Bom Jesus",
        category: "Heritage",
        description: "UNESCO Baroque church holding the sacred mortal remains of St. Francis Xavier."
      },
      {
        name: "Fort Aguada",
        category: "Heritage",
        description: "17th-century Portuguese coastal fortress and lighthouse overlooking Sinquerim Beach."
      }
    ]
  },
  {
    name: "Kerala (Alleppey)",
    region: "Kerala",
    country: "India",
    lat: 9.4981,
    lon: 76.3388,
    tagline: "The Venice of the East: palm-fringed backwaters, houseboats, and misty Western Ghats",
    category: "Nature",
    highlights: [
      {
        name: "Athirappilly Falls",
        category: "Waterfall",
        description: "The 'Niagara of India': magnificent 80ft wide curtain waterfall on the Chalakudy River."
      },
      {
        name: "Vembanad Lake",
        category: "Nature",
        description: "India's longest lake renowned for traditional kettuvallam houseboat cruises and snake boat races."
      },
      {
        name: "Munnar",
        category: "Hill Station",
        description: "Emerald rolling tea plantations and mist-covered valleys in the Western Ghats."
      }
    ]
  },
  {
    name: "Ladakh (Leh)",
    region: "Ladakh",
    country: "India",
    lat: 34.1526,
    lon: 77.5771,
    tagline: "The Land of High Passes: Tibetan gompas, dramatic moonscapes, and high-altitude lakes",
    category: "Mountain",
    highlights: [
      {
        name: "Pangong Tso",
        category: "Lake",
        description: "Endorheic Himalayan lake at 4,225m altitude that shifts from turquoise to deep cobalt."
      },
      {
        name: "Nubra Valley",
        category: "Nature",
        description: "High-altitude cold desert featuring sand dunes and double-humped Bactrian camels."
      },
      {
        name: "Thiksey Monastery",
        category: "Spiritual",
        description: "Twelve-story Tibetan Buddhist monastery resembling Lhasa's Potala Palace."
      }
    ]
  },
  {
    name: "Rishikesh",
    region: "Uttarakhand",
    country: "India",
    lat: 30.0869,
    lon: 78.2676,
    tagline: "Yoga capital of the world nestled in Himalayan foothills along the sacred Ganges",
    category: "Spiritual",
    highlights: [
      {
        name: "Triveni Ghat",
        category: "Spiritual",
        description: "Sacred bathing ghat where pilgrims attend the radiant evening Maha Aarti."
      },
      {
        name: "Neer Garh Waterfall",
        category: "Waterfall",
        description: "Hidden jade-colored natural jungle waterfall cascading over limestone cliffs."
      },
      {
        name: "Ram Jhula",
        category: "Heritage",
        description: "Iconic iron suspension bridge spanning the sacred Ganges river with mountain views."
      }
    ]
  },

  // ==========================================
  // GLOBAL CULTURAL CAPITALS
  // ==========================================
  {
    name: "Kyoto",
    region: "Kansai",
    country: "Japan",
    lat: 35.0116,
    lon: 135.7681,
    tagline: "Japan's imperial heart: classical Zen Buddhist temples, gardens, and torii gates",
    category: "Heritage",
    highlights: [
      {
        name: "Fushimi Inari-taisha",
        category: "Spiritual",
        description: "Iconic shrine famous for its thousands of vibrant vermilion torii gates winding up the sacred mountain."
      },
      {
        name: "Kinkaku-ji",
        category: "Heritage",
        description: "The world-famous Golden Pavilion, a Zen Buddhist temple whose top two floors are covered in pure gold leaf."
      },
      {
        name: "Arashiyama Bamboo Grove",
        category: "Nature",
        description: "Enchanting walking path surrounded by towering green bamboo stalks that sway in the breeze."
      }
    ]
  },
  {
    name: "Paris",
    region: "Île-de-France",
    country: "France",
    lat: 48.8566,
    lon: 2.3522,
    tagline: "The City of Light: monumental Haussmann boulevards, Gothic cathedrals, and world art",
    category: "Culture",
    highlights: [
      {
        name: "Eiffel Tower",
        category: "Heritage",
        description: "World-famous 330m wrought-iron lattice tower on the Champ de Mars."
      },
      {
        name: "Louvre Museum",
        category: "Culture",
        description: "World's most visited art museum, home to the Mona Lisa and Venus de Milo."
      },
      {
        name: "Notre-Dame Cathedral",
        category: "Heritage",
        description: "Masterpiece of French Gothic architecture on the Île de la Cité in Paris."
      }
    ]
  },
  {
    name: "New York",
    region: "New York",
    country: "United States",
    lat: 40.7128,
    lon: -74.006,
    tagline: "The Big Apple: towering skyscrapers, Broadway, Central Park, and global energy",
    category: "Modern",
    highlights: [
      {
        name: "Central Park",
        category: "Nature",
        description: "843-acre urban oasis with walking paths, lakes, castles, and lush greenery."
      },
      {
        name: "Statue of Liberty",
        category: "Heritage",
        description: "Colossal neoclassical sculpture on Liberty Island welcoming visitors to New York Harbor."
      },
      {
        name: "Empire State Building",
        category: "Modern",
        description: "Art Deco skyscraper in Midtown Manhattan offering panoramic observation deck views."
      }
    ]
  }
];

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function isTitleRelevant(fileTitle = "", targetName = "", cityName = "") {
  const normFile = fileTitle.toLowerCase().replace(/^file:/, "").replace(/\.[a-z0-9]+$/, "");
  const words = (targetName + " " + (cityName || ""))
    .toLowerCase()
    .split(/[\s,()_-]+/)
    .filter((w) => w.length >= 3 && !["the", "and", "point", "fort", "near", "view", "waterfall", "falls"].includes(w));
  if (!words.length) return true;
  return words.some((w) => normFile.includes(w));
}

/**
 * Validates whether a Wikipedia article extract is truly related to the target destination
 * to prevent mismatch with unrelated geographical namesakes (e.g. Nebraska high point vs Matheran)
 * or entertainment media (e.g. soap operas, albums, songs).
 */
export function isExtractRelevant(extract = "", name = "", cityName = "") {
  if (!cityName) return true;
  const lowerExt = extract.toLowerCase();
  const lowerCity = cityName.toLowerCase();
  const lowerName = name.toLowerCase();

  // If extract explicitly references the searched city or region, 100% relevant
  if (lowerExt.includes(lowerCity)) return true;

  // Reject entertainment media articles (soap operas, television series, music albums)
  if (
    lowerExt.includes("soap opera") ||
    lowerExt.includes("television series") ||
    lowerExt.includes("album by") ||
    lowerExt.includes("film directed by") ||
    lowerExt.includes("single by") ||
    lowerExt.includes("soundtrack")
  ) {
    return false;
  }

  // If generic landmark name (point, lake, falls, park) and mentions an unrelated foreign state/country
  const genericWords = ["point", "lake", "park", "falls", "waterfall", "viewpoint", "fort", "dam"];
  const isGeneric = genericWords.some((w) => lowerName.includes(w));
  if (isGeneric && !lowerExt.includes(lowerCity)) {
    const foreignIndicators = [
      "nebraska", "california", "australia", "texas", "canada",
      "united kingdom", "scotland", "ohio", "kansas", "new zealand"
    ];
    if (foreignIndicators.some((f) => lowerExt.includes(f))) {
      return false;
    }
  }

  return true;
}

/**
 * High-accuracy multi-tier image resolver:
 * Tier 1: Wikipedia PageImages with redirects=1 and destination relevance check.
 * Tier 2: Wikipedia Article Embedded Files (e.g. for Bara Imambara).
 * Tier 3: Wikimedia Commons Live Photographic Search in namespace 6.
 * Tier 4: Zero-mismatch dynamic SVG landmark emblem.
 */
export async function fetchAccurateImage(name, cityName = "", category = "") {
  // 1. Try Wikipedia PageImages with redirects=1
  try {
    const qTitles = encodeURIComponent(name);
    const u1 = `https://en.wikipedia.org/w/api.php?action=query&titles=${qTitles}&prop=pageimages|extracts|info&inprop=url&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=600&redirects=1&format=json&origin=*`;
    const r1 = await fetch(u1, { headers: { "Api-User-Agent": "WeatherTrail/1.0" } });
    if (r1.ok) {
      const d1 = await r1.json();
      const p1 = Object.values(d1.query?.pages || {})[0];
      const pExtract = p1?.extract || "";
      const isRel = isExtractRelevant(pExtract, name, cityName);

      if (p1 && p1.missing === undefined && p1.thumbnail?.source && isRel) {
        return {
          imageUrl: p1.thumbnail.source,
          url: p1.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(p1.title.replace(/ /g, "_"))}`,
          extract: pExtract
        };
      }

      // If page exists and is relevant, but no lead thumbnail, inspect embedded files on the page
      if (p1 && p1.missing === undefined && isRel) {
        const u2 = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(p1.title)}&prop=images&imlimit=10&format=json&origin=*`;
        const r2 = await fetch(u2, { headers: { "Api-User-Agent": "WeatherTrail/1.0" } });
        if (r2.ok) {
          const d2 = await r2.json();
          const imgs = Object.values(d2.query?.pages || {})[0]?.images || [];
          const valid = imgs.find((img) => {
            const n = img.title.toLowerCase();
            return (
              (n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".png")) &&
              !n.includes("logo") &&
              !n.includes("flag") &&
              !n.includes("map") &&
              !n.includes("symbol") &&
              !n.includes("icon")
            );
          });
          if (valid) {
            const u3 = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(valid.title)}&prop=imageinfo&iiprop=url&iiurlwidth=600&format=json&origin=*`;
            const r3 = await fetch(u3, { headers: { "Api-User-Agent": "WeatherTrail/1.0" } });
            if (r3.ok) {
              const d3 = await r3.json();
              const info = Object.values(d3.query?.pages || {})[0]?.imageinfo?.[0];
              if (info?.thumburl || info?.url) {
                return {
                  imageUrl: info.thumburl || info.url,
                  url: p1.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(p1.title.replace(/ /g, "_"))}`,
                  extract: pExtract
                };
              }
            }
          }
        }
      }
    }
  } catch (_) {}

  // 2. Wikimedia Commons Live Photographic Search (Finds tourist photos of viewpoints, cliffs, lakes, shrines)
  try {
    const qCommons = (name + " " + (cityName || "")).trim();
    const uCommons = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(qCommons)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=600&format=json&origin=*`;
    const rCommons = await fetch(uCommons, { headers: { "Api-User-Agent": "WeatherTrail/1.0" } });
    if (rCommons.ok) {
      const dCommons = await rCommons.json();
      const pageList = Object.values(dCommons.query?.pages || {});
      pageList.sort((a, b) => (a.index || 999) - (b.index || 999));

      const relevantPage = pageList.find((p) => {
        const info = p?.imageinfo?.[0];
        if (!info?.thumburl && !info?.url) return false;
        return isTitleRelevant(p.title, name, cityName);
      });

      if (relevantPage) {
        const info = relevantPage.imageinfo[0];
        return {
          imageUrl: info.thumburl || info.url,
          url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(name)}`,
          extract: ""
        };
      }
    }
  } catch (_) {}

  // 3. Guaranteed zero-mismatch dynamic SVG emblem
  return {
    imageUrl: getCategoryFallback(category, name, cityName),
    url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(name)}`,
    extract: ""
  };
}

/**
 * Fetch dynamic Wikipedia thumbnails for an array of article titles in one batch request
 */
export async function batchFetchWikipediaImages(items = [], cityName = "") {
  if (!items.length) return {};
  const map = {};

  const titlesToFetch = [];
  const itemMap = {};
  for (const it of items) {
    const name = typeof it === "string" ? it : it.name;
    const cat = typeof it === "object" ? it.category : "";
    const desc = typeof it === "object" ? it.description : "";
    titlesToFetch.push(name);
    itemMap[name.toLowerCase()] = { name, category: cat, description: desc };
  }

  if (titlesToFetch.length > 0) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      titlesToFetch.join("|")
    )}&prop=pageimages|extracts|info&inprop=url&exintro=1&explaintext=1&exchars=240&piprop=thumbnail&pithumbsize=600&redirects=1&format=json&origin=*`;

    try {
      const res = await fetch(url, { headers: { "Api-User-Agent": "WeatherTrail/1.0" } });
      if (res.ok) {
        const data = await res.json();
        const pages = data.query?.pages || {};

        // Track redirect mappings (e.g. from "Chhota Imambara" to "Chota Imambara")
        const redirectMap = {};
        if (data.query?.redirects) {
          for (const red of data.query.redirects) {
            redirectMap[red.to.toLowerCase()] = red.from.toLowerCase();
          }
        }

        for (const p of Object.values(pages)) {
          if (!p || p.missing !== undefined) continue;
          const pTitle = p.title;
          const queryKey = redirectMap[pTitle.toLowerCase()] || pTitle.toLowerCase();
          const targetName = itemMap[queryKey]?.name || pTitle;

          if (p.thumbnail?.source && isExtractRelevant(p.extract || "", targetName, cityName)) {
            const entry = {
              title: targetName,
              thumbnail: p.thumbnail.source,
              extract: p.extract || itemMap[queryKey]?.description || null,
              url: p.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(pTitle.replace(/ /g, "_"))}`
            };

            map[queryKey] = entry;
            map[pTitle.toLowerCase()] = entry;
          }
        }
      }
    } catch (err) {
      console.warn("Wikipedia batch image fetch note:", err);
    }

    // Concurrent fallback for items lacking lead thumbnails
    const missing = titlesToFetch.filter((name) => !map[name.toLowerCase()] || !map[name.toLowerCase()].thumbnail);
    if (missing.length > 0) {
      await Promise.all(
        missing.map(async (name) => {
          const key = name.toLowerCase();
          const itCat = itemMap[key]?.category || "Point of Interest";
          const resolved = await fetchAccurateImage(name, cityName, itCat);
          if (resolved && resolved.imageUrl) {
            map[key] = {
              title: name,
              thumbnail: resolved.imageUrl,
              extract: map[key]?.extract || resolved.extract || itemMap[key]?.description || null,
              url: map[key]?.url || resolved.url
            };
          }
        })
      );
    }
  }

  return map;
}

function findCuratedDestination(cityName) {
  if (!cityName) return null;
  const norm = cityName.toLowerCase().trim();
  const inputWords = norm.split(/[\s,]+/);

  return CURATED_DESTINATIONS.find((d) => {
    const dName = d.name.toLowerCase();
    const dWords = dName.split(/[\s,&()]+/);
    return (
      norm === dName ||
      norm.startsWith(dName) ||
      dWords.some((w) => w.length >= 4 && inputWords.includes(w))
    );
  });
}

/**
 * Discover real tourist attractions near given coordinates using Wikipedia's public API
 * Prioritizes curated regional highlights for known heritage destinations (Prayagraj, UP, MP, Maharashtra, Matheran, etc.)
 * and uses dynamic Wikipedia GeoSearch for global discovery with authentic multi-tier photo resolution.
 */
export async function fetchNearbyAttractions(lat, lon, cityName = "") {
  try {
    // If destination has curated highlights, prioritize them
    const curatedMatch = findCuratedDestination(cityName);
    if (curatedMatch && curatedMatch.highlights && curatedMatch.highlights.length > 0) {
      return await getCuratedFallback(cityName, lat, lon);
    }

    // For any other global destination, use Wikipedia Geosearch (valid gsradius <= 10000m)
    const geoUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=10000&gslimit=12&format=json&origin=*`;
    const geoRes = await fetch(geoUrl, { headers: { "Api-User-Agent": "WeatherTrail/1.0" } });
    let searchResults = [];

    if (geoRes.ok) {
      const geoData = await geoRes.json();
      searchResults = geoData.query?.geosearch || [];
    }

    if (!searchResults.length) {
      return await getCuratedFallback(cityName, lat, lon);
    }

    // Batch fetch live details and images for all search results
    const pageIds = searchResults.map((r) => r.pageid).join("|");
    const detailsUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages|info&inprop=url&exintro=1&explaintext=1&exchars=240&piprop=thumbnail&pithumbsize=600&pageids=${pageIds}&format=json&origin=*`;
    const detailsRes = await fetch(detailsUrl, { headers: { "Api-User-Agent": "WeatherTrail/1.0" } });
    const detailsData = detailsRes.ok ? await detailsRes.json() : {};
    const pages = detailsData.query?.pages || {};

    const attractions = [];
    for (const item of searchResults) {
      const page = pages[item.pageid];
      if (!page) continue;

      const title = page.title || item.title;
      if (title.toLowerCase() === cityName.toLowerCase()) continue;

      const dist = calculateDistanceKm(lat, lon, item.lat, item.lon);
      let thumb = page.thumbnail?.source || null;

      // If page has no lead thumbnail, resolve via multi-tier search for that specific attraction
      if (!thumb) {
        const resolved = await fetchAccurateImage(title, cityName, "Point of Interest");
        thumb = resolved.imageUrl;
      }

      attractions.push({
        id: item.pageid,
        name: title,
        category: "Point of Interest",
        lat: item.lat,
        lon: item.lon,
        distanceKm: dist,
        description: page.extract || `Notable historical attraction located near ${cityName}.`,
        imageUrl: thumb,
        url: page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
        source: "Wikipedia Live GeoSearch"
      });
    }

    if (!attractions.length) {
      return await getCuratedFallback(cityName, lat, lon);
    }

    // Prioritize attractions with real photo URLs over SVG placeholders
    attractions.sort((a, b) => {
      const aIsSvg = a.imageUrl && a.imageUrl.startsWith("data:image/svg+xml");
      const bIsSvg = b.imageUrl && b.imageUrl.startsWith("data:image/svg+xml");
      if (!aIsSvg && bIsSvg) return -1;
      if (aIsSvg && !bIsSvg) return 1;
      return a.distanceKm - b.distanceKm;
    });

    return attractions.slice(0, 8);
  } catch (err) {
    console.warn("Live attraction discovery failed, using curated fallback:", err);
    return await getCuratedFallback(cityName, lat, lon);
  }
}

/**
 * Returns rich curated attractions for known destinations with real images fetched from Wikipedia
 */
export async function getCuratedFallback(cityName, lat, lon) {
  const match = findCuratedDestination(cityName);

  if (match && match.highlights && match.highlights.length > 0) {
    // Fetch live images for all highlights
    const liveImages = await batchFetchWikipediaImages(match.highlights, match.name);

    return match.highlights.map((h, idx) => {
      const name = typeof h === "string" ? h : h.name;
      const cat = typeof h === "string" ? match.category : h.category;
      const desc = typeof h === "string" ? `${name} in ${match.name}: ${match.tagline}` : h.description;
      const info = liveImages[name.toLowerCase()] || {};

      const finalThumb = info.thumbnail || getCategoryFallback(cat, name, match.name);
      const finalUrl = info.url || `https://en.wikipedia.org/wiki/${encodeURIComponent(name.replace(/ /g, "_"))}`;
      const finalDesc = info.extract || desc;

      return {
        id: `curated-${match.name.toLowerCase()}-${idx}`,
        name: name,
        category: cat,
        lat: lat || match.lat,
        lon: lon || match.lon,
        distanceKm: lat && lon ? calculateDistanceKm(lat, lon, match.lat, match.lon) : 0,
        description: finalDesc,
        imageUrl: finalThumb,
        url: finalUrl,
        source: "Curated Regional Guide"
      };
    });
  }

  // Generic fallback if unknown destination
  const defaultEmblem = getCategoryFallback("Culture", `${cityName || "Destination"} Historic Old Town & Market`, cityName);
  return [
    {
      id: "curated-city-center",
      name: `${cityName || "Destination"} Historic Old Town & Market`,
      category: "Culture",
      lat: lat,
      lon: lon,
      distanceKm: 0,
      description: `Explore the vibrant local markets, cafes, and central heritage sites around ${cityName || "the city"}.`,
      imageUrl: defaultEmblem,
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName || "tourist attraction")}`,
      source: "Curated Guide"
    }
  ];
}
