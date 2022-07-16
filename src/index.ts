import {getMatch} from "./match/match";
import {storageDelete, storageGet} from "./store/store";
import {Match, matches} from "./match/matches";

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
    window.location.assign(chrome.runtime.getURL(`ui/player/player.html?id=${match.id}&url=${encodeURIComponent(url)}&domains=${window.location.host}`))
}

main()
