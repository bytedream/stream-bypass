<script lang="ts">
	import '@/assets/base.css';

	import { onDestroy } from 'svelte';
	import Divider from '@/entrypoints/popup/components/Divider.svelte';
	import AllDisabled from '@/entrypoints/popup/pages/main/AllDisabled.svelte';
	import CopyMatch from '@/entrypoints/popup/pages/main/CopyMatch.svelte';
	import Header from '@/entrypoints/popup/pages/main/Header.svelte';
	import Match from '@/entrypoints/popup/pages/main/Match.svelte';
	import NoMatch from '@/entrypoints/popup/pages/main/NoMatch.svelte';
	import { listenMessages, MessageType, sendMessageToActiveTab } from '@/lib/communication';
	import { hosts, type Host } from '@/lib/host';
	import { HostSettings } from '@/lib/settings';

	/* types */
	interface Props {
		onSettingsOpenRequest: () => void;
	}

	/* states */
	let { onSettingsOpenRequest }: Props = $props();
	let currentMatch = $state<{ host: Host; url: string; domain: string } | null>(null);

	let allHostsDisabled = $state(false);
	HostSettings.getAllHostsDisabled().then((val) => (allHostsDisabled = val));

	/* lifecycle */
	const cancel = listenMessages((type, data) => {
		if (type !== MessageType.NotifyActiveMatch) return;
		currentMatch = {
			host: hosts.find((host) => host.id === data.id)!,
			url: data.url,
			domain: data.domain
		};
	});
	sendMessageToActiveTab(MessageType.RequestActiveMatch, undefined);

	onDestroy(cancel);
</script>

<div class="w-full">
	<Header bind:allHostsDisabled onSettingsClick={onSettingsOpenRequest} />
	<Divider />
</div>
<div class="px-2 h-full">
	{#if allHostsDisabled}
		<AllDisabled />
	{:else if !currentMatch}
		<NoMatch />
	{:else}
		<div class="flex flex-col justify-between h-full pb-2">
			<Match host={currentMatch.host} domain={currentMatch.domain} />
			<div class="divider border-dashed"></div>
			<div class="mt-2">
				<CopyMatch url={currentMatch.url} domain={currentMatch.domain} />
			</div>
		</div>
	{/if}
</div>

<style>
	* {
		@apply select-none;
	}
</style>
