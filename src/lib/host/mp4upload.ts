import { HostMatchType, type Host } from '@/lib/host';
import { unpack } from '@/utils/content';

export default {
	name: 'Mp4Upload',
	id: 'mp4upload',
	domains: ['mp4upload.com'],
	replace: true,
	regex: [/eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms],

	match: async function (match: RegExpMatchArray) {
		const unpacked = await unpack(match[0]);
		return {
			type: HostMatchType.NATIVE,
			url: unpacked.match(/(?<=player.src\(").*(?=")/)![0]
		};
	}
} satisfies Host;
