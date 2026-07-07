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
import { HostSettings, PerDomainSettings } from '@/lib/settings';

export enum HostMatchType {
	NATIVE = 'native',
	HLS = 'hls'
}

export interface HostMatch {
	type: HostMatchType;
	/** If null, it's interpreted that a url should be present but isn't, probably because the website broke */
	url: string | null;
}

export type HostId = string;

export interface Host {
	name: string;
	id: HostId;
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

export function getHostFromId(id: HostId): Host | null {
	return hosts.find((host) => host.id === id) ?? null;
}

export function filterHosts(list: Host[], query: string): Host[] {
	const q = query.trim().toLowerCase();
	if (!q) return list;
	return list.filter((host) => {
		if (host.name.toLowerCase().includes(q)) return true;
		return host.domains.some((domain) => domain.toLowerCase().includes(q));
	});
}

export async function getHost(domain: string): Promise<Host | null> {
	const [allHostsDisabled, disabledHosts, perDomainSetting] = await Promise.all([
		HostSettings.getAllHostsDisabled(),
		HostSettings.getDisabledHosts(),
		PerDomainSettings.get(domain)
	]);

	// extension is disabled via popup
	if (allHostsDisabled) return null;
	// domain is disabled via popup
	else if (perDomainSetting.allDisabled) return null;

	for (const host of hosts) {
		if (host.domains.includes(domain)) {
			// host is generally disabled via popup
			if (disabledHosts.includes(host.id)) return null;
			// host is disabled for this domain via popup
			else if (perDomainSetting.disabledHostIds.includes(host.id)) return null;

			return host;
		}
	}

	return HostSettings.checkTemporaryHostDomain(domain).then(getHostFromId);
}
