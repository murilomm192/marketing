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

  // Define table columns with display names and corresponding data fields
  const columns = [
    { header: 'ID', field: 'id', formatter: (value) => value },
    { header: 'Chave', field: 'chave', formatter: (value) => value },
    { header: 'Nome Usuário', field: 'nome_usuario', formatter: (value) => value },
    { header: 'Data Visita', field: 'data_visita', formatter: (value) => formatDate(value) },
    { header: 'Cod PDV', field: 'cod_pdv', formatter: (value) => value },
    { header: 'Comercial', field: 'comercial', formatter: (value) => value },
    { header: 'Operação', field: 'operação', formatter: (value) => value }
  ];

  // Function to format cell value based on column configuration
  function formatCellValue(row, column) {
    const value = row[column.field];
    return column.formatter(value);
  }
</script>

<div class="container mx-auto py-10">
  <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Coleta PDV Data</h1>
  <div class="rounded-lg border border-gray-200 shadow-md overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow class="bg-gray-100">
          {#each columns as column}
            <TableHead class="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              {column.header}
            </TableHead>
          {/each}
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each data.data as row, i}
          <TableRow class="hover:bg-gray-50 {i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
            {#each columns as column}
              <TableCell class="py-4 px-6 text-sm text-gray-900">
                {formatCellValue(row, column)}
              </TableCell>
            {/each}
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </div>
</div>