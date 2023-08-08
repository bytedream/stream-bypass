import {unPack} from "./unpack";

export enum Reliability {
    HIGH,
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
    reliability = Reliability.NORMAL
    domains = [
        'doodstream.com',
        'dood.pm',
        'dood.ws',
        'dood.wf',
        'dood.cx',
        'dood.sh',
        'dood.watch',
        'dood.to',
        'dood.so',
        'dood.la',
        'dood.re',
        'dood.yt',
        'ds2play.com',
        'dooood.com'
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

class Filemoon implements Match {
    name = 'Filemoon'
    id = 'filemoon'
    reliability = Reliability.HIGH
    domains = [
        'filemoon.sx',
        'filemoon.in'
    ]
    regex = new RegExp(/eval\(function\(p,a,c,k,e,d\).*?(?=\<\/script\>)/gms)

    async match(match: RegExpMatchArray): Promise<string> {
        let unpacked = await unPack(match[0])
        let url = unpacked.match(/(?<=file:").*(?=")/)[0]
        return url
    }
}

class Mixdrop implements Match {
    name = 'Mixdrop'
    id = 'mixdrop'
    reliability = Reliability.HIGH
    domains = [
        'mixdrop.co',
        'mixdrop.to',
        'mixdrop.ch',
        'mixdrop.bz',
        'mixdrop.gl'
    ]
    regex = new RegExp(/eval\(function\(p,a,c,k,e,d\).*?(?=\<\/script\>)/gms)

    async match(match: RegExpMatchArray): Promise<string> {
        let unpacked = await unPack(match[0])
        let url = unpacked.match(/(?<=MDCore.wurl=").*(?=")/)[0]
        return `https:${url}`
    }
}

class Mp4Upload implements Match {
    name = 'Mp4Upload'
    id = 'mp4upload'
    reliability = Reliability.HIGH
    domains = [
        'mp4upload.com'
    ]
    replace = true
    regex = new RegExp(/eval\(function\(p,a,c,k,e,d\).*?(?=\<\/script\>)/gms)

    async match(match: RegExpMatchArray): Promise<string> {
        let unpacked = await unPack(match[0])
        let url = unpacked.match(/(?<=player.src\(").*(?=")/)[0]
        return url
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
        'streamtape.com',
        'streamtape.net',
        'shavetape.cash'
    ]
    regex = new RegExp(/id=.*(?=')/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return `https://streamtape.com/get_video?${match.reverse()[0]}`
    }
}

class Streamzz implements Match {
    name = 'Streamzz'
    id = 'streamzz'
    reliability = Reliability.LOW
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
    reliability = Reliability.HIGH
    domains = [
        'upstream.to',
        's96.upstreamcdn.co'
    ]
    regex = new RegExp(/eval\(function\(p,a,c,k,e,d\).*?(?=\<\/script\>)/gms)

    async match(match: RegExpMatchArray): Promise<string> {
        let unpacked = await unPack(match[0])
        let url = unpacked.match(/(?<=file:").*(?=")/)[0]
        return url
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

class Voe implements Match {
    name = 'Voe'
    id = 'voe'
    reliability = Reliability.HIGH
    domains = [
        'voe.sx'
    ]
    regex = new RegExp(/https?:\/\/\S*m3u8.+(?=')/gm)

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

class Kwik implements Match {
    name = 'Kwik'
    id = 'kwik'
    reliability = Reliability.HIGH
    domains = [
        'kwik.cx'
    ]
    regex = new RegExp(/eval\(function\(p,a,c,k,e,d\).*?(?=\<\/script\>)/gms)

    async match(match: RegExpMatchArray): Promise<string> {
        console.log(match[0]);
        let unpacked = await unPack(match[0])
        let url = unpacked.match(/(?<=source=').*(?=')/)[0]
        return url
    }
}

class DropLoad implements Match {
    name = 'Dropload'
    id = 'dropload'
    reliability = Reliability.HIGH
    domains = [
        'dropload.io'
    ]
    regex = new RegExp(/eval\(function\(p,a,c,k,e,d\).*?(?=\<\/script\>)/gms)

    async match(match: RegExpMatchArray): Promise<string> {
        let unpacked = await unPack(match[0])
        let url = unpacked.match(/(?<=file:").*(?=")/)[0]
        return url
    }
}

class SuperVideo implements Match {
    name = 'Supervideo'
    id = 'supervideo'
    reliability = Reliability.HIGH
    domains = [
        'supervideo.tv'
    ]
    regex = new RegExp(/eval\(function\(p,a,c,k,e,d\).*?(?=\<\/script\>)/gms)

    async match(match: RegExpMatchArray): Promise<string> {
        let unpacked = await unPack(match[0])
        let url = unpacked.match(/(?<=file:").*(?=")/)[0]
        return url
    }
}

class GoodStream implements Match {
    name = 'Goodstream'
    id = 'goodstream'
    reliability = Reliability.NORMAL
    domains = [
        'goodstream.uno'
    ]
    regex = new RegExp(/(?<=file:\s+").*(?=")/g)

    async match(match: RegExpMatchArray): Promise<string> {
        return match[0]
    }
}

export const matches = [
    new Doodstream(),
    new Filemoon(),
    new Mixdrop(),
    new Mp4Upload(),
    new Newgrounds(),
    new Streamtape(),
    new Streamzz(),
    new Upstream(),
    new Vidoza(),
    new Voe(),
    new Vupload(),
    new Kwik(),
    new DropLoad(),
    new SuperVideo(),
    new GoodStream()
]
