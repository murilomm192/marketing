<script>
  import { Card } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import Minus from "svelte-radix/Minus.svelte";
  import Plus from "svelte-radix/Plus.svelte";
  import { Label } from "$lib/components/ui/label";
  import Calendar from "$lib/components/calendar.svelte";
  import Dropdown from "$lib/components/dropdown.svelte";
  import DataTable from "$lib/components/TableMarcas.svelte";

  import Compressor from "compressorjs";

  import brahma from "$lib/assets/brahma.png";
  import chopp from "$lib/assets/chopp.png";
  import beats from "$lib/assets/beats.png";
  import bud from "$lib/assets/bud.png";
  import corona from "$lib/assets/corona.png";
  import spaten from "$lib/assets/spaten.png";
  import guarana from "$lib/assets/guarana.png";
  import stella from "$lib/assets/stella.png";
  import skol from "$lib/assets/skol.png";
  import concorrencia from "$lib/assets/concorrencia.png";
  import proprio from "$lib/assets/proprio.png";
  import antarctica from "$lib/assets/antarctica.png";
  import bdm from "$lib/assets/bdm.png";
  import bohemia from "$lib/assets/bohemia.png";
  import original from "$lib/assets/original.png";
  import pepsi from "$lib/assets/pepsi.png";

  import { depara_operações } from "$lib/stores";
  import { removeDuplicates } from "$lib/utils";
  import * as Accordion from "$lib/components/ui/accordion";
  import TableMarcas from "$lib/components/TableMarcas.svelte";

  import {
    DateFormatter,
    getLocalTimeZone,
    today,
  } from "@internationalized/date";

  let dados = [];

  let name;
  let data_visita = today(getLocalTimeZone());
  let PDV;
  let comercial_selecionado;
  let operação_selecionada;

  $: comerciais = removeDuplicates("comercial", dados).map((row) => {
    return {
      value: row.comercial,
      name: row.comercial,
    };
  });

  $: operações = removeDuplicates("operação", dados)
    .filter((row) => row.comercial === comercial_selecionado)
    .map((row) => {
      return {
        value: row.unb.toString(),
        name: row.operação,
      };
    });

  let equipamentos = [
    "Ponta de Gôndula",
    "Digital Signature",
    "GCAT",
    "Rack",
    "Geladeira",
    "Tailor Made",
    "Câmara Fria",
    "Mega Execução",
  ];

  let brands = [
    { nome: "Brahma", asset: brahma },
    { nome: "Chopp", asset: chopp },
    { nome: "Bud", asset: bud },
    { nome: "Corona", asset: corona },
    { nome: "Spaten", asset: spaten },
    { nome: "Beats", asset: beats },
    { nome: "Guarana", asset: guarana },
    { nome: "Stella", asset: stella },
    { nome: "Skol", asset: skol },
    { nome: "Antarctica", asset: antarctica },
    { nome: "Bdm", asset: bdm },
    { nome: "Bohemia", asset: bohemia },
    { nome: "Original", asset: original },
    { nome: "Pepsi", asset: pepsi },
    { nome: "Concorrência", asset: concorrencia },
    { nome: "Próprio", asset: proprio },
  ];

  $: levantamento = brands.map((marca) => {
    return {
      nome: marca.nome,
      marca_img: marca.asset,
      equipamentos: equipamentos.reduce((result, item) => {
        result[item] = 0;
        return result;
      }, {}),
    };
  });
</script>

<div class="p-4">
  <h2 class="font-bold text-xl">Lojas Direta</h2>
  <h1>Levantamento de Materiais de Trade</h1>

  <div class="space-y-2 sm:grid sm:grid-cols-2 sm:gap-2">
    <div class="grid grid-cols-1 space-y-1">
      <Label>Nome</Label>
      <Input bind:value={name} />
    </div>
    <div class="grid grid-cols-1 space-y-1">
      <Label>Dia da Visita</Label>
      <Calendar bind:value={data_visita} />
    </div>
    <div class="grid grid-cols-1 space-y-1">
      <Label>Comercial</Label>
      <Dropdown
        bind:values={comerciais}
        nome_categoria="comercial"
        bind:value={comercial_selecionado}
      />
    </div>
    <div class="grid grid-cols-1 space-y-1">
      <Label>Operação</Label>
      <Dropdown
        bind:values={operações}
        nome_categoria="operação"
        bind:value={operação_selecionada}
      />
    </div>
    <div class="grid grid-cols-1 space-y-1">
      <Label>Código PDV</Label>
      <Input type="number" bind:value={PDV} />
    </div>
</div>

  <Accordion.Root>
    {#each levantamento as marca}
      <Accordion.Item value={marca.nome}>
        <Accordion.Trigger>
          <img src={marca.marca_img} class="h-16" alt="" />
          {marca.nome}</Accordion.Trigger
        >
        <Accordion.Content>
          <Card class="bg-white p-1">
            <div class="flex flex-col space-y-2">
              {#each Object.keys(marca.equipamentos) as equip}
                <Card class="">
                  <div
                    class="grid grid-cols-2 justify-around items-center bg-slate-100 px-6"
                  >
                  <p class="items-center min-w-full px-10 font-semibold inline-block">
                    {equip}
                  </p>
                    <div class="flex space-x-1 min-w-full justify-center">
                      <Button
                        variant="outline"
                        disabled={marca.equipamentos[equip] === 0}
                        on:click={() => {
                          marca.equipamentos[equip] -= 1;
                        }}
                        size="icon"
                        class="h-8 w-8 shrink-0 rounded-full"
                      >
                        <Minus class="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        bind:value={marca.equipamentos[equip]}
                        class="w-12 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <Button
                        variant="outline"
                        on:click={() => {
                          marca.equipamentos[equip] += 1;
                        }}
                        size="icon"
                        class="h-8 w-8 shrink-0 rounded-full"
                      >
                        <Plus class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              {/each}
            </div>
          </Card>
        </Accordion.Content>
      </Accordion.Item>
    {/each}
  </Accordion.Root>
</div>
