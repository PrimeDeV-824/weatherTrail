// Tourism Discovery Service: Curated Destinations & Waterfalls
// Focused on Prayagraj, Uttar Pradesh, Madhya Pradesh, Maharashtra (especially Matheran), and Global highlights.
// Uses Wikipedia Live GeoSearch + Page Images API with guaranteed image fallbacks.

export const CATEGORY_FALLBACK_IMAGES = {
  waterfall: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&auto=format&fit=crop&q=80",
  heritage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80",
  temple: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80",
  lake: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
  hillstation: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
  default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
};

export function getCategoryFallback(category = "", name = "") {
  const norm = (category + " " + name).toLowerCase();
  if (norm.includes("fall") || norm.includes("waterfall") || norm.includes("dari")) {
    return CATEGORY_FALLBACK_IMAGES.waterfall;
  }
  if (norm.includes("temple") || norm.includes("ghat") || norm.includes("mandir") || norm.includes("stupa") || norm.includes("sangam")) {
    return CATEGORY_FALLBACK_IMAGES.temple;
  }
  if (norm.includes("lake") || norm.includes("tal") || norm.includes("dam") || norm.includes("tso")) {
    return CATEGORY_FALLBACK_IMAGES.lake;
  }
  if (norm.includes("point") || norm.includes("hill") || norm.includes("matheran") || norm.includes("pachmarhi") || norm.includes("valley")) {
    return CATEGORY_FALLBACK_IMAGES.hillstation;
  }
  if (norm.includes("fort") || norm.includes("palace") || norm.includes("mahal") || norm.includes("monument") || norm.includes("heritage")) {
    return CATEGORY_FALLBACK_IMAGES.heritage;
  }
  return CATEGORY_FALLBACK_IMAGES.default;
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
      { name: "Triveni Sangam", category: "Spiritual", description: "Holy confluence of the sacred Ganga, Yamuna, and mystical Saraswati rivers." },
      { name: "Allahabad Fort", category: "Heritage", description: "Imposing 1583 Mughal citadel built by Emperor Akbar housing the immortal Akshayavat tree." },
      { name: "Anand Bhavan", category: "History", description: "Historic ancestral estate of the Nehru-Gandhi family turned national independence memorial." },
      { name: "Khusro Bagh", category: "Heritage", description: "Enclosed Mughal funerary garden with exquisite sandstone mausoleums of Prince Khusrau." },
      { name: "Alopi Devi Mandir", category: "Temple", description: "Venerated Shakti Peeth shrine where the sanctum is represented by a sacred wooden carriage." }
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
      { name: "Taj Mahal", category: "Heritage", description: "UNESCO World Wonder: the radiant ivory-white marble mausoleum on the Yamuna riverbank." },
      { name: "Agra Fort", category: "Heritage", description: "Majestic red sandstone UNESCO fortress that served as the imperial seat of Mughal emperors." },
      { name: "Fatehpur Sikri", category: "Heritage", description: "Preserved 16th-century ghost city featuring the colossal 54m Buland Darwaza gateway." },
      { name: "Mehtab Bagh", category: "Heritage", description: "Moonlight charbagh garden across the river offering breathtaking sunset views of the Taj Mahal." }
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
      { name: "Kashi Vishwanath Temple", category: "Temple", description: "Revered Jyotirlinga shrine dedicated to Lord Shiva with golden spire on the banks of Ganga." },
      { name: "Dashashwamedh Ghat", category: "Spiritual", description: "The premier Ganga ghat renowned for the mesmerizing evening Maha Aarti ceremony." },
      { name: "Assi Ghat", category: "Spiritual", description: "Vibrant southern ghat popular for sunrise yoga, Subah-e-Banaras music, and Ganga boat tours." },
      { name: "Sarnath", category: "Heritage", description: "Sacred deer park where Gautama Buddha delivered his first sermon after enlightenment." }
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
      { name: "Ram Mandir Ayodhya", category: "Temple", description: "Grand Nagara-style stone temple marking the sacred Ram Janmabhoomi." },
      { name: "Hanuman Garhi Ayodhya", category: "Temple", description: "Fortress-like 10th-century shrine of Lord Hanuman perched above a 76-step staircase." },
      { name: "Kanak Bhavan", category: "Temple", description: "Splendid palace-temple gifted to Sita, adorned with gold-crowned deities." },
      { name: "Saryu River Ghats", category: "Spiritual", description: "Historic holy riverbank lined with ghats illuminated for the evening Saryu Aarti." }
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
      { name: "Bara Imambara", category: "Heritage", description: "Monumental 1784 architectural marvel containing the intricate labyrinthine Bhulbhulaiya." },
      { name: "Chhota Imambara", category: "Heritage", description: "Ornate Palace of Lights adorned with Belgian glass chandeliers and gilded domes." },
      { name: "Rumi Darwaza", category: "Heritage", description: "Colossal 60-foot Turkish gateway built by Nawab Asaf-ud-Daula in Awadhi architectural style." }
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
      { name: "Prem Mandir Vrindavan", category: "Temple", description: "Magnificent Italian white marble temple complex depicting divine lilas with evening light shows." },
      { name: "Bankey Bihari Temple", category: "Temple", description: "One of India's most beloved Krishna shrines renowned for its ecstatic bhakti atmosphere." },
      { name: "Krishna Janmasthan Temple Complex", category: "Temple", description: "Sacred site marking the historic prison cell where Lord Krishna manifested." }
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
      { name: "Lakhaniya Dari Waterfall", category: "Waterfall", description: "Spectacular 100m cascade tucked inside the rocky Vindhyan forest gorge near Mirzapur." },
      { name: "Rajdari Waterfall", category: "Waterfall", description: "Stepped, roaring curtain waterfall inside Chandraprabha Wildlife Sanctuary in Chandauli." },
      { name: "Devdari Waterfall", category: "Waterfall", description: "Picturesque multi-tier cascade and river canyon just downstream of Rajdari." },
      { name: "Windom Falls", category: "Waterfall", description: "Popular scenic natural waterfall and rock picnic retreat in the Mirzapur hill tracts." }
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
      { name: "Dhuandhar Falls", category: "Waterfall", description: "The famous 'Smoke Cascade' where the Narmada River plunges 30 meters through misty marble cliffs." },
      { name: "Marble Rocks Bhedaghat", category: "Nature", description: "Stunning 100-foot white and colored marble gorge carved by the sapphire Narmada River." },
      { name: "Chausath Yogini Temple Jabalpur", category: "Heritage", description: "Ancient 10th-century circular hypaethral temple housing 64 Yogini carvings overlooking the river." }
    ]
  },
  {
    name: "Pachmarhi",
    region: "Madhya Pradesh",
    country: "India",
    lat: 22.4674,
    lon: 78.4346,
    tagline: "Queen of the Satpuras: lush highland plateau with perennial forest waterfalls",
    category: "Waterfall",
    highlights: [
      { name: "Bee Falls Pachmarhi", category: "Waterfall", description: "Majestic 35m perennial forest waterfall popular for refreshing plunge pool bathing." },
      { name: "Duchess Fall Pachmarhi", category: "Waterfall", description: "Roaring 100m cascade tumbling across three tiers deep in the Satpura hills." },
      { name: "Dhoopgarh", category: "Nature", description: "Highest peak in the Satpura mountain range (1,352m) renowned for sunset panoramas." },
      { name: "Jata Shankar Cave", category: "Spiritual", description: "Natural stalactite cave shrine where Lord Shiva is believed to have hidden from Bhasmasura." }
    ]
  },
  {
    name: "Khajuraho",
    region: "Madhya Pradesh",
    country: "India",
    lat: 24.8318,
    lon: 79.9199,
    tagline: "UNESCO World Heritage marvel of medieval Chandela sandstone temple art",
    category: "Heritage",
    highlights: [
      { name: "Kandariya Mahadeva Temple", category: "Heritage", description: "The pinnacle of medieval Indian architecture with over 800 intricately carved sculptures." },
      { name: "Lakshmana Temple Khajuraho", category: "Heritage", description: "Exquisitely preserved 10th-century Panchayatana sandstone temple dedicated to Vaikuntha Vishnu." },
      { name: "Raneh Falls", category: "Waterfall", description: "Dramatic 30m canyon waterfall plunging through crystalline multicolored pure granite rocks." }
    ]
  },
  {
    name: "Gwalior",
    region: "Madhya Pradesh",
    country: "India",
    lat: 26.2183,
    lon: 78.1828,
    tagline: "The Pearl in the necklace of forts: Rajput fortresses and Scindia royal palaces",
    category: "Heritage",
    highlights: [
      { name: "Gwalior Fort", category: "Heritage", description: "Impregnable 8th-century hilltop citadel featuring turquoise ceramic tilework on Man Mandir Palace." },
      { name: "Jai Vilas Palace", category: "Heritage", description: "Grand 19th-century European-style royal palace housing the world's largest crystal chandeliers." },
      { name: "Sasbahu Temple Gwalior", category: "Heritage", description: "Spectacular 11th-century twin temples covered in fine red sandstone figurative reliefs." }
    ]
  },
  {
    name: "Ujjain",
    region: "Madhya Pradesh",
    country: "India",
    lat: 23.1765,
    lon: 75.7885,
    tagline: "Sacred city of Mahakal on the banks of Shipra, host of the historic Simhastha Kumbh",
    category: "Spiritual",
    highlights: [
      { name: "Mahakaleshwar Jyotirlinga", category: "Temple", description: "One of the 12 sacred Jyotirlingas, famous for the auspicious dawn Bhasma Aarti." },
      { name: "Ram Ghat Ujjain", category: "Spiritual", description: "Ancient holy riverfront on the Shipra River where Kumbh Mela ritual bathing takes place." },
      { name: "Kal Bhairav Temple Ujjain", category: "Temple", description: "Unique Tantric shrine dedicated to Ujjain's guardian deity where liquor is offered as prasad." }
    ]
  },
  {
    name: "Rewa & Waterfalls",
    region: "Madhya Pradesh",
    country: "India",
    lat: 24.5362,
    lon: 81.3037,
    tagline: "The land of white tigers and India's tallest canyon cascades",
    category: "Waterfall",
    highlights: [
      { name: "Chachai Falls", category: "Waterfall", description: "Breathtaking 130m canyon drop on Bihad River, one of the tallest waterfalls in India." },
      { name: "Keoti Falls", category: "Waterfall", description: "Stunning 98m single-drop waterfall through deep red sandstone gorge." },
      { name: "Bahuti Falls", category: "Waterfall", description: "Madhya Pradesh's highest waterfall plummeting 198m down the Rewa plateau." }
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
      { name: "Charlotte Lake Matheran", category: "Lake", description: "Serene freshwater mountain lake supplying drinking water to Matheran, surrounded by dense jungle." },
      { name: "Panorama Point Matheran", category: "Hill Station", description: "The 'Sunrise Point' offering an unrivaled 360-degree panorama of the Sahyadri mountains and Neral plains." },
      { name: "Louisa Point Matheran", category: "Hill Station", description: "Edge-of-the-world cliff viewpoint providing dramatic vistas of Prabal Fort, waterfalls, and Vishalgad." },
      { name: "Echo Point Matheran", category: "Hill Station", description: "Famous acoustic cliff edge overlooking deep green valleys with cascading seasonal waterfalls." },
      { name: "One Tree Hill Point", category: "Hill Station", description: "Iconic trekking point named after a lone majestic Jambhul tree standing atop the cliff." }
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
      { name: "Kune Falls", category: "Waterfall", description: "Spectacular 200m 3-tiered waterfall set against the dramatic backdrop of Khandala hills." },
      { name: "Tiger Point Lonavala", category: "Hill Station", description: "Cliff-edge viewpoint with a sheer drop of over 650 meters overlooking roaring valley cascades." },
      { name: "Bhushi Dam", category: "Waterfall", description: "Iconic masonry dam where monsoon water cascades over tiered rock steps creating natural pools." },
      { name: "Karla Caves", category: "Heritage", description: "Ancient 2nd-century BC Buddhist rock-cut cave shrines featuring a grand wooden-ribbed chaitya hall." }
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
      { name: "Thoseghar Waterfalls", category: "Waterfall", description: "Roaring series of waterfalls ranging from 15m to 200m deep inside pristine Sahyadri forests." },
      { name: "Vajrai Waterfall", category: "Waterfall", description: "One of India's tallest waterfalls plunging 560 feet across 3 tiers near Bhambavli." },
      { name: "Kaas Plateau", category: "Nature", description: "UNESCO World Natural Heritage volcanic plateau carpeted in millions of wild seasonal blooms." }
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
      { name: "Randha Falls", category: "Waterfall", description: "Mighty 45m waterfall where the Pravara River crashes into a deep ravine, creating misty spray." },
      { name: "Umbrella Falls Bhandardara", category: "Waterfall", description: "Picturesque umbrella-shaped deluge formed when water spills from the Wilson Dam sluice gates." },
      { name: "Bhivpuri Waterfalls Karjat", category: "Waterfall", description: "Popular trekking cascade near Matheran / Karjat with natural swimming pools and rappelling cliffs." }
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
      { name: "Gateway of India", category: "Heritage", description: "Iconic 26m Indo-Saracenic basalt triumphal arch overlooking the bustling Mumbai Harbour." },
      { name: "Marine Drive Mumbai", category: "Coastal", description: "World-famous 3.6km C-shaped coastal boulevard known as the Queen's Necklace." },
      { name: "Elephanta Caves", category: "Heritage", description: "UNESCO rock-cut cave temples on Elephanta Island dedicated to Lord Shiva's Trimurti." }
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
      { name: "Dudhsagar Falls", category: "Waterfall", description: "Four-tiered 'Sea of Milk' cascade (310m) on the Mandovi River with railway bridge crossing." },
      { name: "Basilica of Bom Jesus", category: "Heritage", description: "UNESCO Baroque church holding the sacred mortal remains of St. Francis Xavier." },
      { name: "Fort Aguada", category: "Heritage", description: "17th-century Portuguese coastal fortress and lighthouse overlooking Sinquerim Beach." }
    ]
  },
  {
    name: "Kerala (Alleppey)",
    region: "Kerala",
    country: "India",
    lat: 9.4981,
    lon: 76.3388,
    tagline: "God's Own Country: tranquil backwaters, houseboat cruises, and Athirappilly falls",
    category: "Nature",
    highlights: [
      { name: "Athirappilly Falls", category: "Waterfall", description: "The 'Niagara of India': magnificent 80ft wide curtain waterfall on the Chalakudy River." },
      { name: "Vembanad Lake", category: "Nature", description: "India's longest lake renowned for traditional kettuvallam houseboat cruises and snake boat races." },
      { name: "Munnar Tea Gardens", category: "Hill Station", description: "Emerald rolling tea plantations and mist-covered valleys in the Western Ghats." }
    ]
  },
  {
    name: "Ladakh (Leh)",
    region: "Ladakh",
    country: "India",
    lat: 34.1526,
    lon: 77.5771,
    tagline: "Land of High Passes: cobalt mountain lakes and ancient Tibetan monasteries",
    category: "Adventure",
    highlights: [
      { name: "Pangong Tso", category: "Lake", description: "Endorheic Himalayan lake at 4,225m altitude that shifts from turquoise to deep cobalt." },
      { name: "Nubra Valley", category: "Nature", description: "High-altitude cold desert featuring sand dunes and double-humped Bactrian camels." },
      { name: "Thiksey Monastery", category: "Spiritual", description: "Twelve-story Tibetan Buddhist monastery resembling Lhasa's Potala Palace." }
    ]
  },
  {
    name: "Rishikesh",
    region: "Uttarakhand",
    country: "India",
    lat: 30.0869,
    lon: 78.2676,
    tagline: "Yoga capital of the world and Himalayan gateway on the crystal Ganges",
    category: "Spiritual",
    highlights: [
      { name: "Triveni Ghat Rishikesh", category: "Spiritual", description: "Sacred bathing ghat where pilgrims attend the radiant evening Maha Aarti." },
      { name: "Neer Garh Waterfall", category: "Waterfall", description: "Hidden jade-colored natural jungle waterfall cascading over limestone cliffs." },
      { name: "Ram Jhula", category: "Heritage", description: "Iconic iron suspension bridge spanning the sacred Ganges river with mountain views." }
    ]
  },

  // ==========================================
  // INTERNATIONAL HIGHLIGHTS
  // ==========================================
  {
    name: "Kyoto",
    region: "Kansai",
    country: "Japan",
    lat: 35.0116,
    lon: 135.7681,
    tagline: "Ancient capital of serene Zen gardens, torii gates, and bamboo groves",
    category: "Heritage",
    highlights: [
      { name: "Fushimi Inari-taisha", category: "Spiritual", description: "Iconic shrine famous for its thousands of vibrant vermilion torii gates winding up the sacred mountain." },
      { name: "Kinkaku-ji", category: "Heritage", description: "The world-famous Golden Pavilion, a Zen Buddhist temple whose top two floors are covered in pure gold leaf." },
      { name: "Arashiyama Bamboo Grove", category: "Nature", description: "Enchanting walking path surrounded by towering green bamboo stalks that sway in the breeze." }
    ]
  },
  {
    name: "Paris",
    region: "Île-de-France",
    country: "France",
    lat: 48.8566,
    lon: 2.3522,
    tagline: "The City of Light: iconic art museums, Seine promenades, and café culture",
    category: "Culture",
    highlights: [
      { name: "Eiffel Tower", category: "Heritage", description: "World-famous 330m wrought-iron lattice tower on the Champ de Mars." },
      { name: "Louvre Museum", category: "Culture", description: "World's most visited art museum, home to the Mona Lisa and Venus de Milo." },
      { name: "Notre-Dame Cathedral", category: "Heritage", description: "Masterpiece of French Gothic architecture on the Île de la Cité in Paris." }
    ]
  },
  {
    name: "New York",
    region: "New York",
    country: "United States",
    lat: 40.7128,
    lon: -74.006,
    tagline: "The iconic global metropolis: Broadway, Central Park, and world-class skylines",
    category: "Metropolis",
    highlights: [
      { name: "Central Park", category: "Nature", description: "843-acre urban oasis with walking paths, lakes, castles, and lush greenery." },
      { name: "Statue of Liberty", category: "Heritage", description: "Colossal neoclassical sculpture on Liberty Island welcoming visitors to New York Harbor." },
      { name: "Empire State Building", category: "Modern", description: "Art Deco skyscraper in Midtown Manhattan offering panoramic observation deck views." }
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

/**
 * Fetch dynamic Wikipedia thumbnails for an array of article titles in one batch request
 */
export async function batchFetchWikipediaImages(titles = []) {
  if (!titles.length) return {};
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
    titles.join("|")
  )}&prop=pageimages|extracts|info&inprop=url&exintro=1&explaintext=1&exchars=240&piprop=thumbnail&pithumbsize=600&format=json&origin=*`;

  try {
    const res = await fetch(url, { headers: { "Api-User-Agent": "WeatherTrail/1.0" } });
    if (!res.ok) return {};
    const data = await res.json();
    const pages = data.query?.pages || {};
    const map = {};

    for (const p of Object.values(pages)) {
      if (!p || p.missing !== undefined) continue;
      map[p.title.toLowerCase()] = {
        title: p.title,
        thumbnail: p.thumbnail?.source || null,
        extract: p.extract || null,
        url: p.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(p.title.replace(/ /g, "_"))}`
      };
    }
    return map;
  } catch (err) {
    console.warn("Wikipedia batch image fetch note:", err);
    return {};
  }
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
 * and uses dynamic Wikipedia GeoSearch for global discovery.
 */
