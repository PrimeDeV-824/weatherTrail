// Tourism Discovery Service: Curated Indian & Global destinations,
// plus live nearby attraction discovery via Wikipedia GeoSearch & OpenStreetMap

export const CURATED_DESTINATIONS = [
  // India Priority
  {
    name: "Agra",
    region: "Uttar Pradesh",
    country: "India",
    lat: 27.1767,
    lon: 78.0081,
    tagline: "Home to the immortal Taj Mahal and Mughal imperial architecture",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/640px-Taj_Mahal_%28Edited%29.jpeg",
    category: "Heritage",
    highlights: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh"]
  },
  {
    name: "Jaipur",
    region: "Rajasthan",
    country: "India",
    lat: 26.9124,
    lon: 75.7873,
    tagline: "The Pink City: grand Rajput hill forts, royal palaces, and vibrant bazaars",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/640px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg",
    category: "Culture",
    highlights: ["Hawa Mahal", "Amber Fort", "City Palace", "Jantar Mantar"]
  },
  {
    name: "Varanasi",
    region: "Uttar Pradesh",
    country: "India",
    lat: 25.3176,
    lon: 82.9739,
    tagline: "One of the world's oldest living cities on the sacred banks of the Ganges",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg/640px-Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg",
    category: "Spiritual",
    highlights: ["Dashashwamedh Ghat", "Kashi Vishwanath Temple", "Assi Ghat", "Sarnath"]
  },
  {
    name: "Goa",
    region: "Goa",
    country: "India",
    lat: 15.2993,
    lon: 74.124,
    tagline: "Golden sun-kissed beaches, Portuguese colonial churches, and coastal cuisine",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Baga_Beach_Goa.jpg/640px-Baga_Beach_Goa.jpg",
    category: "Coastal",
    highlights: ["Palolem Beach", "Basilica of Bom Jesus", "Fort Aguada", "Dudhsagar Falls"]
  },
  {
    name: "Kerala (Alleppey)",
    region: "Kerala",
    country: "India",
    lat: 9.4981,
    lon: 76.3388,
    tagline: "God's Own Country: tranquil backwaters, houseboat cruises, and spice hills",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Alappuzha_Boat_Beauty_W.jpg/640px-Alappuzha_Boat_Beauty_W.jpg",
    category: "Nature",
    highlights: ["Vembanad Lake", "Marari Beach", "Munnar Tea Gardens", "Kumarakom"]
  },
  {
    name: "Hampi",
    region: "Karnataka",
    country: "India",
    lat: 15.335,
    lon: 76.46,
    tagline: "Spectacular UNESCO boulder-strewn ruins of the historic Vijayanagara Empire",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Stone_Chariot_at_Vijaya_Vittala_Temple_Complex%2C_Hampi.jpg/640px-Stone_Chariot_at_Vijaya_Vittala_Temple_Complex%2C_Hampi.jpg",
    category: "Archaeology",
    highlights: ["Virupaksha Temple", "Vijaya Vittala Stone Chariot", "Matanga Hill", "Lotus Mahal"]
  },
  {
    name: "Ladakh (Leh)",
    region: "Ladakh",
    country: "India",
    lat: 34.1526,
    lon: 77.5771,
    tagline: "The Land of High Passes: surreal Tibetan Buddhist monasteries and cobalt lakes",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pangong_Tso_Lake_Ladakh.jpg/640px-Pangong_Tso_Lake_Ladakh.jpg",
    category: "Adventure",
    highlights: ["Pangong Tso", "Nubra Valley", "Thiksey Monastery", "Khardung La"]
  },
  {
    name: "Rishikesh",
    region: "Uttarakhand",
    country: "India",
    lat: 30.0869,
    lon: 78.2676,
    tagline: "Yoga capital of the world set in the foothills of the scenic Himalayas",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Lakshman_Jhula_Rishikesh.jpg/640px-Lakshman_Jhula_Rishikesh.jpg",
    category: "Spiritual",
    highlights: ["Triveni Ghat", "Ram Jhula", "The Beatles Ashram", "Ganga River Rafting"]
  },
  {
    name: "Kaziranga",
    region: "Assam",
    country: "India",
    lat: 26.5775,
    lon: 93.1711,
    tagline: "Wild savannah sanctuary home to the world's great one-horned rhinoceroses",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Indian_Rhinoceros_in_Kaziranga_National_Park.jpg/640px-Indian_Rhinoceros_in_Kaziranga_National_Park.jpg",
    category: "Wildlife",
    highlights: ["One-Horned Rhino Safari", "Brahmaputra Floodplains", "Kaziranga Orchid Park"]
  },
  {
    name: "Andaman & Nicobar",
    region: "Andaman & Nicobar",
    country: "India",
    lat: 11.6234,
    lon: 92.7265,
    tagline: "Tropical archipelago paradise with turquoise coral reefs and historic heritage",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Radhanagar_Beach%2C_Havelock_Island.jpg/640px-Radhanagar_Beach%2C_Havelock_Island.jpg",
    category: "Island",
    highlights: ["Radhanagar Beach", "Cellular Jail", "Elephant Beach", "Baratang Caves"]
  },
  {
    name: "Mumbai",
    region: "Maharashtra",
    country: "India",
    lat: 18.922,
    lon: 72.8347,
    tagline: "The City of Dreams: Victorian Gothic monuments, Marine Drive, and Bollywood",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gateway_of_India_Mumbai.jpg/640px-Gateway_of_India_Mumbai.jpg",
    category: "Metropolis",
    highlights: ["Gateway of India", "Marine Drive", "Chhatrapati Shivaji Maharaj Terminus", "Elephanta Caves"]
  },

  // International Highlights
  {
    name: "Kyoto",
    region: "Kansai",
    country: "Japan",
    lat: 35.0116,
    lon: 135.7681,
    tagline: "Ancient capital of serene Zen gardens, torii gates, and bamboo groves",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Fushimi_Inari_Taisha_torii_pathway_Kyoto_Japan.jpg/640px-Fushimi_Inari_Taisha_torii_pathway_Kyoto_Japan.jpg",
    category: "Heritage",
    highlights: ["Fushimi Inari-taisha", "Kinkaku-ji (Golden Pavilion)", "Arashiyama Bamboo Grove"]
  },
  {
    name: "Paris",
    region: "Île-de-France",
    country: "France",
    lat: 48.8566,
    lon: 2.3522,
    tagline: "The City of Light: iconic art museums, Seine promenades, and café culture",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/640px-Tour_Eiffel_Wikimedia_Commons.jpg",
    category: "Culture",
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Montmartre"]
  },
  {
    name: "Rome",
    region: "Lazio",
    country: "Italy",
    lat: 41.9028,
    lon: 12.4964,
    tagline: "The Eternal City: gladiatorial arenas, Roman forums, and Vatican treasures",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/640px-Colosseo_2020.jpg",
    category: "Heritage",
    highlights: ["Colosseum", "Vatican Museums", "Pantheon", "Trevi Fountain"]
  },
  {
    name: "Bali",
    region: "Bali",
    country: "Indonesia",
    lat: -8.4095,
    lon: 115.1889,
    tagline: "Island of the Gods: cliffside sea temples, emerald rice terraces, and coral beaches",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Ulun_Danu_Bratan_Temple_Bali.jpg/640px-Ulun_Danu_Bratan_Temple_Bali.jpg",
    category: "Tropical",
    highlights: ["Tanah Lot", "Ubud Monkey Forest", "Uluwatu Temple", "Tegallalang Rice Terraces"]
  },
  {
    name: "Singapore",
    region: "Singapore",
    country: "Singapore",
    lat: 1.3521,
    lon: 103.8198,
    tagline: "Futuristic garden metropolis: supertrees, biodomes, and multicultural gastronomy",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Gardens_by_the_Bay_Supertrees_Singapore.jpg/640px-Gardens_by_the_Bay_Supertrees_Singapore.jpg",
    category: "Modern",
    highlights: ["Gardens by the Bay", "Marina Bay Sands", "Sentosa Island", "Jewel Changi"]
  },
  {
    name: "Cape Town",
    region: "Western Cape",
    country: "South Africa",
    lat: -33.9249,
    lon: 18.4241,
    tagline: "Breathtaking coastal headlands, Table Mountain cableway, and penguin colonies",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Table_Mountain_Cape_Town_South_Africa.jpg/640px-Table_Mountain_Cape_Town_South_Africa.jpg",
    category: "Nature",
    highlights: ["Table Mountain", "Cape Point", "Boulders Beach", "Kirstenbosch Gardens"]
  },
  {
    name: "Machu Picchu",
    region: "Cusco",
    country: "Peru",
    lat: -13.1631,
    lon: -72.545,
    tagline: "The Lost City of the Incas, perched high in the Andean cloud forests",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/640px-Machu_Picchu%2C_Peru.jpg",
    category: "Archaeology",
    highlights: ["Inca Citadel", "Huayna Picchu", "Intihuatana Stone", "Sun Gate"]
  },
  {
    name: "New York",
    region: "New York",
    country: "United States",
    lat: 40.7128,
    lon: -74.006,
    tagline: "The world's iconic cultural hub: Broadway theaters, skyline observation decks, and Central Park",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/640px-New_york_times_square-terabass.jpg",
    category: "Metropolis",
    highlights: ["Central Park", "Statue of Liberty", "Empire State Building", "Times Square"]
  },
  {
    name: "Tehran",
    region: "Tehran",
    country: "Iran",
    lat: 35.6892,
    lon: 51.389,
    tagline: "Gateway of the Persian plateau: Golestan Palace, Grand Bazaar, and Alborz snow peaks",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Golestan_Palace%2C_Tehran%2C_Iran.jpg/640px-Golestan_Palace%2C_Tehran%2C_Iran.jpg",
    category: "Heritage",
    highlights: ["Golestan Palace", "Milad Tower", "Azadi Tower", "National Museum of Iran"]
  },
  {
    name: "Damascus",
    region: "Damascus",
    country: "Syria",
    lat: 33.5138,
    lon: 36.2765,
    tagline: "Ancient pearl of the Levant: the majestic Umayyad Mosque and historic souks",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Umayyad_Mosque_Damascus.jpg/640px-Umayyad_Mosque_Damascus.jpg",
    category: "Heritage",
    highlights: ["Umayyad Mosque", "Al-Hamidiyah Souq", "Azm Palace", "Old City Gates"]
  }
];

