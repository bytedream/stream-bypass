import { HostMatchType, type Host } from '@/lib/host';

export default {
	name: 'Vidmoly',
	id: 'vidmoly',
	domains: ['vidmoly.me', 'vidmoly.to'],
	regex: [/(?<=file:").+\.m3u8/gm],
	replace: true,

	match: async function (match: RegExpMatchArray) {
		return {
			type: HostMatchType.HLS,
			url: match[0]
		};
	}
} satisfies Host;
