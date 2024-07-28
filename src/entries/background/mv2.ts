import './shared';

import type { Match } from '~/lib/match';
import { Redirect, storageDelete, storageGet, storageSet } from '~/lib/settings';
import { getMatch } from '~/lib/match';

chrome.webRequest.onBeforeSendHeaders.addListener(
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	async (details) => {
		const referer: { domain: string } | undefined = await storageGet('referer');
		if (referer === undefined) return;

		details.requestHeaders!.push({
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
		if ((await Redirect.get()) == null) {
			let match: Match | null;
			if ((match = await getMatch(new URL(details.url).hostname)) !== null) {
				await Redirect.set(match);
			}
		} else {
			await Redirect.delete();
		}
	},
	{ urls: ['<all_urls>'], types: ['main_frame', 'sub_frame'] }
);
