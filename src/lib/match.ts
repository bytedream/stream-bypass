import { Hosters, Redirect, TmpHost } from './settings';
import { lastPathSegment } from './util/extract';
import { unpack } from './util/userspace';

export interface Match {
	name: string;
	id: string;
	domains: string[];
	replace?: boolean;
	regex: RegExp[];
	notice?: string;

	match(
		match: RegExpMatchArray
	): Promise<
		string | { [MatchMediaType.Hls]: string } | { [MatchMediaType.Native]: string } | null
	>;
}

export enum MatchMediaType {
	Hls = 'hls',
	Native = 'native'
}

export const Doodstream: Match = {
	name: 'Doodstream',
	id: 'doodstream',
	domains: [
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

	match: async (match: RegExpMatchArray) => {
		const response = await fetch(`https://${window.location.host}${match[1]}`, {
			headers: {
				Range: 'bytes=0-'
			},
			referrer: `https://${window.location.host}/e/${
				window.location.pathname.split('/').slice(-1)[0]
			}`
		});
		return `${await response.text()}1234567890${match[2]}${Date.now()}`;
	}
};

export const DropLoad: Match = {
	name: 'Dropload',
	id: 'dropload',
	domains: ['dropload.ui'],
	regex: [/eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms],

	match: async (match: RegExpMatchArray) => {
		const unpacked = await unpack(match[0]);
		return unpacked.match(/(?<=file:").*(?=")/)![0];
	}
};

export const Filemoon: Match = {
	name: 'Filemoon',
	id: 'filemoon',
	domains: ['filemoon.sx', 'filemoon.to', 'filemoon.in'],
	regex: [/(?<=<iframe\s*src=")\S*(?=")/s, /eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms],
	replace: true,

	match: async (match: RegExpMatchArray) => {
		if (window.location.host.startsWith('filemoon')) {
			await TmpHost.set(new URL(match[0]).host, Filemoon);
			return null;
		}

		await TmpHost.delete();

		const unpacked = await unpack(match[0]);
		return unpacked.match(/(?<=file:")\S*(?=")/)![0];
	}
};

export const GoodStream: Match = {
	name: 'Goodstream',
	id: 'goodstream',
	domains: ['goodstream.uno'],
	regex: [/(?<=file:\s+").*(?=")/g],

	match: async (match: RegExpMatchArray) => {
		return match[0];
	}
};

export const Kwik: Match = {
	name: 'Kwik',
	id: 'kwik',
	domains: ['kwik.cx'],
	regex: [/eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms],

	match: async (match: RegExpMatchArray) => {
		const unpacked = await unpack(match[0]);
		return unpacked.match(/(?<=source=').*(?=')/)![0];
	}
};

export const LoadX: Match = {
	name: 'LoadX',
	id: 'loadx',
	domains: ['loadx.ws'],
	regex: [/./gm],

	match: async () => {
		const hash = encodeURIComponent(lastPathSegment(window.location.href));
		const response = await fetch(
			`https://${window.location.host}/player/index.php?data=${hash}&do=getVideo`,
			{
				method: 'POST',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}
		);

		const responseJson = await response.json();
		const videoSource: string = responseJson['videoSource'];

		// extension of extracted url is '.txt', so we have to manually specify that it's a hls
		return { [MatchMediaType.Hls]: videoSource.replace('\\/', '/') };
	}
};

export const Luluvdo: Match = {
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

		let unpacked;

		const responseText = await response.text();
		const evalMatch = responseText.match(/eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms)!;
		// sometimes is packed, sometimes it's not. looks like someone forgets to obfuscate the code when pushing to
		// production
		if (evalMatch) {
			unpacked = await unpack(evalMatch[0]);
			return unpacked.match(/(?<=file:").*(?=")/)![0];
		} else {
			unpacked = responseText;
		}

		return unpacked.match(/(?<=file:").*(?=")/)![0];
	}
};

export const Mixdrop: Match = {
	name: 'Mixdrop',
	id: 'mixdrop',
	domains: ['mixdrop.co', 'mixdrop.to', 'mixdrop.ch', 'mixdrop.bz', 'mixdrop.gl'],
	regex: [/eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms],

	match: async (match: RegExpMatchArray) => {
		const unpacked = await unpack(match[0]);
		const url = unpacked.match(/(?<=MDCore.wurl=").*(?=")/)![0];
		return `https:${url}`;
	}
};

export const Mp4Upload: Match = {
	name: 'Mp4Upload',
	id: 'mp4upload',
	domains: ['mp4upload.com'],
	replace: true,
	regex: [/eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms],

	match: async (match: RegExpMatchArray) => {
		const unpacked = await unpack(match[0]);
		return unpacked.match(/(?<=player.src\(").*(?=")/)![0];
	}
};

export const Newgrounds: Match = {
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
		return decodeURI(json['sources'][Object.keys(json['sources'])[0]][0]['src']);
	}
};

