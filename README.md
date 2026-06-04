# Candle Quest Reborn v1

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


## iOS v5 visual + volatility patch

- Aligned the score and time boxes in the game HUD.
- Range High, Midpoint and Range Low are now all labelled more clearly.
- Range Low label is easier to see and no longer gets lost near the bottom.
- Controlled volatility was increased so candles feel less flat and more market-like.
- Support/resistance reactions are stronger.
- Removed double-print behaviour from engulfing scenarios that could create awkward visual gaps.
- Wicks remain flat/crisp from v4.


## iOS v6 range-view + edge-behaviour patch

- The full support/resistance range now stays in frame instead of only one edge showing at a time.
- Y-axis scaling now always includes support, resistance, and candle overshoots together.
- Forced answer candles were softened so they do not teleport across the chart.
- Added a per-candle step cap to prevent giant last-candle jumps.
- Reduced the size of the right-side future/focus space so the chart uses more of the frame.
- Range lines now extend cleanly across the full chart width.


## iOS v7 setup-zone build-up

- Scenarios now have a short 3–4 candle transition before freezing.
- Price is guided toward the relevant area first: range high, midpoint, range low or trend area.
- The chart now highlights the exact setup zone during the freeze.
- This should reduce sudden “teleport” candles and make each question feel more intentional.
- The player is now trained to read location + candle behaviour together.


## iOS v8 signature channel map

This version rolls out the first Candle Quest visual identity feature:

- The chart now uses a clear three-level channel system.
- Range High = solid white line.
- Range Low = solid white line.
- Channel Mean = dashed white line.
- The base game uses neutral white lines so future skins can recolour the same structure.
- The three-level channel is intended to become a core Candle Quest visual signature.
- Freeze language updated toward the branded “Quest Moment” direction.


## iOS v9 live chart price-feel refinement

This version focuses on the feel of live candle movement:

- Added volatility waves so price action breathes between compression and expansion.
- Added controlled momentum memory so candles relate to prior candles.
- Range price action now rotates more naturally between Range High, Channel Mean and Range Low.
- Edge reactions are stronger but less teleport-like.
- Trend worlds now shift the channel gradually rather than forcing price off-screen.
- Setup transitions now step toward the target zone more smoothly.
- A faint pre-Quest setup guide appears before the freeze so the scenario feels constructed.
- Ordinary candles are capped to reduce unrealistic single-candle jumps.


## iOS v10 combined rollout: 8.0 + 9.0

This version rolls out both refinements together.

### 8.0 Live Chart Price Feel
- Smoother candle-to-candle continuity.
- Better volatility waves.
- Less random movement.
- Better channel respect.
- Less teleport-like movement near extremes.

### 9.0 Setup Build-Up Before Quest Moment
- The game now moves through a clearer sequence:
  1. Market runs.
  2. Setup begins forming.
  3. Relevant channel area subtly lights up.
  4. Quest Moment freezes the chart.
  5. User answers.
- Transition candles compress as they reach the target zone.
- The freeze zone label now reads as a Quest Zone.
- The run hint now teaches the user to watch the channel before answering.


## v15 fixed Quest Moment timer

- Built from last known-good v10 chart base.
- Fixes the empty chart regression from previous timer builds.
- Timer shows `—` during replay/setup.
- Quest Moment starts a 7-second timer.
- Run ends after 10 Quest Moments.
- Includes visible `v15 · Fixed Timer` badge to confirm GitHub Pages is serving the latest file.


## v17 summary, streak and reward polish

- Run complete screen now shows a much larger `X/10` correct-read score.
- Summary title tiers:
  - 10/10 = PERFECT RUN
  - 7–9 = Elite Run
  - 4–6 = Good Run
  - 0–3 = Bad Luck
- Added rotating commendation comments for each performance tier.
- Added live streak tracker in the HUD.
- Correct answers under roughly 2 seconds grant a small score bonus and XP bonus.
- Perfect run grants +50 bonus XP.


## v18 XP reward pop

- XP wallet now pulses when XP is awarded.
- Bonus XP creates a visible `+XP` pop next to the main XP tracker.
- Perfect-run and fast-answer bonuses are shown live as a reward pop.
- Run summary now also lists total bonus XP awarded.
