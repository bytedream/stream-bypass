<script lang="ts">
	/* types */
	interface Props {
		onBackClick: () => void;
	}

	/* states */
	let { onBackClick }: Props = $props();
</script>

<div class="flex justify-between items-center p-2">
	<div class="flex items-baseline gap-2">
		<button class="cursor-pointer" onclick={() => onBackClick()}>←</button>
		<h1>Settings</h1>
	</div>
</div>
