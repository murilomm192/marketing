<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import Mapa from "$lib/components/mapa.svelte";
  import BarChart from "$lib/components/barChart.svelte";
  import Carrousel from "$lib/components/carrousel.svelte";
  import Dropdown from "$lib/components/dropdown.svelte";
  import { Label } from "$lib/components/ui/label";
  import TableMapa from "$lib/components/tableMapa.svelte";

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
      ? data.volumes.filter((row) => row.chave == selected_pdv)
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
</script>

<div class=" w-full flex">
  <div class="w-1/3 text-center">
    {#if selected_pdv}
      <h1 class="text-center font-bold bg-blue-700 text-slate-200">
        {pdv.nome}
      </h1>
      <p class="text-center bg-blue-700 text-slate-200">nome google</p>
      <div class="text-center py-1">
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
      </div>

      <div class="my-2">
        <Label
          ><Dropdown
            values={cestas}
            nome_categoria="Cesta"
            bind:value={cesta_selecionada}
          /></Label
        >
      </div>
      <div class="h-[230px]">
        <BarChart {options} />
      </div>
      Materiais
      <div class="px-2">
        <TableMapa bind:data={materiais_pdv} />
      </div>
      Imagens
      <div class="max-w-1/3 items-center align-middle">
        <Carrousel
          class=""
          images={[pdv.fachada, pdv.cardapio, pdv.interior]}
        />
      </div>
    {:else if selected_pdv === undefined}
      selecione o PDV
    {/if}
  </div>
  <div class="w-2/3 z-10">
    <Mapa {points} bind:selected_pdv />
  </div>
</div>
