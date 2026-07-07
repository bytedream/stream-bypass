<script lang="ts">
	import '@/assets/base.css';

	import { onDestroy } from 'svelte';
	import Divider from '@/entrypoints/popup/components/Divider.svelte';
	import Notice from '@/entrypoints/popup/components/Notice.svelte';
	import CopyMatch from '@/entrypoints/popup/pages/main/CopyMatch.svelte';
	import CurrentSite from '@/entrypoints/popup/pages/main/CurrentSite.svelte';
	import Header from '@/entrypoints/popup/pages/main/Header.svelte';
	import Match from '@/entrypoints/popup/pages/main/Match.svelte';
	import { listenTabMessages, sendTabMessageToActiveTab, TabMessageType } from '@/lib/communication';
	import { hosts, type Host } from '@/lib/host';
	import { HostSettings } from '@/lib/settings';

	/* types */
	interface Props {
		onSettingsOpenRequest: () => void;
		onSiteConfigOpenRequest: () => void;
	}

	/* states */
	let { onSettingsOpenRequest, onSiteConfigOpenRequest }: Props = $props();
	let currentMatch = $state<{ host: Host; url: string; domain: string } | null>(null);
	let currentDomain = $state<string | null>(null);

	let allHostsDisabled = $state(false);
	HostSettings.getAllHostsDisabled().then((val) => (allHostsDisabled = val));

	/* lifecycle */
	const cancel = listenTabMessages((type, data) => {
		if (type !== TabMessageType.NotifyActiveMatch) return;
		const match = {
			host: hosts.find((host) => host.id === data.id)!,
			url: data.url,
			domain: data.domain
		};
		currentMatch = match;
	});
	sendTabMessageToActiveTab(TabMessageType.RequestActiveMatch, undefined);

	browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
		const url = tabs[0]?.url;
		if (!url) return;
		currentDomain = new URL(url).hostname;
	});

	onDestroy(cancel);
</script>

<div class="w-full shrink-0">
	<Header bind:allHostsDisabled onSettingsClick={onSettingsOpenRequest} />
	<Divider />
</div>
<div class="grid grid-cols-1 grid-rows-[min-content_auto_min-content] gap-2 h-full">
	<div class="px-2 pt-1.5 shrink-0">
		{#if currentDomain}
			<CurrentSite domain={currentDomain} onConfigureClick={onSiteConfigOpenRequest} />
		{/if}
	</div>

	<div>
		{#if allHostsDisabled}
			<Notice
				level="warning"
				title="Extension disabled"
				description="Configurations are still saved and take effect the when extension is re-enabled."
			/>
		{:else if currentMatch}
			<div class="flex flex-col justify-between h-full px-2">
				<Match host={currentMatch.host} />
				<CopyMatch url={currentMatch.url} domain={currentMatch.domain} />
			</div>
		{:else}
			<div class="flex-1 min-h-0 flex flex-col">
				<Notice level="info" title="No match found" description="No redirectable host found on this site" />
			</div>
		{/if}
	</div>

	<div class="px-2 pb-0.5">
		<p class="text-[.65rem] text-gray-400 text-center">
			Suggestions or bugs can be submitted <a
				class="underline"
				href="https://github.com/bytedream/stream-bypass/issues">here</a
			>
		</p>
	</div>
</div>

<style>
	* {
		user-select: none;
	}
</style>
