import { getHost } from '@/lib/host';
import { HostSettings, UrlReferer } from '@/lib/settings';

export default defineBackground(() => {
	browser.runtime.onMessage.addListener(async (message) => {
		if (message.action == 'ff2mpv') {
			await browser.runtime.sendNativeMessage('ff2mpv', { url: message.url });
		}
	});

	// the following listener is only available in mv2
	if (import.meta.env.MANIFEST_VERSION === 3) return;

	browser.webRequest.onBeforeSendHeaders.addListener(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		async (details) => {
			const referer = await UrlReferer.get(new URL(details.url).hostname);
			if (!referer) return;

			details.requestHeaders!.push({
				name: 'Referer',
				value: `https://${referer}/`
			});

			return { requestHeaders: details.requestHeaders };
		},
		{ urls: ['<all_urls>'], types: ['xmlhttprequest'] },
		['blocking', 'requestHeaders']
	);

	browser.webRequest.onBeforeRedirect.addListener(
		async (details) => {
			const host = await getHost(new URL(details.url).hostname);
			if (!host) return;

			await HostSettings.addTemporaryHostDomain(host, new URL(details.redirectUrl).hostname);
		},
		{ urls: ['<all_urls>'], types: ['main_frame', 'sub_frame'] }
	);
});
