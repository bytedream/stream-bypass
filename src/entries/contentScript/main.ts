import type { Match } from '~/lib/match';
import { getMatch } from '~/lib/match';
import { Other, Redirect } from '~/lib/settings';

async function main() {
	let match: Match;
	let redirect = false;
	if ((match = await getMatch(window.location.host)) === null) {
		if ((match = await Redirect.get()) === null) {
			return;
		}
		redirect = true;
	}

	const re = document.body.innerHTML.match(match.regex);
	if (re === null) {
		return;
	}
	if (redirect) {
		await Redirect.delete();
	}

	const url = await match.match(re);

	// send the url to the ff2mpv (https://github.com/woodruffw/ff2mpv) application
	if (await Other.getFf2mpv()) {
		await chrome.runtime.sendMessage({ action: 'ff2mpv', url: url });
	}

	if (match.replace && !url.includes('.m3u8')) {
		const player = document.createElement('video');
		player.style.width = '100%';
		player.style.height = '100%';
		player.controls = true;
		player.src = url;

		document.body.innerHTML = '';
		document.body.append(player);
	} else {
		window.location.assign(
			chrome.runtime.getURL(
				`src/entries/player/player.html?id=${match.id}&url=${encodeURIComponent(url)}&domain=${
					window.location.hostname
				}`
			)
		);
	}
}

main();
