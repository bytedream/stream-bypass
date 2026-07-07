<script lang="ts">
	import { AdjustmentsHorizontal, ChevronRight, GlobeAlt } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	/* types */
	interface Props {
		domain: string;
		onConfigureClick: () => void;
	}

	/* states */
	let { domain, onConfigureClick }: Props = $props();
</script>

<div class="flex items-center justify-between gap-2 px-3 py-1.5 text-sm text-gray-300">
	<span class="flex items-center gap-2 min-w-0">
		<Icon src={GlobeAlt} size="0.95rem" class="text-gray-400 shrink-0" />
		<span class="truncate" title={domain}>{domain}</span>
	</span>
	<button
		type="button"
		class="flex items-center gap-1 shrink-0 text-xs text-gray-400 hover:text-gray-200 px-1.5 py-0.5 rounded hover:bg-gray-800/60 cursor-pointer transition-colors"
		onclick={onConfigureClick}
	>
		<Icon src={AdjustmentsHorizontal} size="0.85rem" />
		<span>Configure</span>
		<Icon src={ChevronRight} size="0.75rem" />
	</button>
</div>
