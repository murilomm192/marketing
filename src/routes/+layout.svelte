<script lang="ts">
  import "../app.pcss";

  import { Agent, setGlobalDispatcher } from "undici";

  setGlobalDispatcher(new Agent({ connect: { timeout: 60000 } }));
</script>

<slot />

