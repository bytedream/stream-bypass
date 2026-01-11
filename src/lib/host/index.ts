import Doodstream from './doodstream';
import Dropload from './dropload';
import Filemoon from './filemoon';
import Goodstream from './goodstream';
import Kwik from './kwik';
import Loadx from './loadx';
import Luluvdo from './luluvdo';
import Mixdrop from './mixdrop';
import Mp4Upload from './mp4upload';
import Newgrounds from './newgrounds';
import StreamA2z from './streama2z';
import Streamtape from './streamtape';
import Streamzz from './streamzz';
import SuperVideo from './supervideo';
import Upstream from './upstream';
import Vidmoly from './vidmoly';
import Vidoza from './vidoza';
import Voe from './voe';
import Vupload from './vupload';
import { HostSettings } from '@/lib/settings';

export enum HostMatchType {
	NATIVE = 'native',
	HLS = 'hls'
}

export interface HostMatch {
	type: HostMatchType;
	/** If null, it's interpreted that a url should be present but isn't, probably because the website broke */
	url: string | null;
}

export interface Host {
	name: string;
	id: string;
	domains: string[];
	replace?: boolean;
	regex: RegExp[];
	notice?: string;

	match(match: RegExpMatchArray): Promise<HostMatch | null>;
}

export const hosts = [
	Doodstream,
	Dropload,
	Filemoon,
	Goodstream,
	Kwik,
	Loadx,
	Luluvdo,
	Mixdrop,
	Mp4Upload,
	Newgrounds,
	StreamA2z,
	Streamtape,
	Streamzz,
	SuperVideo,
	Upstream,
	Vidmoly,
	Vidoza,
	Voe,
	Vupload
];

export async function getHost(domain: string): Promise<Host | null> {
	if (await HostSettings.getAllHostsDisabled()) return null;

	const disabledIds = await HostSettings.getDisabledHosts();
	for (const host of hosts) {
		if (host.domains.includes(domain)) {
			if (!disabledIds.includes(host.id)) return host;
			else return null;
		}
	}

	return HostSettings.checkTemporaryHostDomain(domain);
}
