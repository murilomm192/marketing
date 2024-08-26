<script>
  import CalendarIcon from "svelte-radix/Calendar.svelte";
  import {
    DateFormatter,
    getLocalTimeZone,
    today,
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";

  const df = new DateFormatter("pt-BR", {
    dateStyle: "long",
  });

  export let value = today(getLocalTimeZone());
</script>

<Popover.Root>
  <Popover.Trigger asChild let:builder>
    <Button
      variant="outline"
      class={cn(
        "w-full justify-start text-left font-normal",
        !value && "text-muted-foreground",
      )}
      builders={[builder]}
    >
      <CalendarIcon class="mr-2 h-4 w-4" />
      {value ? value : "Selecione a data:"}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0" align="start">
    <Calendar bind:value />
  </Popover.Content>
</Popover.Root>
