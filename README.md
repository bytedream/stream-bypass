# Stream Bypass

A multi-browser addon / extension for multiple streaming providers which redirects directly to the source video.

<p align="center">
  <a href="https://github.com/ByteDream/stream-bypass/releases/latest">
    <img src="https://img.shields.io/github/v/release/ByteDream/stream-bypass?label=Version&style=flat-square" alt="Version">
  </a>
  <a href="https://addons.mozilla.org/de/firefox/addon/stream-bypass/">
    <img src="https://img.shields.io/amo/users/stream-bypass?label=Firefox%20Store%20Downloads&style=flat-square" alt="Firefox Addon Store">
  </a>
  <a href="https://addons.mozilla.org/de/firefox/addon/stream-bypass/">
    <img src="https://img.shields.io/amo/stars/stream-bypass?label=Firefox%20Store%20Stars&style=flat-square" alt="Firefox Addon Stars">
  </a>
  <a href="https://github.com/ByteDream/stream-bypass/releases/latest">
    <img src="https://img.shields.io/github/downloads/ByteDream/stream-bypass/total?label=GitHub%20Downloads&style=flat-square" alt="GitHub Downloads">
  </a>
  <a href="https://discord.gg/gUWwekeNNg">
    <img src="https://img.shields.io/discord/915659846836162561?label=Discord&style=flat-square" alt="Discord">
  </a>
</p>

<p align="center">
  <a href="#-introduction">Introduction 📝</a>
  •
  <a href="#-installation">Installation 📥</a>
  •
  <a href="#-supported-sites">Supported Sites 📜</a>
  •
  <a href="#%EF%B8%8F-building">Building 🛠️</a>
  •
  <a href="#%EF%B8%8F-settings">Settings ⚙️</a>
  •
  <a href="#-license">License ⚖</a>
</p>

## 📝 Introduction

This addon replaces the video player from this sides with the native player build-in into the browser or redirects directly to the source video.
This has the advantage, that no advertising or popups are shown when trying to interact with the video (playing, skipping, ...) or some sites are showing them even if you do nothing.
Additionally, this enables you to download the video by right-clicking it and just choose the download option.

<details id="example">
    <summary><b>How it's working:</b></summary>
    <img src="example.gif" alt="">
</details>

## 📥 Installation

### Firefox

