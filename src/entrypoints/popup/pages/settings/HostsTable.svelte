<script lang="ts">
	import HostRow from '@/entrypoints/popup/components/HostRow.svelte';
	import SearchInput from '@/entrypoints/popup/components/SearchInput.svelte';
	import Toggle from '@/entrypoints/popup/components/Toggle.svelte';
	import { filterHosts, hosts } from '@/lib/host';
	import { HostSettings } from '@/lib/settings';

	/* types */
	interface Props {
		searchQuery: string;
	}

	/* states */
	let { searchQuery = $bindable('') }: Props = $props();
	let disabledHostIds = $state<Array<string>>([]);
	HostSettings.getDisabledHosts().then((val) => (disabledHostIds = val));

	let filtered = $derived(filterHosts(hosts, searchQuery));
</script>

<div class="flex flex-col gap-2 max-h-full">
	<SearchInput bind:value={searchQuery} placeholder="Filter hosts…" />
	{#if filtered.length === 0}
		<p class="text-xs text-gray-400 text-center py-2">No hosts match "{searchQuery}"</p>
	{:else}
		<div class="flex flex-col divide-y divide-gray-700/40 -mx-1 max-h-full overflow-y-scroll">
			{#each filtered as host (host.id)}
				<HostRow {host} enabled={!disabledHostIds.includes(host.id)}>
					{#snippet actions()}
						{#key disabledHostIds}
							<Toggle
								bind:checked={
									() => !disabledHostIds.includes(host.id),
									(v) =>
										v
											? HostSettings.removeDisabledHost(host.id)
											: HostSettings.addDisabledHost(host.id)
								}
								size="sm"
							/>
						{/key}
					{/snippet}
				</HostRow>
			{/each}
		</div>
	{/if}
</div>
