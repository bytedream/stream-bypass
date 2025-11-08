<script lang="ts">
	import Toggle from '@/entrypoints/popup/components/Toggle.svelte';
	import { hosts } from '@/lib/host';
	import { HostSettings } from '@/lib/settings';

	/* states */
	let disabledHostIds = $state<Array<string>>([]);
	HostSettings.getDisabledHosts().then((val) => (disabledHostIds = val));
</script>

<div class="grid grid-cols-[35%_43%_22%] gap-y-0.75">
	<p class="font-bold">Host</p>
	<p class="font-bold">Domains</p>
	<p class="font-bold">Enabled</p>
	{#each hosts as host (host.id)}
		{@const domainList = host.domains.join(', ')}
		<p>{host.name}</p>
		<div>
			<label for={host.id}>
				<input id={host.id} type="checkbox" class="peer hidden" checked />
				<p
					title={domainList}
					class="cursor-pointer overflow-hidden peer-checked:text-ellipsis peer-checked:text-nowrap"
				>
					{domainList}
				</p>
			</label>
		</div>
		<div class="mt-[.2rem]">
			{#key disabledHostIds}
				<Toggle
					bind:checked={
						() => !disabledHostIds.includes(host.id),
						(v) => (v ? HostSettings.removeDisabledHost(host) : HostSettings.addDisabledHost(host))
					}
					size="sm"
				></Toggle>
			{/key}
		</div>
	{/each}
</div>
