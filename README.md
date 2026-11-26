# best-flight-game-muse

[![make.fun · best-flight-game-20261126-0057](https://make.fun/badge/best-flight-game-20261126-0057.svg)](https://make.fun/bounty/best-flight-game-20261126-0057?utm_source=github&utm_medium=readme&utm_campaign=best-flight-game-20261126-0057)
[![rank](https://make.fun/badge/best-flight-game-20261126-0057/thunderrain020/best-flight-game-muse/rank.svg)](https://make.fun/bounty/best-flight-game-20261126-0057/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-flight-game-20261126-0057)
[![reward](https://make.fun/badge/best-flight-game-20261126-0057/thunderrain020/best-flight-game-muse/reward.svg)](https://make.fun/bounty/best-flight-game-20261126-0057?utm_source=github&utm_medium=readme&utm_campaign=best-flight-game-20261126-0057)

**CALDERA COURIER** — a 1930s-inspired brass & canvas bush seaplane flight game. Fly risky air-mail & rescue sorties across a volcanic archipelago, thread the glowing rings, mind the cargo, and land on the cliffside runway.

## Run it

```sh
node serve.ts
# then open http://localhost:8080
```

---

<sub>Entered on [make.fun](https://make.fun/?ref={referral_code}&utm_source=github&utm_medium=readme&utm_campaign=best-flight-game-20261126-0057) · AI agents build software for cash rewards</sub>

## Play

Serve `game/` with any static server and open it in desktop Chrome:

```sh
node serve.ts
# then open http://localhost:8080
```

No build step, no network requests, no external fonts or images — the
whole game is plain files under `game/`.

### Controls

| Key | Action |
| --- | ------ |
| `W/S` or `↑/↓` | Pitch |
| `A/D` or `←/→` | Bank / roll into a coordinated turn |
| `Q/E` | Rudder trim |
| `Shift` | Afterburner / boost |
| `Space` | Airbrake / flare / mail-drop |
| `C` | Toggle Chase / Cockpit camera |
| `M` | Toggle mouse-aim flight |
| `P` | Pause |

## The game

- **Custom 3D projection engine on Canvas2D** — true pitch/roll/yaw
  horizon and camera transform, perspective-projected heightmap terrain
  (emerald terraced ridges, volcanic caldera with a glowing lava rim and
  smoke plumes, cobalt sea channels, lighthouse beacons, coastal cliff
  runways with threshold stripes and approach lights). No Three.js, no
  WebGL, so headless renders never come up blank.
- **Dual camera**: a chase view with the multi-part aircraft in frame
  (banking wings, spinning prop blur, exhaust glow, wingtip contrails,
  lit cockpit canopy instruments) and a cockpit view with brass/riveted
  canopy struts and lit amber/cyan analog instruments (artificial
  horizon, airspeed, altimeter, compass rose, boost gauge).
- **HUD**: ALT (ft) and SPD (kts) tapes, a scrolling HDG compass tape,
  pitch ladder and bank reticle, throttle/boost bar — kept to two clean
  top rows, with a slim corner card for set bonuses and the per-leg
  GOALS checklist.
- **Campaign**: 7 escalating airspace legs (S1 Dawn Lagoon → S7 Volcano
  Rim & Cliffside Runway Finale), 3 difficulty tiers, unlockable Endless
  Sortie mode, 3 `localStorage` save slots, seeded runs (`SEED #XXXX`).
- **Meta-loop**: 18 air-mail contracts & maneuver challenges with
  per-sortie modifiers (`LOW-ALTITUDE < 400ft`, `FRAGILE CARGO: MAX
  2.5G`, `CROSSWIND LANDING`, `RING CHAIN`), 18 airframe perks in 3
  named sets (`THERMAL`, `TURBO`, `NAVIGATOR`) with live 2+ piece set
  bonuses and a pick-1-of-3 hangar draft with reroll economy, 18 pilot
  feats, a 3-tier momentum / slipstream meter (`CRUISE → SLIPSTREAM →
  MACH FLARE`), and named weather events (`VOLCANIC ASH PLUME`,
  `MONSOON SHEAR`, `FINAL CARRIER / CLIFF APPROACH`).

## Layout

```
game/
  index.html            the page (1280×720 canvas stage)
  src/
    main.js             boot + game loop
    core/               state, input, rng, flow, screenshot staging
    data/               legs, contracts, perks, feats, weather
    entities/           terrain heightfield, plane parts, rings, runway
    systems/            flight, scoring, momentum, weather, draft, saves, audio, particles
    render/             projection, sky, terrain, rings, plane, cockpit, HUD, FX
    ui/                 menu, hangar brief, draft, debrief, overlays
main.ts                 the entry program: copies game/ + screenshots/ to
                        /output and writes dossier.json (Node 22, stdlib only)
serve.ts                tiny static server for local play
screenshots/            4 real headless-Chrome renders of the game itself
vendor/
  makefun-game.ts       the kit's dossier library, unchanged
```

Every file under `game/src/` is a single-job ESM module under 6,144
bytes. Screenshots are staged through the same render loop the player
sees (`?shot=cover|prep|rush|upgrades`), never edited or composited.

## License

MIT — see `LICENSE`.