Install the addon directly from the [firefox addon store](https://addons.mozilla.org/de/firefox/addon/stream-bypass/).

### Chromium / Google Chrome

1. Download the zipfile from the [latest release](https://smartrelease.bytedream.org/github/ByteDream/stream-bypass/stream_bypass-{tag}.zip) and unzip it (with [7zip](https://www.7-zip.org/) or something like that).
2. Go into your browser and type `chrome://extensions` in the address bar.
3. Turn the developer mode in the top right corner on.
4. Click Load unpacked.
5. Choose the cloned / unzipped directory.

### Opera

1. Download the zipfile from the [latest release](https://smartrelease.bytedream.org/github/ByteDream/stream-bypass/stream_bypass-{tag}.zip) and unzip it (with [7zip](https://www.7-zip.org/) or something like that).
2. Go into your browser and type `opera://extensions` in the address bar.
3. Turn the developer mode in the top right corner on.
4. Click Load unpacked.
5. Choose the cloned / unzipped directory.

## 📜 Supported sites

| Site                                                                  | Supported | Note                                                                                                         |
|-----------------------------------------------------------------------|-----------|--------------------------------------------------------------------------------------------------------------|
| [doodstream.com](doodstream.com) / [dood.pm](https://dood.pm)         | ✔️        |                                                                                                              |
| [filemoon.sx](https://filemoon.sx)                                    | ✔         |                                                                                                              |
| [mcloud.to](https://mcloud.to/)                                       | ❌         | Reverse engineering the site costs too much time ([#5](https://github.com/ByteDream/stream-bypass/issues/5)) |
| [mixdrop.co](https://mixdrop.co)                                      | ✔ ️       |                                                                                                              |		
| [mp4upload.com](https://mp4upload.com)                                | ✔         |                                                                                                              |
| [newgrounds.com](https://newgrounds.com)                              | ✔         |                                                                                                              |
| [streamtape.com](https://streamtape.com)                              | ✔         |                                                                                                              |
| [streamzz.to](https://streamzz.to) / [streamz.ws](https://streamz.ws) | ✔         |                                                                                                              |
| [upstream.to](https://upstream.to)                                    | ✔         |                                                                                                              |
| [videovard.sx](https://videovard.sx)                                  | ❌         | Reverse engineering the site costs too much time                                                             |
| [vidoza.net](https://vidoza.net)                                      | ✔         |                                                                                                              |
| [vidstream.pro](https://vidstream.pro)                                | ❌         | Reverse engineering the site costs too much time ([#5](https://github.com/ByteDream/stream-bypass/issues/5)) |
| [voe.sx](https://voe.sx)                                              | ✔         |                                                                                                              |
| [vupload.com](https://vupload.com)                                    | ✔         |                                                                                                              |
| [kwik.cx](https://kwik.cx)                                            | ✔         |                                                                                                              |
| [dropload.io](https://dropload.io)                                            | ✔         |                                                                                                              |
| [supervideo.tv](https://supervideo.tv)                                            | ✔         |                                                                                                              |
| [goodstream.uno](https://goodstream.uno)                                            | ✔         |                                                                                                              |

- ✔️: Everything ok.
- ⚠: Included in the addon but will probably not work. See `Note` in this case, an explanation why will stand there in the most cases.
- ❌: Not included / supported by the addon. This can have various reasons. See `Note` for an explanation.

Some sites put much effort in obfuscating their code / how they receive the video stream so that it simply cost too much time for me to reverse engineer it and find out how to bypass the native video player of the site.

<details>
    <summary>Hall of dead sites</summary>
    <ul>
        <li><a href="https://evoload.io">evoload.io</a> - Down</li>
        <li><a href="https://vidlox.me">vidlox.me</a> - Reachable but empty</li>
        <li><a href="https://vivo.sx">vivo.sx</a> - Down</li>
    </ul>
</details>

## 🛠️ Building

If you want to build the addon from source and not using the [installation](#installation) way, follow the instructions.

Requirements:
- `npm` installed.
- A copy of this repository and a shell / console open in the copied directory.

If the requirements are satisfied, you can continue with the following commands:
```shell
# install all dependencies
$ npm install

# build the extension source to a build/ directory
$ npm run build

# same as build + create a bundle zipfile at dist/
$ npm run bundle
```

##### Install

If you want to use the addon in Chromium or any browser which is based on it (almost every other, Google Chrome, Opera, ...), follow the steps in [installation](#-installation).
When using firefox, use the following:
1. Type `about:debugging` in the browser's address bar.
2. Select 'This Firefox' tab (maybe named different, depending on your language).
3. Under `Temporary Extensions`, click `Load Temporary Add-on`.
4. Choose any file in the directory where the compiled sources are.


## ⚙️ Settings

### <ins>ff2mpv: use mpv to directly play streams</ins>
ff2mpv is located at this repository: https://github.com/woodruffw/ff2mpv

Steps to get it set up:
  - In the [Usage](https://github.com/woodruffw/ff2mpv#usage) section of the ff2mpv repository pick the installation instruction for your operating system (Linux/Windows/macOS; you do not need the browser addon).
  - Scroll down to `Install manually`
  - Follow instructions for Firefox/Chrome
  - Edit the `ff2mpv.json` you created:
    - Firefox: Add `{55dd42e8-3dd9-455a-b4fe-86664881b10c}` to `allowed_extensions` -> 
      ```
      "allowed_extensions": [
        "ff2mpv@yossarian.net",
        "{55dd42e8-3dd9-455a-b4fe-86664881b10c}"
      ]
      ```
    - Chrome/Chromium:
      - Go To: Settings -> Extensions
      - Click on `Details` of the Stream Bypass extension and copy the ID
      - Add `chrome-extension://your-id-here/` to `allowed_origins` ->
        ```
        "allowed_origins": [
          "chrome-extension://ephjcajbkgplkjmelpglennepbpmdpjg/",
          "chrome-extension://your-id-her/"
        ]
        ```


## ⚖ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for more details.
