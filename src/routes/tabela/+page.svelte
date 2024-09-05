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
  <h1 class="text-2xl font-bold mb-5">Coleta PDV Data</h1>
  <div class="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Chave</TableHead>
          <TableHead>Nome Usuário</TableHead>
          <TableHead>Data Visita</TableHead>
          <TableHead>Cod PDV</TableHead>
          <TableHead>Comercial</TableHead>
          <TableHead>Operação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each data.data as row}
          <TableRow>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.chave}</TableCell>
            <TableCell>{row.nome_usuario}</TableCell>
            <TableCell>{formatDate(row.data_visita)}</TableCell>
            <TableCell>{row.cod_pdv}</TableCell>
            <TableCell>{row.comercial}</TableCell>
            <TableCell>{row.operação}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </div>
</div>