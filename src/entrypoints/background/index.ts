import { BackgroundMessageData, BackgroundMessageType } from '@/lib/communication';
import { getHost, hosts } from '@/lib/host';
import { HostSettings } from '@/lib/settings';

const temporaryReferers: Record<string, string> = {};
const allHostDomains = hosts.flatMap((host) => host.domains);

function domainToMatch(domain: string) {
	return `*://${domain}/*`;
}

function domainsToMatch(domains: string[]) {
	return domains.map(domainToMatch);
}

async function reInjectContentScript(domain: string) {
	const contentScript: Browser.scripting.RegisteredContentScript = {
		id: 'temporary-hosts',
		js: ['content-scripts/content.js'],
		matches: [domainToMatch(domain)],
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

/* --- listeners --- */
async function browserRuntimeOnMessageListener(message: any, sender: Browser.runtime.MessageSender) {
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
		case BackgroundMessageType.RegisterTemporaryReferer: {
			// requires "dynamic" host permissions, which is only available in mv2
			if (import.meta.env.MANIFEST_VERSION === 3) break;

			data = data as BackgroundMessageData<typeof type>;
			if (data.domain in temporaryReferers) break;
			temporaryReferers[data.domain] = data.referer;

			// remount before send headers listener which to also listen on the new temporary referer domain
			registerBrowserWebRequestOnBeforeSendHeadersListener();

			break;
		}
		default:
			break;
	}

	return response;
}
function registerBrowserRuntimeOnMessageListener() {
	browser.runtime.onMessage.addListener(browserRuntimeOnMessageListener);
}

function browserWebRequestOnBeforeSendHeadersListener(
	details: Browser.webRequest.OnBeforeSendHeadersDetails
): Browser.webRequest.BlockingResponse | undefined {
	const referer = temporaryReferers[new URL(details.url).host];
	if (!referer) return;

	details.requestHeaders!.push({
		name: 'Referer',
		value: `https://${referer}/`
	});

	return { requestHeaders: details.requestHeaders };
}
function registerBrowserWebRequestOnBeforeSendHeadersListener() {
	// only available in mv2
	if (import.meta.env.MANIFEST_VERSION === 3) return;
	// background crashes when a listener with empty url is registered
	else if (Object.keys(temporaryReferers).length === 0) return;

	browser.webRequest.onBeforeSendHeaders.removeListener(browserWebRequestOnBeforeSendHeadersListener);
	browser.webRequest.onBeforeSendHeaders.addListener(
		browserWebRequestOnBeforeSendHeadersListener,
		{
			urls: domainsToMatch(Object.keys(temporaryReferers)),
			types: ['xmlhttprequest']
		},
		['blocking', 'requestHeaders']
	);
}

async function browserWebRequestOnBeforeRedirectListener(details: Browser.webRequest.OnBeforeRedirectDetails) {
	const domain = new URL(details.url).host;
	const host = await getHost(domain);
	if (!host) return;

	const newDomain = new URL(details.redirectUrl).host;

	await Promise.all([
		HostSettings.addTemporaryHostDomain(host.id, newDomain, { registerContentScript: false }),
		// must be called manually, a message sent from a background script is only received on non-background pages
		reInjectContentScript(newDomain)
	]);

	// add new domain to internal list of supported hosts and remount listener to also listen on the new domain
	if (allHostDomains.indexOf(newDomain) === -1) allHostDomains.push(newDomain);
	queueMicrotask(registerBrowserWebRequestOnBeforeRedirectListener);
}
function registerBrowserWebRequestOnBeforeRedirectListener() {
	// only available in mv2
	if (import.meta.env.MANIFEST_VERSION === 3) return;

	browser.webRequest.onBeforeRedirect.removeListener(browserWebRequestOnBeforeRedirectListener);
	browser.webRequest.onBeforeRedirect.addListener(browserWebRequestOnBeforeRedirectListener, {
		urls: domainsToMatch(allHostDomains),
		types: ['main_frame', 'sub_frame']
	});
}

export default defineBackground(() => {
	registerBrowserRuntimeOnMessageListener();
	registerBrowserWebRequestOnBeforeRedirectListener();
});
