<script lang="ts">
	import { onMount } from 'svelte';
	import { play } from '~/entries/player/player';

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
<video id="video" bind:this={videoElem}></video>
{#if errorMessage}
	<div id="message-container">
		<p>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html errorMessage}
		</p>
	</div>
{/if}

<!-- eslint-disable -->
<style lang="scss" global>
	body {
		background-color: #131313;
	}

	html,
	body,
	video {
		width: 100%;
		height: 100%;
		margin: 0;
	}

	video {
		position: absolute;
		top: 0;
		left: 0;
	}

	#message-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: white;
		text-align: center;
		height: 100%;

		& a,
		& a:visited {
			color: inherit;
			text-decoration: underline;
		}
	}
</style>
