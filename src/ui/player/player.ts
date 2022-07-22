import {Match, matches, Reliability} from "../../match/matches";
// @ts-ignore
import Hls from "hls.js";

function show_message(message: string) {
    document.getElementById('message').innerHTML = message
    document.getElementById('message-container').hidden = false
    document.getElementById('video').hidden = true
}

async function play_native(url: string, match: Match) {
    const video = document.getElementById('video') as HTMLVideoElement
    video.controls = true
    video.src = url
}

async function play_hls(url: string, match: Match) {
    const video = document.getElementById('video') as HTMLVideoElement
    video.controls = true

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url
    } else if (Hls.isSupported()) {
        const hls = new Hls({
            enableWorker: false
        })
        hls.loadSource(url)
        hls.attachMedia(video)

        const loaded = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(false)
            }, match.reliability * 3000)

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                resolve(true)
            })
        })

        if (!loaded) {
            let message: string
            switch (match.reliability) {
                case Reliability.LOW:
                    message = `The reliability for this domain is low, errors like this are common.
                    Try to choose another streaming provider (if existent) or deactivate the addon for this provider (${match.name}) and try again`
                    break
                case Reliability.NORMAL:
                    message = `The reliability for this domain is normal, errors like this can occur but are not very common. Try to refresh the page`
                    break
                case Reliability.HIGH:
                    message = `The reliability for this domains is high, errors like this are very unlikely to happen.<br>
                    Try to refresh the page and if the error still exists you might want to open a new issue <a href="https://github.com/ByteDream/stream-bypass/issues/new">here</a>.<br>
                    When you're using <a href="https://www.torproject.org/">Tor</a>, such errors have a slight chance to occur more often,
                    so if this is the case just try to reload the page and see if it's working then`
                    break
            }
            show_message(`Could not load video. ${message}`)
        }
    } else {
        show_message('Failed to play m3u8 video (hls is not supported). Try again or create a new issue <a href="https://github.com/ByteDream/stream-bypass/issues/new">here</a>')
    }
}

async function main() {
    const urlQuery = new URLSearchParams(window.location.search)
    const id = urlQuery.get('id')
    const url = urlQuery.get('url')
    const domain = urlQuery.get('domain')

    const match = matches.find((m) => m.id === id)
    if (match === undefined) {
        show_message(`Invalid id: ${id}. Please report this <a href="https://github.com/ByteDream/stream-bypass/issues/new">here</a>`)
        return
    }
    document.title = `Stream Bypass (${domain})`

    url.endsWith('.m3u8') ? await play_hls(url, match) : await play_native(url, match)
}

main()
