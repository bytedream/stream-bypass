import {getMatch} from "./match/match";
import {storageDelete, storageGet, getSetting} from "./store/store";
import {Match, matches} from "./match/matches";


async function main() {
    let match: Match;
    let redirect = false;
    if ((match = await getMatch(window.location.host)) === undefined) {
        let id: string
        if ((id = await storageGet('redirect')) !== undefined) {
            redirect = true
            match = matches.find(m => m.id === id)
        } else {
            return
        }
    }

    const re = document.body.innerHTML.match(match.regex)
    if (re === null) return
    if (redirect) await storageDelete('redirect')

    const url = await match.match(re)

    if (await getSetting("ff2mpv")) {
        chrome.runtime.sendMessage({action: "ff2mpv", url: url})
    }

    if (match.replace && !url.includes('.m3u8')) {
        const player = document.createElement('video')
        player.style.width = '100%'
        player.style.height = '100%'
        player.controls = true
        player.src = url

        document.body.innerHTML = ''
        document.body.append(player)
    } else {
        window.location.assign(chrome.runtime.getURL(`ui/player/player.html?id=${match.id}&url=${encodeURIComponent(url)}&domain=${window.location.host}`))
    }
}

main()
