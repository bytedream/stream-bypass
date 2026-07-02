<script lang="ts">
	import { ArrowLeft } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	/* types */
	interface Props {
		onBackClick: () => void;
	}

	/* states */
	let { onBackClick }: Props = $props();
</script>

<div class="flex justify-between items-center px-3 py-2.5">
	<div class="flex items-center gap-2">
		<button
			type="button"
			class="flex items-center justify-center w-7 h-7 rounded-md text-gray-300 hover:text-gray-100 hover:bg-gray-800/60 cursor-pointer transition-colors"
			aria-label="Back"
			onclick={() => onBackClick()}
		>
			<Icon src={ArrowLeft} size="1.1rem" />
		</button>
		<div>
			<h1 class="text-lg font-semibold text-gray-100 leading-tight">Settings</h1>
			<p class="text-xs text-gray-400 leading-tight">Manage hosts and integrations</p>
		</div>
	</div>
</div>
