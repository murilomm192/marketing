<script>
  import { onMount } from "svelte";
  import "leaflet/dist/leaflet.css";

  let map;
  const attractions = [
    {
      name: "Cristo Redentor",
      address:
        "Parque Nacional da Tijuca - Alto da Boa Vista, Rio de Janeiro - RJ",
      coords: [-22.9519, -43.2105],
      description: "One of the New Seven Wonders of the World",
    },
    {
      name: "Pão de Açúcar",
      address: "Urca, Rio de Janeiro - RJ",
      coords: [-22.9492, -43.1545],
      description: "Iconic cable car and stunning views of Rio",
    },
    {
      name: "Cataratas do Iguaçu",
      address: "Foz do Iguaçu - PR",
      coords: [-25.6953, -54.4367],
      description: "Magnificent waterfalls on Brazil-Argentina border",
    },
    {
      name: "Pelourinho",
      address: "Centro Histórico, Salvador - BA",
      coords: [-12.974, -38.5089],
      description: "Historic center with colonial architecture",
    },
    {
      name: "Teatro Amazonas",
      address: "Largo de São Sebastião - Centro, Manaus - AM",
      coords: [-3.1302, -60.0234],
      description: "Historic opera house in the Amazon",
    },
  ];

  onMount(() => {
    // We need to dynamically import Leaflet because it requires window object
    import("leaflet").then((L) => {
      // Create map centered on Brazil
      map = L.map("map").setView([-14.235, -51.9253], 4);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Add markers for each attraction
      attractions.forEach((attraction) => {
        const marker = L.marker(attraction.coords).addTo(map);
        marker.bindPopup(
          `<b>${attraction.name}</b><br>${attraction.description}`,
        );
      });
    });
  });
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-center mb-8 text-blue-800">
    Tourist Attractions in Brazil
  </h1>

  <!-- Map Container -->
  <div class="mb-8 rounded-lg overflow-hidden shadow-lg">
    <div id="map" class="h-[400px] w-full"></div>
  </div>

  <!-- Attractions List -->
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each attractions as attraction}
      <div
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <h2 class="text-xl font-semibold text-blue-800 mb-2">
          {attraction.name}
        </h2>
        <p class="text-gray-600 mb-2">
          {attraction.address}
        </p>
        <p class="text-gray-700">
          {attraction.description}
        </p>
      </div>
    {/each}
  </div>
</div>

<style>
  :global(.leaflet-container) {
    z-index: 0;
  }
</style>
