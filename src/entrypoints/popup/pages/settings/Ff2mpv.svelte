<script lang="ts">
	import { showToast } from '../../state';
	import { InformationCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import Toggle from '@/entrypoints/popup/components/Toggle.svelte';
	import { FF2MPVSettings } from '@/lib/settings';

	/* states */
	let enabled = $state(false);
	FF2MPVSettings.getEnabled().then((val) => (enabled = val));

	/* callbacks */
	async function onEnableChange(enabled: boolean) {
		if (!enabled) return true;

		const id = setTimeout(() => showToast('Accept the permission request to allow communication with mpv'), 100);
		const confirmed = await browser.permissions.request({ permissions: ['nativeMessaging'] });
		clearTimeout(id);

		return confirmed;
	}
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-col gap-0.5">
		<p class="text-sm font-semibold text-gray-100">Communication enabled</p>
		<a
			class="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
			href="https://github.com/bytedream/stream-bypass/tree/main?tab=readme-ov-file#ff2mpv-use-mpv-to-directly-play-streams"
			target="_blank"
		>
			<Icon src={InformationCircle} size="0.85rem" />
			<span>Learn more</span>
		</a>
	</div>
	{#key enabled}
		<Toggle
			bind:checked={() => enabled, (v) => FF2MPVSettings.setEnabled(v)}
			onChecked={onEnableChange}
			size="sm"
		/>
	{/key}
</div>
