// CALDERA COURIER — entities/terrain.js
// The volcanic archipelago: a deterministic heightfield. Sea is 0;
// islands rise as smooth ridges, the caldera cone glows at the far end.
// One function drives the render, the flight floor and the runway pads.
import { smoothNoise, clamp } from '../core/util.js';

/** The volcano cone centre (world units). */
export const VOLCANO = { x: 320, z: 5200, r: 620, h: 300 };
/** The cliffside runway pad of the finale. */
export const CLIFF = { x: -260, z: 6100 };

function island(x, z) {
  // A chain of islands marching north; each is a soft gaussian bump
  // with terraced ridges carved by noise.
  let h = 0;
  const chain = [
    { x: -180, z: 900, r: 420, h: 90 }, { x: 260, z: 1500, r: 380, h: 120 },
    { x: -320, z: 2200, r: 460, h: 150 }, { x: 120, z: 2900, r: 400, h: 130 },
    { x: -80, z: 3600, r: 520, h: 170 }, { x: 380, z: 4300, r: 420, h: 140 },
    { x: -260, z: 6100, r: 500, h: 110 },
  ];
  for (const isl of chain) {
    const dx = (x - isl.x) / isl.r, dz = (z - isl.z) / isl.r;
    const d2 = dx * dx + dz * dz;
    if (d2 < 4) h += isl.h * Math.exp(-d2 * 1.4);
  }
  // Terraced ridges: stepped noise so the slopes read as farmland.
  const ridge = smoothNoise(x * 0.004, z * 0.004);
  h += Math.max(0, ridge) * 26 * Math.exp(-Math.abs(x) / 900);
  return h;
}

export function groundHeight(x, z) {
  let h = island(x, z);
  const dx = (x - VOLCANO.x) / VOLCANO.r, dz = (z - VOLCANO.z) / VOLCANO.r;
  const d2 = dx * dx + dz * dz;
  if (d2 < 2.2) h += VOLCANO.h * Math.exp(-d2 * 1.1);
  // Gentle swell far out so the sea is never a flat sheet.
  h += smoothNoise(x * 0.002 + 7, z * 0.002) * 6;
  return Math.max(-14, h);
}

/** Terrain colour at a point: sea, sand, grass terraces, rock, lava. */
export function groundColor(x, z, h) {
  const dx = x - VOLCANO.x, dz = z - VOLCANO.z;
  const dv = Math.sqrt(dx * dx + dz * dz);
  if (h <= 2) return '#1d5f8a'; // cobalt sea
  if (h <= 8) return '#d9c48f'; // sand
  if (dv < 260 && h > 180) return '#ff5a26'; // glowing lava rim
  if (dv < 420 && h > 120) return '#5a3a34'; // dark volcanic rock
  if (h > 150) return '#6b5a4a'; // high rock
  // Terraced emerald: bands by height so ridges read as steps.
  const band = Math.floor(h / 34) % 2 === 0;
  return band ? '#3f9e4d' : '#2f7d3c';
}
export const isSea = (x, z) => groundHeight(x, z) <= 2;
export const clampAlt = (y) => clamp(y, 8, 1400);
