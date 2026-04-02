# RetroTerm

A Chrome extension that turns GitHub, Hack Club, and Carnival into amber CRT terminal experiences. Scanlines, pixel fonts, boot sequences, the whole deal.

![GitHub with RetroTerm](icons/screenshot/Screenshot%202026-04-02%20212454.png)

## What it does

RetroTerm slaps a retro amber monochrome filter on top of three websites:

- **GitHub** - full CSS variable override, amber syntax highlighting, filtered images
- **Hack Club** - html-level amber filter that tints everything without breaking layout
- **Carnival** (carnival.hackclub.com) - same amber treatment plus glowing hero text

Every site gets:
- VT323 + Press Start 2P pixel fonts
- CRT scanline overlay
- Screen vignette (dark corners like curved glass)
- Phosphor flicker animation
- A boot screen that types out lines like an old terminal booting up
- Blinking cursor on focused inputs

![Hack Club hero](icons/screenshot/Screenshot%202026-04-02%20212314.png)

## Popup controls

Click the extension icon and you get a retro-styled control panel with:

- Master power toggle (kills everything)
- Per-site toggles (GitHub, Hackclub, Carnival individually)
- Amber intensity slider (30-100%)
- Scanline intensity slider (0-80%)
- Status bar showing how many sites are active

![Popup](icons/screenshot/Screenshot%202026-04-02%20212242.png)

## How to install

### From GitHub releases

1. Go to the [Releases](https://github.com/maverickkamal/RetroTerm/releases) page
2. Download the latest `.zip` file
3. Unzip it somewhere on your computer
4. Open Chrome and go to `chrome://extensions`
5. Turn on "Developer mode" (top right toggle)
6. Click "Load unpacked"
7. Select the unzipped folder
8. Done. Go to github.com and watch it boot up

### From cloning the repo

```bash
git clone https://github.com/maverickkamal/RetroTerm.git
```

1. Open Chrome, go to `chrome://extensions`
2. Turn on "Developer mode"
3. Click "Load unpacked"
4. Select the cloned `RetroTerm` folder
5. That's it

## Screenshots

### Carnival

![Carnival](icons/screenshot/Screenshot%202026-04-02%20212256.png)

### Hack Club (scrolled)

![Hack Club scrolled](icons/screenshot/Screenshot%202026-04-02%20212332.png)

### GitHub

![GitHub](icons/screenshot/Screenshot%202026-04-02%20212454.png)

## How the toggle works

CSS is NOT declared in the manifest. Instead, when you load a page:

1. JS checks `chrome.storage.sync` for your toggle settings
2. If the site is enabled, JS injects the CSS files as `<link>` tags
3. If disabled, nothing happens. The site loads normally
4. Flipping a toggle in the popup triggers a page reload

This means toggling off actually gives you the original site back, not some half-broken revert.

