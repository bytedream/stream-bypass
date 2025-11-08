<script lang="ts">
	/* types */
	interface Props {
		checked: boolean;
		onChecked?: (checked: boolean) => void | boolean | Promise<void> | Promise<boolean>;
		size?: 'sm' | 'md';
	}

	/* states */
	let { checked = $bindable(), onChecked, size = 'md' }: Props = $props();
	let internalChecked = $state($state.snapshot(checked));

	/* callbacks */
	async function onInputChange() {
		internalChecked = !internalChecked;
		let approved = false;

		if (!onChecked) {
			approved = true;
		} else {
			const ret = onChecked(!internalChecked);

			if (typeof ret === 'boolean') {
				approved = ret;
			} else if (typeof ret === 'object' && 'then' in ret && typeof ret.then === 'function') {
				const promiseRet = await ret;
				if (typeof promiseRet === 'undefined') approved = true;
				else approved = promiseRet;
			}
		}

		if (approved) {
			internalChecked = !internalChecked;
			checked = internalChecked;
		}
	}
</script>

<label class="flex items-center cursor-pointer">
	<div class="relative">
		<input type="checkbox" class="peer sr-only" bind:checked={internalChecked} onchange={onInputChange} />
		<div
			class="block rounded-full box bg-red-700 peer-checked:bg-linux-mint-green"
			class:w-8={size === 'sm'}
			class:h-4={size === 'sm'}
			class:w-10={size === 'md'}
			class:h-5={size === 'md'}
		></div>
		<div
			class="absolute flex items-center justify-center transition bg-white rounded-full dot left-0 top-0 peer-checked:translate-x-full"
			class:w-4={size === 'sm'}
			class:h-4={size === 'sm'}
			class:w-5={size === 'md'}
			class:h-5={size === 'md'}
		></div>
	</div>
</label>
