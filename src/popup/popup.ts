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
        let buttons = document.createElement('td')
        buttons.classList.add('buttons')
        let on = document.createElement('a')
        on.innerText = 'On'
        let off = document.createElement('a')
        off.innerText = 'Off'
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
    allButtons[0].onclick = function () {
        if (!allButtons[0].classList.contains('disabled')) {
            enableAll(true)
            allButtons[0].classList.add('active')
            allButtons[1].classList.remove('active')
        }
    }
    allButtons[1].onclick = function () {
        if (!allButtons[1].classList.contains('disabled')) {
            enableAll(false)
            allButtons[0].classList.remove('active')
            allButtons[1].classList.add('active')
        }
    }
    allDisabled ? allButtons[1].classList.add('active') : allButtons[0].classList.add('active')
})
