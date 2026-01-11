import { HostMatchType, type Host } from '@/lib/host';

export default {
	name: 'Vidoza',
	id: 'vidoza',
	domains: ['vidoza.net', 'videzz.net'],
	regex: [/(?<=src:\s?").+?(?=")/gm],
	replace: true,

	match: async function (match: RegExpMatchArray) {
		return {
			type: HostMatchType.NATIVE,
			url: match[0]
		};
	}
} satisfies Host;
