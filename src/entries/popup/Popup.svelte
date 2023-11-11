<script lang="ts">
	import { matches, Reliability } from '~/lib/match';
	import { Hosters, Other } from '~/lib/settings';

	let hostersEnabled: boolean;
	let hosters = [];
	(async () => {
		hostersEnabled = !(await Hosters.getAllDisabled());

		const disabled = await Hosters.getDisabled();
		hosters = Object.values(matches).map((m) => {
			m['active'] = disabled.findIndex((p) => p.id == m.id) == -1;
			m['disabled'] = !hostersEnabled;
			return m;
		});
	})();

	let ff2mpvEnabled: boolean;
	(async () => {
		ff2mpvEnabled = await Other.getFf2mpv();
	})();
</script>

<main>
	<div>
		<h3 class="header">Hosters</h3>
		<div class="buttons super-buttons">
			<button
				class:active={hostersEnabled}
				on:click={async () => {
					await Hosters.enableAll();
					hostersEnabled = true;
					hosters = hosters.map((m) => {
						m['disabled'] = false;
						return m;
					});
				}}>On</button
			>
			<button
				class:active={!hostersEnabled}
				on:click={async () => {
					await Hosters.disableAll();
					hostersEnabled = false;
					hosters = hosters.map((m) => {
						m['disabled'] = true;
						return m;
					});
				}}>Off</button
			>
		</div>
		<table class="setting-table">
			{#each hosters as hoster}
				<tr>
					<td class="setting-name">
						<p
							class:reliability-low={hoster.reliability === Reliability.LOW}
							class:reliability-normal={hoster.reliability === Reliability.NORMAL}
							class:reliability-high={hoster.reliability === Reliability.HIGH}
						>
							{hoster.name}
						</p>
					</td>
					<td class="buttons">
						<button
							class:disabled={hoster.disabled}
							class:active={hoster.active}
							on:click={async () => {
								if (hoster.disabled) return;
								await Hosters.enable(hoster);
								hoster.active = true;
							}}>On</button
						>
						<button
							class:disabled={hoster.disabled}
							class:active={!hoster.active}
							on:click={async () => {
								if (hoster.disabled) return;
								await Hosters.disable(hoster);
								hoster.active = false;
							}}>Off</button
						>
					</td>
				</tr>
			{/each}
		</table>
	</div>
	<hr />
	<div>
		<h3 class="header">Other</h3>
		<table>
			<tr>
				<td class="setting-name">
					<p>ff2mpv</p>
				</td>
				<td class="buttons">
					<button
						class:active={ff2mpvEnabled}
						on:click={async () => {
							await Other.setFf2mpv(true);
							ff2mpvEnabled = true;
						}}>On</button
					>
					<button
						class:active={!ff2mpvEnabled}
						on:click={async () => {
							await Other.setFf2mpv(false);
							ff2mpvEnabled = false;
						}}>Off</button
					>
					<a
						href="https://github.com/ByteDream/stream-bypass/tree/master#ff2mpv-use-mpv-to-directly-play-streams"
						>🛈</a
					>
				</td>
			</tr>
		</table>
	</div>
	<hr />
	<a id="bug-notice" href="https://github.com/ByteDream/stream-bypass/issues"
		>Something does not work</a
	>
</main>

<!-- eslint-disable -->
<style lang="scss" global>
	body {
		background-color: #2b2a33;
		color: white;
		font-weight: bold;
		overflow-x: hidden;
		overflow-y: auto;
	}

	#bug-notice {
		border: none;
		color: white;
		display: block;
		font-weight: lighter;
		font-size: 0.8rem;
		text-align: center;
		padding: 5px 0;
	}

	.settings {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 10px 0;
	}

	.header {
		font-size: 16px;
		margin: 5px 0;
		text-align: center;
	}

	.setting-table {
		border-collapse: collapse;
		border-spacing: 0;
	}

	.setting-name {
		height: 34px;

		p {
			margin: 0;
			cursor: default;
		}
	}

	.buttons {
		display: flex;
		flex-direction: row;
		height: 34px;

		button,
		a {
			border: 1px solid #281515;
			background-color: transparent;
			color: white;
			cursor: pointer;
			padding: 5px 8px;
			margin: 0;
			text-decoration: none;

			&.active {
				background-color: rgba(255, 65, 65, 0.74);
				cursor: default;
			}

			&.disabled {
				background-color: gray;
				cursor: not-allowed;
			}
		}

		&.super-buttons {
			display: flex;
			justify-content: center;
			gap: 4px;
			width: 100%;
			margin-bottom: 10px;
		}
	}

	.reliability-low {
		text-decoration: underline;
		text-decoration-color: red;
	}
	.reliability-normal {
		text-decoration: underline;
		text-decoration-color: yellow;
	}
	.reliability-high {
		text-decoration: underline;
		text-decoration-color: #00ff00;
	}
</style>
