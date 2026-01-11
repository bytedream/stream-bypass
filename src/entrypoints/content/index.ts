import { getHost, HostMatchType, hosts, type HostMatch } from '@/lib/host';
import { FF2MPVSettings } from '@/lib/settings';

export default defineContentScript({
	matches: [
		...Object.values(hosts).flatMap((h) => h.domains.map((d) => `*://${d}/*`)),
		// only mv2 allows to match all urls
		...(import.meta.env.MANIFEST_VERSION === 2 ? ['<all_urls>'] : [])
	],
	allFrames: true,
	runAt: 'document_end',
	main
});

async function main() {
	const host = await getHost(window.location.host);
	if (!host) return;

	let re = null;
	for (const regex of host.regex) {
		if ((re = document.body.innerHTML.match(regex)) !== null) {
			break;
		}
	}
	if (!re) {
		return;
	}

	let hostMatch: HostMatch | null;
	try {
		hostMatch = await host.match(re);
	} catch {
		hostMatch = null;
	}

	if (!hostMatch || !hostMatch.url) return;

	// send the url to the ff2mpv (https://github.com/woodruffw/ff2mpv) application
	if (await FF2MPVSettings.getEnabled()) {
		await browser.runtime.sendMessage({ action: 'ff2mpv', url: hostMatch.url });
	}

	if (host.replace && hostMatch.type != HostMatchType.HLS) {
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
		player.src = hostMatch.url;

		// add video player to document body
		document.body.style.margin = '0';
		document.body.append(player);
	} else {
		window.location.assign(
			browser.runtime.getURL(
				`/player.html?id=${host.id}&url=${encodeURIComponent(hostMatch.url)}&domain=${window.location.hostname}&type=${hostMatch.type}`
			)
		);
	}
}
