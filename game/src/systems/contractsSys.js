// CALDERA COURIER — systems/contractsSys.js
// One active contract + one modifier per sortie, drawn from the seeded
// deck. Completing the contract's condition pays mail on landing.
import { CONTRACTS, MODIFIERS } from '../data/contracts.js';
import { mulberry32, pick } from '../core/rng.js';

export function drawSortie(g) {
  const rng = mulberry32(g.seed * 17 + g.leg * 29 + 3);
  g.contract = pick(rng, CONTRACTS);
  g.modifier = pick(rng, MODIFIERS);
  return g.contract;
}
export function contractDone(g) {
  // Most contracts complete by landing with their goal met; ring and
  // stunt contracts complete live. This is the landing-time check.
  const c = g.contract;
  if (!c) return false;
  if (c.kind === 'rings') return g.goals[0].done;
  if (c.kind === 'land') return g.stats.perfect > 0 || g.plane.landed;
  return g.plane.landed; // mail / rescue / photo / drop pay on landing
}
export function modifierViolated(g) {
  const m = g.modifier;
  if (!m) return false;
  const p = g.plane;
  if (m.id === 'LOW-ALT' && p.y > 400) return true;
  if (m.id === 'FRAGILE' && p.g > 2.5) return true;
  return false;
}
