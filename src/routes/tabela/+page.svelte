<script>
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";

  export let data;

  // Function to format a date string
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<div class="container mx-auto py-10">
  <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Coleta PDV Data</h1>
  <div class="rounded-lg border border-gray-200 shadow-md overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow class="bg-gray-100">
          <TableHead class="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</TableHead>
          <TableHead class="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Chave</TableHead>
          <TableHead class="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nome Usuário</TableHead>
          <TableHead class="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Data Visita</TableHead>
          <TableHead class="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Cod PDV</TableHead>
          <TableHead class="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Comercial</TableHead>
          <TableHead class="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Operação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each data.data as row, i}
          <TableRow class="hover:bg-gray-50 {i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
            <TableCell class="py-4 px-6 text-sm text-gray-900">{row.id}</TableCell>
            <TableCell class="py-4 px-6 text-sm text-gray-900">{row.chave}</TableCell>
            <TableCell class="py-4 px-6 text-sm text-gray-900">{row.nome_usuario}</TableCell>
            <TableCell class="py-4 px-6 text-sm text-gray-900">{formatDate(row.data_visita)}</TableCell>
            <TableCell class="py-4 px-6 text-sm text-gray-900">{row.cod_pdv}</TableCell>
            <TableCell class="py-4 px-6 text-sm text-gray-900">{row.comercial}</TableCell>
            <TableCell class="py-4 px-6 text-sm text-gray-900">{row.operação}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </div>
</div>