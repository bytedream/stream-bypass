# Stream Bypass

A multi-browser addon / extension for multiple streaming providers which redirects directly to the source video.

<p align="center">
  <a href="https://github.com/bytedream/stream-bypass/releases/latest">
    <img src="https://img.shields.io/github/v/release/bytedream/stream-bypass?label=Version&style=flat-square" alt="Version">
  </a>
  <a href="https://addons.mozilla.org/de/firefox/addon/stream-bypass/">
    <img src="https://img.shields.io/amo/users/stream-bypass?label=Firefox%20Users&style=flat-square" alt="Firefox Addon Store">
  </a>
  <a href="https://chromewebstore.google.com/detail/ddfpfjomnakfckhmilacnbokdaknamdb">
    <img src="https://img.shields.io/chrome-web-store/users/ddfpfjomnakfckhmilacnbokdaknamdb?style=flat-square&label=Chrome%20Users" alt="Chrome Store">
  </a>
  <a href="https://github.com/bytedream/stream-bypass/releases/latest">
    <img src="https://img.shields.io/github/downloads/bytedream/stream-bypass/total?label=GitHub%20Downloads&style=flat-square" alt="GitHub Downloads">
  </a>
</p>

<p align="center">
  <a href="#-introduction">Introduction 📝</a>
  •
  <a href="#-installation">Installation 📥</a>
  •
  <a href="#-features">Features ✨</a>
  •
  <a href="#-supported-websites">Supported Websites 📜</a>
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
    <summary><b>How it works:</b></summary>
    <img src="example.gif" alt="">
</details>

## 📥 Installation

### Official browser stores

The best way to install the extension are the official browser extension stores:

