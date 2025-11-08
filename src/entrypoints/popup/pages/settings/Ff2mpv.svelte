<script lang="ts">
	import { InformationCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import Toggle from '@/entrypoints/popup/components/Toggle.svelte';
	import { FF2MPVSettings } from '@/lib/settings';

	/* states */
	let enabled = $state(false);
	FF2MPVSettings.getEnabled().then((val) => (enabled = val));

	/* callbacks */
	function onEnableChange(enabled: boolean) {
		if (!enabled) return true;

		return browser.permissions.request({ permissions: ['nativeMessaging'] });
	}
</script>

<div class="flex items-center gap-2">
	<div class="relative mr-3">
		<span>Communication enabled</span>
		<a
			class="absolute -top-1 -right-4 text-sm"
			href="https://github.com/bytedream/stream-bypass/tree/main?tab=readme-ov-file#ff2mpv-use-mpv-to-directly-play-streams"
			target="_blank"><Icon src={InformationCircle} size="1rem" /></a
		>
	</div>
	{#key enabled}
		<Toggle
			bind:checked={() => enabled, (v) => FF2MPVSettings.setEnabled(v)}
			onChecked={onEnableChange}
			size="sm"
		/>
	{/key}
</div>
