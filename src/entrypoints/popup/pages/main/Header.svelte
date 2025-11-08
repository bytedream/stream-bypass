<script lang="ts">
	import Toggle from '@/entrypoints/popup/components/Toggle.svelte';
	import { HostSettings } from '@/lib/settings';

	/* types */
	interface Props {
		allHostsDisabled: boolean;
		onSettingsClick: () => void;
	}

	/* states */
	let { allHostsDisabled = $bindable(), onSettingsClick }: Props = $props();

	/* effects */
	$effect(() => {
		HostSettings.setAllHostsDisabled(allHostsDisabled);
		browser.browserAction.setIcon({
			path: allHostsDisabled
				? {
						16: 'icon/stream-bypass_disabled@16px.png',
						32: 'icon/stream-bypass_disabled@32px.png',
						48: 'icon/stream-bypass_disabled@48px.png',
						128: 'icon/stream-bypass_disabled@128px.png'
					}
				: {
						16: 'icon/stream-bypass@16px.png',
						32: 'icon/stream-bypass@32px.png',
						48: 'icon/stream-bypass@48px.png',
						128: 'icon/stream-bypass@128px.png'
					}
		});
	});
</script>

<div class="flex justify-between items-center p-2">
	<div class="flex items-baseline gap-2">
		<h1>stream-bypass</h1>
		<span class="text-xs text-gray-400">v{import.meta.env.VERSION}</span>
	</div>
	<div class="flex items-center gap-2">
		{#key allHostsDisabled}
			<Toggle bind:checked={() => !allHostsDisabled, (v) => (allHostsDisabled = !v)} />
		{/key}
		<button class="font-bold cursor-pointer" onclick={() => onSettingsClick()}>⋮</button>
	</div>
</div>
