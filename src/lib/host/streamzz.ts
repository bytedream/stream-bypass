import { HostMatchType, type Host } from '@/lib/host';

export default {
	name: 'Streamzz',
	id: 'streamzz',
	domains: ['streamzz.to', 'streamz.ws'],
	regex: [/(?<=\|)\w{2,}/gm],

	match: async function (match: RegExpMatchArray) {
		return {
			type: HostMatchType.HLS,
			url: `https://get.${location.hostname.split('.')[0]}.tw/getlink-${
				match.sort((a, b) => b.length - a.length)[0]
			}.dll`
		};
	}
} satisfies Host;
