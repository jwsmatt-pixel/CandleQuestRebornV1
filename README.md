# Candle Quest Reborn v1


- 90-second runs
- instant start
- freeze-and-answer gameplay
- mobile-friendly UI
- five simple worlds
- XP unlocks
- cosmetic skins
- no overloaded menus
- trading concepts taught through repetition and gameplay

## How to run

Double click `START_GAME.bat`, then open:

http://127.0.0.1:8123

Or open `index.html` directly in a browser.


## iOS Friendly Build

This version adds:

- iPhone safe-area support
- touch-first buttons
- mobile sticky answer pad
- no zoom/double-tap accidents during play
- PWA manifest
- Apple mobile web app meta tags
- Apple touch icon
- install tip for Safari

## Running on iPhone

Recommended:
1. Upload the folder to any simple static web host.
2. Open `index.html` in Safari.
3. Tap Share.
4. Tap Add to Home Screen.

Local testing:
- Run the server from your PC with `START_GAME.bat`.
- Make sure your iPhone is on the same Wi‑Fi.
- Open the PC's local network IP address and port in Safari.


## iOS v2 chart visibility fix

- Added right-side future space / bleed to the live candle chart.
- Slightly zoomed out candle spacing.
- Reduced candle body width slightly.
- Prevented mobile canvas cropping by using `object-fit: contain`.
- The final freeze/question candles should now remain visible inside the frame.


## iOS v3 price-action engine

This version tightens the live candle simulation:

- Support/resistance and midpoint are now stable per run instead of recalculated randomly.
- Range worlds now mean-revert near support/resistance.
- Trend worlds now drift directionally with controlled pullbacks.
- Forced quiz scenarios now form near the correct market location.
- Breakouts, fakeouts, support reclaims and resistance rejections are more deliberate.
- Candle wicks are less chaotic and more proportional.
- Range High / Midpoint / Range Low labels are shown directly on the chart.


## iOS v4 flat candle renderer

This version fixes the “flying saucer” candle issue:

- Candle bodies are now flat rectangles instead of rounded rectangles.
- Thin candle bodies no longer turn into oval/capsule shapes.
- Wicks are drawn as crisp vertical lines with flat line caps.
- Candle outlines are cleaner on iPhone screens.
