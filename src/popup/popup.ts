function enableAll(enable: boolean) {
    // @ts-ignore
    chrome.storage.local.set({'all': enable})

    // @ts-ignore
    for (let button of document.getElementById('sub-container').getElementsByTagName('a')) {
        enable ? button.classList.remove('disabled') : button.classList.add('disabled')
    }
}

function enableOne(website: string, enable: boolean) {
    // @ts-ignore
    chrome.storage.local.get(['disabled'], function (result) {
        let disabled: string[] = Object.keys(result).length === 0 ? [] : result['disabled']
        if (enable && disabled.indexOf(website) !== -1) {
            disabled.splice(disabled.indexOf(website), 1)
        } else if (!enable && disabled.indexOf(website) === -1) {
            disabled.push(website)
        } else {
            return
        }

        // @ts-ignore
        chrome.storage.local.set({'disabled': disabled})
    })
}

// @ts-ignore
chrome.storage.local.get(['all', 'disabled'], function (result) {
    let allDisabled = result['all'] !== undefined && !result['all']
    let disabled = new Map()

    if (allDisabled) {
        // @ts-ignore
        for (let match of matches) {
            disabled.set(match[0], false)
        }
    } else {
        if (Object.keys(result).indexOf('disabled') !== -1) {
            for (let disable of result['disabled']) {
                disabled.set(disable, false)
            }
        }
    }

    let subContainer = document.getElementById('sub-container')
    // @ts-ignore
    for (let match of matches) {
        let row = document.createElement('tr')

        let name = document.createElement('td')
        let nameValue = document.createElement('p')
        nameValue.innerText = match[0]
        switch (match[3]) {
            case 1: // low
                nameValue.classList.add('low-reliability')
                // @ts-ignore
                tippy(nameValue, {
                    content: 'Low reliability: Errors may occur often'
                })
                break
            case 2: // normal
                nameValue.classList.add('normal-reliability')
                // @ts-ignore
                tippy(nameValue, {
                    content: 'Normal reliability: Save to use but errors may occur'
                })
                break
            case 3: //high
                nameValue.classList.add('high-reliability')
                // @ts-ignore
                tippy(nameValue, {
                    content: 'High reliability: Errors are very unlikely to happen'
                })
                break
        }
        let buttons = document.createElement('td')
        buttons.classList.add('buttons')
        let on = document.createElement('a')
        on.innerText = 'On'
        // @ts-ignore
        let onTippy = tippy(on, {
            content: `Enable ${match[0]}`,
            onMount: () => {
                if (on.classList.contains('active') || off.classList.contains('disabled')) {
                    onTippy.hide()
                }
            }
        })
        let off = document.createElement('a')
        off.innerText = 'Off'
        // @ts-ignore
        let offTippy = tippy(off, {
            content: `Disable ${match[0]}`,
            onMount: () => {
                if (off.classList.contains('active') || off.classList.contains('disabled')) {
                    offTippy.hide()
                }
            }
        })
        disabled.has(match[0]) ? off.classList.add('active') : on.classList.add('active')
        if (allDisabled) {
            on.classList.add('disabled')
            off.classList.add('disabled')
        }

        on.onclick = function () {
            if (!on.classList.contains('disabled')) {
                enableOne(match[0], true)
                on.classList.add('active')
                off.classList.remove('active')
            }
        }
        off.onclick = function () {
            if (!off.classList.contains('disabled')) {
                enableOne(match[0], false)
                on.classList.remove('active')
                off.classList.add('active')
            }
        }

        name.append(nameValue)
        buttons.append(on, off)
        row.append(name, buttons)
        subContainer.append(row)
    }

    let allButtons = document.getElementById('all').getElementsByTagName('a')
    let allOn = allButtons[0]
    allButtons[0].onclick = function () {
        if (!allButtons[0].classList.contains('disabled')) {
            enableAll(true)
            allButtons[0].classList.add('active')
            allButtons[1].classList.remove('active')
        }
    }
    // @ts-ignore
    let allOnTippy = tippy(allOn, {
        content: 'Enable all websites',
        onMount: () => {
            if (allButtons[0].classList.contains('active')) {
                allOnTippy.hide()
            }
        }
    })
    allButtons[1].onclick = function () {
        if (!allButtons[1].classList.contains('disabled')) {
            enableAll(false)
            allButtons[0].classList.remove('active')
            allButtons[1].classList.add('active')
        }
    }
    // @ts-ignore
    let allOffTippy = tippy(allButtons[1], {
        content: 'Disable all websites',
        onMount: () => {
            if (allButtons[1].classList.contains('active')) {
                allOffTippy.hide()
            }
        }
    })
    allDisabled ? allButtons[1].classList.add('active') : allButtons[0].classList.add('active')
})
