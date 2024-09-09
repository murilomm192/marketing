<script>
    import Check from "svelte-radix/Check.svelte";
    import CaretSort from "svelte-radix/CaretSort.svelte";
    import { tick } from "svelte";
    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { cn } from "$lib/utils.js";

    export let nome_categoria = "framework"

    export let values = [
      {
        value: "sveltekit",
        name: "SvelteKit"
      },
      {
        value: "next.js",
        name: "Next.js"
      },
      {
        value: "nuxt.js",
        name: "Nuxt.js"
      },
      {
        value: "remix",
        name: "Remix"
      },
      {
        value: "astro",
        name: "Astro"
      }
    ];
   
    let open = false;
    export let value = "";
   
    $: selectedValue = values.find((f) => f.value === value)?.name ?? `${nome_categoria}`;
   
    // We want to refocus the trigger button when the user selects
    // an item from the list so users can continue navigating the
    // rest of the form with the keyboard.
    function closeAndFocusTrigger(triggerId) {
      open = false;
      tick().then(() => {
        document.getElementById(triggerId)?.focus();
      });
    }
  </script>
   
  <Popover.Root bind:open let:ids>
    <Popover.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="outline"
        role="combobox"
        aria-expanded={open}
        class="min-w-[200px] justify-between"
      >
        {selectedValue}
        <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </Popover.Trigger>
    <Popover.Content class="w-[200px] p-0">
      <Command.Root>
        <Command.Input placeholder={`Procurar ${nome_categoria}...`} class="h-9" />
        <Command.Empty>Não Encontrado</Command.Empty>
        <Command.Group>
          {#each values as framework}
            <Command.Item
              value={framework.value}
              onSelect={(currentValue) => {
                value = currentValue;
                closeAndFocusTrigger(ids.trigger);
              }}
            >
              <Check
                class={cn(
                  "mr-2 h-4 w-4",
                  value !== framework.value && "text-transparent"
                )}
              />
              {framework.name}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>