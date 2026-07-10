// --- tab communication --- //
export enum TabMessageType {
	RequestActiveMatch = 10,
	NotifyActiveMatch
}

export type TabMessageData<T extends TabMessageType> = {
	[TabMessageType.RequestActiveMatch]: undefined;
	[TabMessageType.NotifyActiveMatch]: {
		id: string;
		url: string;
		domain: string;
	};
}[T];

export async function sendTabBroadcast<T extends TabMessageType>(message: T, data: TabMessageData<T>) {
	await browser.runtime.sendMessage({ type: message, data: data });
}

export async function sendTabMessageToActiveTab<T extends TabMessageType>(message: T, data: TabMessageData<T>) {
	const tabs = await browser.tabs.query({ active: true, currentWindow: true });

	await browser.tabs.sendMessage(tabs[0].id!, { type: message, data: data }).catch(() => {});
}

export function listenTabMessages(listener: (type: TabMessageType, data: any) => void): () => void {
	const callback = (callbackData: { type: TabMessageType; data: any }) => {
		const { type, data } = callbackData;
		listener(type, data);
	};

	browser.runtime.onMessage.addListener(callback);
	return () => browser.runtime.onMessage.removeListener(callback);
}

// --- background script communication --- //
export enum BackgroundMessageType {
	Ff2mpv = 20,
	RequestTabUrl,
	RegisterContentScript,
	RegisterTemporaryReferer
}

export type BackgroundMessageData<T extends BackgroundMessageType> = {
	[BackgroundMessageType.Ff2mpv]: {
		url: string;
	};
	[BackgroundMessageType.RequestTabUrl]: undefined;
	[BackgroundMessageType.RegisterContentScript]: {
		domain: string;
	};
	[BackgroundMessageType.RegisterTemporaryReferer]: {
		domain: string;
		referer: string;
	};
}[T];

export type BackgroundMessageReply<T extends BackgroundMessageType> = {
	[BackgroundMessageType.Ff2mpv]: undefined;
	[BackgroundMessageType.RequestTabUrl]: string | null;
	[BackgroundMessageType.RegisterContentScript]: undefined;
	[BackgroundMessageType.RegisterTemporaryReferer]: undefined;
}[T];

export async function sendBackgroundMessage<T extends BackgroundMessageType>(
	message: T,
	data: BackgroundMessageData<T>
): Promise<BackgroundMessageReply<T>> {
	const response = await browser.runtime.sendMessage({ type: message, data: data });
	return response;
}
