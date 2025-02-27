<script>
	import { cn } from "$lib/utils.js";
	import { badgeVariants } from "./index.js";

	let className = undefined;
	export let variant = "default";
	export { className as class };
</script>

<div class={cn(badgeVariants({ variant, className }))} {...$$restProps}>
	<slot />
</div>
