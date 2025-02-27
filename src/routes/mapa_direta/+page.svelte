<script lang="typescript">
  import Mapa from "$lib/components/mapa_direta.svelte";
  import BarChart from "$lib/components/barChart.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import Carrousel from "$lib/components/carrousel.svelte";
  import Dropdown from "$lib/components/dropdown.svelte";
  import { Label } from "$lib/components/ui/label";
  import TableMapa from "$lib/components/tableMapa.svelte";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "$lib/components/ui/tabs/index.js";
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

  export let data;

  let selectedImage = null;
  let imageModalOpen = false;
  let imageModalTitle = "";
  let imageRotation = 0;
  
  export let selected_pdv = data.coletas[0] || {};

  $: points = data.coletas.map((row) => ({
    lngLat: [row.latitude, row.longitude],
    eg: row.eg,
    nome: row.nome_fantasia,
    segmento: row.segmento,
    cidade: row.cidade,
    uf: row.uf,
    rede: row.rede,
    cluster_trade: row.cluster_trade,
    tamanho_loja: row.tamanho_loja,
    status_loja: row.status_loja,
  }));
  
  let pdv_details = [];
  let selected_visit_id = null;
  let selected_visit = null;

  $: pdv_details = data.eg_details.filter((row) => row.eg === selected_pdv.eg);
  $: latest_visit =
    pdv_details.length > 0 ? pdv_details[pdv_details.length - 1] : null;
  $: cliente_info =
    data.clientes.find((row) => row.eg === selected_pdv.eg) || {};

  // Add a variable to store the selected visit
  // Update selected_visit whenever selected_visit_id or pdv_details changes
  $: {
    if (selected_visit_id && pdv_details) {
      selected_visit = pdv_details.find(
        (visit) => visit.id === selected_visit_id,
      );
    } else {
      selected_visit = latest_visit;
    }
    console.log("Selected visit updated:", selected_visit_id);
  }

  let materiaisData = { brandsList: [], categoriesList: [], data: {} };

  $: if (selected_pdv) {
    if (
      latest_visit &&
      latest_visit.materiais &&
      typeof latest_visit.materiais === "object"
    ) {
      materiaisData = processMateriaisData(latest_visit.materiais);
    } else {
      materiaisData = { brandsList: [], categoriesList: [], data: {} };
    }

    // Reset selected visit when PDV changes
    selected_visit_id = "";
  }

  // Function to process materials data
  function processMateriaisData(materiais) {
    if (!materiais || typeof materiais !== "object")
      return { brandsList: [], categoriesList: [], data: {} };

    const tableData = {
      brands: new Set(),
      categories: new Set(),
      data: {},
      nonZeroCategories: new Set(),
      // Track which brands have non-zero values
      brandsWithValues: new Map(), // brand -> count of non-zero values
    };

    // Process the data
    for (const [category, brands] of Object.entries(materiais)) {
      if (typeof brands === "object" && brands !== null) {
        tableData.categories.add(category);

        for (const [brand, value] of Object.entries(brands)) {
          // Always add the brand to track it
          tableData.brands.add(brand);

          if (!tableData.data[brand]) {
            tableData.data[brand] = {};
          }

          // Store the value regardless of whether it's zero
          tableData.data[brand][category] = value;

          // Only count non-zero values for filtering
          if (value && value !== 0 && value !== "0") {
            // Mark this category as having non-zero values
            tableData.nonZeroCategories.add(category);

            // Increment the count for this brand
            const currentCount = tableData.brandsWithValues.get(brand) || 0;
            tableData.brandsWithValues.set(brand, currentCount + 1);
          }
        }
      }
    }

    // Only include brands with at least one non-zero value
    const brandsList = Array.from(tableData.brands).filter((brand) =>
      tableData.brandsWithValues.has(brand),
    );

    // Only include categories with non-zero values
    const categoriesList = Array.from(tableData.categories).filter((category) =>
      tableData.nonZeroCategories.has(category),
    );

    return { brandsList, categoriesList, data: tableData.data };
  }

  // Function to convert nested materials format to flattened format
  function convertMaterialsFormat(materials) {
    if (!materials || !Array.isArray(materials)) {
      return [];
    }

    // First, collect all unique equipment types across all materials
    const allEquipmentTypes = [...new Set(
      materials
        .flatMap(item => item.equipamentos ? Object.keys(item.equipamentos) : [])
    )].sort();

    return materials.map(item => {
      // Start with the marca
      const result = { marca: item.marca };
      
      // Add all equipment properties directly to the result object
      if (item.equipamentos) {
        // First add all equipment types with their actual values
        Object.entries(item.equipamentos).forEach(([equipType, value]) => {
          result[equipType] =  parseInt(value);
        });
        
        // Then ensure all equipment types are present (even if not in this item)
        allEquipmentTypes.forEach(equipType => {
          if (result[equipType] === undefined) {
            result[equipType] = 0;
          }
        });
      } else {
        // If no equipamentos, add all equipment types with zero values
        allEquipmentTypes.forEach(equipType => {
          result[equipType] = 0;
        });
      }
      
      return result;
    });
  }

  // Format object values for display
  function formatValue(value) {
    if (value === null || value === undefined) return "";

    if (typeof value === "number") {
      return value === 0 ? "" : value.toLocaleString("pt-BR");
    }

    if (typeof value === "object") {
      // Handle object values by displaying their properties
      try {
        const entries = Object.entries(value);
        if (entries.length === 0) return "";

        // Filter out zero values if all values are zero
        const nonZeroEntries = entries.filter(([_, val]) => {
          return !(val === 0 || val === "0" || val === "" || val === false);
        });

        // If there are non-zero entries, only show those
        const entriesToShow =
          nonZeroEntries.length > 0 ? nonZeroEntries : entries;

        return entriesToShow
          .map(([key, val]) => {
            if (val === 0 || val === "0" || val === "" || val === false) {
              return `<div class="text-gray-400 text-xs py-1">${key}: ${val}</div>`;
            }

            if (typeof val === "number") {
              return `<div class="text-blue-600 font-medium text-xs py-1">${key}: ${val.toLocaleString("pt-BR")}</div>`;
            }

            return `<div class="text-blue-600 font-medium text-xs py-1">${key}: ${val}</div>`;
          })
          .join("");
      } catch (e) {
        return JSON.stringify(value);
      }
    }

    return String(value) === "0" ? "" : String(value);
  }

  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  }
