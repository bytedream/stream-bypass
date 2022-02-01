enum Reliability {
    LOW = 1,
    NORMAL,
    HIGH
}

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

class MCloud implements Match {
    async match(match: RegExpMatchArray): Promise<string> {
        const code = window.location.pathname.split('/').slice(-1)[0]
        const response = await fetch(`https://mcloud.to/info/${code}?skey=${match[0]}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            referrer: `https://mcloud.to/embed/${code}`
        })
        const json = await response.json()
        return json['media']['sources'][0]['file']
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

class Upstream implements Match {
    async match(match: RegExpMatchArray): Promise<string> {
        return `https://${match[47]}.upstreamcdn.co/hls/${match.sort((a, b) => {return b.length - a.length})[0]}/master.m3u8`
    }
}

class Vidstream implements Match {
    async match(match: RegExpMatchArray): Promise<string> {
        const code = window.location.pathname.split('/').slice(-1)[0]
        const response = await fetch(`https://vidstream.pro/info/${code}?skey=${match[0]}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            referrer: `https://vidstream.pro/embed/${code}`
        })
        const json = await response.json()
        return json['media']['sources'][0]['file']
    }
}

class Vivo implements Match {
    async match(match: RegExpMatchArray): Promise<string> {
        return this.rot47(decodeURIComponent(match[0]))
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

// all domains to match. the matches must be structured like this:
//      [domain, regex match (can be null), class to call after match (can be null), reliability]
// => the domain which should be redirected
// => the regex gets called if the user visits a site with the given domain and matches the websites document body.
//    if the regex is null, the complete document body gets handled as one big regex match
// => the class to call when the regex was parsed successfully. the class has to implement the `Match` interface.
//    if the class is null, the user gets redirected to the first regex match element
// => the reliability shows how reliable a stream redirect is. for example, vivo.sx works nearly every time whereas
//    upstream.to works only sometimes because of a security mechanism they're using (CORS) which currently can't be bypassed
//
// every match HAS to be on an separate line (for automatically manifest generation)
const matches = [
    ['evoload.io', null, new Evoload(), Reliability.NORMAL],
    ['mcloud.to', new RegExp(/(?<=')\w+(?=';)/gm), new MCloud(), Reliability.NORMAL],
    ['mixdrop.co', new RegExp(/(?<=\|)\w{2,}/gm), new Mixdrop(), Reliability.HIGH],
    ['streamtape.com', new RegExp(/id=\S*(?=')/gm), new Streamtape(), Reliability.NORMAL],
    ['streamzz.to', new RegExp(/https?:\/\/get.streamz.tw\/getlink-\w+\.dll/gm), null, Reliability.NORMAL],
    ['thevideome.com', new RegExp(/(?<=\|)\w{2,}/gm), new TheVideoMe(), Reliability.NORMAL],
    //['upstream.to', new RegExp(/(?<=\|)\w{2,}/gm), new Upstream(), Reliability.LOW],
    ['vidlox.me', new RegExp(/(?<=\[")\S+?(?=")/gm), null, Reliability.NORMAL],
    ['vidstream.pro', new RegExp(/(?<=')\w+(?=';)/gm), new Vidstream(), Reliability.LOW],
    ['vidoza.net', new RegExp(/(?<=src:(\s*)?")\S*(?=")/gm), null, Reliability.NORMAL],
    ['vivo.st', new RegExp(/(?<=source:\s')(\S+)(?=')/gm), new Vivo(), Reliability.HIGH],
    ['vivo.sx', new RegExp(/(?<=source:\s')(\S+)(?=')/gm), new Vivo(), Reliability.HIGH],
    ['voe.sx', new RegExp(/https?:\/\/\S*m3u8(?=")/gm), null, Reliability.HIGH],
    ['vupload.com', new RegExp(/(?<=src:\s?").+?(?=")/gm), null, Reliability.NORMAL]
]
