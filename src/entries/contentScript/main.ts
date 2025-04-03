import {getMatch, type Match, MatchMediaType} from '~/lib/match';
import {Other, Redirect} from '~/lib/settings';

async function main() {
	let match: Match | null;
	let redirect = false;
	if ((match = await getMatch(window.location.host)) === null) {
		if ((match = await Redirect.get()) === null) {
			return;
		}
		redirect = true;
	}

	// some sites have a javascript based redirect, e.g. example.com redirects to example.org by changing
	// window.location.href instead of a 3XX http redirect. an empty body is a sign that such a javascript redirect
	// occurred
	if (document.body == null) {
		await Redirect.set(match);
		return;
	}

	let re = null;
	for (const regex of match.regex) {
		if ((re = document.body.innerHTML.match(regex)) !== null) {
			break;
		}
	}
	if (re === null) {
		return;
	}

	if (redirect) {
		await Redirect.delete();
	}

	let url: string | null;
	let urlType: MatchMediaType | null;
	try {
		const matchResult = await match.match(re);
		if (matchResult && typeof matchResult === 'string') {
			url = matchResult;
			urlType = url.includes('.m3u8') ? MatchMediaType.Hls : MatchMediaType.Native;
		} else if (matchResult && typeof matchResult === 'object') {
			if (MatchMediaType.Hls in matchResult) {
				url = matchResult[MatchMediaType.Hls];
				urlType = MatchMediaType.Hls;
			} else if (MatchMediaType.Native in matchResult) {
				url = matchResult[MatchMediaType.Native];
				urlType = MatchMediaType.Native;
			}
		}
	} catch {
		return;
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (!url || !urlType) {
		return;
	}

	// send the url to the ff2mpv (https://github.com/woodruffw/ff2mpv) application
	if (await Other.getFf2mpv()) {
		await chrome.runtime.sendMessage({ action: 'ff2mpv', url: url });
	}

	if (match.replace && urlType != MatchMediaType.Hls) {
		// this destroys all intervals that may spawn popups or events
		let intervalId = window.setInterval(() => {}, 0);
		while (intervalId--) {
			clearInterval(intervalId);
		}
		let timeoutId = window.setTimeout(() => {}, 0);
		while (timeoutId--) {
			clearTimeout(timeoutId);
		}

		// clear completed document
		document.documentElement.innerHTML = '';

		document.body.style.backgroundColor = '#131313';

		// video player
		const player = document.createElement('video');
		player.style.width = '100%';
		player.style.height = '100%';
		player.controls = true;
		player.src = url;

		// add video player to document body
		document.body.style.margin = '0';
		document.body.append(player);
	} else {
		window.location.assign(
			chrome.runtime.getURL(
				`src/entries/player/player.html?id=${match.id}&url=${encodeURIComponent(url)}&domain=${
					window.location.hostname
				}&type=${urlType}`
			)
		);
	}
}

main();
