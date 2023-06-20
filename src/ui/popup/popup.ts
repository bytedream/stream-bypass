import {getDisabled, disable, enable, getAllDisabled, enableAll, disableAll} from "../../store/store";
import {matches, Reliability} from "../../match/matches";
import { Settings, Setting } from "../../store/settings";

async function main() {
    const disabled = await getDisabled()

    const subContainer = document.getElementById('sub-container')
    for (const m of matches) {
        const row = document.createElement('tr')

        const name = document.createElement('td')
        const nameValue = document.createElement('p')
        nameValue.innerText = m.name
        switch (m.reliability) {
            case Reliability.LOW:
                nameValue.classList.add('low-reliability')
                break
            case Reliability.NORMAL:
                nameValue.classList.add('normal-reliability')
                break
            case Reliability.HIGH:
                nameValue.classList.add('high-reliability')
                break
        }

        const buttons = document.createElement('td')
        buttons.classList.add('buttons')
        const on = document.createElement('a')
        on.innerText = 'On'
        const off = document.createElement('a')
        off.innerText = 'Off'
        disabled.find((v) => v.id === m.id) === undefined ? on.classList.add('active') : off.classList.add('active')

        on.onclick = async function () {
            if (!on.classList.contains('disabled')) {
                await enable(m)
                on.classList.add('active')
                off.classList.remove('active')
            }
        }
        off.onclick = async function () {
            if (!off.classList.contains('disabled')) {
                await disable(m)
                on.classList.remove('active')
                off.classList.add('active')
            }
        }

        name.append(nameValue)
        buttons.append(on, off)
        row.append(name, buttons)
        subContainer.append(row)
    }

    const settingsContainer = document.getElementById("settings-container") 
    for (const s of Settings) {
        const row = document.createElement('tr')

        const name = document.createElement('td')
        const nameValue = document.createElement('p')
        nameValue.innerText = s.name

        const buttons = document.createElement('td')
        buttons.classList.add('buttons')
        const on = document.createElement('a')
        on.innerText = 'On'
        const off = document.createElement('a')
        off.innerText = 'Off'
        const info = document.createElement('a')
        info.target = "_blank"
        info.href = s.info_url
        info.innerText = "🛈"

        await s.get_status() ? on.classList.add('active') : off.classList.add('active')

        on.onclick = async function () {
            if (!on.classList.contains('disabled')) {
                await s.enable()
                on.classList.add('active')
                off.classList.remove('active')
            }
        }
        off.onclick = async function () {
            if (!off.classList.contains('disabled')) {
                await s.disable()
                on.classList.remove('active')
                off.classList.add('active')
            }
        }

        name.append(nameValue)
        buttons.append(on, off)
        if (s.info_url) {
            buttons.append(info)
        }
        row.append(name, buttons)
        settingsContainer.append(row)
    }

    const allOnButton = document.getElementById('all').getElementsByTagName('a')[0]
    const allOffButton = document.getElementById('all').getElementsByTagName('a')[1]

    if (await getAllDisabled()) {
        const allBtns = document.getElementById('sub-container').getElementsByTagName('a')
        for (let i = 0; i < allBtns.length; i++) {
            allBtns[i].classList.add('disabled')
        }
        allOffButton.classList.add('active')
    } else {
        allOnButton.classList.add('active')
    }

    allOnButton.onclick = async () => {
        if (!allOnButton.classList.contains('active')) {
            allOnButton.classList.add('active')
            allOffButton.classList.remove('active')

            const allBtns = document.getElementById('sub-container').getElementsByTagName('a')
            for (let i = 0; i < allBtns.length; i++) {
                allBtns[i].classList.remove('disabled')
            }

            await enableAll()
        }
    }
    allOffButton.onclick = async () => {
        if (!allOffButton.classList.contains('active')) {
            allOffButton.classList.add('active')
            allOnButton.classList.remove('active')

            const allBtns = document.getElementById('sub-container').getElementsByTagName('a')
            for (let i = 0; i < allBtns.length; i++) {
                allBtns[i].classList.add('disabled')
            }

            await disableAll()
        }
    }
}

main()
