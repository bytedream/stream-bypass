const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
const rollupPluginCommonJs = require('@rollup/plugin-commonjs')
const rollupPluginNodeResolve = require('@rollup/plugin-node-resolve').default
const rollupPluginReplace = require('@rollup/plugin-replace')
const rollupPluginTypescript = require('@rollup/plugin-typescript')
const sass = require('node-sass')
const sassPluginNodeImport = require('node-sass-package-importer')
const typescript = require('typescript')

function getDomains() {
    // because nodejs is nodejs, the simple commented out code below cannot be used.
    // thus, the following bloated regexes must be used
    /*const manifestMatches = []
    for (const m of matches) {
        for (const domain of m.domains) {
            manifestMatches.push(`*://*.${domain}/*`)
        }
    }
    manifest['content_scripts']['matches'] = manifestMatches*/

    let domains = []

    const matchesRegex = new RegExp(/export\s+const\s+matches\s+=\s+(?<matches>\[.*?])/gms)
    const matchesClassesRegex = new RegExp(/new\s+(?<class>\w+)\(\)/gms)

    const matchTs = fs.readFileSync('src/match/match.ts')
    const jsMatches = matchesRegex.exec(matchTs).groups.matches
    let m
    while ((m = matchesClassesRegex.exec(jsMatches))) {
        if (m.index === matchesClassesRegex.lastIndex) {
            matchesClassesRegex.lastIndex++
        }

        if (m.groups.class !== undefined) {
            const classDomainsRegex = new RegExp('class\\s+' + m.groups.class + '.*?domains\\s*=\\s*(?<domains>\\[.*?])', 'gms')
            let mm
            while ((mm = classDomainsRegex.exec(matchTs))) {
                if (mm.index === classDomainsRegex.lastIndex) {
                    classDomainsRegex.lastIndex++
                }

                if (mm.groups.domains !== undefined) {
                    const matches = []
                    for (const domain of JSON.parse(mm.groups.domains.replace(/'/g, '"', -1))) {
                        matches.push(domain)
                    }
                    domains = domains.concat(matches)
                }
            }
        }
    }

    return domains
}

async function buildManifest() {
    const manifest = JSON.parse(fs.readFileSync('src/manifest.json'))

    manifest['version'] = process.env.npm_package_version

    manifest['content_scripts']['matches'] = getDomains().map((domain) => {`*://*.${domain}/*`})

    fs.writeFileSync('src/manifest.json', JSON.stringify(manifest, null, 2))
}

async function buildReadme() {
    let readme = fs.readFileSync('README.md')

    readme = readme.toString().replace(/<ul>.*?<\/ul>/gms, '<ul>\n' + getDomains().map((domain) => {
        return `\t\t<li><a href="https://${domain}">${domain.charAt(0).toUpperCase() + domain.substring(1)}</a></li>`
    }).join('\n') + '\n\t</ul>')

    fs.writeFileSync('README.md', readme)
}

async function buildMisc() {
    const files = {
        'src/manifest.json': 'build/manifest.json',
        'src/icons/stream-bypass.png': 'build/icons/stream-bypass.png'
    }

    for (const [src, dst] of Object.entries(files)) {
        fs.mkdirSync(path.dirname(dst), {recursive: true})
        fs.copyFileSync(src, dst)
    }
}

async function buildHtml() {
    const files = {
        'src/ui/popup/popup.html': 'build/ui/popup/popup.html',
        'src/ui/hls/hls.html': 'build/ui/hls/hls.html'
    }

    for (const [src, dst] of Object.entries(files)) {
        fs.mkdirSync(path.dirname(dst), {recursive: true})
        fs.copyFileSync(src, dst)
    }
}

async function buildCss() {
    const files = {
        'src/ui/popup/popup.sass': 'build/ui/popup/popup.css',
        'src/ui/hls/hls.sass': 'build/ui/hls/hls.css'
    }

    for (const [src, dst] of Object.entries(files)) {
        const compiled = sass.renderSync({
            file: src,
            importer: sassPluginNodeImport()
        })
        fs.mkdirSync(path.dirname(dst), {recursive: true})
        fs.writeFileSync(dst, compiled.css)
    }
}

async function buildJs() {
    const files = {
        'src/ui/popup/popup.ts': 'build/ui/popup/popup.js',
        'src/ui/hls/hls.ts': 'build/ui/hls/hls.js',

        'src/index.ts': 'build/index.js'
    }

    for (const [src, dst] of Object.entries(files)) {
        const bundle = await rollup.rollup({
            input: src,
            plugins: [
                rollupPluginNodeResolve({
                    browser: true
                }),
                rollupPluginReplace({
                    'process.env.NODE_ENV': JSON.stringify('production')
                }),
                rollupPluginTypescript({
                    typescript,
                    tsconfig: 'src/tsconfig.json'
                }),
                rollupPluginCommonJs({
                    extensions: ['.js', '.ts']
                })
            ]
        })
        await bundle.write({
            file: dst,
            strict: true
        })
    }
}

async function build() {
    await buildManifest()
    await buildReadme()
    await buildMisc()
    await buildHtml()
    await buildCss()
    await buildJs()
}

build()
