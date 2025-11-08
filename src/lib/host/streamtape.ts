import { HostMatchType, type Host } from '@/lib/host';

export default {
	name: 'Streamtape',
	id: 'streamtape',
	domains: ['streamtape.com', 'streamtape.net', 'shavetape.cash'],
	regex: [/id=.*(?=')/gm],

	match: async function (match: RegExpMatchArray) {
		let i = 0;
		while (i < match.length) {
			if (match[++i - 1] == match[i]) {
				return {
					type: HostMatchType.HLS,
					url: `https://streamtape.com/get_video?${match[i]}`
				};
			}
		}

		return {
			type: HostMatchType.HLS,
			// use the old method as fallback
			url: `https://streamtape.com/get_video?${match.reverse()[0]}`
		};
	}
} satisfies Host;
