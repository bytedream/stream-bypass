<script lang="ts">
	import { type Match, matches } from '~/lib/match';
	import { Hosters, Other } from '~/lib/settings';
	import Toggle from './toggle.svelte';

	let hostersEnabled: boolean;
	let hosters: (Match & { active: boolean; disabled: boolean })[] = [];
	(async () => {
		hostersEnabled = !(await Hosters.getAllDisabled());

		const disabled = await Hosters.getDisabled();
		hosters = Object.values(matches).map((m: any) => {
			m['active'] = disabled.findIndex((p) => p.id == m.id) == -1;
			return m;
		}) as typeof hosters;
	})();

	let isMobile: boolean;
	(async () => {
		isMobile = (await browser.runtime.getPlatformInfo()).os === 'android';
	})();

	let ff2mpvEnabled: boolean;
	(async () => {
		ff2mpvEnabled = (await Other.getFf2mpv()) as boolean;
	})();
</script>

<main
	style={isMobile
		? 'height: 100vh; display: flex; flex-direction: column; align-items: center'
		: 'height: 500px'}
>
	<fieldset>
		<legend>Hoster</legend>
		<div class="setting-container" style={isMobile ? 'grid-column-gap: 5rem' : ''}>
			<label for="hosters-enabled">Enabled</label>
			<div>
				<Toggle
					bind:checked={hostersEnabled}
					id="hosters-enabled"
					onChange={() => Hosters.setAll(hostersEnabled)}
				/>
			</div>
			<hr />
			{#each hosters as hoster, i}
				<label for="hoster-{i}" style="cursor: {hostersEnabled ? 'pointer' : 'default'}"
					>{hoster.name}</label
				>
				<div>
					<Toggle
						bind:checked={hoster.active}
						disabled={!hostersEnabled}
						id="hoster-{i}"
						onChange={async () => {
							if (hoster.active) {
								await Hosters.enable(hoster);
							} else {
								await Hosters.disable(hoster);
							}
						}}
					></Toggle>
				</div>
			{/each}
		</div>
	</fieldset>
	{#if !isMobile}
		<fieldset>
			<legend>Other</legend>
			<div class="setting-container">
				<label for="ff2mpv">ff2mpv</label>
				<div>
					<Toggle
						bind:checked={ff2mpvEnabled}
						id="ff2mpv"
						onChange={async () => {
							ff2mpvEnabled = !ff2mpvEnabled;
							if (await browser.permissions.request({ permissions: ['nativeMessaging'] })) {
								await Other.setFf2mpv(ff2mpvEnabled);
								ff2mpvEnabled = !ff2mpvEnabled;
							}
						}}
					></Toggle>
					<a
						class="info-questionmark"
						href="https://github.com/ByteDream/stream-bypass/tree/master#ff2mpv-use-mpv-to-directly-play-streams"
						>?</a
					>
				</div>
			</div>
		</fieldset>
	{/if}
	<a id="report-notice" href="https://github.com/ByteDream/stream-bypass/issues"
		>Report issues or requests</a
	>
</main>

<!-- eslint-disable -->
<style lang="scss" global>
	body {
		background-color: #2b2a33;
		color: white;
		font-weight: bold;
		margin: 0;
		padding: 0 8px;
	}

	fieldset {
		border-radius: 5px;
		border-color: gray;
	}

	#report-notice {
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

	.setting-container {
		display: grid;
		grid-template-columns: auto auto;
		grid-column-gap: 5px;
		grid-row-gap: 4px;
		align-items: end;
		width: 100%;

		& > label {
			height: 34px;
			margin: 0;
			user-select: none;
			cursor: pointer;
			display: flex;
			align-items: center;
		}

		& > hr {
			grid-column: 1 / span 2;
			width: 100%;
		}
	}

	.info-questionmark {
		display: inline-block;
		transform: translateX(-40%) translateY(-100%);
		color: black;
		text-decoration: none;
	}
</style>
