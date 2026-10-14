import { assertEquals, assert } from "jsr:@std/assert";
import { fetchNearbyAttractions, getCategoryFallback } from "../js/tourismService.js";

Deno.test("Tourism Service - Lucknow Attractions have Authentic Images (No Amber Fort)", async () => {
  const attractions = await fetchNearbyAttractions(26.8467, 80.9462, "Lucknow");
  assert(attractions.length >= 3, "Must return at least 3 Lucknow attractions");

  const bara = attractions.find((a) => a.name.includes("Bara Imambara"));
  const chhota = attractions.find((a) => a.name.includes("Chhota Imambara"));
  const rumi = attractions.find((a) => a.name.includes("Rumi Darwaza"));

  assert(bara, "Bara Imambara must exist");
  assert(chhota, "Chhota Imambara must exist");
  assert(rumi, "Rumi Darwaza must exist");

  // Verify none of them use the old Amber Fort Unsplash fallback
  assert(!bara.imageUrl.includes("photo-1599661046289-e31897846e41"), "Bara Imambara must NOT show Amber Fort!");
  assert(!chhota.imageUrl.includes("photo-1599661046289-e31897846e41"), "Chhota Imambara must NOT show Amber Fort!");
  assert(!rumi.imageUrl.includes("photo-1599661046289-e31897846e41"), "Rumi Darwaza must NOT show Amber Fort!");

  // Verify they point to verified Wikipedia/Commons photos of Lucknow
  assert(bara.imageUrl.includes("Bara_Imambara") || bara.imageUrl.includes("wikipedia"), "Bara Imambara must use authentic Wikipedia image");
  assert(chhota.imageUrl.includes("Chhota_imambara") || chhota.imageUrl.includes("wikipedia"), "Chhota Imambara must use authentic Wikipedia image");
  assert(rumi.imageUrl.includes("Rumi_Darwaza") || rumi.imageUrl.includes("wikipedia"), "Rumi Darwaza must use authentic Wikipedia image");
});

Deno.test("Tourism Service - Matheran Attractions have Authentic Images (No Canadian Rockies)", async () => {
  const attractions = await fetchNearbyAttractions(18.9866, 73.2687, "Matheran");
  assert(attractions.length >= 4, "Must return Matheran attractions");

  const charlotte = attractions.find((a) => a.name.includes("Charlotte Lake"));
  const panorama = attractions.find((a) => a.name.includes("Panorama Point"));

  assert(charlotte, "Charlotte Lake must exist");
  assert(panorama, "Panorama Point must exist");

  // Verify none of them use the old Canadian Rockies Unsplash fallback
  assert(!charlotte.imageUrl.includes("photo-1464822759023-fed622ff2c3b"), "Charlotte Lake must NOT show Canadian Rockies!");
  assert(!panorama.imageUrl.includes("photo-1464822759023-fed622ff2c3b"), "Panorama Point must NOT show Canadian Rockies!");

  // Verify they point to authentic Matheran photos
  assert(charlotte.imageUrl.includes("Charlotte_Lake") || charlotte.imageUrl.includes("Matheran"), "Charlotte Lake must point to real lake photo");
  assert(panorama.imageUrl.includes("Matheran") || panorama.imageUrl.includes("Panorama"), "Panorama Point must point to real Matheran photo");
});

Deno.test("Tourism Service - Fallback generates custom SVG emblem instead of random photo", () => {
  const svgFallback = getCategoryFallback("Heritage", "Historic Gateway", "Lucknow");
  assert(svgFallback.startsWith("data:image/svg+xml"), "Fallback must be a data URI SVG");
  assert(decodeURIComponent(svgFallback).includes("Historic Gateway"), "Fallback SVG must contain landmark name");
  assert(decodeURIComponent(svgFallback).includes("Lucknow"), "Fallback SVG must contain city name");
});
