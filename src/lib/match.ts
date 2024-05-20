import { unpack } from './utils';
import { Hosters } from './settings';

export interface Match {
	name: string;
	id: string;
	domains: string[];
	replace?: boolean;
	regex: RegExp;
	notice?: string;

	match(match: RegExpMatchArray): Promise<string>;
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
		'dood.to',
		'dood.so',
		'dood.la',
		'dood.re',
		'dood.yt',
		'doods.pro',
		'ds2play.com',
		'dooood.com'
	],
	replace: true,
	regex: /(\/pass_md5\/.*?)'.*(\?token=.*?expiry=)/s,

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
	regex: /eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms,

	match: async (match: RegExpMatchArray) => {
		const unpacked = await unpack(match[0]);
		return unpacked.match(/(?<=file:").*(?=")/)[0];
	}
};

export const Filemoon: Match = {
	name: 'Filemoon',
	id: 'filemoon',
	domains: ['filemoon.sx', 'filemoon.in'],
	regex: /eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms,

	match: async (match: RegExpMatchArray) => {
		const unpacked = await unpack(match[0]);
		return unpacked.match(/(?<=file:").*(?=")/)[0];
	}
};

export const GoodStream: Match = {
	name: 'Goodstream',
	id: 'goodstream',
	domains: ['goodstream.uno'],
	regex: /(?<=file:\s+").*(?=")/g,

	match: async (match: RegExpMatchArray) => {
		return match[0];
	}
};

export const Kwik: Match = {
	name: 'Kwik',
	id: 'kwik',
	domains: ['kwik.cx'],
	regex: /eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms,

	match: async (match: RegExpMatchArray) => {
		const unpacked = await unpack(match[0]);
		return unpacked.match(/(?<=source=').*(?=')/)[0];
	}
};

export const Mixdrop: Match = {
	name: 'Mixdrop',
	id: 'mixdrop',
	domains: ['mixdrop.co', 'mixdrop.to', 'mixdrop.ch', 'mixdrop.bz', 'mixdrop.gl'],
	regex: /eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms,

	match: async (match: RegExpMatchArray) => {
		const unpacked = await unpack(match[0]);
		const url = unpacked.match(/(?<=MDCore.wurl=").*(?=")/)[0];
		return `https:${url}`;
	}
};

export const Mp4Upload: Match = {
	name: 'Mp4Upload',
	id: 'mp4upload',
	domains: ['mp4upload.com'],
	replace: true,
	regex: /eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms,

	match: async (match: RegExpMatchArray) => {
		const unpacked = await unpack(match[0]);
		return unpacked.match(/(?<=player.src\(").*(?=")/)[0];
	}
};

export const Newgrounds: Match = {
	name: 'Newgrounds',
	id: 'newgrounds',
	domains: ['newgrounds.com'],
	regex: /.*/gm,

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

export const Streamtape: Match = {
	name: 'Streamtape',
	id: 'streamtape',
	domains: ['streamtape.com', 'streamtape.net', 'shavetape.cash'],
	regex: /id=.*(?=')/gm,

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
	regex: /(?<=\|)\w{2,}/gm,

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
	regex: /eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms,

	match: async (match: RegExpMatchArray) => {
		const unpacked = await unpack(match[0]);
		return unpacked.match(/(?<=file:").*(?=")/)[0];
	}
};

export const Upstream: Match = {
	name: 'Upstream',
	id: 'upstream',
	domains: ['upstream.to'],
	regex: /eval\(function\(p,a,c,k,e,d\).*?(?=<\/script>)/gms,

	match: async (match: RegExpMatchArray) => {
		const unpacked = await unpack(match[0]);
		return unpacked.match(/(?<=file:").*(?=")/)[0];
	}
};

export const Vidmoly: Match = {
	name: 'Vidmoly',
	id: 'vidmoly',
	domains: ['vidmoly.me', 'vidmoly.to'],
	regex: /(?<=file:").+\.m3u8(?=")/gm,

	match: async (match: RegExpMatchArray) => {
		return match[0];
	}
};

export const Vidoza: Match = {
	name: 'Vidoza',
	id: 'vidoza',
	domains: ['vidoza.net'],
	regex: /(?<=src:\s?").+?(?=")/gm,

	match: async (match: RegExpMatchArray) => {
		return match[0];
	}
};

export const Voe: Match = {
	name: 'Voe',
	id: 'voe',
	domains: ['voe.sx'],
	regex: /https?:\/\/\S*m3u8.+(?=['"])/gm,

	match: async (match: RegExpMatchArray) => {
		return match[0];
	}
};

export const Vupload: Match = {
	name: 'Vupload',
	id: 'vupload',
	domains: ['vupload.com'],
	regex: /(?<=src:\s?").+?(?=")/gm,

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
	[Mixdrop.id]: Mixdrop,
	[Mp4Upload.id]: Mp4Upload,
	[Newgrounds.id]: Newgrounds,
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

	return null;
}
