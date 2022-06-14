import {matches} from "./match/match";
import {getAllDisabled, getDisabled} from "./store/store";

async function main() {
    if (await getAllDisabled()) {
        return
    }
    const disabled = await getDisabled()

    for (const match of matches) {
        if (disabled.some((v) => v == match) || !match.domains.some((v) => window.location.host.indexOf(v) !== -1)) {
            continue
        }

        const re = document.body.innerHTML.match(match.regex)
        if (re === null) {
            continue
        }

        const url = await match.match(re)
        location.assign(url.indexOf('.m3u8', url.length - 5) === -1 ? url : chrome.runtime.getURL(`ui/hls/hls.html?id=${match.id}&url=${encodeURIComponent(url)}`))
    }
}

main()
