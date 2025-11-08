import { HostMatchType, type Host } from '@/lib/host';
import { unpack } from '@/utils/content';

export default {
	name: 'Supervideo',
	id: 'supervideo',
	domains: ['supervideo.cc', 'supervideo.tv'],
	regex: [/eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms],

	match: async function (match: RegExpMatchArray) {
		const unpacked = await unpack(match[0]);
		return {
			type: HostMatchType.HLS,
			url: unpacked.match(/(?<=file:").*(?=")/)![0]
		};
	}
} satisfies Host;
