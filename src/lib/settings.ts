import type { Match } from './match';
import { matches } from './match';

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
		const disabled = await storageGet('hosters.disabled', []);
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
	let resolve: (value: T | undefined) => void;
	const promise = new Promise<T | undefined>((r) => (resolve = r));

	chrome.storage.local.get(key, (entry) => {
		const value = entry[key];
		resolve(value === undefined ? defaultValue : value);
	});

	return promise;
}

export async function storageSet<T>(key: string, value: T) {
	let resolve: () => void;
	const promise = new Promise<void>((r) => (resolve = r));

	const obj = {
		[key]: value
	};
	chrome.storage.local.set(obj, () => resolve());

	return promise;
}

export async function storageDelete(key: string) {
	let resolve: () => void;
	const promise = new Promise<void>((r) => (resolve = r));

	chrome.storage.local.remove(key, () => resolve());

	return promise;
}
