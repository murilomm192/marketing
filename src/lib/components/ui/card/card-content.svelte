<script>
	import { cn } from "$lib/utils.js";
	let className = undefined;
	export { className as class };
</script>

<div class={cn("sm:p-6 p-2 pt-0", className)} {...$$restProps}>
	<slot />
</div>
