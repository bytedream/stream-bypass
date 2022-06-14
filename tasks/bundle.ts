import * as fs from "fs";
import * as path from "path";
import * as yazl from "yazl";

function walkDirectory(dir, callback) {
    for (const file of fs.readdirSync(dir)) {
        const filePath = path.join(dir, file)
        fs.statSync(filePath).isDirectory() ? walkDirectory(filePath, callback) : callback(filePath)
    }
}

async function bundle_zip() {
    const zipfile = new yazl.ZipFile()
    walkDirectory('build', (path) => {
        zipfile.addFile(path, path.substring(6))
    })
    zipfile.end()

    fs.mkdirSync('dist', {recursive: true})
    zipfile.outputStream.pipe(fs.createWriteStream(`dist/stream_bypass-v${process.env.npm_package_version}.zip`))
}

async function bundle() {
    await bundle_zip()
}

bundle()
