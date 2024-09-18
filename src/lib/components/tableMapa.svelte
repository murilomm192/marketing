<script>
  export let data;
</script>

<div class={$$restProps.class || "overflow-x-scroll border-collapse w-full"}>
  <div class="sm:-mx-6 lg:-mx-8">
    <div class="py-2 inline-block sm:px-6 lg:px-8">
      <div class="">
        <table class="w-full border-collapse">
          <thead class="bg-white">
            <tr class="border-2 border-slate-300">
              {#if data.length == 0}
                sem material declarado
              {:else}
                {#each Object.keys(data[0]) as key}
                  <th
                    scope="col"
                    class="text-sm text-gray-900 px-1 py-2 text-center min-w-[75px]"
                  >
                    {key}
                  </th>
                {/each}{/if}
            </tr>
          </thead>
          <tbody>
            {#each data as row}
              <tr>
                {#each Object.values(row) as value}
                  <td class="border-2 border-slate-300 text-center text-nowrap">
                    {value}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
