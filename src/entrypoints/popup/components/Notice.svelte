<script lang="ts">
	import { ExclamationTriangle, InformationCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	/* types */
	interface Props {
		level: 'warning' | 'info';
		title?: string;
		description?: string;
	}

	/* states */
	let { level, title, description }: Props = $props();

	const icons = {
		warning: ExclamationTriangle,
		info: InformationCircle
	};
	const containerStyles = {
		warning: 'bg-yellow-900/30 border-yellow-700/50 text-yellow-200',
		info: 'bg-blue-900/30 border-blue-700/50 text-blue-200'
	};
	const iconStyles = {
		warning: 'text-yellow-400',
		info: 'text-blue-400'
	};
</script>

<div class="mx-2 mt-1 flex items-start gap-2 px-2.5 py-2 border rounded-md text-xs {containerStyles[level]}">
	<Icon src={icons[level]} size="0.95rem" class={iconStyles[level]} />
	<div class="leading-snug">
		{#if title}
			<p class="font-semibold">{title}</p>
		{/if}
		{#if description}
			<p class="opacity-80">{description}</p>
		{/if}
	</div>
</div>
