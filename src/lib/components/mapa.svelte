<script>
  import { onMount, onDestroy } from "svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import leaflet_icon from "$lib/assets/marker-icon.png";

  export let points;

  export let selected_pdv;

  export let pdvs_proximos;

  function filterPoints(points) {
    return points.filter((point) => {
      const latDiff = Math.abs(point.lngLat[0] - selected_pdv.latitude);
      const lngDiff = Math.abs(point.lngLat[1] - selected_pdv.longitude);

      return latDiff <= 0.005 && lngDiff <= 0.005;
    });
  }

  let filteredPoints = filterPoints(pdvs_proximos);

  let mapElement;
  let map;

  onMount(async () => {
    const leaflet = await import("leaflet");
    const { MarkerClusterGroup } = await import("leaflet.markercluster");

    const svgTemplate = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="marker">
      <path fill-opacity=".25" d="M16 32s1.427-9.585 3.761-12.025c4.595-4.805 8.685-.99 8.685-.99s4.044 3.964-.526 8.743C25.514 30.245 16 32 16 32z"/>
      <path fill="#F7FADA" stroke="#000" d="M15.938 32S6 17.938 6 11.938C6 .125 15.938 0 15.938 0S26 .125 26 11.875C26 18.062 15.938 32 15.938 32zM16 6a4 4 0 100 8 4 4 0 000-8z"/>
    </svg>`;

    const nearby_icon = leaflet.divIcon({
      className: "marker",
      html: svgTemplate,
      iconSize: [20, 20],
      iconAnchor: [10, 20],
      popupAnchor: [7, -16],
    });

    const icon = leaflet.icon({
      iconUrl: leaflet_icon,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });



    function select_marker(e) {
      selected_pdv = e.layer.options;
      console.log(selected_pdv);
      filteredPoints = filterPoints(pdvs_proximos);
      nearby_pdvs.clearLayers();

      console.log(filteredPoints);

      filteredPoints.forEach((point) => {
        let marker = leaflet.marker(point.lngLat, {
          icon: nearby_icon,
          title: point.nome,
          chave: point.chave,
          segmento: point.segmento,
          latitude: point.lngLat[0],
          longitude: point.lngLat[1],
        });

        marker.bindTooltip(
          point.nome + "<br>" + point.segmento + "<br>" + point.chave,
        );

        nearby_pdvs.addLayer(marker);
      });
    }

    map = leaflet.map(mapElement).setView(
      [
        points.reduce((sum, value) => {
          return sum + value.lngLat[0];
        }, 0) / points.length,
        [
          points.reduce((sum, value) => {
            return sum + value.lngLat[1];
          }, 0) / points.length,
        ],
      ],
      5,
    );

    const base = leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      .addTo(map);

    let markers = new MarkerClusterGroup({
      spiderfyOnMaxZoom: false,
      disableClusteringAtZoom: 17,
      chunkedLoading: true,
    });

    let nearby_pdvs = new leaflet.LayerGroup();

    points
      .filter((row) => row.nome)
      .forEach((point) => {
        let marker = leaflet.marker(point.lngLat, {
          icon: icon,
          title: point.nome,
          chave: point.chave,
          segmento: point.segmento,
          latitude: point.lngLat[0],
          longitude: point.lngLat[1],
        });
        marker.bindTooltip(
          point.nome +
            "<br>" +
            point.segmento +
            "<br>" +
            "<img src='" +
            point.fachada +
            "' h='200' w='200'/>",
        );
        markers.addLayer(marker).on("click", select_marker);
      });
    map.addLayer(markers);

    filteredPoints.forEach((point) => {
      let marker = leaflet.marker(point.lngLat, {
        icon: nearby_icon,
        title: point.nome,
        chave: point.chave,
        segmento: point.segmento,
        latitude: point.latitude,
        longitude: point.longitude,
      });
      marker.bindTooltip(
        point.nome + "<br>" + point.segmento + "<br>" + point.chave,
      );
      nearby_pdvs.addLayer(marker);
    });

    var baseMaps = {};

    var overlayMaps = {
      Pesquisas: markers,
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
</style>
