import {matches} from "./match/match";
import {getAllDisabled, getDisabled} from "./store/store";

async function main() {
    if (await getAllDisabled()) {
        return
    }

    for (const match of matches) {
        if (!match.domains.some((v) => window.location.host.indexOf(v) !== -1) || ((await getDisabled()).some((v) => v === match))) {
            continue
        }

        const re = document.body.innerHTML.match(match.regex)
        if (re === null) {
            continue
        }

        const url = await match.match(re)
        location.assign(chrome.runtime.getURL(`ui/player/player.html?id=${match.id}&url=${encodeURIComponent(url)}`))
    }
}

main()
