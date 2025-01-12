<script lang="typescript">
  import Mapa from "$lib/components/mapa_direta.svelte";
  import BarChart from "$lib/components/barChart.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import Carrousel from "$lib/components/carrousel.svelte";
  import Dropdown from "$lib/components/dropdown.svelte";
  import { Label } from "$lib/components/ui/label";
  import TableMapa from "$lib/components/tableMapa.svelte";
  import { Card } from "$lib/components/ui/card";
  export let data;

  export let selected_pdv = data.coletas[1];

  $: points = data.coletas.map((row) => ({
    lngLat: [row.latitude, row.longitude],
    eg: row.eg,
    nome: row.nome_fantasia,
    segmento: row.segmento,
  }));

  $: eg_selecionado = data.eg.filter((row) => row.eg == selected_pdv.eg);
  $: visitas = eg_selecionado.map((row) => row.data_visita);
</script>

<div class="w-full h-screen relative">
  <div class="w-full h-full absolute top-0 left-0 z-0">
    <Mapa {points} bind:selected_pdv />
  </div>
  <div
    class="absolute top-0 left-0 z-10 w-1/3 max-h-screen overflow-y-auto bg-slate-200 space-y-2 p-2"
  >
    <div class="bg-blue-700 rounded-lg">
      <h1 class="text-center font-bold text-slate-200">
        {selected_pdv.title}
      </h1>
    </div>
    <Card class="bg-white bg-opacity-90 p-4 text-center"></Card>

    <Card class="bg-white bg-opacity-90 p-4">
      <div class="my-2 mb-2"></div>
      <div class="h-[200px]"></div>
    </Card>

    <Card class="bg-white bg-opacity-90 p-4">
      <h2 class="font-bold mt-4">Materiais</h2>
      <div class="px-2"></div>
    </Card>

    <Card class="bg-white bg-opacity-90 p-4">
      <h2 class="font-bold mt-4">Imagens</h2>
      <div class="max-w-full items-center align-middle"></div>
      <h1>{JSON.stringify(visitas)}</h1>
    </Card>
  </div>
</div>
