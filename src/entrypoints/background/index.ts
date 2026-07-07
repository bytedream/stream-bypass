import { BackgroundMessageData, BackgroundMessageType } from '@/lib/communication';
import { getHost } from '@/lib/host';
import { HostSettings, UrlReferer } from '@/lib/settings';

async function reInjectContentScript(domain: string) {
	const contentScript: Browser.scripting.RegisteredContentScript = {
		id: 'temporary-hosts',
		js: ['content-scripts/content.js'],
		matches: [`*://${domain}/*`],
		persistAcrossSessions: false,
		allFrames: true,
		runAt: 'document_end'
	};

	const contentScripts = await browser.scripting.getRegisteredContentScripts({ ids: [contentScript.id] });
	if (contentScripts.length !== 0) {
		const registeredContentScript = contentScripts[0];

		// do not double register for same domain
		if (registeredContentScript.matches!.indexOf(contentScript.matches![0]) !== -1) return;

		contentScript.matches!.push(...contentScripts[0].matches!);
		await browser.scripting.updateContentScripts([contentScript]);
	} else {
		await browser.scripting.registerContentScripts([contentScript]);
	}
}

export default defineBackground(() => {
	browser.runtime.onMessage.addListener(async (message, sender) => {
		const type = message.type as BackgroundMessageType;
		let data = message.data;

		let response;

		switch (type) {
			case BackgroundMessageType.Ff2mpv: {
				data = data as BackgroundMessageData<typeof type>;

				await browser.runtime.sendNativeMessage('ff2mpv', { url: data.url });
				break;
			}
			case BackgroundMessageType.RequestTabUrl: {
				response = sender.tab?.url ?? null;
				break;
			}
			case BackgroundMessageType.RegisterContentScript: {
				// requires "dynamic" host permissions, which is only available in mv2
				if (import.meta.env.MANIFEST_VERSION === 3) break;

				data = data as BackgroundMessageData<typeof type>;
				await reInjectContentScript(data.domain);

				break;
			}
			default:
				break;
		}

		return response;
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
			const domain = new URL(details.url).host;
			const host = await getHost(domain);
			if (!host) return;

			const newDomain = new URL(details.redirectUrl).host;

			await Promise.all([
				HostSettings.addTemporaryHostDomain(host.id, newDomain, { registerContentScript: false }),
				// must be called manually, a message sent from a background script is only received on non-background pages
				reInjectContentScript(newDomain)
			]);
		},
		{ urls: ['<all_urls>'], types: ['main_frame', 'sub_frame'] }
	);
});
