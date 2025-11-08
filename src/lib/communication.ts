export enum MessageType {
	RequestActiveMatch,
	NotifyActiveMatch
}

export type MessageData<T extends MessageType> = {
	[MessageType.RequestActiveMatch]: undefined;
	[MessageType.NotifyActiveMatch]: {
		id: string;
		url: string;
		domain: string;
	};
}[T];

export async function sendMessage<T extends MessageType>(message: T, data: MessageData<T>) {
	await browser.runtime.sendMessage({ type: message, data: data });
}

export async function sendMessageToActiveTab<T extends MessageType>(message: T, data: MessageData<T>) {
	const tabs = await browser.tabs.query({ active: true, currentWindow: true });

	await browser.tabs.sendMessage(tabs[0].id!, { type: message, data: data }).catch(() => {});
}

export function listenMessages(listener: (type: MessageType, data: any) => void): () => void {
	const callback = (callbackData: { type: MessageType; data: any }) => {
		const { type, data } = callbackData;
		listener(type, data);
	};

	browser.runtime.onMessage.addListener(callback);

	return () => {
		browser.runtime.onMessage.removeListener(callback);
	};
}
