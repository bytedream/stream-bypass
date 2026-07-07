<script lang="ts">
	import { type Host } from '@/lib/host';

	/* types */
	interface Props {
		host: Host;
	}

	/* states */
	const { host }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center">
	<p class="text-md text-gray-400">Match found:</p>
	<span class="underline text-green-400 text-xl font-bold select-text">{host.name}</span>
</div>
