<script>
  import { page } from "$app/stores";

  import { Button } from "$lib/components/ui/button";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import BarChart from "$lib/components/barChart.svelte";
  import TableMapa from "$lib/components/tableMapa.svelte";
  import Dropdown from "$lib/components/dropdown.svelte";
  import { Label } from "$lib/components/ui/label";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";

  import { ChevronLeft, Star, Receipt } from "lucide-svelte";
  import { LegendPlainComponent } from "echarts/components";

  let cesta_selecionada = "cerveja";
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

  let pedidos_hub =
    $page.data.pedidos_hub.length == 0
      ? [{ marca: "sem pedidos" }]
      : $page.data.pedidos_hub
          .map((row) => {
            const parts = row.data_entrega.split("/");
            row.data_entrega = new Date(parts[2], parts[1] - 1, parts[0]);
            delete row.descricao;
            return row;
          })
          .sort((a, b) => {
            const dateComparison = new Date(b.data_entrega) - new Date(a.data_entrega);
            if (dateComparison !== 0) {
              return dateComparison;
            }
            return b.quantidade - a.quantidade;
          })
          .map((row) => {
            row.data_entrega = new Date(row.data_entrega).toLocaleDateString("pt-BR");
            return row;
          });

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  let visitas = $page.data.result.map((pdv, index) => {
    return {
      value: formatDate(pdv.data_visita),
      name: formatDate(pdv.data_visita),
      position: index,
    };
  });
  let selected_date = visitas[0].value;

  $: visita_selecionada = $page.data.result.filter(
    (row) => formatDate(row.data_visita) == selected_date,
  )[0];

  $: materiais_pdv = visita_selecionada.materiais
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
      Chopeira: row.qtd_materiais["Chopeira"],
    }));

  $: images = [
    {
      link: visita_selecionada.fachada,
      legenda: "Foto da Fachada",
    },
    {
      link: visita_selecionada.cardapio,
      legenda: "Foto do Cardápio",
    },
    {
      link: visita_selecionada.interior,
      legenda: "Foto do Interior do PDV",
    },
  ];

  $: volume_pdv = $page.data.volumes.sort((a, b) => (a.mes > b.mes ? 1 : -1));

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
</script>

<div class="mx-auto p-2 flex items-center gap-4">
  <Button href="/mapa" size="icon" className="h-7 w-7 bg-slate-400">
    <ChevronLeft class="h-4 w-4" />
    <span class="sr-only">Back</span>
  </Button>
  <h1
    class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0"
  >
    {$page.data.result[0].nome_fantasia}
  </h1>
  <Label
    >Visitas: <Dropdown
      values={visitas}
      nome_categoria="Selecione a Visita"
      bind:value={selected_date}
    /></Label
  >
</div>
<div class=" grid grid-cols-2 grid-rows-3 p-0.5">
  <Card class="bg-white bg-opacity-90 p-2 m-0.5">
    <div class="grid grid-cols-2">
      <div class="px-1">
        <p class="text-center text-slate-200">{""}</p>
        <p>
          <span class="font-bold"
            >Chave UNB_PDV:
          </span>{visita_selecionada.chave}
        </p>
        <p>
          <span class="font-bold"
            >Segmentação Primária:
          </span>{visita_selecionada["segmentação_primária"]}
        </p>
        <p>
          <span class="font-bold">Segmento NGE: </span>{visita_selecionada.NGE}
        </p>
        <p>
          <span class="font-bold">Data Visita: </span>{new Date(
            visita_selecionada.data_visita,
          ).toLocaleDateString("pt-BR")}
        </p>
        <p>
          <span class="font-bold">Data Cadastro: </span>{new Date(
            visita_selecionada.data_cadastro,
          ).toLocaleDateString("pt-BR")}
        </p>
        <p>
          <span class="font-bold">Última Compra: </span>{new Date(
            visita_selecionada.ultima_compra,
          ).toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div>
        <p>
          <span class="font-bold">Nome Google: </span>{$page.data.google.nome}
        </p>
        <div class="flex items-center">
          <p>
            <span class="font-bold">Rating Avalições: </span>
            {$page.data.google.rating} estrelas com {$page.data.google
              .n_reviews} avaliações
          </p>
        </div>
        <p>
          <span class="font-bold text-wrap w-full"
            >Tipo Estabelecimento:
          </span>{$page.data.google.tipo_estabelecimento}
        </p>
        <p>
          <span class="font-bold text-wrap w-full">Faixa de Preço: </span>{$page
            .data.google.preço
            ? "$".repeat($page.data.google.preço)
            : "Não Informado"}
        </p>
      </div>
    </div>
  </Card>
  <Card class="bg-white bg-opacity-90 p-2 row-span-3 m-0.5 space-y-2">
    <h2 class="font-bold">Volumes</h2>
    <div class="my-2 mb-2 flex-row">
      <Label
        >Cesta: <Dropdown
          values={cestas}
          nome_categoria="Cesta"
          bind:value={cesta_selecionada}
        /></Label
      >
      <div class="h-[180px]">
        <BarChart {options} />
      </div>
    </div>
    <h2 class="font-bold">Materiais</h2>
    <TableMapa bind:data={materiais_pdv} class="overflow-clip" />
    <TableMapa bind:data={pedidos_hub} class="overflow-clip" />
  </Card>
  <Card class="bg-white bg-opacity-90 p-1 row-span-2 m-0.5">
    <div class="px-2">
      <ScrollArea
        class="w-full whitespace-nowrap rounded-md border max-h-[320px] pb-2"
        orientation="both"
      >
        <div class="flex w-max space-x-4 p-1">
          {#each images as image}
            <figure class="shrink-0">
              <figcaption class="text-muted-foreground pt-2 text-xs">
                <span class="text-foreground font-semibold">
                  {image.legenda}
                </span>
              </figcaption>
              <div class="overflow-hidden rounded-md">
                <img
                  src={image.link}
                  alt={`Photo by ${image.legenda}`}
                  class="object-scale-down"
                  width={300}
                  height={300}
                />
              </div>
            </figure>
          {/each}
        </div>
      </ScrollArea>
    </div>
  </Card>
</div>
