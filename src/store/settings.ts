import { storageSet, storageGet } from "./store"

export class Setting {
    name: string
    info_url?: string

    constructor(name: string, info_url?: string) {
        this.name = name
        this.info_url = info_url
    }

    async enable() {
        await storageSet(this.name, true)
    }

    async disable() {
        await storageSet(this.name, false)
    }

    async get_status() {
        return await storageGet(this.name)
    }
}

export const Settings = [
    new Setting("ff2mpv", "https://github.com/ByteDream/stream-bypass/tree/ff2mpv_feature#ff2mpv-use-mpv-to-directly-play-streams")
]
