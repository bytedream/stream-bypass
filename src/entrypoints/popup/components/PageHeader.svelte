<script lang="ts">
	import type { Snippet } from 'svelte';

	/* types */
	interface Props {
		title: string;
		subtitle?: string;
		actionsLeft?: Snippet;
		actionsRight?: Snippet;
	}

	/* states */
	let { title, subtitle, actionsLeft, actionsRight }: Props = $props();
</script>

<div class="flex items-center gap-2 px-3 py-2.5">
	{#if actionsLeft}
		<div class="shrink-0 flex items-center gap-2">
			{@render actionsLeft()}
		</div>
	{/if}

	<div class="min-w-0 flex-1">
		<h1 class="text-lg font-semibold text-gray-100 leading-tight truncate">{title}</h1>
		{#if subtitle}
			<p class="text-xs text-gray-400 leading-tight truncate" title={subtitle}>{subtitle}</p>
		{/if}
	</div>

	{#if actionsRight}
		<div class="shrink-0 flex items-center gap-2">
			{@render actionsRight()}
		</div>
	{/if}
</div>
