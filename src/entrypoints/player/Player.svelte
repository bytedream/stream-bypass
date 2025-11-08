<script lang="ts">
	import { onMount } from 'svelte';
	import { play } from './player';

	let errorMessage: string | null = $state(null);

	let videoElem: HTMLVideoElement;

	onMount(async () => {
		try {
			await play(videoElem);
			videoElem.controls = true;
		} catch (e) {
			errorMessage = e as string;
		}
	});
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<video class="absolute top-0 left-0 w-full h-full m-0" bind:this={videoElem}></video>
{#if errorMessage}
	<div class="h-full flex items-center justify-center text-center">
		<p>
			{errorMessage}&nbsp;<a class="underline" href="https://github.com/bytedream/stream-bypass/issues">here</a>.
		</p>
	</div>
{/if}
