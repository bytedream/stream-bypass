export enum Reliability {
    HIGH = 1,
    NORMAL,
    LOW,
}

export abstract class Match {
    name: string
    id: string
    reliability: Reliability
    domains: string[]
    replace?: boolean
    regex: RegExp
    abstract match(match: RegExpMatchArray): Promise<string>

    notice?: string
}

class Doodstream implements Match {
    name = 'Doodstream'
    id = 'doodstream'
    reliability = Reliability.HIGH
    domains = [
        'doodstream.com',
        'dood.pm'
    ]
    replace = true
    regex = new RegExp(/(\/pass_md5\/.*?)'.*(\?token=.*?expiry=)/s)

    async match(match: RegExpMatchArray): Promise<string> {
        const response = await fetch(`https://${window.location.host}${match[1]}`, {
            headers: {
                'Range': 'bytes=0-'
            },
            referrer: `https://${window.location.host}/e/${window.location.pathname.split('/').slice(-1)[0]}`,
        });

        return `${await response.text()}1234567890${match[2]}${Date.now()}`
    }
}

class Evoload implements Match {
    name = 'Evoload'
    id = 'evoload'
    reliability = Reliability.NORMAL
    domains = [
        'evoload.io'
    ]
    regex = new RegExp(/.*/gm)

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
    name = 'Mixdrop'
    id = 'mixdrop'
    reliability = Reliability.HIGH
    domains = [
        'mixdrop.co'
    ]
    regex = new RegExp(/(?<=\|)\w{2,}/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return `https://a-${match[1]}.${match[4]}.${match[5]}/v/${match[2]}.${match[6]}?s=${match[12]}&e=${match[13]}`
    }
}

class Mp4Upload implements Match {
    name = 'Mp4Upload'
    id = 'mp4upload'
    reliability = Reliability.LOW
    domains = [
        'mp4upload.com'
    ]
    replace = true
    regex = new RegExp(/(?<=\|)\w{2,}/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return `https://${match[34]}.mp4upload.com:${match[89]}/d/${match[88]}/video.mp4`
    }
}

class Newgrounds implements Match {
    name = 'Newgrounds'
    id = 'newgrounds'
    reliability = Reliability.HIGH
    domains = [
        'newgrounds.com'
    ]
    regex = new RegExp(/.*/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        let id = window.location.pathname.split('/').slice(-1)[0]
        let response = await fetch(`https://www.newgrounds.com/portal/video/${id}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        let json = await response.json()
        return decodeURI(json['sources'][Object.keys(json['sources'])[0]][0]['src'])
    }
}

class Streamtape implements Match {
    name = 'Streamtape'
    id = 'streamtape'
    reliability = Reliability.NORMAL
    domains = [
        'streamtape.com'
    ]
    regex = new RegExp(/id=.*(?=')/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return `https://streamtape.com/get_video?${match.reverse()[0]}`
    }
}

class Streamzz implements Match {
    name = 'Streamzz'
    id = 'streamzz'
    reliability = Reliability.NORMAL
    domains = [
        'streamzz.to',
        'streamz.ws'
    ]
    regex = new RegExp(/(?<=\|)\w{2,}/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return `https://get.${document.domain.split('.')[0]}.tw/getlink-${match.sort((a, b) => b.length - a.length)[0]}.dll`
    }
}

class Upstream implements Match {
    name = 'Upstream'
    id = 'upstream'
    reliability = Reliability.NORMAL
    domains = [
        'upstream.to'
    ]
    regex = new RegExp(/(?<=\|)\w{2,}/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return `https://${match[49]}.upstreamcdn.co/hls/${match[148]}/master.m3u8`
    }
}

class Vidlox implements Match {
    name = 'Vidlox'
    id = 'vidlox'
    reliability = Reliability.LOW
    domains = [
        'vidlox.me'
    ]
    regex = new RegExp(/(?<=\[")\S+?(?=")/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return match[0]
    }
}

class Vidoza implements Match {
    name = 'Vidoza'
    id = 'vidoza'
    reliability = Reliability.HIGH
    domains = [
        'vidoza.net'
    ]
    regex = new RegExp(/(?<=src:\s?").+?(?=")/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return match[0]
    }
}

class Vivo implements Match {
    name = 'Vivo'
    id = 'vivo'
    reliability = Reliability.LOW
    domains = [
        'vivo.sx'
    ]
    regex = new RegExp(/(?<=source:\s')(\S+)(?=')/gms)

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

class Voe implements Match {
    name = 'Voe'
    id = 'voe'
    reliability = Reliability.HIGH
    domains = [
        'voe.sx'
    ]
    regex = new RegExp(/https?:\/\/\S*m3u8(?=")/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return match[0]
    }
}

class Vupload implements Match {
    name = 'Vupload'
    id = 'vupload'
    reliability = Reliability.HIGH
    domains = [
        'vupload.com'
    ]
    regex = new RegExp(/(?<=src:\s?").+?(?=")/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return match[0]
    }
}

export const matches = [
    new Doodstream(),
    new Evoload(),
    new Mixdrop(),
    new Mp4Upload(),
    new Newgrounds(),
    new Streamtape(),
    new Streamzz(),
    new Upstream(),
    new Vidlox(),
    new Vidoza(),
    new Vivo(),
    new Voe(),
    new Vupload()
]
