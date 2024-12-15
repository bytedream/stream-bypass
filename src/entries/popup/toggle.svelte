<!-- https://flowbite.com/docs/forms/toggle/ -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		checked?: boolean;
		disabled?: boolean;
		id?: string | null;
		onChange?: () => void;
		children?: Snippet;
	};
	let { checked = $bindable(), disabled, id = null, onChange, children }: Props = $props();
</script>

<label class="toggle">
	{@render children?.()}
	<input type="checkbox" {id} bind:checked {disabled} onchange={onChange} />
	<span></span>
</label>

<style lang="scss" global>
	.toggle {
		display: inline-flex;
		align-items: center;
		cursor: pointer;

		input {
			clip: rect(0, 0, 0, 0);
			position: absolute;

			&:checked + span {
				background: limegreen;

				&:after {
					transform: translateX(100%);
				}
			}

			&:disabled + span {
				background: gray;
			}
		}

		span {
			position: relative;
			width: 2.75rem;
			height: 1.5rem;
			background: #cf0000;
			border-radius: 9999px;

			&:after {
				content: '';
				position: absolute;
				top: 2px;
				inset-inline-start: 2px;
				background: white;
				border-radius: 9999px;
				height: 1.25rem;
				width: 1.25rem;
				transition: all 0.15s;
			}
		}

		&:has(input:disabled) {
			cursor: default;
		}
	}
</style>
