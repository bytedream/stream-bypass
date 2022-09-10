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

async function buildManifest() {
    const manifest = JSON.parse(fs.readFileSync('src/manifest.json'))

    manifest['version'] = process.env.npm_package_version

    fs.writeFileSync('src/manifest.json', JSON.stringify(manifest, null, 2))
}

async function buildMisc() {
    const files = {
        'src/manifest.json': 'build/manifest.json',

        'src/icons/logo_48.png': 'build/icons/logo_48.png',
        'src/icons/logo_128.png': 'build/icons/logo_128.png',
        'src/icons/disabled_48.png': 'build/icons/disabled_48.png',
        'src/icons/disabled_128.png': 'build/icons/disabled_128.png',
    }

    for (const [src, dst] of Object.entries(files)) {
        fs.mkdirSync(path.dirname(dst), {recursive: true})
        fs.copyFileSync(src, dst)
    }
}

async function buildHtml() {
    const files = {
        'src/ui/popup/popup.html': 'build/ui/popup/popup.html',
        'src/ui/player/player.html': 'build/ui/player/player.html'
    }

    for (const [src, dst] of Object.entries(files)) {
        fs.mkdirSync(path.dirname(dst), {recursive: true})
        fs.copyFileSync(src, dst)
    }
}

async function buildCss() {
    const files = {
        'src/ui/popup/popup.scss': 'build/ui/popup/popup.css',
        'src/ui/player/player.scss': 'build/ui/player/player.css'
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
        'src/ui/player/player.ts': 'build/ui/player/player.js',

        'src/index.ts': 'build/index.js',
        'src/background.ts': 'build/background.js'
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
    await buildMisc()
    await buildHtml()
    await buildCss()
    await buildJs()
}

build()
