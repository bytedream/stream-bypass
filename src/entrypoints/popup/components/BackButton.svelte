<script lang="ts">
	import { ArrowLeft } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	/* types */
	interface Props {
		onclick: () => void;
	}

	/* states */
	let { onclick }: Props = $props();
</script>

<button
	type="button"
	class="shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-gray-300 hover:text-gray-100 hover:bg-gray-800/60 cursor-pointer transition-colors"
	{onclick}
>
	<Icon src={ArrowLeft} size="1.1rem" />
</button>
