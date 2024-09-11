<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import Mapa from "$lib/components/mapa.svelte";
  import BarChart from "$lib/components/barChart.svelte";
  import Carrousel from "$lib/components/carrousel.svelte";
  import Dropdown from "$lib/components/dropdown.svelte";
  import { Label } from "$lib/components/ui/label";
  import TableMapa from "$lib/components/tableMapa.svelte";
  import { Card } from "$lib/components/ui/card";

  export let data;

  let selected_pdv = data.result[0].chave;

  let cesta_selecionada = "cerveja";

  let points = data.result.map((row) => ({
    lngLat: [row.latitude, row.longitude],
    nome: row.nome_fantasia,
    chave: row.chave,
    segmento: row.segmentação_primária,
    fachada: row.fachada,
  }));

  $: ponto_clicado =
    selected_pdv != undefined
      ? data.result.filter((row) => row.chave == selected_pdv)[0]
      : [];

  $: volume_pdv =
    selected_pdv != undefined
      ? data.volumes
          .filter((row) => row.chave == selected_pdv)
          .sort((a, b) => (a.mes > b.mes ? 1 : -1))
      : [];

  let cestas = [
    "cerveja",
    "nab",
    "rgb",
    "brahma",
    "spaten",
    "corona",
    "bud",
    "stella",
    "skol",
    "antarctica",
    "guarana",
    "beats",
  ].map((row) => {
    return {
      value: row,
      name: row.charAt(0).toUpperCase() + row.slice(1),
    };
  });

  $: options = {
    title: {
      text: "Volume mês a mês",
      subtext:
        cesta_selecionada.charAt(0).toUpperCase() + cesta_selecionada.slice(1),
    },
    grid: {
      left: "10%",
      right: "10%",
      top: "25%",
      bottom: "10%",
    },
    xAxis: {
      type: "category",
      data: volume_pdv.map((row) => row.mes),
    },
    yAxis: {
      show: false,
      type: "value",
    },
    series: [
      {
        data: volume_pdv.map((row) => row[cesta_selecionada].toFixed(2)),
        label: {
          show: true,
          position: "top",
          valueAnimation: false,
        },
        type: "bar",
      },
    ],
  };

  $: pdv =
    ponto_clicado != undefined
      ? {
          nome: ponto_clicado.nome_fantasia,
          chave: ponto_clicado.chave,
          segmento_nge: ponto_clicado.NGE,
          fachada: ponto_clicado.fachada,
          cardapio: ponto_clicado.cardapio,
          interior: ponto_clicado.interior,
          segmento: ponto_clicado["segmentação_primária"],
          nge: ponto_clicado.NGE,
          ultima_compra: ponto_clicado.ultima_compra,
          data_cadastro: ponto_clicado.data_cadastro,
          data_visita: ponto_clicado.data_visita,
          materiais: ponto_clicado.materiais,
        }
      : {};

  $: materiais_pdv = pdv.materiais
    .filter(
      (obj) =>
        Object.values(obj.qtd_materiais).reduce((acc, curr) => acc + curr, 0) >
        0,
    )
    .map((row) => ({
      Marca: row.marca,
      Mesas: row.qtd_materiais["Jogos de Mesa"],
      Geladeira: row.qtd_materiais["Geladeira"],
      Cervegela: row.qtd_materiais["Cervegela"],
      Ombrelone: row.qtd_materiais["Ombrelone"],
      Luminoso: row.qtd_materiais["Luminoso"],
    }));

  let detalhes_google;
</script>

<div class="w-full h-screen relative">
  <div class="w-full h-full absolute top-0 left-0 z-0">
    <Mapa {points} bind:selected_pdv />
  </div>

  <div
    class="absolute top-0 left-0 z-10 w-1/3 max-h-screen overflow-y-auto bg-slate-200 space-y-2 p-2"
  >
    {#if selected_pdv}
      <div class="bg-blue-700 rounded-lg">
        <h1 class="text-center font-bold text-slate-200">
          {pdv.nome}
        </h1>
        <p class="text-center text-slate-200">{""}</p>
      </div>
      <Card class="bg-white bg-opacity-90 p-4 text-center">
        <p><span class="font-bold">Chave UNB_PDV: </span>{pdv.chave}</p>
        <p>
          <span class="font-bold">Segmentação Primária: </span>{pdv.segmento}
        </p>
        <p><span class="font-bold">Segmento NGE: </span>{pdv.segmento_nge}</p>
        <p>
          <span class="font-bold">Data Visita: </span>{new Date(
            pdv.data_visita,
          ).toLocaleDateString("pt-BR")}
        </p>
        <p>
          <span class="font-bold">Data Cadastro: </span>{new Date(
            pdv.data_cadastro,
          ).toLocaleDateString("pt-BR")}
        </p>
        <p>
          <span class="font-bold">Última Compra: </span>{new Date(
            pdv.ultima_compra,
          ).toLocaleDateString("pt-BR")}
        </p>

        <Button class="my-4" href={"/pdv/" + ponto_clicado.chave}
          >Ver mais detalhes do PDV</Button
        >
      </Card>

      <Card class="bg-white bg-opacity-90 p-4">
        <div class="my-2 mb-2">
          <Label
            >Cesta: <Dropdown
              values={cestas}
              nome_categoria="Cesta"
              bind:value={cesta_selecionada}
            /></Label
          >
        </div>
        <div class="h-[200px]">
          <BarChart {options} />
        </div>
      </Card>

      <Card class="bg-white bg-opacity-90 p-4">
        <h2 class="font-bold mt-4">Materiais</h2>
        <div class="px-2">
          <TableMapa bind:data={materiais_pdv} />
        </div>
      </Card>

      <Card class="bg-white bg-opacity-90 p-4">
        <h2 class="font-bold mt-4">Imagens</h2>
        <div class="max-w-full items-center align-middle">
          <Carrousel images={[pdv.fachada, pdv.cardapio, pdv.interior]} />
        </div>
      </Card>
    {:else if selected_pdv === undefined}
      <p class="text-center">Selecione um PDV no mapa</p>
    {/if}
  </div>
</div>
