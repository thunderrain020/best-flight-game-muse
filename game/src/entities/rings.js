// CALDERA COURIER — entities/rings.js
// Target rings: glowing hoops strung along the leg's flight path.
// Pass through the hoop (near its plane, inside its radius) to score;
// dead-center passes pay the CENTER RING! bonus.
import { mulberry32 } from '../core/rng.js';
import { groundHeight } from './terrain.js';

export function makeRings(seed, leg, startZ) {
  const rng = mulberry32(seed * 31 + leg.rings * 7 + 11);
  const rings = [];
  let x = 0;
  for (let i = 0; i < leg.rings; i++) {
    x += (rng() - 0.5) * 260;
    x = Math.max(-320, Math.min(320, x));
    const z = startZ + 420 + i * 560;
    const ground = groundHeight(x, z);
    const y = Math.max(ground + 90, leg.alt + (rng() - 0.5) * 90);
    rings.push({ x, y, z, r: 26, passed: false, center: false, idx: i });
  }
  return rings;
}
/** Distance from the plane to the ring's plane, and radial offset. */
export function ringGap(plane, ring) {
  const dz = plane.z - ring.z;
  const dx = plane.x - ring.x, dy = plane.y - ring.y;
  return { along: dz, radial: Math.sqrt(dx * dx + dy * dy) };
}
/** True when the plane just crossed this ring's plane inside the hoop. */
export function ringPassed(plane, prevZ, ring) {
  if (ring.passed) return null;
  const crossed = (prevZ - ring.z) * (plane.z - ring.z) <= 0 && Math.abs(plane.z - ring.z) < 60;
  if (!crossed) return null;
  const dx = plane.x - ring.x, dy = plane.y - ring.y;
  const radial = Math.sqrt(dx * dx + dy * dy);
  if (radial > ring.r) return null;
  ring.passed = true;
  ring.center = radial < ring.r * 0.35;
  return ring.center ? 'center' : 'pass';
}
export const ringsLeft = (rings) => rings.filter((r) => !r.passed).length;
export const nextRing = (rings) => rings.find((r) => !r.passed) || null;
