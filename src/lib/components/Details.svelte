<script>
  import { Card } from "$lib/components/ui/card";
  import { onMount } from "svelte";

  export let detalhes;
export let ponto_clicado

  onMount(async () => {
    const res = await fetch(
      `api/google?lat=${ponto_clicado.latitude}&long=${ponto_clicado.longitude}&nome=${ponto_clicado.nome_fantasia}`
    );
    $: detalhes = await res.json();
  });
</script>

<Card class="bg-white bg-opacity-90 p-4"
  >{JSON.stringify(detalhes, null, 2)}</Card
>