</script>

<div class="w-full h-screen relative">
  <div class="w-full h-full absolute top-0 left-0 z-0">
    <Mapa {points} bind:selected_pdv />
  </div>
  <div
    class="absolute top-0 left-0 z-10 w-full md:w-1/3 p-4 overflow-y-auto max-h-screen"
  >
    <div class="bg-blue-700 rounded-lg p-2">
      <h1 class="text-center font-bold text-slate-200 text-xl">
        {selected_pdv.nome_fantasia || "Selecione um PDV no mapa"}
      </h1>
    </div>
    
    <div class="mb-2 mt-2">
      <a href="/direta">
        <Button variant="outline" class="w-full bg-white bg-opacity-90">
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Ir para Levantamento de Materiais
          </span>
        </Button>
      </a>
    </div>

    <Tabs defaultValue="info" class="w-full">
      <TabsList class="grid grid-cols-3 w-full">
        <TabsTrigger value="info">Informações</TabsTrigger>
        <TabsTrigger value="materials">Materiais</TabsTrigger>
        <TabsTrigger value="photos">Fotos</TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        
        <Card class="bg-white bg-opacity-90 p-4">
          <CardHeader>
            <CardTitle>Detalhes do PDV</CardTitle>
            <CardDescription
              >Informações gerais sobre o ponto de venda</CardDescription
            >
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="bg-gray-50 p-3 rounded-md">
                <Label class="text-xs text-gray-500">Cidade/UF</Label>
                <p class="font-medium">
                  {selected_pdv.cidade || "N/A"}/{selected_pdv.uf || "N/A"}
                </p>
              </div>
              <div class="bg-gray-50 p-3 rounded-md">
                <Label class="text-xs text-gray-500">Rede</Label>
                <p
                  class="font-medium truncate"
                  title={selected_pdv.rede || "N/A"}
                >
                  {selected_pdv.rede || "N/A"}
                </p>
              </div>
              <div class="bg-gray-50 p-3 rounded-md">
                <Label class="text-xs text-gray-500">Segmento</Label>
                <p class="font-medium">{selected_pdv.segmento || "N/A"}</p>
              </div>
              <div class="bg-gray-50 p-3 rounded-md">
                <Label class="text-xs text-gray-500">Cluster Trade</Label>
                <p class="font-medium">{selected_pdv.cluster_trade || "N/A"}</p>
              </div>
              <div class="bg-gray-50 p-3 rounded-md">
                <Label class="text-xs text-gray-500">Tamanho da Loja</Label>
                <p class="font-medium">{selected_pdv.tamanho_loja || "N/A"}</p>
              </div>
              <div class="bg-gray-50 p-3 rounded-md">
                <Label class="text-xs text-gray-500">Status</Label>
                <div class="mt-1">
                  <Badge
                    variant={selected_pdv.status_loja === "ATIVO"
                      ? "success"
                      : "destructive"}
                  >
                    {selected_pdv.status_loja || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>

            <div class="border-t pt-4 mt-2">
              <CardTitle class="text-lg mb-3">Última Visita</CardTitle>
              {#if latest_visit}
                <div class="bg-blue-50 p-3 rounded-md mb-3">
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <Label class="text-xs text-gray-500">Data</Label>
                      <p class="font-medium">
                        {formatDate(latest_visit.data_visita)}
                      </p>
                    </div>
                    <div>
                      <Label class="text-xs text-gray-500">Usuário</Label>
                      <p class="font-medium">
                        {latest_visit.nome_usuario || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              {:else}
                <div class="bg-gray-100 p-3 rounded-md text-center">
                  <p>Nenhuma visita registrada</p>
                </div>
              {/if}
            </div>

            <div class="border-t pt-4 mt-4">
              <div class="flex justify-between items-center mb-3">
                <CardTitle class="text-lg">Histórico de Visitas</CardTitle>
                <Badge variant="secondary">{pdv_details.length} visitas</Badge>
              </div>

              {#if pdv_details.length > 0}
                <div class="max-h-[200px] overflow-y-auto border rounded-md">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr class="bg-gray-100 sticky top-0">
                        <th class="p-2 text-left border-b">Data</th>
                        <th class="p-2 text-left border-b">Usuário</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each pdv_details as visit}
                        <tr class="border-b border-gray-200 hover:bg-gray-50">
                          <td class="p-2">{formatDate(visit.data_visita)}</td>
                          <td class="p-2">{visit.nome_usuario || "N/A"}</td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {:else}
                <div class="bg-gray-100 p-3 rounded-md text-center">
                  <p>Nenhuma visita registrada</p>
                </div>
              {/if}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="materials">
        <Card class="bg-white bg-opacity-90 p-4">
          <CardHeader>
            <CardTitle>Materiais</CardTitle>
            <CardDescription
              >Materiais registrados na última visita</CardDescription
            >
          </CardHeader>
          <CardContent>
            {#if latest_visit && latest_visit.materiais && Array.isArray(latest_visit.materiais)}
              {@const flattenedMaterials = convertMaterialsFormat(latest_visit.materiais)}
              
              {#if flattenedMaterials.length > 0}
                <div class="w-full">
                  <div class="grid grid-cols-1 gap-4 md:hidden">
                    <!-- Mobile view: Card-based layout -->
                    {#each flattenedMaterials as material}
                      <div class="bg-white rounded-lg shadow p-4">
                        <div class="flex items-center mb-3">
                          {#if brands.find(b => b.nome === material.marca)}
                            <img 
                              src={brands.find(b => b.nome === material.marca).asset} 
                              alt={material.marca} 
                              class="w-8 h-8 object-contain mr-2"
                            />
                          {/if}
                          <h3 class="font-bold text-lg">{material.marca}</h3>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                          {#each Object.entries(material).filter(([key]) => key !== 'marca').sort() as [equipType, value]}
                            {#if value && value !== 0 && value !== "0"}
                              <div class="bg-blue-50 p-2 rounded">
                                <span class="text-xs text-gray-600">{equipType}</span>
                                <p class="text-blue-600 font-medium">{value}</p>
                              </div>
                            {/if}
                          {/each}
                        </div>
                      </div>
                    {/each}
                  </div>
                  
                  <!-- Desktop view: Table layout -->
                  <div class="hidden md:block overflow-x-auto">
                    <table class="w-full border-collapse text-sm">
                      <thead>
                        <tr class="bg-gray-100 ">
                          <th class="text-left p-2 border text-center">Marca</th>
                          {#each Object.keys(flattenedMaterials[0]).filter(key => key !== 'marca').sort() as equipType, i}
                            <th class="text-center p-2 border whitespace-nowrap">
                              <div title={equipType}>{equipType}</div>
                            </th>
                          {/each}
                        </tr>
                      </thead>
                      <tbody>
                        {#each flattenedMaterials as material}
                          <tr class="border hover:bg-gray-50 ">
                            <td class="p-2 border font-medium">
                              <div class="flex items-center justify-center">
                                {#if brands.find(b => b.nome === material.marca)}
                                  <img 
                                    src={brands.find(b => b.nome === material.marca).asset} 
                                    alt={material.marca} 
                                    class="w-6 h-6 object-contain mr-2 flex-shrink-0"
                                  />
                                {/if}
                                
                              </div>
                            </td>
                            {#each Object.keys(material).filter(key => key !== 'marca').sort() as equipType}
                              <td class="p-2 border text-center">
                                {#if material[equipType] && material[equipType] !== 0 && material[equipType] !== "0"}
                                  <span class="text-blue-600 font-medium">{material[equipType]}</span>
                                {:else}
                                  <span class="text-gray-300">-</span>
                                {/if}
                              </td>
                            {/each}
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                </div>
              {:else}
                <div class="bg-gray-50 p-4 rounded-md text-center">
                  <p class="text-gray-500">
                    Não há materiais com valores registrados.
                  </p>
                </div>
              {/if}
            {:else}
              <p>Nenhum material registrado</p>
            {/if}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="photos">
        <Card class="bg-white bg-opacity-90 p-4">
          <CardHeader>
            <CardTitle>Fotos</CardTitle>
            <CardDescription>Fotos registradas nas visitas</CardDescription>
          </CardHeader>
          <CardContent>
            {#if pdv_details && pdv_details.length > 0}
              <div class="mb-4">
                <label
                  for="visit-selector"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Selecione uma visita:
                </label>
                <select
                  id="visit-selector"
                  class="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  bind:value={selected_visit_id}
                >
                  <option value=""
                    >Última visita ({formatDate(
                      latest_visit?.data_visita,
                    )})</option
                  >
                  {#each pdv_details.sort((a, b) => new Date(b.data_visita) - new Date(a.data_visita)) as visit}
                    <option value={visit.id}>
                      {formatDate(visit.data_visita)} - {visit.nome_usuario ||
                        "Usuário não identificado"}
                    </option>
                  {/each}
                </select>
              </div>
              <!-- Debug info -->
              <div class="text-xs text-gray-500 mb-2">
                Visita selecionada: {selected_visit_id
                  ? selected_visit_id
                  : "Última visita"}
                ({selected_visit
                  ? formatDate(selected_visit.data_visita)
                  : "Nenhuma"})
              </div>
            {/if}

            {#if selected_visit && selected_visit.fotos}
              {#if Array.isArray(selected_visit.fotos) && selected_visit.fotos.length > 0}
                <div class="grid grid-cols-2 gap-2">
                  {#each selected_visit.fotos as photo, i}
                    {#if photo}
                      <button
                        class="relative aspect-square overflow-hidden rounded-md border border-gray-200 hover:opacity-90 transition-opacity"
                        on:click={() => {
                          selectedImage = photo;
                          imageModalOpen = true;
                          imageModalTitle = `Foto ${i + 1}`;
                          imageRotation = 0;
                        }}
                      >
                        <img
                          src={photo}
                          alt={`Foto ${i + 1}`}
                          class="object-cover w-full h-full"
                          on:error={(e) =>
                            (e.target.src = "/placeholder-image.svg")}
                        />
                        <div
                          class="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-tl"
                        >
                          Clique para ampliar
                        </div>
                      </button>
                    {/if}
                  {/each}
                </div>
              {:else if typeof selected_visit.fotos === "object" && selected_visit.fotos !== null}
                <div class="space-y-4">
                  {#each Object.entries(selected_visit.fotos) as [category, photos]}
                    {#if typeof photos === "object" && photos !== null && !Array.isArray(photos)}
                      <div>
                        <h3 class="font-bold text-md mb-2">{category}</h3>
                        <div class="grid grid-cols-2 gap-2">
                          {#each Object.entries(photos) as [label, photoUrl]}
                            {#if typeof photoUrl === "string" && photoUrl}
                              <button
                                class="relative aspect-square overflow-hidden rounded-md border border-gray-200 hover:opacity-90 transition-opacity"
                                on:click={() => {
                                  selectedImage = photoUrl;
                                  imageModalOpen = true;
                                  imageModalTitle = `${category} - ${label}`;
                                  imageRotation = 0;
                                }}
                              >
                                <img
                                  src={photoUrl}
                                  alt={`${category} - ${label}`}
                                  class="object-cover w-full h-full"
                                  on:error={(e) =>
                                    (e.target.src = "/placeholder-image.svg")}
                                />
                                <div
                                  class="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1"
                                >
                                  {label}
                                </div>
                                <div
                                  class="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-tl"
                                >
                                  Clique para ampliar
                                </div>
                              </button>
                            {/if}
                          {/each}
                        </div>
                      </div>
                    {/if}
                  {/each}
                </div>
              {:else}
                <p>Nenhuma foto disponível</p>
              {/if}
            {:else}
              <p>Nenhuma foto registrada</p>
            {/if}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</div>

<Dialog.Root bind:open={imageModalOpen}>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 bg-black/50" />
    <Dialog.Content
      class="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[90vw] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
    >
      <Dialog.Title class="text-xl font-semibold mb-4">{imageModalTitle}</Dialog.Title>
      <div class="flex justify-center items-center max-h-[70vh] overflow-hidden">
        <img
          src={selectedImage}
          alt={imageModalTitle}
          style={`transform: rotate(${imageRotation}deg); transition: transform 0.3s ease;`}
          class="max-w-full max-h-[70vh] object-contain"
        />
      </div>
      <div class="mt-6 flex justify-between">
        <Button
          variant="outline"
          on:click={() => {
            imageRotation = (imageRotation + 90) % 360;
          }}
          class="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Rotacionar 90°
        </Button>
        <Button
          variant="outline"
          on:click={() => {
            imageModalOpen = false;
            selectedImage = null;
          }}
          class="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Fechar
        </Button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
