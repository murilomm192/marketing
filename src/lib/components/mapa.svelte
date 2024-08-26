<script>
  import { onMount, onDestroy } from "svelte";
  import { Button } from "$lib/components/ui/button/index.js";

  export let points;

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.random() * (max - min + 1) + min;
  }
  let mapElement;
  let map;

  onMount(async () => {
    const leaflet = await import("leaflet");
    const { MarkerClusterGroup } = await import("leaflet.markercluster");

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
        let marker = leaflet.marker(point.lngLat, { title: point.nome });
        marker.bindTooltip(
          point.nome +
            "<br>" +
            point.segmento +
            "<br>" +
            "<img src='" +
            `https://picsum.photos/200?random=${Math.floor(Math.random() * 10) + 1}` +
            "'/>",
        );
        markers.addLayer(marker);
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
    left: 25%;
    bottom: 0;
    right: 0;
    overflow: auto;
    z-index: -10;
  }
</style>
