<script lang="ts">
	import { fly } from 'svelte/transition';
	import { toast } from '@/entrypoints/popup/state';
</script>

{#if $toast}
	<div
		class="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-max max-w-11/12 px-3 py-1.5 bg-gray-700 text-gray-100 text-sm rounded shadow-lg pointer-events-none"
		transition:fly={{ y: -20, duration: 200 }}
	>
		{$toast.message}
	</div>
{/if}
