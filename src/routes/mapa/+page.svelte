<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import Mapa from "$lib/components/mapa.svelte";

  export let data;

  let nome = "a";

  let points = data.result.map((row) => ({
    lngLat: [row.latitude, row.longitude],
    nome: row.nome_fantasia,
    segmento: row.NGE,
  }));
</script>

<input type="text" bind:value={nome} class="w-1/4 border-2 border-black" />

<div class="">
  <Mapa {points} filter={nome} />
</div>