export const StreamA2z: Match = {
	name: 'Stream2Az',
	id: 'stream2az',
	domains: ['streama2z.com', 'streama2z.xyz'],
	regex: [/https?:\/\/\S*m3u8.+(?=['"])/gm],

	match: async (match: RegExpMatchArray) => {
		if (StreamA2z.domains.indexOf(window.location.hostname) !== -1) {
			await Redirect.set(StreamA2z);
			return null;
		}
		return match[0];
	}
};

export const Streamtape: Match = {
	name: 'Streamtape',
	id: 'streamtape',
	domains: ['streamtape.com', 'streamtape.net', 'shavetape.cash'],
	regex: [/id=.*(?=')/gm],

	match: async (match: RegExpMatchArray) => {
		let i = 0;
		while (i < match.length) {
			if (match[++i - 1] == match[i]) {
				return `https://streamtape.com/get_video?${match[i]}`;
			}
		}

		// use the old method as fallback
		return `https://streamtape.com/get_video?${match.reverse()[0]}`;
	}
};

export const Streamzz: Match = {
	name: 'Streamzz',
	id: 'streamzz',
	domains: ['streamzz.to', 'streamz.ws'],
	regex: [/(?<=\|)\w{2,}/gm],

	match: async (match: RegExpMatchArray) => {
		return `https://get.${location.hostname.split('.')[0]}.tw/getlink-${
			match.sort((a, b) => b.length - a.length)[0]
		}.dll`;
	}
};

export const SuperVideo: Match = {
	name: 'Supervideo',
	id: 'supervideo',
	domains: ['supervideo.tv'],
	regex: [/eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms],

	match: async (match: RegExpMatchArray) => {
		const unpacked = await unpack(match[0]);
		return unpacked.match(/(?<=file:").*(?=")/)![0];
	}
};

export const Upstream: Match = {
	name: 'Upstream',
	id: 'upstream',
	domains: ['upstream.to'],
	regex: [/eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms],

	match: async (match: RegExpMatchArray) => {
		const unpacked = await unpack(match[0]);
		return unpacked.match(/(?<=file:").*(?=")/)![0];
	}
};

export const Vidmoly: Match = {
	name: 'Vidmoly',
	id: 'vidmoly',
	domains: ['vidmoly.me', 'vidmoly.to'],
	regex: [/(?<=file:").+\.m3u8/gm],
	replace: true,

	match: async (match: RegExpMatchArray) => {
		return match[0];
	}
};

export const Vidoza: Match = {
	name: 'Vidoza',
	id: 'vidoza',
	domains: ['vidoza.net', 'videzz.net'],
	regex: [/(?<=src:\s?").+?(?=")/gm],
	replace: true,

	match: async (match: RegExpMatchArray) => {
		return match[0];
	}
};

export const Voe: Match = {
	name: 'Voe',
	id: 'voe',
	domains: ['voe.sx'],
	regex: [
		// voe.sx
		/(?<=window\.location\.href\s=\s')\S*(?=')/gm,
		// whatever site voe.sx redirects to
		/(?<='hls':\s*')\S*(?=')/gm
	],

	match: async (match: RegExpMatchArray) => {
		if (window.location.host === 'voe.sx') {
			const redirectUrl = new URL(match[0]);
			await TmpHost.set(redirectUrl.host, Voe);
			return null;
		} else {
			return atob(match[0]);
		}
	}
};

export const Vupload: Match = {
	name: 'Vupload',
	id: 'vupload',
	domains: ['vupload.com'],
	regex: [/(?<=src:\s?").+?(?=")/gm],

	match: async (match: RegExpMatchArray) => {
		return match[0];
	}
};

export const matches = {
	[Doodstream.id]: Doodstream,
	[DropLoad.id]: DropLoad,
	[Filemoon.id]: Filemoon,
	[GoodStream.id]: GoodStream,
	[Kwik.id]: Kwik,
	[LoadX.id]: LoadX,
	[Luluvdo.id]: Luluvdo,
	[Mixdrop.id]: Mixdrop,
	[Mp4Upload.id]: Mp4Upload,
	[Newgrounds.id]: Newgrounds,
	[StreamA2z.id]: StreamA2z,
	[Streamtape.id]: Streamtape,
	[Streamzz.id]: Streamzz,
	[SuperVideo.id]: SuperVideo,
	[Upstream.id]: Upstream,
	[Vidmoly.id]: Vidmoly,
	[Vidoza.id]: Vidoza,
	[Voe.id]: Voe,
	[Vupload.id]: Vupload
};

export async function getMatch(domain: string): Promise<Match | null> {
	if (await Hosters.getAllDisabled()) {
		return null;
	}

	for (const match of Object.values(matches)) {
		if (
			match.domains.indexOf(domain) !== -1 &&
			!(await Hosters.getDisabled().then((d) => d.find((p) => p.id == match.id)))
		) {
			return match;
		}
	}

	const tmpHost = await TmpHost.get();
	if (tmpHost && tmpHost[0] === domain) {
		return tmpHost[1];
	}

	return null;
}
