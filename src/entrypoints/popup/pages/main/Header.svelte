<script lang="ts">
	import { Cog6Tooth } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import PageHeader from '@/entrypoints/popup/components/PageHeader.svelte';
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

<PageHeader title="stream-bypass" subtitle="v{import.meta.env.VERSION}">
	{#snippet actionsRight()}
		{#key allHostsDisabled}
			<Toggle bind:checked={() => !allHostsDisabled, (v) => (allHostsDisabled = !v)} />
		{/key}
		<button
			type="button"
			class="shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-gray-300 hover:text-gray-100 hover:bg-gray-800/60 cursor-pointer transition-colors"
			onclick={() => onSettingsClick()}
		>
			<Icon src={Cog6Tooth} size="1.1rem" />
		</button>
	{/snippet}
</PageHeader>
