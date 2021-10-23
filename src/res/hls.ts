function showMessage(message: string) {
    let messageElement = document.getElementById('message') as HTMLParagraphElement
    messageElement.innerHTML = message
    messageElement.hidden = false
    document.getElementById('video').hidden = true
}

function loadHls() {
    let url = window.location.hash.substring(1)
    let video = document.getElementById('video') as HTMLVideoElement;

    video.controls = true
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url
    // @ts-ignore
    } else if (Hls.isSupported()) {
        // @ts-ignore
        let hls = new Hls()
        hls.loadSource(url)
        hls.attachMedia(video)

        let searchParams = new URLSearchParams(window.location.search)
        let rawReliability = parseInt(searchParams.get('reliability'))

        let thirdPartyFallback = setTimeout(() => {
            let message: string

            switch (rawReliability) {
                case 1: // low
                    message = `The reliability for this domain is low, so errors like this are common.
                    Try to choose another streaming provider (if existent) or deactivate the addon for this domain (${searchParams.get('domain')}) and try again`
                    break
                case 2: // normal
                    message = `The reliability for this domain is normal, errors like this can occur but are not very common. Try to refresh the page`
                    break
                case 3: // high
                    message = `The reliability for this domains is high, errors like this are very unlikely to happen.
                    Try to refresh the page and if the error still exists you might want to open a new issue <a href="https://github.com/ByteDream/stream-bypass/issues">here</a>.
                    When your using <a href="https://www.torproject.org/">Tor</a> such errors have a slight chance to occur more often,
                    so if this is the case just try to reload the page and see if you it's working then`
                    break
            }

            // shows a message if hls could not be loaded
            showMessage(`Could not load hls video. ${message}`)
        }, rawReliability * 3000)

        // @ts-ignore
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            clearTimeout(thirdPartyFallback)
            document.getElementById('video').hidden = false
            document.getElementById('message').hidden = true
        })
    } else {
        // shows a message if hls is not supported
        showMessage(`Failed to play m3u8 video (hls is not supported). Try again or create a new issue <a href="https://github.com/ByteDream/stream-bypass/issues">here</a>`)
    }
}

loadHls()
