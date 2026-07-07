<script lang="ts">
	import { onDestroy } from 'svelte';
	import Divider from '@/entrypoints/popup/components/Divider.svelte';
	import Header from '@/entrypoints/popup/pages/site-config/Header.svelte';
	import PerSiteHostsList from '@/entrypoints/popup/pages/site-config/PerSiteHostsList.svelte';
	import { listenMessages, MessageType, sendMessageToActiveTab } from '@/lib/communication';
	import { hosts, type Host } from '@/lib/host';

	/* types */
	interface Props {
		onBackClick: () => void;
	}

	/* states */
	let { onBackClick }: Props = $props();

	let currentMatch = $state<{ host: Host; url: string; domain: string } | null>(null);
	let currentDomain = $state<string | null>(null);

	/* lifecycle */
	const cancel = listenMessages((type, data) => {
		if (type !== MessageType.NotifyActiveMatch) return;
		const match = {
			host: hosts.find((host) => host.id === data.id)!,
			url: data.url,
			domain: data.domain
		};
		currentMatch = match;
		currentDomain = match.domain;
	});
	sendMessageToActiveTab(MessageType.RequestActiveMatch, undefined);

	browser.tabs
		.query({ active: true, currentWindow: true })
		.then((tabs) => {
			if (currentDomain) return;
			const url = tabs[0]?.url;
			if (!url) return;
			try {
				currentDomain = new URL(url).hostname;
			} catch {
				/* ignore */
			}
		})
		.catch(() => {});

	onDestroy(cancel);
</script>

<div class="w-full">
	<Header domain={currentDomain ?? ''} {onBackClick} />
	<Divider />
</div>

<div class="flex flex-col h-full overflow-hidden">
	{#if currentDomain}
		<PerSiteHostsList domain={currentDomain} matchedHostId={currentMatch?.host.id ?? null} />
	{:else}
		<div class="flex items-center justify-center h-full text-sm text-gray-400 p-4 text-center">
			No active website detected.
		</div>
	{/if}
</div>
