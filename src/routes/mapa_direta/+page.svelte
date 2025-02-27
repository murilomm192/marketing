<script lang="typescript">
  import Mapa from "$lib/components/mapa_direta.svelte";
  import BarChart from "$lib/components/barChart.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import Carrousel from "$lib/components/carrousel.svelte";
  import Dropdown from "$lib/components/dropdown.svelte";
  import { Label } from "$lib/components/ui/label";
  import TableMapa from "$lib/components/tableMapa.svelte";
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs/index.js";
  export let data;

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
    status_loja: row.status_loja
  }));

  $: pdv_details = data.eg_details.filter((row) => row.eg === selected_pdv.eg);
  $: latest_visit = pdv_details.length > 0 ? pdv_details[pdv_details.length - 1] : null;
  $: cliente_info = data.clientes.find((row) => row.eg === selected_pdv.eg) || {};

  let materiaisData = { brandsList: [], categoriesList: [], data: {} };

  $: if (selected_pdv) {
    if (latest_visit && latest_visit.materiais && typeof latest_visit.materiais === 'object') {
      materiaisData = processMateriaisData(latest_visit.materiais);
    } else {
      materiaisData = { brandsList: [], categoriesList: [], data: {} };
    }
  }

  // Function to process materials data
  function processMateriaisData(materiais) {
    if (!materiais || typeof materiais !== 'object') return { brandsList: [], categoriesList: [], data: {} };
    
    const tableData = {
      brands: new Set(),
      categories: new Set(),
      data: {}
    };
    
    // Process the data
    for (const [category, brands] of Object.entries(materiais)) {
      if (typeof brands === 'object' && brands !== null) {
        tableData.categories.add(category);
        
        for (const [brand, value] of Object.entries(brands)) {
          if (value && value !== 0 && value !== '0') {
            tableData.brands.add(brand);
            
            if (!tableData.data[brand]) {
              tableData.data[brand] = {};
            }
            
            tableData.data[brand][category] = value;
          }
        }
      }
    }
    
    // Convert Sets to Arrays for easier iteration
    const brandsList = Array.from(tableData.brands);
    const categoriesList = Array.from(tableData.categories);
    
    return { brandsList, categoriesList, data: tableData.data };
  }

  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }
</script>

