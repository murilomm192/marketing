<script>
  import * as Card from "$lib/components/ui/card";
  import Carrousel from "$lib/components/carrousel.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";
  import Calendar from "$lib/components/calendar.svelte";
  import Dropdown from "$lib/components/dropdown.svelte";
  import DataTable from "$lib/components/TableMarcas.svelte";

  import brahma from "$lib/assets/brahma.png";
  import beats from "$lib/assets/beats.png";
  import bud from "$lib/assets/bud.png";
  import corona from "$lib/assets/corona.png";
  import spaten from "$lib/assets/spaten.png";
  import guarana from "$lib/assets/guarana.png";
  import stella from "$lib/assets/stella.png";
  import skol from "$lib/assets/skol.png";
  import concorrencia from "$lib/assets/concorrencia.png";
  import proprio from "$lib/assets/proprio.png";

  import { depara_operações } from "$lib/stores";
  import { removeDuplicates } from "$lib/utils";

  import {
    DateFormatter,
    getLocalTimeZone,
    today,
  } from "@internationalized/date";

  let dados = [];

  const depara = depara_operações.subscribe((value) => (dados = value));

  //adicionar skol, stella e um agrupado da concorrencia e própria e adicionar SOPI
  let materiais = [
    {
      marca: "Brahama Chopp",
      logo: brahma,
      qtd_materiais: {
        "Jogos de Mesa": 0,
        Cervegela: 0,
        Ombrelone: 0,
        Luminoso: 0,
        Geladeira: 0,
      },
    },
    {
      marca: "Budweiser",
      logo: bud,
      qtd_materiais: {
        "Jogos de Mesa": 0,
        Cervegela: 0,
        Ombrelone: 0,
        Luminoso: 0,
        Geladeira: 0,
      },
    },
    {
      marca: "Corona",
      logo: corona,
      qtd_materiais: {
        "Jogos de Mesa": 0,
        Cervegela: 0,
        Ombrelone: 0,
        Luminoso: 0,
        Geladeira: 0,
      },
    },
    {
      marca: "Stella Artois",
      logo: stella,
      qtd_materiais: {
        "Jogos de Mesa": 0,
        Cervegela: 0,
        Ombrelone: 0,
        Luminoso: 0,
        Geladeira: 0,
      },
    },
    {
      marca: "Spaten",
      logo: spaten,
      qtd_materiais: {
        "Jogos de Mesa": 0,
        Cervegela: 0,
        Ombrelone: 0,
        Luminoso: 0,
        Geladeira: 0,
      },
    },
    {
      marca: "Skol",
      logo: skol,
      qtd_materiais: {
        "Jogos de Mesa": 0,
        Cervegela: 0,
        Ombrelone: 0,
        Luminoso: 0,
        Geladeira: 0,
      },
    },
    {
      marca: "Skol Beats",
      logo: beats,
      qtd_materiais: {
        "Jogos de Mesa": 0,
        Cervegela: 0,
        Ombrelone: 0,
        Luminoso: 0,
        Geladeira: 0,
      },
    },
    {
      marca: "Guarana Antarctica",
      logo: guarana,
      qtd_materiais: {
        "Jogos de Mesa": 0,
        Cervegela: 0,
        Ombrelone: 0,
        Luminoso: 0,
        Geladeira: 0,
      },
    },
    {
      marca: "Concorrência",
      logo: concorrencia,
      qtd_materiais: {
        "Jogos de Mesa": 0,
        Cervegela: 0,
        Ombrelone: 0,
        Luminoso: 0,
        Geladeira: 0,
      },
    },
    {
      marca: "Próprio",
      logo: proprio,
      qtd_materiais: {
        "Jogos de Mesa": 0,
        Cervegela: 0,
        Ombrelone: 0,
        Luminoso: 0,
        Geladeira: 0,
      },
    },
  ];

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

  let name;
  let data_visita = today(getLocalTimeZone());
  let PDV;
  let comercial_selecionado;
  let operação_selecionada;

  let arquivos_cardapio = null;
  let arquivos_fachada = null;
  let arquivos_interior = null;

  //adicionar foto da área interna
  const handleChange_cardapio = (event) => {
    const file = event.target.files[0];
    arquivos_cardapio = file;
  };
  const handleChange_fachada = (event) => {
    const file = event.target.files[0];
    arquivos_fachada = file;
  };
  const handleChange_interior = (event) => {
    const file = event.target.files[0];
    arquivos_interior = file;
  };

  $: dados_finais = JSON.stringify({
    nome: name,
    data_visita: data_visita.toString(),
    cod_pdv: PDV,
    comercial: comercial_selecionado,
    operação: operação_selecionada,
    materiais: materiais,
  });
