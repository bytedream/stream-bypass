<script lang="ts">
	import { Clipboard, InformationCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { isMobile } from '@/entrypoints/popup/state';

	/* types */
	interface Props {
		url: string;
		domain: string;
	}

	type UrlType = 'url' | 'curl';

	/* states */
	let { url, domain }: Props = $props();

	let urlOutputType: UrlType = $state('url');
	let urlOutput = $derived(getUrl(urlOutputType));

	/* functions */
	function getUrl(type: UrlType) {
		switch (type) {
			case 'url':
				return url;
			case 'curl':
				return `curl -H "Referer: https://${domain}/" "${encodeURI(url)}"`;
		}
	}

	/* callbacks */
	function copyUrl() {
		navigator.clipboard.writeText(urlOutput);
	}
</script>

<div>
	<div class="flex gap-2 items-center pb-1">
		<p class="mt-0.5 text-sm">Show video as</p>
		<select
			class="w-fit text-xs border text-slate-200 border-gray-500 rounded cursor-pointer pt-1 pb-0.5 pl-1"
			bind:value={urlOutputType}
		>
			<option value="url">URL</option>
			<option value="curl">cURL</option>
		</select>
		{#if urlOutputType === 'url'}
			<div class="relative group h-4 flex justify-center items-center">
				<button class="text-sm peer"><Icon src={InformationCircle} size="1rem" /></button>
				<span
					class="z-10 absolute w-58 bottom-5/4 p-1 bg-gray-800 text-xs invisible opacity-0 group-hover:visible group-hover:opacity-100 peer-focus:visible peer-focus:opacity-100 transition-[opacity]"
					>You may have to send the referer header <code class="select-text">Referer: {domain}</code> when accessing
					the url</span
				>
			</div>
		{/if}
	</div>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="relative group w-full" tabindex={$isMobile ? 0 : undefined}>
		<pre
			class="w-full h-20 overflow-y-scroll text-[0.8rem] wrap-anywhere text-wrap select-text rounded bg-gray-900 py-[0.25rem] px-1.5">{urlOutput}</pre>
		<div
			class="absolute top-2 right-2 transition-opacity duration-100 opacity-0 group-hover:opacity-100 group-focus:opacity-100 h-full"
		>
			<button class="cursor-pointer" title="Copy to clipboard" onclick={copyUrl}>
				<Icon src={Clipboard} size="1rem" />
			</button>
		</div>
	</div>
</div>
