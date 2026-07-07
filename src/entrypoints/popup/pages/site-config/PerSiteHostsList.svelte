<script lang="ts">
	import HostRow from '@/entrypoints/popup/components/HostRow.svelte';
	import Toggle from '@/entrypoints/popup/components/Toggle.svelte';
	import { hosts, type Host } from '@/lib/host';
	import { PerDomainSettings } from '@/lib/settings';

	/* types */
	interface Props {
		domain: string;
		matchedHostId: string | null;
	}

	/* states */
	let { domain, matchedHostId }: Props = $props();

	let perDomain = $state<{ allDisabled: boolean; disabledHostIds: string[] }>({
		allDisabled: false,
		disabledHostIds: []
	});

	// `domain` is updated after this component is active, and thus we must react to this update
	$effect(() => {
		PerDomainSettings.get(domain).then((val) => (perDomain = val));
	});

	let orderedHosts = $derived(getOrderedHosts(matchedHostId));

	/* functions */
	function getOrderedHosts(matchedId: string | null): Host[] {
		const matched = matchedId ? hosts.find((h) => h.id === matchedId) : null;
		const rest = hosts
			.filter((h) => !matched || h.id !== matched.id)
			.slice()
			.sort((a, b) => a.name.localeCompare(b.name));
		return matched ? [matched, ...rest] : rest;
	}

	/* callbacks */
	async function onHostToggle(hostId: string, enabled: boolean) {
		await PerDomainSettings.setHostDisabled(domain, hostId, !enabled);
		perDomain = await PerDomainSettings.get(domain);
	}

	async function onAllToggle(enabled: boolean) {
		await PerDomainSettings.setAllDisabled(domain, !enabled);
		perDomain = await PerDomainSettings.get(domain);
	}
</script>

<div class="flex flex-col gap-2 px-2 pb-2 h-full overflow-hidden">
	<div class="flex-1 min-h-0 overflow-y-auto -mx-1 divide-y divide-gray-700/40">
		{#each orderedHosts as host (host.id)}
			{@const isInDisabledList = perDomain.disabledHostIds.includes(host.id)}
			<HostRow
				{host}
				enabled={!isInDisabledList && !perDomain.allDisabled}
				badge={host.id === matchedHostId ? 'Match' : undefined}
			>
				{#snippet actions()}
					{#key perDomain.allDisabled + perDomain.disabledHostIds.join(',')}
						<Toggle
							disabled={perDomain.allDisabled}
							title={perDomain.allDisabled ? 'All hosts are disabled for this site' : undefined}
							bind:checked={
								() => !isInDisabledList,
								(v) => {
									onHostToggle(host.id, v);
									return v;
								}
							}
							size="sm"
						/>
					{/key}
				{/snippet}
			</HostRow>
		{/each}
	</div>
	<div
		class="flex items-center justify-between gap-2 px-3 py-2 mt-1 bg-gray-800/40 border border-gray-700/60 rounded-md shrink-0"
	>
		<div class="min-w-0">
			<p class="text-sm font-semibold text-gray-100">Disable all on this site</p>
			<p class="text-xs text-gray-400 truncate">Turn off all hosts for {domain}</p>
		</div>
		{#key perDomain.allDisabled}
			<Toggle
				bind:checked={
					() => !perDomain.allDisabled,
					(v) => {
						onAllToggle(v);
						return v;
					}
				}
				size="sm"
			/>
		{/key}
	</div>
</div>