- [Firefox Addon Store](https://addons.mozilla.org/de/firefox/addon/stream-bypass/) (Firefox for Android is supported too!)
- [Chrome Web Store](https://chromewebstore.google.com/detail/ddfpfjomnakfckhmilacnbokdaknamdb)

<details>
    <summary><h3 id="manual-installation1">Manual installation</h3></summary>

- Firefox (mv2)
    - Download `stream-bypass-<version>-mv2.zip` from the [latest release](https://github.com/bytedream/stream-bypass/releases/latest) and unzip it (e.g. with [7zip](https://www.7-zip.org/))
    - Go into your browser and type `about:debugging#/runtime/this-firefox` in the address bar
    - Click the `Load Temporary Add-on...` button and choose the `manifest.json` file in the unzipped directory
- Chromium / Google Chrome (mv3)
    > As nearly every browser other than Firefox is based on Chromium, this should be the same for most of them
    - Download `stream-bypass-<version>-mv3.zip` from the [latest release](https://github.com/bytedream/stream-bypass/releases/latest) and unzip it (e.g. [7zip](https://www.7-zip.org/))
    - Go into your browser and type `chrome://extensions` in the address bar
    - Turn on the developer mode by checking the switch in the top right corner
    - Click `Load unpacked` and choose the unzipped directory

</details>

## ✨ Features

- ✔: Supported.
- ✖: Not supported.

| Feature                                                                                                                           | Firefox (mv2) | Chrome (mv3) | Firefox for Android (mv2) |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------ | ------------------------- |
| Replace site-speicifc video player with browser native video player                                                               | ✔             | ✔            | ✔                         |
| Support websites that are accessed via a redirect                                                                                 | ✔             | ✖            | ✔                         |
| Open video in mpv (with [ff2mpv](https://github.com/bytedream/stream-bypass/tree/master#ff2mpv-use-mpv-to-directly-play-streams)) | ✔             | ✔            | ✖                         |

## 📜 Supported websites

- ✔: Everything ok.
- ⚠: Works with limitations.
- ✖: Not supported.

| Site                                                                  | Firefox & Firefox for Android (mv2)                                                     | Chrome & Chromium based (mv2)                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [dropload.io](https://dropload.io)                                    | ✔                                                                                       | ✔                                                                                       |
| [doodstream.com](doodstream.com) / [dood.pm](https://dood.pm)         | ✔                                                                                       | ⚠ (redirect probably required)                                                          |
| [filemoon.to](https://filemoon.to)                                    | ✔                                                                                       | ✔                                                                                       |
| [goodstream.uno](https://goodstream.uno)                              | ✔                                                                                       | ✔                                                                                       |
| [kwik.cx](https://kwik.cx)                                            | ✔                                                                                       | ✔                                                                                       |
| [loadx.ws](https://loadx.ws)                                          | ✔                                                                                       | ✖ (background request always required)                                                  |
| [luluvdo.com](https://luluvdo.com)                                    | ✔                                                                                       | ✖ (background request always required)                                                  |
| [mixdrop.co](https://mixdrop.co)                                      | ✔ ️                                                                                      | ✔                                                                                       |
| [mp4upload.com](https://mp4upload.com)                                | ✔                                                                                       | ✔                                                                                       |
| [newgrounds.com](https://newgrounds.com)                              | ✔                                                                                       | ✔                                                                                       |
| [streama2z.com](https://streama2z.com)                                | ✔                                                                                       | ✖ (redirect always required)                                                            |
| [streamtape.com](https://streamtape.com)                              | ⚠ (correct video url can't always be extract, retrying/reloading the page might fix it) | ⚠ (correct video url can't always be extract, retrying/reloading the page might fix it) |
| [streamzz.to](https://streamzz.to) / [streamz.ws](https://streamz.ws) | ✔                                                                                       | ✔                                                                                       |
| [supervideo.tv](https://supervideo.tv)                                | ✔                                                                                       | ✔                                                                                       |
| [upstream.to](https://upstream.to)                                    | ✔                                                                                       | ✔                                                                                       |
| [vidmoly.to](https://vidmoly.me)                                      | ✔                                                                                       | ✔                                                                                       |
| [vidoza.net](https://vidoza.net)                                      | ✔                                                                                       | ✔                                                                                       |
| [voe.sx](https://voe.sx)                                              | ✔                                                                                       | ✖ (redirect always required)                                                            |
| [vupload.com](https://vupload.com)                                    | ✔                                                                                       | ✔                                                                                       |

_This table might not be 100% accurate, it isn't actively monitored if the addon works for every website!_

Some sites put much effort in obfuscating their code / how they receive the video stream so that it simply cost too much time for me to reverse engineer it and find out how to bypass the native video player of the site.

## 🛠️ Building

If you want to build the addon from source and not using the way described in [installation](#-installation), follow the instructions.

Requirements:

- `npm` installed.
- A copy of this repository and a shell / console open in the copied directory.

If the requirements are satisfied, you can continue with the following commands:

```shell
# install all dependencies
$ npm i

# build the extension and start it in a new firefox instance
$ npm run dev:firefox

# build the extension with optimizations to the .output/firefox-mv2 directory
$ npm run build:firefox
```

You can omit the `:firefox` suffix, then it's built for Chrome.

##### Install

If you want to use the addon in Chromium or any browser which is based on it, follow the steps in the [manual installation](#-installation).
When using firefox, use the following:

1. Type `about:debugging` in the browser's address bar.
2. Select 'This Firefox' tab (maybe named different, depending on your language).
3. Under `Temporary Extensions`, click `Load Temporary Add-on`.
4. Choose any file in the directory where the compiled sources are.

## ⚙️ Settings

> You reach the settings by pressing the tree dots (⋮) in the top right corner of the extension popup.

### Hosts

You can enable or disabled for which hosts the extension should redirect.

### ff2mpv

[ff2mpv](https://github.com/woodruffw/ff2mpv) allows you to play streams directly in [mpv](https://mpv.io/) instead of the browser.
You can enable or disable this behavior.

<details>
    <summary><i>Steps to get it set up</i></summary>

- In the [Usage](https://github.com/woodruffw/ff2mpv#usage) section of the ff2mpv repository pick the installation instruction for your operating system (Linux/Windows/macOS; you do not need the browser addon).
- Scroll down to `Install manually`
- Follow instructions for Firefox/Chrome
- Edit the `ff2mpv.json` you created:
    - Firefox: Add `{55dd42e8-3dd9-455a-b4fe-86664881b10c}` to `allowed_extensions`:

        ```
        "allowed_extensions": [
          "ff2mpv@yossarian.net",
          "{55dd42e8-3dd9-455a-b4fe-86664881b10c}"
        ]
        ```

    - Chrome/Chromium: - Go To: Settings -> Extensions - Click on `Details` of the Stream Bypass extension and copy the ID - Add `chrome-extension://ddfpfjomnakfckhmilacnbokdaknamdb/` to `allowed_origins`:
        ```
        "allowed_origins": [
          "chrome-extension://ephjcajbkgplkjmelpglennepbpmdpjg/",
          "chrome-extension://ddfpfjomnakfckhmilacnbokdaknamdb/"
        ]
        ```

</details>

## ⚖ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for more details.
