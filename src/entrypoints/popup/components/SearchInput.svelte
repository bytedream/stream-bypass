<script lang="ts">
	import { MagnifyingGlass, XMark } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	/* types */
	interface Props {
		value: string;
		placeholder?: string;
	}

	/* states */
	let { value = $bindable(''), placeholder = 'Search…' }: Props = $props();
</script>

<div
	class="flex items-center gap-2 px-2.5 py-1.5 bg-gray-900/60 border border-gray-700 rounded-md focus-within:border-linux-mint-green transition-colors"
>
	<Icon src={MagnifyingGlass} size="0.95rem" class="text-gray-400 shrink-0" />
	<input
		type="text"
		bind:value
		{placeholder}
		class="flex-1 bg-transparent text-sm text-gray-100 placeholder:text-gray-500 outline-none min-w-0"
	/>
	{#if value}
		<button
			type="button"
			class="text-gray-400 hover:text-gray-100 cursor-pointer shrink-0"
			onclick={() => (value = '')}
		>
			<Icon src={XMark} size="0.95rem" />
		</button>
	{/if}
</div>
