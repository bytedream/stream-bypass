import { storage } from '#imports';
import { BackgroundMessageType, sendBackgroundMessage } from './communication';
import type { HostId } from '@/lib/host';

class Setting<T> {
	private item;

	constructor(key: Parameters<typeof storage.defineItem>[0], fallback: T) {
		this.item = storage.defineItem(key, { fallback });
	}

	get = () => this.item.getValue();
	set = (value: T) => this.item.setValue(value);

	update = (fn: (val: T) => T) => this.get().then(fn).then(this.set);
}

export class HostSettings {
	/* disabled hosts */
	private static disabledHosts = new Setting<HostId[]>('local:disabledHosts', []);
	private static allHostsDisabled = new Setting<boolean>('local:allHostsDisabled', false);

	static addDisabledHost = (hostId: HostId) =>
		this.disabledHosts.update((val) => {
			if (!val.includes(hostId)) val.push(hostId);
			return val;
		});
	static removeDisabledHost = (hostId: HostId) =>
		this.disabledHosts.update((val) => {
			const index = val.indexOf(hostId);
			if (index !== -1) val.splice(index, 1);
			return val;
		});

	static getDisabledHosts = () => this.disabledHosts.get();
	static getAllHostsDisabled = () => this.allHostsDisabled.get();
	static setAllHostsDisabled = (disabled: boolean) => this.allHostsDisabled.set(disabled);

	/* tmp */
	private static temporaryHostDomain = new Setting<Record<string, string>>('local:temporaryHostDomain', {});

	static addTemporaryHostDomain = async (hostId: HostId, domain: string) => {
		// only has an effect with mv2
		const backgroundScriptInject =
			import.meta.env.MANIFEST_VERSION === 2
				? sendBackgroundMessage(BackgroundMessageType.RegisterContentScript, { domain: domain })
				: Promise.resolve();
		const temporaryHostDomainUpdate = this.temporaryHostDomain.update((val) => {
			val[domain] = hostId;
			return val;
		});

		return Promise.all([backgroundScriptInject, temporaryHostDomainUpdate]);
	};
	static checkTemporaryHostDomain = (domain: string) => this.temporaryHostDomain.get().then((val) => val[domain]);
}

export class FF2MPVSettings {
	private static ff2mpvEnabled = new Setting<boolean>('local:ff2mpv', false);

	static getEnabled = () => this.ff2mpvEnabled.get();
	static setEnabled = (enabled: boolean) => this.ff2mpvEnabled.set(enabled);
}

export class UrlReferer {
	private static temporaryUrlReferer = new Setting<Record<string, string>>('local:temporaryUrlReferer', {});

	static addTemporary = (hostname: string, referer: string) =>
		this.temporaryUrlReferer.update((val) => {
			val[hostname] = referer;
			return val;
		});

	static get = (hostname: string) => this.temporaryUrlReferer.get().then((val) => val[hostname] ?? null);
}

export interface PerDomainConfig {
	allDisabled: boolean;
	disabledHostIds: HostId[];
}

export class PerDomainSettings {
	private static storage = new Setting<Record<string, PerDomainConfig>>('local:perDomainSettings', {});

	private static ensureDomain = (val: Record<string, PerDomainConfig>, domain: string) => {
		if (!val[domain]) val[domain] = { allDisabled: false, disabledHostIds: [] };
		return val[domain];
	};

	static get = (domain: string): Promise<PerDomainConfig> =>
		this.storage.get().then((val) => val[domain] ?? { allDisabled: false, disabledHostIds: [] });

	static getMap = () => this.storage.get();

	static setAllDisabled = (domain: string, disabled: boolean) =>
		this.storage.update((val) => {
			this.ensureDomain(val, domain).allDisabled = disabled;
			return val;
		});

	static setHostDisabled = (domain: string, hostId: HostId, disabled: boolean) =>
		this.storage.update((val) => {
			const entry = this.ensureDomain(val, domain);
			if (!disabled) entry.disabledHostIds = entry.disabledHostIds.filter((id) => id !== hostId);
			else if (!entry.disabledHostIds.includes(hostId)) entry.disabledHostIds.push(hostId);
			return val;
		});

	static add = (domain: string) =>
		this.storage.update((val) => {
			this.ensureDomain(val, domain);
			return val;
		});

	static clear = (domain: string) =>
		this.storage.update((val) => {
			delete val[domain];
			return val;
		});

	static cleanEmpty = () =>
		this.storage.update((val) => {
			for (const [domain, settings] of Object.entries(val)) {
				if (!settings.allDisabled && settings.disabledHostIds.length === 0) delete val[domain];
			}
			return val;
		});
}
