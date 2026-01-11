import { HostMatchType, type Host } from '@/lib/host';

export default {
	name: 'Doodstream',
	id: 'doodstream',
	domains: [
		'do7go.com',
		'doodstream.com',
		'dood.pm',
		'dood.ws',
		'dood.wf',
		'dood.cx',
		'dood.sh',
		'dood.watch',
		'dood.work',
		'dood.to',
		'dood.so',
		'dood.la',
		'dood.li',
		'dood.re',
		'dood.yt',
		'doods.pro',
		'ds2play.com',
		'dooood.com',
		'd000d.com'
	],
	replace: true,
	regex: [/(\/pass_md5\/.*?)'.*(\?token=.*?expiry=)/s],

	match: async function (match: RegExpMatchArray) {
		const response = await fetch(`https://${window.location.host}${match[1]}`, {
			headers: {
				Range: 'bytes=0-'
			},
			referrer: `https://${window.location.host}/e/${window.location.pathname.split('/').slice(-1)[0]}`
		});
		return {
			type: HostMatchType.NATIVE,
			url: `${await response.text()}1234567890${match[2]}${Date.now()}`
		};
	}
} satisfies Host;
