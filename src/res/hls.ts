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
    } else {
        // shows a message if hls is not supported
        document.getElementById('not-supported').hidden = false
    }
}

loadHls()
