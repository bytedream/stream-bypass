<script lang="ts">
	import { ArrowLeft } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	/* types */
	interface Props {
		domain: string;
		onBackClick: () => void;
	}

	/* states */
	let { domain, onBackClick }: Props = $props();
</script>

<div class="flex items-center gap-2 px-3 py-2.5">
	<button
		type="button"
		class="flex items-center justify-center w-7 h-7 rounded-md text-gray-300 hover:text-gray-100 hover:bg-gray-800/60 cursor-pointer transition-colors"
		onclick={() => onBackClick()}
	>
		<Icon src={ArrowLeft} size="1.1rem" />
	</button>
	<div class="min-w-0">
		<h1 class="text-lg font-semibold text-gray-100 leading-tight">Site settings</h1>
		<p class="text-xs text-gray-400 leading-tight truncate" title={domain}>{domain}</p>
	</div>
</div>
