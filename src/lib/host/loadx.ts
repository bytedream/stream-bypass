import { HostMatchType, type Host } from '@/lib/host';
import { lastPathSegment } from '@/utils/extract';

export default {
	name: 'LoadX',
	id: 'loadx',
	domains: ['loadx.ws'],
	regex: [/./gm],

	match: async () => {
		const hash = encodeURIComponent(lastPathSegment(window.location.href));
		const response = await fetch(`https://${window.location.host}/player/index.php?data=${hash}&do=getVideo`, {
			method: 'POST',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		});

		const responseJson = await response.json();
		const videoSource: string = responseJson['videoSource'];

		return {
			type: HostMatchType.HLS,
			url: videoSource.replace('\\/', '/')
		};
	}
} satisfies Host;
