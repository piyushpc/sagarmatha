// "Where We Work" client coverage map (Leaflet + OpenStreetMap, no API key required)

const CLIENTS = [
  // India — Gorakhpur area (nudged apart slightly where pins would overlap)
  { name: "Doordarshan Kendra", city: "Gorakhpur, India", lat: 26.7606, lng: 83.3852 },
  { name: "DDU Gorakhpur University", city: "Gorakhpur, India", lat: 26.7285, lng: 83.3690 },
  { name: "Hotel Vivek", city: "Gorakhpur, India", lat: 26.7654, lng: 83.3760 },
  { name: "Ansari Hotel", city: "Gorakhpur, India", lat: 26.7624, lng: 83.3700 },
  { name: "Kailash Saraf Factory", city: "Gorakhpur, India", lat: 26.7460, lng: 83.3900 },
  { name: "Bindu Traders", city: "Gorakhpur, India", lat: 26.7700, lng: 83.3600 },
  { name: "Krishna Stationery", city: "Gorakhpur, India", lat: 26.7580, lng: 83.3530 },
  { name: "Ganesh / Bhagwati Stationers", city: "Gorakhpur, India", lat: 26.7426, lng: 83.3650 },
  { name: "National Panasonic", city: "Gorakhpur, India", lat: 26.7396, lng: 83.3780 },
  { name: "Civil Line Hospital", city: "Basti, India", lat: 26.7920, lng: 82.7290 },

  // Nepal
  { name: "Siddhartha Flour Mills Pvt. Ltd.", city: "Kathmandu, Nepal", lat: 27.7010, lng: 85.3200 },
  { name: "Hotel Kasai", city: "Lumbini, Nepal", lat: 27.6360, lng: 83.4370 },
  { name: "Sharma Market", city: "Sonauli (border), Nepal", lat: 27.4500, lng: 83.4500 },
];

function initClientMap() {
  const mapEl = document.getElementById("clientMap");
  if (!mapEl || typeof L === "undefined") return;

  const map = L.map(mapEl, { scrollWheelZoom: false });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  const pinIcon = L.divIcon({
    className: "client-pin",
    html: `
      <svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 24 14 24s14-13.5 14-24c0-7.7-6.3-14-14-14z" fill="#14543A"/>
        <circle cx="14" cy="14" r="6" fill="#3DA35D"/>
      </svg>`,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -34],
  });

  const markers = CLIENTS.map((client) =>
    L.marker([client.lat, client.lng], { icon: pinIcon })
      .addTo(map)
      .bindPopup(`<strong>${client.name}</strong><br>${client.city}`)
  );

  // Frame the view around our pins rather than a fixed center/zoom, so the
  // map always shows just the India-Nepal coverage area, not the whole globe.
  const bounds = L.featureGroup(markers).getBounds();
  map.fitBounds(bounds.pad(0.5), { maxZoom: 9 });

  // The container can report a stale size right after creation (e.g. while
  // the section is still mid scroll-reveal transition); re-measure shortly
  // after init and once more on window resize so tiles always fill the box.
  setTimeout(() => map.invalidateSize(), 300);
  window.addEventListener("resize", () => map.invalidateSize());

  map.on("focus", () => map.scrollWheelZoom.enable());
  map.on("blur", () => map.scrollWheelZoom.disable());
}

document.addEventListener("DOMContentLoaded", initClientMap);
