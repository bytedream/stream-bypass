import { HostMatchType, type Host } from '@/lib/host';

export default {
	name: 'Vidmoly',
	id: 'vidmoly',
	// vidmoly has multiple domains, but regardless of the domain, the actual videos are loaded via an iframe which
	// always points to vidmoly.net. the "outer" vidmoly site also has a link to some video, which, would
	// be preferred to use, as the whole site could be replaced by the native video player instead of just the iframe,
	// but said link doesn't always point the same video as the iframe
	domains: ['vidmoly.net'],
	regex: [/(?<=file:").+\.m3u8.*(?=")/gm],

	match: async function (match: RegExpMatchArray) {
		return {
			type: HostMatchType.HLS,
			url: match[0]
		};
	}
} satisfies Host;
