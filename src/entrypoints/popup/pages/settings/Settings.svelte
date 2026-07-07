<script lang="ts">
	import { CommandLine, MapPin, ServerStack } from '@steeze-ui/heroicons';
	import Divider from '@/entrypoints/popup/components/Divider.svelte';
	import Section from '@/entrypoints/popup/components/Section.svelte';
	import Ff2mpv from '@/entrypoints/popup/pages/settings/Ff2mpv.svelte';
	import Header from '@/entrypoints/popup/pages/settings/Header.svelte';
	import HostsTable from '@/entrypoints/popup/pages/settings/HostsTable.svelte';
	import PerSiteDisables from '@/entrypoints/popup/pages/settings/PerSiteDisables.svelte';
	import { isMobile } from '@/entrypoints/popup/state';
	import { PerDomainSettings } from '@/lib/settings';

	/* types */
	interface Props {
		onSettingsCloseRequest: () => void;
	}

	/* states */
	let { onSettingsCloseRequest }: Props = $props();
	let searchQuery = $state('');

	onDestroy(PerDomainSettings.cleanEmpty);
</script>

<div class="w-full">
	<Header onBackClick={onSettingsCloseRequest} />
	<Divider />
</div>
<div class="flex flex-col gap-2 p-2 h-full overflow-y-scroll">
	<div class="max-h-full">
		<Section
			title="Hosts"
			description="Enable or disable support for specific streaming providers"
			icon={ServerStack}
			defaultOpen
		>
			<HostsTable bind:searchQuery />
		</Section>
	</div>
	<Section title="Per-site disables" description="Disable hosts for specific websites" icon={MapPin}>
		<PerSiteDisables />
	</Section>
	{#if !$isMobile}
		<Section title="ff2mpv" description="Play streams directly in mpv via native messaging" icon={CommandLine}>
			<Ff2mpv />
		</Section>
	{/if}
</div>

<style>
	* {
		user-select: none;
	}
</style>
