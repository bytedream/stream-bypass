<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Host } from '@/lib/host';

	/* types */
	interface Props {
		host: Host;
		enabled?: boolean;
		onclick?: () => void;
		actions: Snippet;
	}

	/* states */
	let { host, enabled, onclick, actions }: Props = $props();

	let rowClass = $derived(
		`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${onclick ? 'hover:bg-gray-800/40 cursor-pointer' : ''}`
	);

	/* functions */
	function handleKeydown(event: KeyboardEvent) {
		if (!onclick) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onclick();
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class={rowClass}
	role={onclick ? 'button' : undefined}
	tabindex={onclick ? 0 : undefined}
	{onclick}
	onkeydown={handleKeydown}
>
	<span
		class="w-2 h-2 rounded-full shrink-0"
		class:bg-linux-mint-green={enabled === true}
		class:bg-gray-500={enabled === false}
		class:bg-transparent={enabled === undefined}
		aria-hidden="true"
	></span>
	<div class="flex-1 min-w-0">
		<p class="text-sm font-semibold text-gray-100 truncate">{host.name}</p>
		<p class="text-xs text-gray-400 truncate" title={host.domains.join(', ')}>
			{host.domains.join(', ')}
		</p>
	</div>
	<div class="shrink-0">
		{@render actions()}
	</div>
</div>