</script>

<form method="POST" action="?/upload" enctype="multipart/form-data">
  <input type="hidden" name="dados" bind:value={dados_finais} />
  <div class="flex m-6 font-bold justify-center">
    <Card.Root class="w-2/3">
      <Card.Header>
        <Card.Title>Levantamento PDVs</Card.Title>
        <Card.Description
          >Salve as informações do PDV para consulta</Card.Description
        >
      </Card.Header>
      <Card.Content>
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
            <Input bind:value={PDV} />
          </div>

          <div class="grid grid-cols-3 gap-3 justify-between">
            <div
              class="px-1 space-x-1 flex border rounded-lg border-slate-400 items-center text-wrap max-h-12"
            >
              <input
                type="file"
                name="fachada"
                id="actual-btn-fachada"
                accept="image/*"
                capture="environment"
                hidden
                on:change={handleChange_fachada}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="45"
                height="45"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-store"
                ><path
                  d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"
                /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path
                  d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"
                /><path d="M2 7h20" /><path
                  d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"
                /></svg
              >
              <label for="actual-btn-fachada" class="font-normal text-sm"
                >{arquivos_fachada
                  ? arquivos_fachada.name
                  : "Tire foto da fachada"}</label
              >
            </div>
            <div
              class="px-1 space-x-1 flex border rounded-lg border-slate-400 items-center text-wrap max-h-12"
            >
              <input
                type="file"
                name="cardapio"
                id="actual-btn-cardapio"
                accept="image/*"
                capture="environment"
                hidden
                on:change={handleChange_cardapio}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="45"
                height="45"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-book-open-text"
                ><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path
                  d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
                /><path d="M6 8h2" /><path d="M6 12h2" /><path
                  d="M16 8h2"
                /><path d="M16 12h2" /></svg
              >
              <label for="actual-btn-cardapio" class="font-normal text-sm"
                >{arquivos_cardapio
                  ? arquivos_cardapio.name
                  : "Tire foto do Cardápio"}</label
              >
            </div>
            <div
              class="px-1 space-x-1 flex border rounded-lg border-slate-400 items-center text-wrap max-h-12"
            >
              <input
                type="file"
                name="interior"
                id="actual-btn-interior"
                accept="image/*"
                capture="environment"
                hidden
                on:change={handleChange_interior}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="45"
                height="45"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-beer"
                ><path d="M17 11h1a3 3 0 0 1 0 6h-1" /><path d="M9 12v6" /><path
                  d="M13 12v6"
                /><path
                  d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"
                /><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" /></svg
              >
              <label for="actual-btn-interior" class="font-normal text-sm"
                >{arquivos_interior
                  ? arquivos_interior.name
                  : "Tire foto do Interior do PDV"}</label
              >
            </div>
          </div>

          <div class="sm:col-span-2"><DataTable bind:data={materiais} /></div>
        </div>
      </Card.Content>
      <Card.Footer>
        <Button type="submit"><Label>Enviar</Label></Button>
      </Card.Footer>
    </Card.Root>
  </div>
</form>
