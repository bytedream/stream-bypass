import { HostMatchType, type Host } from '@/lib/host';
import { HostSettings } from '@/lib/settings';

export default {
	name: 'Stream2Az',
	id: 'stream2az',
	domains: ['streama2z.com', 'streama2z.xyz'],
	regex: [/https?:\/\/\S*m3u8.+(?=['"])/gm],

	match: async function (match: RegExpMatchArray) {
		if (this.domains.indexOf(window.location.hostname) !== -1) {
			await HostSettings.addTemporaryHostDomain(this, window.location.hostname);
			return null;
		}
		return {
			type: HostMatchType.HLS,
			url: match[0]
		};
	}
} satisfies Host;
