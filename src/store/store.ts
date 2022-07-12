import {Match, matches} from "../match/matches";

export async function storageGet(key: string): Promise<any> {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (value) => {
            resolve(value[key])
        })
    })
}

export async function storageSet(key: string, value: any) {
    const obj = {}
    obj[key] = value
    await chrome.storage.local.set(obj)
}

export async function storageDelete(key: string) {
    await chrome.storage.local.remove(key)
}

export async function getDisabled(): Promise<Match[]> {
    const localMatches = []

    for (const disabled of (await storageGet('disabled') as string[]) || []) {
        let m: Match
        if ((m = matches.find((v) => v.id === disabled)) !== undefined) {
            localMatches.push(m)
        }
    }

    return localMatches
}

export async function getAllDisabled(): Promise<boolean> {
    const value = await storageGet('all')
    return value !== undefined ? value as unknown as boolean : false
}

export async function enableAll() {
    await storageSet('all', false)
    await chrome.browserAction.setIcon({
        path: null
    })
}

export async function disableAll() {
    await storageSet('all', true)
    await chrome.browserAction.setIcon({
        path: {
            48: chrome.runtime.getURL('icons/disabled_48.png'),
            128: chrome.runtime.getURL('icons/disabled_128.png')
        }
    })
}

export async function enable(match: Match) {
    const disabled = await storageGet('disabled') || []
    disabled.splice(disabled.indexOf(match.id))
    await storageSet('disabled', disabled)
}

export async function disable(match: Match) {
    const disabled = await storageGet('disabled') as string[] || []
    if (disabled.indexOf(match.id) !== undefined) {
        disabled.push(match.id)
        await storageSet('disabled', disabled)
    }
}
