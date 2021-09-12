interface Match {
    match(match: RegExpMatchArray): Promise<string>
}

class Evoload implements Match {
    async match(match: RegExpMatchArray): Promise<string> {
        const code = window.location.pathname.split('/').slice(-1)[0]
        const response = await fetch('https://evoload.io/SecurePlayer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({code: code})
        })

        const json = await response.json()
        return json['stream']['src']
    }
}

class Mixdrop implements Match {
    async match(match: RegExpMatchArray): Promise<string> {
        return `https://a-${match[1]}.${match[4]}.${match[5]}/v/${match[2]}.${match[6]}?s=${match[12]}&e=${match[13]}`
    }
}

class Streamtape implements Match {
    async match(match: RegExpMatchArray): Promise<string> {
        return `https://streamtape.com/get_video?${match[0]}`
    }
}

class TheVideoMe implements Match {
    async match(match: RegExpMatchArray): Promise<string> {
        return `https://thevideome.com/${match[5]}.mp4`
    }
}

class Vivo implements Match {
    async match(match: RegExpMatchArray): Promise<string> {
        return this.rot47(decodeURIComponent(match[1]))
    }

    // decrypts a string with the rot47 algorithm (https://en.wikipedia.org/wiki/ROT13#Variants)
    rot47(encoded: string): string {
        const s = []
        for(let i = 0; i < encoded.length; i++) {
            const j = encoded.charCodeAt(i)
            if((j >= 33) && (j <= 126)) {
                s[i] = String.fromCharCode(33+((j+ 14)%94))
            } else {
                s[i] = String.fromCharCode(j)
            }
        }
        return s.join('')
    }
}

class Vupload implements Match {
    async match(match: RegExpMatchArray): Promise<string> {
        return `https://www3.megaupload.to/${match[0]}/v.mp4`
    }
}

// every match HAS to be on an separate line
const matches = [
    ['evoload.io', null, new Evoload()],
    ['mixdrop.co', new RegExp(/(?<=\|)\w{2,}/gm), new Mixdrop()],
    ['streamtape.com', new RegExp(/id=\S*(?=')/gm), new Streamtape()],
    ['streamzz.to', new RegExp(/https?:\/\/get.streamz.tw\/getlink-\w+\.dll/gm), null],
    ['thevideome.com', new RegExp(/(?<=\|)\w{2,}/gm), new TheVideoMe()],
    ['vidlox.me', new RegExp(/(?<=\[")\S+?(?=")/gm), null],
    ['vidoza.net', new RegExp(/(?<=src:(\s*)?")\S*(?=")/gm), null],
    ['vivo.st', new RegExp(/source:\s*'(\S+)'/gm), new Vivo()],
    ['vivo.sx', new RegExp(/source:\s*'(\S+)'/gm), new Vivo()],
    ['voe.sx', new RegExp(/https?:\/\/\S*m3u8(?=")/gm), null],
    ['vupload.com', new RegExp(/(?<=class\|)\w*/gm), new Vupload()]
]
