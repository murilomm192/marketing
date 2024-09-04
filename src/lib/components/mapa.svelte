<script>
  import { onMount, onDestroy } from "svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import leaflet_icon from "$lib/assets/marker-icon.png";

  export let points;

  export let selected_pdv;

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.random() * (max - min + 1) + min;
  }
  let mapElement;
  let map;

  onMount(async () => {
    const leaflet = await import("leaflet");
    const { MarkerClusterGroup } = await import("leaflet.markercluster");
    const icon = leaflet.icon({ iconUrl: leaflet_icon });
    function select_marker(e) {
      selected_pdv = e.layer.options.chave;
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

    leaflet
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

    points
      .filter((row) => row.nome)
      .forEach((point) => {
        let marker = leaflet.marker(point.lngLat, {
          icon: icon,
          title: point.nome,
          chave: point.chave,
          segmento: point.segmento,
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
