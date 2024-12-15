import type { Match } from './match';
import { matches } from './match';

export const Hosters = {
	getDisabled: async () => {
		const disabled = (await storageGet('hosters.disabled', [])) as string[];
		return disabled.map((id) => matches[id]).filter((m) => m !== undefined);
	},
	disable: async (match: Match) => {
		const disabled = (await storageGet('hosters.disabled', [])) as string[];
		const index = disabled.indexOf(match.id);
		if (index === -1) {
			disabled.push(match.id);
			await storageSet('hosters.disabled', disabled);
		}
	},
	enable: async (match: Match) => {
		const disabled = (await storageGet('hosters.disabled', [])) as string[];
		const index = disabled.indexOf(match.id);
		if (index !== -1) {
			disabled.splice(index, 1);
			await storageSet('hosters.disabled', disabled);
		}
	},
	getAllDisabled: async () => {
		return await storageGet<boolean>('hosters.allDisabled', false);
	},
	setAll: async (enable: boolean) => {
		await storageSet('hosters.allDisabled', !enable);
	}
};

export const Redirect = {
	get: async (): Promise<Match | null> => {
		return matches[(await storageGet('redirect')) as string] || null;
	},
	set: async (match: Match) => {
		await storageSet('redirect', match.id);
	},
	delete: async () => {
		await storageDelete('redirect');
	}
};

export const TmpHost = {
	get: async (): Promise<[string, Match] | null> => {
		const tmphost = await storageGet<[string, number]>('tmphost');
		if (tmphost === undefined) {
			return null;
		}
		return [tmphost[0], matches[tmphost[1]]];
	},
	set: async (domain: string, match: Match) => {
		await storageSet('tmphost', [domain, match.id]);
	},
	delete: async () => {
		await storageDelete('tmphost');
	}
};

export const Other = {
	getFf2mpv: async () => {
		return await storageGet('other.ff2mpv', false);
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
