<script>
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";

  export let data;

  // Function to format a date string
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
</script>

<div class="container mx-auto py-10">
  <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Coleta PDV Data</h1>
  <div class="rounded-lg border border-gray-200 shadow-md overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow class="bg-gray-100">
          {#each ['ID', 'Chave', 'Nome Usuário', 'Data Visita', 'Cod PDV', 'Comercial', 'Operação'] as header}
            <TableHead class="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">{header}</TableHead>
          {/each}
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each data.data as row, i}
          <TableRow class="hover:bg-gray-50 {i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
            {#each ['id', 'chave', 'nome_usuario', 'data_visita', 'cod_pdv', 'comercial', 'operação'] as field}
              <TableCell class="py-4 px-6 text-sm text-gray-900">
                {#if field === 'data_visita'}
                  {formatDate(row[field])}
                {:else}
                  {row[field]}
                {/if}
              </TableCell>
            {/each}
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </div>
</div>