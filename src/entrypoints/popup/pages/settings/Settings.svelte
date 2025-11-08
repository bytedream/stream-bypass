<script lang="ts">
	import Divider from '@/entrypoints/popup/components/Divider.svelte';
	import Ff2mpv from '@/entrypoints/popup/pages/settings/Ff2mpv.svelte';
	import Header from '@/entrypoints/popup/pages/settings/Header.svelte';
	import HostsTable from '@/entrypoints/popup/pages/settings/HostsTable.svelte';
	import { isMobile } from '@/entrypoints/popup/state';

	/* types */
	interface Props {
		onSettingsCloseRequest: () => void;
	}

	/* states */
	let { onSettingsCloseRequest }: Props = $props();
</script>

<div class="w-full">
	<Header onBackClick={onSettingsCloseRequest} />
	<Divider />
</div>
<div class="flex flex-col gap-y-1 pt-1 h-full mx-2 my-1 overflow-y-scroll">
	<details class="details" open>
		<summary>Hosts</summary>
		<HostsTable />
	</details>
	{#if !$isMobile}
		<details class="details">
			<summary>ff2mpv</summary>
			<Ff2mpv />
		</details>
	{/if}
</div>

<style>
	* {
		@apply select-none;
	}

	.details {
		/* using normal css instead of tailwind in the following blocks.
           for some reason tailwind fails to resolve many references */

		&::before,
		&::after {
			content: '';
			display: block;
			width: 100%;
			border-top: 1px solid var(--color-gray-600);
			margin: 0.25rem 0;
		}

		& > summary {
			cursor: pointer;
		}

		&[open] > summary {
			margin-bottom: 0.5rem;
		}
	}
</style>
