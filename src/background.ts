import {getMatch} from "./match/match";
import {storageDelete, storageGet, storageSet} from "./store/store";
import {Match} from "./match/matches";


chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action == "ff2mpv") {
        chrome.runtime.sendNativeMessage("ff2mpv", {url: message.url})
            .catch((error) => {console.error(error)})
    }
})

chrome.webRequest.onBeforeRedirect.addListener(async details => {
    // check if redirects origins from a previous redirect
    if (await storageGet('redirect') === undefined) {
        let match: Match
        if ((match = await getMatch(new URL(details.url).host)) !== undefined) {
            await storageSet('redirect', match.id)
        }
    } else {
        await storageDelete('redirect')
    }
}, {
    urls: ['<all_urls>'],
    types: ['main_frame', 'sub_frame']
})
