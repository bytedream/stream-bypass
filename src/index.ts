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
        let domain = match[0] as string
        if (window.location.href.indexOf(domain) !== -1) {
            if (keys.indexOf('disabled') === -1 || result['disabled'].indexOf(domain) === -1) {
                let regex = match[1] as RegExp
                let matchClass = match[2] as Match
                let reliability = match[3] as Reliability

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
                        // @ts-ignore
                        location.assign(hasSuffix(re[0], 'm3u8') ? chrome.runtime.getURL(`res/hls.html?domain=${domain}&reliability=${reliability}#${re[0]}`) : re[0])
                    }
                } else {
                    matchClass.match(re).then(function (path) {
                        // @ts-ignore
                        location.assign(hasSuffix(path, 'm3u8') ? chrome.runtime.getURL(`res/hls.html?domain=${domain}&reliability=${reliability}#${path}`) : path)
                    })
                }
            }
            return
        }
    }
})