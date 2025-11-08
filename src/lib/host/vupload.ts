import { HostMatchType, type Host } from '@/lib/host';

export default {
	name: 'Vupload',
	id: 'vupload',
	domains: ['vupload.com'],
	regex: [/(?<=src:\s?").+?(?=")/gm],

	match: async function (match: RegExpMatchArray) {
		return {
			type: HostMatchType.HLS,
			url: match[0]
		};
	}
} satisfies Host;
