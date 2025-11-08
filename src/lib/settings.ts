import { storage } from '#imports';
import { hosts, type Host } from '@/lib/host';

export class HostSettings {
	/* disabled hosts */
	private static disabledHosts = storage.defineItem<string[]>('local:disabledHosts', { fallback: [] });
	private static allHostsDisabled = storage.defineItem<boolean>('local:allHostsDisabled', { fallback: false });

	static async addDisabledHost(host: Host) {
		const ids = await this.disabledHosts.getValue();

		const index = ids.indexOf(host.id);
		if (index === -1) {
			ids.push(host.id);
			await this.disabledHosts.setValue(ids);
		}
	}
	static async removeDisabledHost(host: Host) {
		const ids = await this.disabledHosts.getValue();

		const index = ids.indexOf(host.id);
		if (index !== -1) {
			ids.splice(index, 1);
			await this.disabledHosts.setValue(ids);
		}
	}
	static async getDisabledHosts() {
		return await this.disabledHosts.getValue();
	}

	static async getAllHostsDisabled() {
		return await this.allHostsDisabled.getValue();
	}

	static async setAllHostsDisabled(disabled: boolean) {
		await this.allHostsDisabled.setValue(disabled);
	}

	/* tmp */
	private static temporaryHostDomain = storage.defineItem<Record<string, string>>('local:temporaryHostDomain', {
		fallback: {}
	});

	static async addTemporaryHostDomain(host: Host, domain: string) {
		const temporaryHostDomains = await this.temporaryHostDomain.getValue();

		temporaryHostDomains[domain] = host.id;
		await this.temporaryHostDomain.setValue(temporaryHostDomains);
		console.log(await this.temporaryHostDomain.getValue());
	}
	static async checkTemporaryHostDomain(domain: string) {
		const temporaryHostDomains = await this.temporaryHostDomain.getValue();

		const hostId = temporaryHostDomains[domain];
		return hostId ? (hosts.find((host) => host.id === hostId) ?? null) : null;
	}
}

export class FF2MPVSettings {
	private static ff2mpvEnabled = storage.defineItem<boolean>('local:ff2mpv', { fallback: false });

	static async getEnabled() {
		return await this.ff2mpvEnabled.getValue();
	}
	static async setEnabled(enabled: boolean) {
		console.log('set', enabled);
		await this.ff2mpvEnabled.setValue(enabled);
	}
}

export class UrlReferer {
	private static temporaryUrlReferer = storage.defineItem<Record<string, string>>('local:temporaryUrlReferer', {
		fallback: {}
	});

	static async addTemporary(hostname: string, referer: string) {
		const tmpUrlReferer = await this.temporaryUrlReferer.getValue();

		tmpUrlReferer[hostname] = referer;
		await this.temporaryUrlReferer.setValue(tmpUrlReferer);
	}

	static async get(hostname: string) {
		const tmpUrlReferer = await this.temporaryUrlReferer.getValue();

		return tmpUrlReferer[hostname] ?? null;
	}
}