<div class="w-full h-screen relative">
  <div class="w-full h-full absolute top-0 left-0 z-0">
    <Mapa {points} bind:selected_pdv />
  </div>
  <div
    class="absolute top-0 left-0 z-10 w-1/3 max-h-screen overflow-y-auto bg-slate-200 space-y-2 p-2"
  >
    <div class="bg-blue-700 rounded-lg p-2">
      <h1 class="text-center font-bold text-slate-200 text-xl">
        {selected_pdv.nome_fantasia || 'Selecione um PDV no mapa'}
      </h1>
      <p class="text-center text-slate-200">
        EG: {selected_pdv.eg || 'N/A'}
      </p>
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
            <CardDescription>Informações gerais sobre o ponto de venda</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="bg-gray-50 p-3 rounded-md">
                <Label class="text-xs text-gray-500">Cidade/UF</Label>
                <p class="font-medium">{selected_pdv.cidade || 'N/A'}/{selected_pdv.uf || 'N/A'}</p>
              </div>
              <div class="bg-gray-50 p-3 rounded-md">
                <Label class="text-xs text-gray-500">Rede</Label>
                <p class="font-medium truncate" title={selected_pdv.rede || 'N/A'}>{selected_pdv.rede || 'N/A'}</p>
              </div>
              <div class="bg-gray-50 p-3 rounded-md">
                <Label class="text-xs text-gray-500">Segmento</Label>
                <p class="font-medium">{selected_pdv.segmento || 'N/A'}</p>
              </div>
              <div class="bg-gray-50 p-3 rounded-md">
                <Label class="text-xs text-gray-500">Cluster Trade</Label>
                <p class="font-medium">{selected_pdv.cluster_trade || 'N/A'}</p>
              </div>
              <div class="bg-gray-50 p-3 rounded-md">
                <Label class="text-xs text-gray-500">Tamanho da Loja</Label>
                <p class="font-medium">{selected_pdv.tamanho_loja || 'N/A'}</p>
              </div>
              <div class="bg-gray-50 p-3 rounded-md">
                <Label class="text-xs text-gray-500">Status</Label>
                <div class="mt-1">
                  <Badge variant={selected_pdv.status_loja === 'ATIVO' ? 'success' : 'destructive'}>
                    {selected_pdv.status_loja || 'N/A'}
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
                      <p class="font-medium">{formatDate(latest_visit.data_visita)}</p>
                    </div>
                    <div>
                      <Label class="text-xs text-gray-500">Usuário</Label>
                      <p class="font-medium">{latest_visit.nome_usuario || 'N/A'}</p>
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
                          <td class="p-2">{visit.nome_usuario || 'N/A'}</td>
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
            <CardDescription>Materiais registrados na última visita</CardDescription>
          </CardHeader>
          <CardContent>
            {#if latest_visit && latest_visit.materiais}
              {#if typeof latest_visit.materiais === 'object' && latest_visit.materiais !== null}
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse text-sm">
                    <thead>
                      <tr class="bg-gray-100">
                        <th class="text-left p-2 border">Marca</th>
                        {#each materiaisData.categoriesList as category}
                          <th class="text-center p-2 border">{category}</th>
                        {/each}
                      </tr>
                    </thead>
                    <tbody>
                      {#each materiaisData.brandsList as brand}
                        <tr class="border hover:bg-gray-50">
                          <td class="p-2 border font-medium">{brand}</td>
                          {#each materiaisData.categoriesList as category}
                            <td class="p-2 border text-center">
                              {#if materiaisData.data[brand] && materiaisData.data[brand][category]}
                                {typeof materiaisData.data[brand][category] === 'number' 
                                  ? materiaisData.data[brand][category].toLocaleString('pt-BR') 
                                  : materiaisData.data[brand][category]}
                              {:else}
                                0
                              {/if}
                            </td>
                          {/each}
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {:else}
                <pre class="bg-gray-100 p-2 rounded overflow-auto text-xs">{JSON.stringify(latest_visit.materiais, null, 2)}</pre>
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
            <CardDescription>Fotos registradas na última visita</CardDescription>
          </CardHeader>
          <CardContent>
            {JSON.stringify(latest_visit.fotos)}
            {#if latest_visit && latest_visit.fotos}
              {#if Array.isArray(latest_visit.fotos) && latest_visit.fotos.length > 0}
                <div class="grid grid-cols-2 gap-2">
                  {#each latest_visit.fotos as photo, i}
                    {#if photo}
                      <button 
                        class="relative aspect-square overflow-hidden rounded-md border border-gray-200 hover:opacity-90 transition-opacity"
                        on:click={() => window.open(photo, '_blank')}
                      >
                        <img 
                          src={photo} 
                          alt={`Foto ${i+1}`} 
                          class="object-cover w-full h-full" 
                          on:error={(e) => e.target.src = '/placeholder-image.svg'}
                        />
                        <div class="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-tl">
                          Clique para ampliar
                        </div>
                      </button>
                    {/if}
                  {/each}
                </div>
              {:else if typeof latest_visit.fotos === 'object' && latest_visit.fotos !== null}
                <div class="space-y-4">
                  {#each Object.entries(latest_visit.fotos) as [category, photos]}
                    {#if typeof photos === 'object' && photos !== null && !Array.isArray(photos)}
                      <div>
                        <h3 class="font-bold text-md mb-2">{category}</h3>
                        <div class="grid grid-cols-2 gap-2">
                          {#each Object.entries(photos) as [label, photoUrl]}
                            {#if typeof photoUrl === 'string' && photoUrl}
                              <button 
                                class="relative aspect-square overflow-hidden rounded-md border border-gray-200 hover:opacity-90 transition-opacity"
                                on:click={() => window.open(photoUrl, '_blank')}
                              >
                                <img 
                                  src={photoUrl} 
                                  alt={`${category} - ${label}`} 
                                  class="object-cover w-full h-full" 
                                  on:error={(e) => e.target.src = '/placeholder-image.svg'}
                                />
                                <div class="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1">
                                  {label}
                                </div>
                                <div class="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-tl">
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
