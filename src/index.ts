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
                if (regex === null) {
                    location.assign(matchClass === null ? document.body.innerHTML : matchClass.match(new RegExp('').exec(document.body.innerHTML)))
                } else if ((re = regex.exec(document.body.innerHTML)) !== null) {
                    location.assign(matchClass === null ? re[0] : matchClass.match(re))
                }
            }
            return
        }
    }
})