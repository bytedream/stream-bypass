<script lang="ts">
	import { play } from '~/entries/player/player';
	import { onMount } from 'svelte';

	let errorMessage: string | null = null;
	let videoElem: HTMLVideoElement;

	onMount(async () => {
		try {
			await play(videoElem);
			videoElem.controls = true;
		} catch (e) {
			errorMessage = e;
		}
	});
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video id="video" bind:this={videoElem} />
{#if errorMessage}
	<div id="message-container">
		<p>
			{@html errorMessage}
		</p>
	</div>
{/if}

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
