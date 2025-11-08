import { HostMatchType, type Host } from '@/lib/host';
import { unpack } from '@/utils/content';
import { lastPathSegment } from '@/utils/extract';

export default {
	name: 'Luluvdo',
	id: 'luluvdo',
	domains: ['luluvdo.com'],
	regex: [/./gm],

	match: async () => {
		const requestBody = new FormData();
		requestBody.set('op', 'embed');
		requestBody.set('file_code', lastPathSegment(window.location.href));
		const response = await fetch(`https://${window.location.host}/dl`, {
			method: 'POST',
			body: requestBody,
			referrer: window.location.href
		});

		const responseText = await response.text();
		const evalMatch = responseText.match(/eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms)!;
		// sometimes is packed, sometimes it's not. looks like someone forgets to obfuscate the code when pushing to
		// production
		const unpacked = evalMatch ? await unpack(evalMatch[0]) : responseText;

		return {
			type: HostMatchType.HLS,
			url: unpacked.match(/(?<=file:").*(?=")/)![0]
		};
	}
} satisfies Host;
