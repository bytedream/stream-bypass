import { HostMatchType, type Host } from '@/lib/host';
import { HostSettings } from '@/lib/settings';
import { unpack } from '@/utils/content';

export default {
	name: 'Filemoon',
	id: 'filemoon',
	domains: ['filemoon.sx', 'filemoon.to', 'filemoon.in'],
	regex: [/(?<=<iframe\s*src=")\S*(?=")/s, /eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms],
	replace: true,

	match: async function (match: RegExpMatchArray) {
		if (window.location.host.startsWith('filemoon')) {
			await HostSettings.addTemporaryHostDomain(this, new URL(match[0]).host);
			return null;
		}

		const unpacked = await unpack(match[0]);
		return {
			type: HostMatchType.HLS,
			url: unpacked.match(/(?<=file:")\S*(?=")/)![0]
		};
	}
} satisfies Host;