export async function fetchNearbyAttractions(lat, lon, cityName = "") {
  try {
    // If destination has curated world-famous highlights (like Agra, Prayagraj, Matheran), prioritize them
    const curatedMatch = findCuratedDestination(cityName);
    if (curatedMatch && curatedMatch.highlights && curatedMatch.highlights.length > 0) {
      return await getCuratedFallback(cityName, lat, lon);
    }

    // For any other global destination, use Wikipedia Geosearch (valid gsradius <= 10000m)
    const geoUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=10000&gslimit=10&format=json&origin=*`;
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
      const thumb = page.thumbnail?.source || getCategoryFallback("heritage", title);

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

    attractions.sort((a, b) => a.distanceKm - b.distanceKm);
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
    const titles = match.highlights.map((h) => (typeof h === "string" ? h : h.name));
    // Fetch live high-resolution images from Wikipedia for all highlights
    const liveImages = await batchFetchWikipediaImages(titles);

    return match.highlights.map((h, idx) => {
      const name = typeof h === "string" ? h : h.name;
      const cat = typeof h === "string" ? match.category : h.category;
      const desc = typeof h === "string" ? `${name} in ${match.name}: ${match.tagline}` : h.description;
      const info = liveImages[name.toLowerCase()] || {};

      const finalThumb = info.thumbnail || getCategoryFallback(cat, name);
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
  return [
    {
      id: "curated-city-center",
      name: `${cityName || "Destination"} Historic Old Town & Market`,
      category: "Culture",
      lat: lat,
      lon: lon,
      distanceKm: 0,
      description: `Explore the vibrant local markets, cafes, and central heritage sites around ${cityName || "the city"}.`,
      imageUrl: CATEGORY_FALLBACK_IMAGES.heritage,
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName || "tourist attraction")}`,
      source: "Curated Guide"
    }
  ];
}
