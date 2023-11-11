import browser from 'webextension-polyfill';
import type { Match } from '~/lib/match';
import { matches } from '~/lib/match';

export const Hosters = {
	getDisabled: async () => {
		const disabled = await storageGet<string[]>('hosters.disabled', []);
		return disabled.map((id) => matches[id]).filter((m) => m !== undefined);
	},
	disable: async (match: Match) => {
		const disabled = await storageGet('hosters.disabled', []);
		const index = disabled.indexOf(match.id);
		if (index === -1) {
			disabled.push(match.id);
			await storageSet('hosters.disabled', disabled);
		}
	},
	enable: async (match: Match) => {
		let disabled = await storageGet('hosters.disabled', []);
		const index = disabled.indexOf(match.id);
		if (index !== -1) {
			disabled.splice(index, 1);
			await storageSet('hosters.disabled', disabled);
		}
	},
	getAllDisabled: async () => {
		return await storageGet<boolean>('hosters.allDisabled', false);
	},
	disableAll: async () => {
		await storageSet('hosters.allDisabled', true);
	},
	enableAll: async () => {
		await storageSet('hosters.allDisabled', false);
	}
};

export const Redirect = {
	get: async (): Promise<Match | null> => {
		return matches[await storageGet<string>('redirect')] || null;
	},
	set: async (match: Match) => {
		await storageSet('redirect', match.id);
	},
	delete: async () => {
		await storageDelete('redirect');
	}
};

export const Other = {
	getFf2mpv: async () => {
		return await storageGet('other.ff2mpv', true);
	},
	setFf2mpv: async (enable: boolean) => {
		await storageSet('other.ff2mpv', enable);
	}
};

export async function storageGet<T>(key: string, defaultValue?: T): Promise<T | undefined> {
	const entry = await browser.storage.local.get(key);
	const value = entry[key];
	return value === undefined ? defaultValue : value;
}

export async function storageSet<T>(key: string, value: T) {
	const obj = {
		[key]: value
	};
	await browser.storage.local.set(obj);
}

export async function storageDelete(key: string) {
	await browser.storage.local.remove(key);
}
