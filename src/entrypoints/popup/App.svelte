<script lang="ts">
	import '@/assets/base.css';

	import { fly } from 'svelte/transition';
	import Main from '@/entrypoints/popup/pages/main/Main.svelte';
	import Settings from '@/entrypoints/popup/pages/settings/Settings.svelte';
	import { isMobile } from '@/entrypoints/popup/state.js';

	/* state init */
	browser.runtime.getPlatformInfo().then((info) => ($isMobile = info.os === 'android'));

	/* types */
	type Page = 'main' | 'settings';

	/* states */
	let activePage = $state<Page>('main');
</script>

<div class="flex w-[350px] overflow-hidden" class:w-screen={$isMobile}>
	{#if activePage === 'main'}
		<div transition:fly={{ x: -300, duration: 150 }} class="min-w-full w-full h-[300px] flex-1 flex flex-col">
			<Main onSettingsOpenRequest={() => (activePage = 'settings')} />
		</div>
	{:else if activePage === 'settings'}
		<div
			transition:fly={{ x: 300, duration: 150 }}
			class="min-w-full w-full h-[300px] flex-1 flex flex-col"
			class:h-screen={$isMobile}
		>
			<Settings onSettingsCloseRequest={() => (activePage = 'main')} />
		</div>
	{/if}
</div>
