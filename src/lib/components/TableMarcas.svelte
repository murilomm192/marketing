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
                        <tr>
                            <th
                                scope="col"
                                class="text-sm font-medium text-gray-900 py-4 text-center w-[65px] sticky left-0 bg-white z-10"
                            >
                                Marca
                            </th>
                            {#each Object.keys(data[0].qtd_materiais) as key}
                                <th
                                    scope="col"
                                    class="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                                >
                                    {key}
                                </th>
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each data as row}
                            <tr class="bg-gray-100">
                                <td class=" w-[65px] flex items-center sticky left-0 bg-slate-100 z-10"
                                    ><img
                                        src={row.logo}
                                        class="h-auto max-w-[60px] rounded-lg"
                                        alt={row.marca}
                                    /></td
                                >
                                {#each Object.keys(row.qtd_materiais) as key}
                                    <td class="text-center">
                                        <div class="flex space-x-1">
                                            <Button
                                                variant="outline"
                                                disabled={row.qtd_materiais[
                                                    key
                                                ] === 0}
                                                on:click={() => {
                                                    row.qtd_materiais[key] -= 1;
                                                }}
                                                size="icon"
                                                class="h-8 w-8 shrink-0 rounded-full"
                                            >
                                                <Minus class="h-4 w-4" />
                                            </Button>
                                            <Input
                                                type="number"
                                                bind:value={row.qtd_materiais[
                                                    key
                                                ]}
                                                class="w-12 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <Button
                                                variant="outline"
                                                on:click={() => {
                                                    row.qtd_materiais[key] += 1;
                                                }}
                                                size="icon"
                                                class="h-8 w-8 shrink-0 rounded-full"
                                            >
                                                <Plus class="h-4 w-4" />
                                                <span class="sr-only"
                                                    >Increase</span
                                                >
                                            </Button>
                                        </div>
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
