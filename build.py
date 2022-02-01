#!/usr/bin/python3

import argparse
import io
import json
import sys
import urllib.request
import zipfile
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
                if not line.strip().startswith('//'):
                    matched.append(match[0])
            else:
                break

    return matched


def write_manifest():
    matches = load_matches()
    manifest = json.load(open('src/manifest.json', 'r'))

    for content_script in manifest['content_scripts']:
        content_script['matches'] = [f'*://{match}/*' for match in matches]

    json.dump(manifest, open('src/manifest.json', 'w'), indent=2)


def write_supported():
    open('SUPPORTED', 'w').writelines([f'{match}\n' for match in load_matches()])


def write_readme():
    firefox_pattern = re.compile(r'Mozilla Firefox (?P<version>.+)')
    chromium_pattern = re.compile(r'(?P<version>\d+\.\d+)')
    tested = {}

    stdout, stderr = subprocess.Popen(['firefox', '--version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()
    if stderr == b'':
        tested['Firefox'] = re.search(firefox_pattern, stdout.decode('utf-8').replace('\n', '')).group('version')

    for command, name in {'chromium': 'Ungoogled Chromium', 'vivaldi-stable': 'Vivaldi', 'opera': 'Opera'}.items():
        stdout, stderr = subprocess.Popen([command, '--version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()
        if stderr == b'':
            tested[name] = re.search(chromium_pattern, stdout.decode('utf-8').replace('\n', '')).group('version')

    # it this the right syntax if i want to read and write to a file? * dreams in python3.10 *
    with open('README.md', 'r') as read_file:
        readme = read_file.read()

        # adds all available websites
        all_providers_regex = r'(?<=<ul>\n)(.+?)(?=</ul>)'
        domains = filter(lambda domain: domain != '', open('SUPPORTED', 'r').read().split('\n'))
        all_providers = '\n'.join(f'\t\t<li><a href="https://{supported}">{supported}</a></li>' for supported in domains)
        readme = re.sub(all_providers_regex, all_providers, readme, flags=re.DOTALL)

        # adds all installed browsers to the tested browser section. i'm just to lazy to seek out all browser versions manually
        tested_browsers_regex = r'(?<=The addon was tested on\n)(.+?)(?=\n*## Installing)'
        tested_browsers = '\n'.join(f'- {name} ({version})' for name, version in tested.items())
        readme = re.sub(tested_browsers_regex, tested_browsers, readme, flags=re.DOTALL)

        # rewrite the readme
        with open('README.md', 'w') as write_file:
            write_file.write(readme)
            write_file.close()
        read_file.close()


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

    ext_path = Path('build', 'ext')
    if not ext_path.is_dir():
        ext_path.mkdir()

    # download hls.js (version 1.1.1)
    with zipfile.ZipFile(io.BytesIO(urllib.request.urlopen('https://github.com/video-dev/hls.js/releases/download/v1.1.1/release.zip').read())) as z:
        open(ext_path.joinpath('hls.light.min.js'), 'wb').write(z.read('dist/hls.light.min.js'))
        z.close()

    # download popperjs core (version 2.10.2)
    open(ext_path.joinpath('popper.min.js'), 'wb').write(urllib.request.urlopen('https://unpkg.com/@popperjs/core@2.10.2/dist/umd/popper.min.js').read())

    # download tippy.js (version 6.3.7)
    open(ext_path.joinpath('tippy-bundle.umd.min.js'), 'wb').write(urllib.request.urlopen('https://unpkg.com/tippy.js@6.3.7/dist/tippy-bundle.umd.min.js').read())


def clean_build():
    for file in Path('src').rglob('*'):
        if file.suffix in ['.js', '.css', '.map']:
            file.unlink()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-m', '--manifest', action='store_true', help='Builds the manifest.json file for addon information in ./src')
    parser.add_argument('-r', '--readme', action='store_true', help='Updates the README.md with the currently installed ')
    parser.add_argument('-s', '--supported', action='store_true', help='Builds the SUPPORTED file with all supported domains in the current directory')
    parser.add_argument('-b', '--build', action='store_true', help='Creates a ./build folder and builds all typescript / sass files')
    parser.add_argument('-c', '--clean', action='store_true', help='Cleans the ./src folder from .js, .css and .map files')

    parsed = parser.parse_args()

    if parsed.manifest:
        write_manifest()
    if parsed.readme:
        write_readme()
    if parsed.supported:
        write_supported()
    if parsed.build:
        copy_built()
    if parsed.clean:
        clean_build()

    if not parsed.manifest and not parsed.supported and not parsed.build and not parsed.clean:
        print('\n'.join(load_matches()))
