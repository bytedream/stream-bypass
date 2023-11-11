import type { Match } from '~/lib/match';
import { storageDelete, storageGet, storageSet } from '~/lib/settings';
import { getMatch } from '~/lib/match';

chrome.runtime.onMessage.addListener(async (message) => {
	if (message.action == 'ff2mpv') {
		await chrome.runtime.sendNativeMessage('ff2mpv', { url: message.url });
	}
});

chrome.webRequest.onBeforeRedirect.addListener(
	async (details) => {
		// check if redirects origins from a previous redirect
		if ((await storageGet('redirect')) === undefined) {
			let match: Match;
			if ((match = await getMatch(new URL(details.url).hostname)) !== undefined) {
				await storageSet('redirect', match.id);
			}
		} else {
			await storageDelete('redirect');
		}
	},
	{ urls: ['<all_urls>'], types: ['main_frame', 'sub_frame'] }
);
