<script>
  import { Card } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import Minus from "svelte-radix/Minus.svelte";
  import Plus from "svelte-radix/Plus.svelte";
  import { Label } from "$lib/components/ui/label";
  import Calendar from "$lib/components/calendar.svelte";
  import Dropdown from "$lib/components/dropdown.svelte";
  import { enhance } from "$app/forms";
  import * as Dialog from "$lib/components/ui/dialog";

  import brahma from "$lib/assets/brahma.png";
  // import chopp from "$lib/assets/chopp.png";
  import beats from "$lib/assets/beats.png";
  import bud from "$lib/assets/bud.png";
  import corona from "$lib/assets/corona.png";
  import spaten from "$lib/assets/spaten.png";
  import guarana from "$lib/assets/guarana.png";
  import stella from "$lib/assets/stella.png";
  // import skol from "$lib/assets/skol.png";
  import concorrencia from "$lib/assets/concorrencia.png";
  import proprio from "$lib/assets/proprio.png";
  // import antarctica from "$lib/assets/antarctica.png";
  import bdm from "$lib/assets/bdm.png";
  // import bohemia from "$lib/assets/bohemia.png";
  // import original from "$lib/assets/original.png";
  import pepsi from "$lib/assets/pepsi.png";

  import { depara_operações } from "$lib/stores";
  import { removeDuplicates } from "$lib/utils";
  import * as Accordion from "$lib/components/ui/accordion";
  import TableMarcas from "$lib/components/TableMarcas.svelte";

  import { getLocalTimeZone, today } from "@internationalized/date";

  import {
    PUBLIC_DATABASE_URL,
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
  } from "$env/static/public";

  import { createClient } from "@supabase/supabase-js";

  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

  let showConfirmation = false;

  function upload_file(file, file_name, bucket, token) {
    return file.arrayBuffer().then((r) =>
      supabase.storage.from(bucket).uploadToSignedUrl(file_name, token, r, {
        upsert: true,
      }),
    );
  }

  async function getSignedURLs(bucket, file_name) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(file_name);
    return data.token;
  }

  const generateUniqueID = (idLength) =>
    [...Array(idLength).keys()]
      .map((elem) => Math.random().toString(36).substr(2, 1))
      .join("");

  let files;

  let paths_after_upload = [];

  let disableButton = false;

  async function uploadWithURL(e) {
    const files_picked = Array.from(e.target.files);

    const upload = files_picked.map(async (file) => {
      const file_name = `${generateUniqueID(6)}.${file.name.split(".").at(-1)}`;
      const token = await getSignedURLs("Direta", file_name);
      const upload = await upload_file(file, file_name, "Direta", token);
      paths_after_upload = [...paths_after_upload, file_name];
    });

    disableButton = true;
    setTimeout(() => {
      disableButton = false;
    }, 5000);
  }

  export let data;

  let name;
  let data_visita = today(getLocalTimeZone());
  let uf_selecinado;
  let rede_selecionada;
  let loja_selecionada;

  $: uf = removeDuplicates("uf", data.base_direta).map((row) => {
    return {
      value: row.uf,
      name: row.uf,
    };
  });

  $: rede = removeDuplicates(
    "rede",
    data.base_direta.filter((row) => row.uf === uf_selecinado),
  ).map((row) => {
    return {
      value: row.rede,
      name: row.rede,
    };
  });

  $: loja = removeDuplicates(
    "nome_fantasia",
    data.base_direta
      .filter((row) => row.rede === rede_selecionada)
      .filter((row) => row.uf === uf_selecinado),
  ).map((row) => {
    return {
      value: row.eg,
      name: row.nome_fantasia,
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
    // { nome: "Chopp", asset: chopp },
    { nome: "Bud", asset: bud },
    { nome: "Corona", asset: corona },
    { nome: "Spaten", asset: spaten },
    { nome: "Beats", asset: beats },
    { nome: "Guarana", asset: guarana },
    { nome: "Stella", asset: stella },
    // { nome: "Skol", asset: skol },
    // { nome: "Antarctica", asset: antarctica },
    { nome: "Bdm", asset: bdm },
    // { nome: "Bohemia", asset: bohemia },
    // { nome: "Original", asset: original },
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

  $: retorno = JSON.stringify({
    nome: name,
    data_visita: data_visita.toLocaleString("pt-BR"),
    loja: loja_selecionada,
    equipamentos: levantamento,
    caminhos: paths_after_upload,
  });
</script>

<form
  method="POST"
  action="?/upload"
  enctype="multipart/form-data"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === "success") {
        showConfirmation = true;
      }
    };
  }}
