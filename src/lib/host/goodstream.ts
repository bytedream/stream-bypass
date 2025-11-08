import { HostMatchType, type Host } from '@/lib/host';

export default {
	name: 'Goodstream',
	id: 'goodstream',
	domains: ['goodstream.uno'],
	regex: [/(?<=file:\s+").*(?=")/g],

	match: async function (match: RegExpMatchArray) {
		return {
			type: HostMatchType.HLS,
			url: match[0]
		};
	}
} satisfies Host;
