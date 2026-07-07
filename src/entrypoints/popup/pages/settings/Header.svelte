<script lang="ts">
	import BackButton from '@/entrypoints/popup/components/BackButton.svelte';
	import PageHeader from '@/entrypoints/popup/components/PageHeader.svelte';

	/* types */
	interface Props {
		onBackClick: () => void;
	}

	/* states */
	let { onBackClick }: Props = $props();
</script>

<PageHeader title="Settings" subtitle="Manage hosts and integrations">
	{#snippet actionsLeft()}
		<BackButton onclick={onBackClick} />
	{/snippet}
</PageHeader>
