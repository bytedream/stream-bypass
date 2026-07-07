<script lang="ts">
	import { showToast } from '../../state';
	import { Trash } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import HostRow from '@/entrypoints/popup/components/HostRow.svelte';
	import { getHostFromId, hosts } from '@/lib/host';
	import { PerDomainSettings, type PerDomainConfig } from '@/lib/settings';

	/* states */
	let perDomainMap = $state<Record<string, PerDomainConfig>>({});
	let expanded = $state<string | null>(null);

	let newDomainInput = $state<string>('');
	let selectedHostId = $state<string>('');

	loadMap();

	/* functions */
	async function loadMap() {
		perDomainMap = await PerDomainSettings.getMap();
	}

	function parseDomain(input: string): string | null {
		let d = input.trim().toLowerCase();
		if (!d) return null;
		d = d.replace(/^https?:\/\//, '');
		d = d.split('/')[0];
		d = d.split(':')[0];
		if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/.test(d)) {
			return null;
		}
		return d;
	}

	/* callbacks */
	async function onClear(domain: string) {
		await PerDomainSettings.clear(domain);
		await loadMap();
		if (expanded === domain) expanded = null;
	}

	async function onAllRemove(domain: string) {
		await PerDomainSettings.setAllDisabled(domain, false);
		await loadMap();
	}

	async function onHostRemove(domain: string, hostId: string) {
		await PerDomainSettings.setHostDisabled(domain, hostId, false);
		await loadMap();
	}

	async function onHostAdd(domain: string, hostId: string) {
		if (!hostId) return;
		await PerDomainSettings.setHostDisabled(domain, hostId, true);
		await loadMap();
	}

	async function onDomainAdd(input: string) {
		const domain = parseDomain(input);
		if (!domain) {
			showToast('Invalid domain');
			return;
		}
		await PerDomainSettings.add(domain);
		await loadMap();
		expanded = domain;
	}

	function toggleExpand(domain: string) {
		expanded = expanded === domain ? null : domain;
	}
</script>

<div class="flex flex-col gap-1 h-full overflow-y-scroll">
	<div class="flex items-center gap-2 pb-1.5">
		<input
			type="text"
			bind:value={newDomainInput}
			placeholder="Add custom domain…"
			class="flex-1 min-w-0 text-xs bg-gray-900/60 border border-gray-700 rounded px-2 py-1 text-gray-100 placeholder:text-gray-500 focus:border-linux-mint-green focus:outline-none transition-colors"
			onkeydown={(e) => {
				if (e.key === 'Enter') onDomainAdd(newDomainInput).then(() => (newDomainInput = ''));
			}}
		/>
		<button
			type="button"
			class="shrink-0 px-2 py-1 text-xs rounded bg-gray-700/60 hover:bg-linux-mint-green hover:text-white text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
			disabled={!newDomainInput.trim()}
			onclick={() => onDomainAdd(newDomainInput).then(() => (newDomainInput = ''))}
		>
			Add
		</button>
	</div>
	{#if Object.keys(perDomainMap).length === 0}
		<p class="text-xs text-gray-400 text-center py-2">
			No per-site disables configured. Use the popup on a streaming site to configure it.
		</p>
	{:else}
		<div class="flex flex-col gap-1.5">
			{#each Object.entries(perDomainMap) as [domain, settings] (domain)}
				{@const isOpen = expanded === domain}
				<div class="border border-gray-700/60 rounded-md overflow-hidden">
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div
						class="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 bg-gray-900/40 hover:bg-gray-800/60 cursor-pointer transition-colors"
						role="button"
						tabindex={0}
						onclick={() => toggleExpand(domain)}
					>
						<div class="min-w-0">
							<p class="text-sm font-semibold text-gray-100 truncate">{domain}</p>
							<p class="text-[0.7rem] text-gray-400">
								{#if settings.allDisabled}
									All hosts disabled
								{:else}
									{settings.disabledHostIds.length}
									{settings.disabledHostIds.length === 1 ? 'host' : 'hosts'} disabled
								{/if}
							</p>
						</div>
						<button
							type="button"
							class="shrink-0 p-1 rounded text-gray-400 hover:text-red-400 hover:bg-gray-700/40 cursor-pointer transition-colors"
							onclick={(e) => {
								e.stopPropagation();
								onClear(domain);
							}}
						>
							<Icon src={Trash} size="0.9rem" />
						</button>
					</div>
					{#if isOpen}
						{@const availableHosts = hosts.filter((h) => !settings.disabledHostIds.includes(h.id))}
						<div class="px-2 py-2 border-t border-gray-700/60 flex flex-col gap-2">
							{#if settings.allDisabled}
								<div class="flex items-center justify-between gap-2 px-2 py-1.5 bg-gray-900/40 rounded">
									<p class="text-xs text-gray-300">All hosts disabled</p>
									<button
										type="button"
										class="shrink-0 p-1 rounded text-gray-400 hover:text-red-400 hover:bg-gray-700/40 cursor-pointer transition-colors"
										onclick={() => onAllRemove(domain)}
									>
										<Icon src={Trash} size="0.9rem" />
									</button>
								</div>
							{/if}
							{#if settings.disabledHostIds.length > 0}
								<div class="flex flex-col -mx-1 max-h-60 overflow-y-auto">
									{#each settings.disabledHostIds as hostId (hostId)}
										{@const host = getHostFromId(hostId)}
										{#if host}
											<HostRow {host} enabled={false}>
												{#snippet actions()}
													<button
														type="button"
														class="shrink-0 p-1 rounded text-gray-400 hover:text-red-400 hover:bg-gray-700/40 cursor-pointer transition-colors"
														onclick={() => onHostRemove(domain, hostId)}
													>
														<Icon src={Trash} size="0.9rem" />
													</button>
												{/snippet}
											</HostRow>
										{/if}
									{/each}
								</div>
							{/if}
							{#if !settings.allDisabled && settings.disabledHostIds.length === 0}
								<p class="text-xs text-gray-400 text-center py-1">No overrides set</p>
							{/if}
							<div class="flex items-center gap-2 pt-1">
								<select
									bind:value={selectedHostId}
									class="flex-1 min-w-0 text-xs bg-gray-900/60 border border-gray-700 rounded px-1.5 py-1 text-gray-100 cursor-pointer focus:border-linux-mint-green focus:outline-none transition-colors"
								>
									<option value="" disabled>Add host…</option>
									{#each availableHosts as host (host.id)}
										<option value={host.id}>{host.name}</option>
									{/each}
								</select>
								<button
									type="button"
									class="shrink-0 px-2 py-1 text-xs rounded bg-gray-700/60 hover:bg-linux-mint-green hover:text-white text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
									disabled={!selectedHostId}
									onclick={() => onHostAdd(domain, selectedHostId).then(() => (selectedHostId = ''))}
								>
									Add
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
