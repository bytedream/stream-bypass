import {matches} from "../../match/matches";
// @ts-ignore
import Hls from "hls.js";

function show_message(message: string) {
    document.getElementById('message').innerText = message
    document.getElementById('message-container').style.visibility = 'visible'
    document.getElementById('video').hidden = true
}

async function play_native(url: string) {
    const video = document.getElementById('video') as HTMLVideoElement
    video.controls = true
    video.src = url
}

async function play_hls(url: string) {
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
    } else {
        show_message('Failed to play m3u8 video (hls is not supported). Try again or create a new issue <a href="https://github.com/ByteDream/stream-bypass/issues/new">here</a>')
    }
}

async function main() {
    const urlQuery = new URLSearchParams(window.location.search)
    const id = urlQuery.get('id')
    const url = decodeURIComponent(urlQuery.get('url'))
    const domain = urlQuery.get('domain')

    const match = matches.find((m) => m.id === id)
    if (match === undefined) {
        show_message(`Invalid id: ${id}. Please report this <a href="https://github.com/ByteDream/stream-bypass/issues">here</a>`)
        return
    }
    document.title = `Stream Bypass (${domain})`

    new URL(url).pathname.endsWith('.m3u8') ? await play_hls(url) : await play_native(url)
}

main()
