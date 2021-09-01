interface Match {
    match(match: RegExpMatchArray): string
}

class Streamtape implements Match {
    match(match: RegExpMatchArray): string {
        return `https://streamtape.com/get_video?${match[0]}`
    }
}

class Vivo implements Match {
    match(match: RegExpMatchArray): string {
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
    match(match: RegExpMatchArray): string {
        return `https://www3.megaupload.to/${match[0]}/v.mp4`
    }
}

// every match HAS to be on an separate line
const matches = [
    ['streamtape.com', new RegExp(/id=\S*(?=')/gm), new Streamtape()],
    ['vidoza.net', new RegExp(/(?<=src:(\s*)?")\S*(?=")/gm), null],
    ['vivo.sx', new RegExp(/source:\s*'(\S+)'/gm), new Vivo()],
    ['vupload.com', new RegExp(/(?<=class\|)\w*/gm), new Vupload()]
]
