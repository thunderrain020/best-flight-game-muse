// CALDERA COURIER — entities/runway.js
// Coastal cliff runways: a striped strip on a flattened pad at the end
// of each leg, with approach lights and a lighthouse beacon nearby.
import { groundHeight } from './terrain.js';
import { CLIFF } from './terrain.js';

export function makeRunway(legIndex, startZ) {
  // Legs 1-6 end on a coastal strip; the finale ends on the cliff pad.
  const finale = legIndex >= 6;
  const x = finale ? CLIFF.x : (legIndex % 2 === 0 ? -140 : 160);
  const z = startZ + 420 + 10 * 560 + 500;
  const y = Math.max(groundHeight(x, z), 6) + (finale ? 26 : 0);
  return {
    x, y, z, heading: 0, length: 260, width: 46,
    finale, lights: finale ? 'cliff' : 'coast',
  };
}
/** True when the plane is over the strip, low, slow and level. */
export function landingCheck(plane, runway) {
  const dx = plane.x - runway.x, dz = plane.z - runway.z;
  const along = Math.abs(dz) < runway.length / 2;
  const across = Math.abs(dx) < runway.width / 2 + 12;
  const height = plane.y - runway.y;
  const slow = plane.speed < 62;
  const level = Math.abs(plane.pitch) < 0.22 && Math.abs(plane.roll) < 0.35;
  if (!along || !across) return null;
  if (height < 4 && slow && level) return plane.speed < 42 ? 'perfect' : 'landed';
  if (height < 4) return 'hard';
  return null;
}
export const runwayDist = (plane, runway) => Math.max(0, runway.z - plane.z);
