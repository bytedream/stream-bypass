import {getMatch} from "./match/match";
import {storageDelete, storageGet} from "./store/store";
import {Match, matches} from "./match/matches";
import play = chrome.cast.media.timeout.play;

async function main() {
    let match: Match;
    if ((match = await getMatch(window.location.host)) === undefined) {
        let id: string
        if ((id = await storageGet('redirect')) !== undefined) {
            match = matches.find(m => m.id === id)
            await storageDelete('redirect')
        } else {
            return
        }
    }

    const re = document.body.innerHTML.match(match.regex)
    if (re === null) {
        return
    }

    const url = await match.match(re)

    if (match.replace && !url.endsWith('.m3u8')) {
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
