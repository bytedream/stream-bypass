chrome.runtime.onMessage.addListener(async (message) => {
	if (message.action == 'ff2mpv') {
		await chrome.runtime.sendNativeMessage('ff2mpv', { url: message.url });
	}
});
