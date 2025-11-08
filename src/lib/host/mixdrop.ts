import { HostMatchType, type Host } from '@/lib/host';
import { unpack } from '@/utils/content';

export default {
	name: 'Mixdrop',
	id: 'mixdrop',
	domains: ['mixdrop.bz', 'mixdrop.ch', 'mixdrop.co', 'mixdrop.gl', 'mixdrop.my', 'mixdrop.to'],
	regex: [/eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms],

	match: async function (match: RegExpMatchArray) {
		const unpacked = await unpack(match[0]);
		const url = unpacked.match(/(?<=MDCore.wurl=").*(?=")/)![0];
		return {
			type: HostMatchType.NATIVE,
			url: `https:${url}`
		};
	}
} satisfies Host;
