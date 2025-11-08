<script lang="ts">
	import { type Host } from '@/lib/host';

	/* types */
	interface Props {
		host: Host;
		domain: string;
	}

	/* states */
	const { host, domain }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center w-full h-full">
	<p class="text-lg">Match found:</p>
	<div class="[&>*]:select-text">
		<span class="underline text-green-400 text-2xl font-bold">{host.name}</span>
		<span class="text-xs text-slate-300">({domain})</span>
	</div>
</div>
