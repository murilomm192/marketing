<script>
  import Minus from "svelte-radix/Minus.svelte";
  import Plus from "svelte-radix/Plus.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input";
  export let data;
</script>

<div class="overflow-x-scroll border-collapse w-full">
  <div class="sm:-mx-6 lg:-mx-8">
    <div class="py-2 inline-block sm:px-6 lg:px-8">
      <div class="">
        <table class="w-full border-collapse">
          <thead class="bg-white">
            <tr class="border-2 border-slate-300">
              {#each Object.keys(data[0]) as key}
                <th
                  scope="col"
                  class="text-sm text-gray-900 px-1 py-2 text-center"
                >
                  {key}
                </th>
              {/each}
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
