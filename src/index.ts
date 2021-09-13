function hasSuffix(content: string, suffix: string) {
    return content.indexOf(suffix, content.length - suffix.length) !== -1
}

// @ts-ignore
chrome.storage.local.get(['all', 'disabled'], function (result) {
    let keys = Object.keys(result)
    if (keys.indexOf('all') !== -1 && !result['all']) {
        return
    }
    // @ts-ignore
    for (let match of matches) {
        if (window.location.href.indexOf(match[0]) !== -1) {
            if (keys.indexOf('disabled') === -1 || result['disabled'].indexOf(match[0]) === -1) {
                let regex = match[1] as RegExp
                let matchClass = match[2] as Match

                let re
                if (regex !== null) {
                    if ((re = document.body.innerHTML.match(regex)) === null) {
                        continue
                    }
                } else {
                    re = document.body.innerHTML.match(regex)
                }

                if (matchClass === null) {
                    if (regex === null) {
                        location.assign(document.body.innerHTML)
                    } else {
                        location.assign(hasSuffix(re[0], 'm3u8') ? `https://bharadwajpro.github.io/m3u8-player/player/#${re[0]}`: re[0])
                    }
                } else {
                    matchClass.match(re).then(function (path) {
                        location.assign(hasSuffix(path, 'm3u8') ? `https://bharadwajpro.github.io/m3u8-player/player/#${path}`: path)
                    })
                }
            }
            return
        }
    }
})