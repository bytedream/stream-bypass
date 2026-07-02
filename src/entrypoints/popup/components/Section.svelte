<script lang="ts">
	import { ChevronDown } from '@steeze-ui/heroicons';
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
	import { untrack, type Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	/* types */
	interface Props {
		title: string;
		description?: string;
		icon?: IconSource;
		defaultOpen?: boolean;
		children: Snippet;
	}

	/* states */
	let { title, description, icon, defaultOpen = false, children }: Props = $props();
	let open = $state(untrack(() => defaultOpen));
</script>

<div class="bg-gray-800/40 border border-gray-700/60 rounded-lg max-h-full flex flex-col">
	<button
		type="button"
		class="w-full flex items-center justify-between gap-2 px-3 py-2.5 cursor-pointer hover:bg-gray-800/60 transition-colors"
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		<div class="flex items-center gap-2 min-w-0">
			{#if icon}
				<Icon src={icon} size="1.1rem" class="text-gray-400 shrink-0" />
			{/if}
			<div class="min-w-0 text-left">
				<h3 class="text-sm font-semibold text-gray-100 leading-tight">{title}</h3>
				{#if description}
					<p class="text-xs text-gray-400 mt-0.5 leading-tight">{description}</p>
				{/if}
			</div>
		</div>
		<span class="text-gray-400 shrink-0 inline-flex chevron" class:rotated={open}>
			<Icon src={ChevronDown} size="1rem" />
		</span>
	</button>
	{#if open}
		<div class="px-3 py-3 flex overflow-hidden" transition:slide={{ duration: 150 }}>
			<div class="w-full">
				{@render children()}
			</div>
		</div>
	{/if}
</div>

<style>
	.chevron {
		transition: transform 150ms ease;
	}
	.rotated {
		transform: rotate(180deg);
	}
</style>
