<script>
  import { onMount, onDestroy } from "svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import leaflet_icon from "$lib/assets/marker-icon.png";

  export let points;
  export let selected_pdv;

  // Filter points that are close to the selected PDV
  function filterPoints(points) {
    if (!selected_pdv || !selected_pdv.latitude || !selected_pdv.longitude) return [];
    
    return points.filter((point) => {
      const latDiff = Math.abs(point.lngLat[0] - selected_pdv.latitude);
      const lngDiff = Math.abs(point.lngLat[1] - selected_pdv.longitude);

      return latDiff <= 0.005 && lngDiff <= 0.005 && point.eg !== selected_pdv.eg;
    });
  }

  let mapElement;
  let map;
  let markers;
  let nearby_pdvs;
  let filteredPoints = [];

  onMount(async () => {
    const leaflet = await import("leaflet");
    const { MarkerClusterGroup } = await import("leaflet.markercluster");

    // SVG template for nearby markers
    const svgTemplate = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="marker">
      <path fill-opacity=".25" d="M16 32s1.427-9.585 3.761-12.025c4.595-4.805 8.685-.99 8.685-.99s4.044 3.964-.526 8.743C25.514 30.245 16 32 16 32z"/>
      <path fill="#F7FADA" stroke="#000" d="M15.938 32S6 17.938 6 11.938C6 .125 15.938 0 15.938 0S26 .125 26 11.875C26 18.062 15.938 32 15.938 32zM16 6a4 4 0 100 8 4 4 0 000-8z"/>
    </svg>`;

    // Create nearby marker icon
    const nearby_icon = leaflet.divIcon({
      className: "marker",
      html: svgTemplate,
      iconSize: [20, 20],
      iconAnchor: [10, 20],
      popupAnchor: [7, -16],
    });

    // Create standard marker icon
    const icon = leaflet.icon({
      iconUrl: leaflet_icon,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    // Function to handle marker selection
    function select_marker(e) {
      selected_pdv = e.layer.options;
      
      // Update filtered points based on new selection
      filteredPoints = filterPoints(points);
      nearby_pdvs.clearLayers();

      // Add nearby PDVs to the map
      filteredPoints.forEach((point) => {
        let marker = leaflet.marker(point.lngLat, {
          icon: nearby_icon,
          title: point.nome,
          eg: point.eg,
          segmento: point.segmento,
          latitude: point.lngLat[0],
          longitude: point.lngLat[1],
          cidade: point.cidade,
          uf: point.uf,
          rede: point.rede,
          cluster_trade: point.cluster_trade,
          tamanho_loja: point.tamanho_loja,
          status_loja: point.status_loja,
          nome_fantasia: point.nome
        });

        // Create detailed tooltip
        marker.bindTooltip(`
          <div class="tooltip-content">
            <strong>${point.nome || 'N/A'}</strong><br>
            <strong>EG:</strong> ${point.eg || 'N/A'}<br>
            <strong>Segmento:</strong> ${point.segmento || 'N/A'}<br>
            <strong>Cidade/UF:</strong> ${point.cidade || 'N/A'}/${point.uf || 'N/A'}<br>
            <strong>Rede:</strong> ${point.rede || 'N/A'}
          </div>
        `, { className: 'custom-tooltip' });

        nearby_pdvs.addLayer(marker);
      });
    }

    // Initialize map with average coordinates
    const avgLat = points.reduce((sum, value) => sum + value.lngLat[0], 0) / points.length;
    const avgLng = points.reduce((sum, value) => sum + value.lngLat[1], 0) / points.length;
    
    map = leaflet.map(mapElement).setView([avgLat, avgLng], 5);

    // Add base tile layer
    const base = leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      .addTo(map);

    // Initialize marker cluster group
    markers = new MarkerClusterGroup({
      spiderfyOnMaxZoom: false,
      disableClusteringAtZoom: 17,
      chunkedLoading: true,
    });

    // Initialize nearby PDVs layer
    nearby_pdvs = new leaflet.LayerGroup();

    // Add markers for each point
    points
      .filter((row) => row.nome)
      .forEach((point) => {
        let marker = leaflet.marker(point.lngLat, {
          icon: icon,
          title: point.nome,
          eg: point.eg,
          segmento: point.segmento,
          latitude: point.lngLat[0],
          longitude: point.lngLat[1],
          cidade: point.cidade,
          uf: point.uf,
          rede: point.rede,
          cluster_trade: point.cluster_trade,
          tamanho_loja: point.tamanho_loja,
          status_loja: point.status_loja,
          nome_fantasia: point.nome
        });
        
        // Create detailed tooltip
        marker.bindTooltip(`
          <div class="tooltip-content">
            <strong>${point.nome || 'N/A'}</strong><br>
            <strong>EG:</strong> ${point.eg || 'N/A'}<br>
            <strong>Segmento:</strong> ${point.segmento || 'N/A'}<br>
            <strong>Cidade/UF:</strong> ${point.cidade || 'N/A'}/${point.uf || 'N/A'}<br>
            <strong>Rede:</strong> ${point.rede || 'N/A'}
          </div>
        `, { className: 'custom-tooltip' });
        
        markers.addLayer(marker).on("click", select_marker);
      });
      
    map.addLayer(markers);

    // If there's a selected PDV on initial load, show nearby PDVs
    if (selected_pdv && selected_pdv.latitude && selected_pdv.longitude) {
      filteredPoints = filterPoints(points);
      
      filteredPoints.forEach((point) => {
        let marker = leaflet.marker(point.lngLat, {
          icon: nearby_icon,
          title: point.nome,
          eg: point.eg,
          segmento: point.segmento,
          latitude: point.lngLat[0],
          longitude: point.lngLat[1],
          cidade: point.cidade,
          uf: point.uf,
          rede: point.rede,
          cluster_trade: point.cluster_trade,
          tamanho_loja: point.tamanho_loja,
          status_loja: point.status_loja,
          nome_fantasia: point.nome
        });
        
        // Create detailed tooltip
        marker.bindTooltip(`
          <div class="tooltip-content">
            <strong>${point.nome || 'N/A'}</strong><br>
            <strong>EG:</strong> ${point.eg || 'N/A'}<br>
            <strong>Segmento:</strong> ${point.segmento || 'N/A'}<br>
            <strong>Cidade/UF:</strong> ${point.cidade || 'N/A'}/${point.uf || 'N/A'}<br>
            <strong>Rede:</strong> ${point.rede || 'N/A'}
          </div>
        `, { className: 'custom-tooltip' });
        
        nearby_pdvs.addLayer(marker);
      });
    }

    // Set up layer controls
    var baseMaps = {};
    var overlayMaps = {
      "PDVs": markers,
    };

    var layerControl = leaflet.control
      .layers(baseMaps, overlayMaps, { collapsed: false })
      .addTo(map);

    layerControl.addOverlay(nearby_pdvs, "PDVs Próximos");
  });

  onDestroy(async () => {
    if (map) {
      console.log("Unloading Leaflet map.");
      map.remove();
    }
  });
</script>

<main>
  <div bind:this={mapElement}></div>
</main>

<style>
  @import "leaflet/dist/leaflet.css";
  @import "leaflet.markercluster/dist/MarkerCluster.Default.css";
  
  main div {
    position: fixed;
    top: 0;
    left: 33.33%;
    bottom: 0;
    right: 0;
    overflow: auto;
    z-index: -10;
  }
  
  :global(.custom-tooltip) {
    font-size: 12px;
    padding: 6px 8px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  
  :global(.tooltip-content) {
    max-width: 200px;
  }
</style>
