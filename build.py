#!/usr/bin/python3

import argparse
import json
import sys
from pathlib import Path
import re
import shutil
import subprocess


def load_matches():
    matched = []

    indexed = False
    pattern = re.compile(r"(?<=\[')\S*(?=',)")
    for line in open('src/match.ts', 'r'):
        if not indexed:
            if 'constmatches=[' in line.replace(' ', ''):
                indexed = True
        else:
            match = pattern.findall(line)
            if match:
                matched.append(match[0])
            else:
                break

    return matched


def write_manifest():
    matches = load_matches()
    manifest = json.load(open('src/manifest.json', 'r'))

    for content_script in manifest['content_scripts']:
        content_script['matches'] = [f'*://{match}/*' for match in matches]

    domains = []
    for match in matches:
        toplevel = match.split('.')[-1]
        if toplevel not in domains:
            domains.append(toplevel)
    manifest['content_security_policy'] = f"script-src 'self' blob: https://cdn.jsdelivr.net {' '.join(f'*.{toplevel}' for toplevel in domains)}; object-src 'self'"

    json.dump(manifest, open('src/manifest.json', 'w'), indent=2)


def write_supported():
    open('SUPPORTED', 'w').writelines([f'{match}\n' for match in load_matches()])


def copy_built():
    if not shutil.which('tsc'):
        sys.stderr.write('The typescript compiler `tsc` could not be found')
        sys.exit(1)
    elif not shutil.which('sass'):
        sys.stderr.write('The sass compiler `sass` could not be found')
        sys.exit(1)

    write_manifest()

    subprocess.call(['tsc', '-p', 'src'])

    build_path = Path('build')
    if not build_path.is_dir():
        build_path.mkdir()
    for file in Path('src').rglob('*'):
        build_file = build_path.joinpath(str(file)[4:])
        if file.is_dir():
            if not build_file.exists():
                build_file.mkdir(parents=True)
        elif file.suffix == '.sass':
            css_file = str(file)[:-4] + 'css'
            subprocess.call(['sass', '--no-source-map', file, css_file])
            shutil.copy(css_file, str(build_path.joinpath(css_file[4:])))
        elif file.name == 'tsconfig.json':
            continue
        elif file.suffix != '.ts':
            shutil.copy(str(file), str(build_file))


def clean_build():
    for file in Path('src').rglob('*'):
        if file.suffix in ['.js', '.css', '.map']:
            file.unlink()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-m', '--manifest', action='store_true', help='Builds the manifest.json file for addon information in ./src')
    parser.add_argument('-s', '--supported', action='store_true', help='Builds the SUPPORTED file with all supported domains in the current directory')
    parser.add_argument('-b', '--build', action='store_true', help='Creates a ./build folder and builds all typescript / sass files')
    parser.add_argument('-c', '--clean', action='store_true', help='Cleans the ./src folder from .js, .css and .map files')

    parsed = parser.parse_args()

    if parsed.manifest:
        write_manifest()
    if parsed.supported:
        write_supported()
    if parsed.build:
        copy_built()
    if parsed.clean:
        clean_build()

    if not parsed.manifest and not parsed.supported and not parsed.build and not parsed.clean:
        print('\n'.join(load_matches()))