>
  <div class="p-4">
    <input type="hidden" bind:value={retorno} name="dados" />
    <h2 class="font-bold text-xl">Lojas Direta</h2>
    <h1 class="mb-4">Levantamento de Materiais de Trade</h1>
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
        <Label>UF</Label>
        <Dropdown
          bind:values={uf}
          nome_categoria="Selecione a UF"
          bind:value={uf_selecinado}
        />
      </div>
      <div class="grid grid-cols-1 space-y-1">
        <Label>Rede</Label>
        <Dropdown
          bind:values={rede}
          nome_categoria="Selecione a Rede"
          bind:value={rede_selecionada}
        />
      </div>
      <div class="grid grid-cols-1 space-y-1">
        <Label>Loja</Label>
        <Dropdown
          bind:values={loja}
          nome_categoria="Selecione a Loja"
          bind:value={loja_selecionada}
        />
      </div>
    </div>
    <div
      class="my-4 py-2 space-x-1 flex border rounded-lg border-slate-400 items-center text-wrap max-h-14 justify-center"
    >
      <input
        type="file"
        id="actual-imagens"
        multiple="multiple"
        accept="capture=camera,image/*"
        hidden
        on:change={uploadWithURL}
        bind:files
      />
      <svg
        width="64px"
        height="64px"
        viewBox="0 0 1024 1024"
        class="icon"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
        ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g><g id="SVGRepo_iconCarrier"
          ><path
            d="M356.4 168.9h318.1c15.3 0 27.7 12.4 27.7 27.7v83H328.7v-83c0-15.3 12.4-27.7 27.7-27.7z"
            fill="#FFFFFF"
          ></path><path
            d="M729.8 307.2H301V196.6c0-30.5 24.8-55.3 55.3-55.3h318.1c30.5 0 55.3 24.8 55.3 55.3v110.6z m-373.4-55.3h318.1v-55.3H356.3l0.1 55.3z"
            fill="#333333"
          ></path><path
            d="M162.8 238.1h691.5c15.3 0 27.7 12.4 27.7 27.7v497.9c0 15.3-12.4 27.7-27.7 27.7H162.8c-15.3 0-27.7-12.4-27.7-27.7V265.8c0-15.4 12.4-27.7 27.7-27.7z"
            fill="#FFFFFF"
          ></path><path
            d="M826.6 791.3H190.4c-30.5 0-55.3-24.8-55.3-55.3V293.4c0-30.5 24.8-55.3 55.3-55.3h636.2c30.5 0 55.3 24.8 55.3 55.3v442.5c0 30.5-24.8 55.4-55.3 55.4zM190.4 293.4v442.5h636.2V293.3H190.4z"
            fill="#333333"
          ></path><path
            d="M328.7 514.7a186.7 179.8 0 1 0 373.4 0 186.7 179.8 0 1 0-373.4 0Z"
            fill="#8CAAFF"
          ></path><path
            d="M515.4 722.1c-118.2 0-214.4-93-214.4-207.4s96.2-207.4 214.4-207.4 214.4 93.1 214.4 207.4S633.6 722.1 515.4 722.1z m0-359.6c-87.7 0-159 68.2-159 152.1S427.7 666.8 515.4 666.8s159-68.2 159-152.1-71.3-152.2-159-152.2z"
            fill="#333333"
          ></path><path
            d="M439.3 514.7a76.1 69.1 0 1 0 152.2 0 76.1 69.1 0 1 0-152.2 0Z"
            fill="#FFFFFF"
          ></path><path
            d="M515.4 611.5c-57.2 0-103.7-43.4-103.7-96.8s46.5-96.8 103.7-96.8 103.7 43.4 103.7 96.8-46.5 96.8-103.7 96.8z m0-138.3c-26.7 0-48.4 18.6-48.4 41.5s21.7 41.5 48.4 41.5 48.4-18.6 48.4-41.5-21.7-41.5-48.4-41.5z"
            fill="#333333"
          ></path></g
        ></svg
      >
      <label for="actual-imagens" class="font-normal text-md text-bold"
        >{files
          ? files.length + " Arquivos"
          : "Selecione as fotos da Galeria (Máximo 2Mb)"}</label
      >
    </div>
    <p class="font-bold">Materiais</p>
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
                      <p
                        class="items-center min-w-full px-2 font-semibold inline-block"
                      >
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
  <Button
    type="submit"
    class="mx-6 mx-auto block justify-center w-5/6"
    disabled={disableButton}
  >
    <Label>Enviar</Label></Button
  >
</form>

<Dialog.Root bind:open={showConfirmation}>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 bg-black/50" />
    <Dialog.Content
      class="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
    >
      <Dialog.Title class="text-xl font-semibold">Sucesso!</Dialog.Title>
      <Dialog.Description class="mt-4">
        Formulário enviado com sucesso.
      </Dialog.Description>
      <div class="mt-6 flex justify-end">
        <Button
          on:click={() => {
            showConfirmation = false;
            window.location.reload();
          }}
        >
          OK
        </Button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
