import { HostMatchType, type Host } from '@/lib/host';

export default {
	name: 'Newgrounds',
	id: 'newgrounds',
	domains: ['newgrounds.com'],
	regex: [/.*/gm],

	match: async () => {
		const id = window.location.pathname.split('/').slice(-1)[0];
		const response = await fetch(`https://www.newgrounds.com/portal/video/${id}`, {
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		});
		const json = await response.json();
		return {
			type: HostMatchType.HLS,
			url: decodeURI(json['sources'][Object.keys(json['sources'])[0]][0]['src'])
		};
	}
} satisfies Host;
