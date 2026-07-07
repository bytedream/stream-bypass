<script lang="ts">
	import BackButton from '@/entrypoints/popup/components/BackButton.svelte';
	import PageHeader from '@/entrypoints/popup/components/PageHeader.svelte';

	/* types */
	interface Props {
		domain: string;
		onBackClick: () => void;
	}

	/* states */
	let { domain, onBackClick }: Props = $props();
</script>

<PageHeader title="Site settings" subtitle={domain}>
	{#snippet actionsLeft()}
		<BackButton onclick={onBackClick} />
	{/snippet}
</PageHeader>
