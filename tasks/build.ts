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

// because of javascript magic, require and import cannot be used at the same time
/*async function build_manifest() {
    const manifest = JSON.parse(await fs.readFileSync('src/manifest.json'))

    const manifestMatches = []

    for (const m of matches) {
        for (const domain of m.domains) {
            manifestMatches.push(`*://*.${domain}/*`)
        }
    }

    manifest['content_scripts']['matches'] = manifestMatches

    await fs.writeFileSync('src/manifest.json', JSON.stringify(manifest))
}*/

async function build_misc() {
    const files = {
        'src/manifest.json': 'build/manifest.json',
        'src/icons/stream-bypass.png': 'build/icons/stream-bypass.png'
    }

    for (const [src, dst] of Object.entries(files)) {
        fs.mkdirSync(path.dirname(dst), {recursive: true})
        fs.copyFileSync(src, dst)
    }
}

async function build_html() {
    const files = {
        'src/ui/popup/popup.html': 'build/ui/popup/popup.html',
        'src/ui/hls/hls.html': 'build/ui/hls/hls.html'
    }

    for (const [src, dst] of Object.entries(files)) {
        fs.mkdirSync(path.dirname(dst), {recursive: true})
        fs.copyFileSync(src, dst)
    }
}

async function build_css() {
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

async function build_js() {
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
    await build_misc()
    await build_html()
    await build_css()
    await build_js()
}

build()
