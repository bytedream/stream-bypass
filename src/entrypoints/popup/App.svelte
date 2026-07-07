<script lang="ts">
	import '@/assets/base.css';

	import { fly } from 'svelte/transition';
	import Toast from '@/entrypoints/popup/components/Toast.svelte';
	import Main from '@/entrypoints/popup/pages/main/Main.svelte';
	import Settings from '@/entrypoints/popup/pages/settings/Settings.svelte';
	import SiteConfig from '@/entrypoints/popup/pages/site-config/SiteConfig.svelte';
	import { isMobile } from '@/entrypoints/popup/state.js';

	/* state init */
	browser.runtime.getPlatformInfo().then((info) => ($isMobile = info.os === 'android'));

	/* types */
	type Page = 'main' | 'settings' | 'site-config';

	/* states */
	let activePage = $state<Page>('main');
</script>

<div class="flex w-78 overflow-hidden" class:w-screen={$isMobile}>
	<Toast />
	{#if activePage === 'main'}
		<div transition:fly={{ x: -300, duration: 150 }} class="min-w-full w-full h-80 flex-1 flex flex-col">
			<Main
				onSettingsOpenRequest={() => (activePage = 'settings')}
				onSiteConfigOpenRequest={() => (activePage = 'site-config')}
			/>
		</div>
	{:else if activePage === 'settings'}
		<div
			transition:fly={{ x: 300, duration: 150 }}
			class="min-w-full w-full h-120 flex-1 flex flex-col"
			class:h-screen={$isMobile}
		>
			<Settings onSettingsCloseRequest={() => (activePage = 'main')} />
		</div>
	{:else if activePage === 'site-config'}
		<div
			transition:fly={{ x: 300, duration: 150 }}
			class="min-w-full w-full h-120 flex-1 flex flex-col"
			class:h-screen={$isMobile}
		>
			<SiteConfig onBackClick={() => (activePage = 'main')} />
		</div>
	{/if}
</div>