// Calculate Haversine distance in km between two lat/lon pairs
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
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
 * Discover real tourist attractions near given coordinates using Wikipedia's public Geosearch API
 * Returns real articles, summaries, and licensed thumbnail images with external Wikipedia links.
 */
export async function fetchNearbyAttractions(lat, lon, cityName = "") {
  try {
    // 1. Geosearch query to Wikipedia
    const geoUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=15000&gslimit=10&format=json&origin=*`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error("Wikipedia GeoSearch network error");
    const geoData = await geoRes.json();

    const searchResults = geoData.query?.geosearch || [];
    if (!searchResults.length) {
      return getCuratedFallback(cityName, lat, lon);
    }

    const pageIds = searchResults.map((r) => r.pageid).join("|");

    // 2. Fetch page descriptions & thumbnails
    const detailsUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages|info&inprop=url&exintro=1&explaintext=1&exchars=240&piprop=thumbnail&pithumbsize=400&pageids=${pageIds}&format=json&origin=*`;
    const detailsRes = await fetch(detailsUrl);
    if (!detailsRes.ok) throw new Error("Wikipedia Details network error");
    const detailsData = await detailsRes.json();

    const pages = detailsData.query?.pages || {};

    const attractions = [];
    for (const item of searchResults) {
      const page = pages[item.pageid];
      if (!page) continue;

      const title = page.title || item.title;
      // Skip if it's merely the city page itself
      if (title.toLowerCase() === cityName.toLowerCase()) continue;

      const dist = calculateDistanceKm(lat, lon, item.lat, item.lon);
      attractions.push({
        id: item.pageid,
        name: title,
        category: "Point of Interest",
        lat: item.lat,
        lon: item.lon,
        distanceKm: dist,
        description: page.extract || `Notable historical and cultural attraction located near ${cityName}.`,
        imageUrl: page.thumbnail?.source || null,
        url: page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
        source: "Wikipedia Live GeoSearch"
      });
    }

    if (!attractions.length) {
      return getCuratedFallback(cityName, lat, lon);
    }

    // Sort by proximity
    attractions.sort((a, b) => a.distanceKm - b.distanceKm);
    return attractions.slice(0, 8);
  } catch (err) {
    console.warn("Live attraction discovery failed, using curated fallback:", err);
    return getCuratedFallback(cityName, lat, lon);
  }
}

/**
 * Returns curated fallback points of interest for known destinations
 */
export function getCuratedFallback(cityName, lat, lon) {
  const norm = (cityName || "").toLowerCase();
  const match = CURATED_DESTINATIONS.find((d) =>
    norm.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(norm)
  );

  if (match && match.highlights) {
    return match.highlights.map((h, idx) => ({
      id: `curated-${idx}`,
      name: h,
      category: match.category,
      lat: match.lat,
      lon: match.lon,
      distanceKm: calculateDistanceKm(lat, lon, match.lat, match.lon),
      description: `Curated highlight in ${match.name}: ${match.tagline}`,
      imageUrl: idx === 0 ? match.image : null,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(h.replace(/ /g, "_"))}`,
      source: "Curated Destination Guide"
    }));
  }

  // Generic fallback if completely unknown
  return [
    {
      id: "curated-city-center",
      name: `${cityName || "Destination"} Historic Old Town & Market`,
      category: "Culture",
      lat: lat,
      lon: lon,
      distanceKm: 0,
      description: `Explore the vibrant local markets, cafes, and central heritage sites around ${cityName || "the city"}.`,
      imageUrl: null,
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName || "tourist attraction")}`,
      source: "Curated Fallback"
    }
  ];
}
