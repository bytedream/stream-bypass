import './shared';

import type { Match } from '~/lib/match';
import { storageDelete, storageGet, storageSet } from '~/lib/settings';
import { getMatch } from '~/lib/match';

chrome.webRequest.onBeforeSendHeaders.addListener(
	async (details) => {
		const referer: { domain: string } | undefined = await storageGet('referer');
		if (referer === undefined) return;

		details.requestHeaders.push({
			name: 'Referer',
			value: `https://${referer.domain}/`
		});

		await storageDelete('referer');

		return { requestHeaders: details.requestHeaders };
	},
	{ urls: ['<all_urls>'], types: ['xmlhttprequest'] },
	['blocking', 'requestHeaders']
);

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
