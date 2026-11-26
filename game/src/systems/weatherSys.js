// CALDERA COURIER — systems/weatherSys.js
// Weather rolls per leg from the seeded RNG: rain streaks, ash fall,
// crosswind gusts and the HUD banner. It also spawns the particles
// the renderer draws around the aircraft.
import { WEATHER } from '../data/weather.js';
import { pick } from '../core/rng.js';
import { mulberry32 } from '../core/rng.js';

export function rollWeather(g) {
  const rng = mulberry32(g.seed * 7 + g.leg * 13 + 5);
  const leg = g.legs[g.leg];
  let w;
  if (leg.sky === 'night') w = WEATHER[4];
  else if (leg.sky === 'storm') w = pick(rng, [WEATHER[2], WEATHER[3]]);
  else if (leg.sky === 'ash') w = pick(rng, [WEATHER[1], WEATHER[5]]);
  else w = pick(rng, [WEATHER[0], WEATHER[0], WEATHER[3]]);
  g.weather = w;
  g.event = { name: w.name, bonus: w.desc };
  return w;
}
export function weatherTick(g, dt) {
  const w = g.weather;
  if (!w) return;
  const p = g.plane;
  // Rain / ash drift past the canopy: spawn a few streaks per frame.
  const n = w.rain ? 3 : w.ash ? 2 : 0;
  for (let i = 0; i < n; i++) {
    g.particles.push({
      x: p.x + (Math.random() - 0.5) * 120, y: p.y + (Math.random() - 0.5) * 60,
      z: p.z + 60 + Math.random() * 80, vx: 0, vy: w.rain ? -90 : -12,
      vz: -p.speed * 0.4, life: 1.2, kind: w.rain ? 'rain' : 'ash',
    });
  }
  if (g.particles.length > 220) g.particles.splice(0, g.particles.length - 220);
}
