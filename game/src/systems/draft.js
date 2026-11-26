// CALDERA COURIER — systems/draft.js
// The between-leg hangar draft: pick 1 of 3 airframe perks, with one
// reroll per leg. Rarity is weighted by the seeded deck.
import { PERKS, RARITY_COLOR } from '../data/perks.js';
import { mulberry32, shuffle } from '../core/rng.js';

export function rollDraft(g) {
  const rng = mulberry32(g.seed * 23 + g.leg * 41 + g.score + 9);
  const pool = shuffle(rng, PERKS.filter((p) => !g.perks.includes(p.id)));
  const three = pool.slice(0, 3);
  g.draft = { choices: three, picked: null };
  return g.draft;
}
export function pickPerk(g, id) {
  if (!g.draft || g.draft.picked) return false;
  const perk = g.draft.choices.find((p) => p.id === id);
  if (!perk) return false;
  g.perks.push(id);
  g.draft.picked = id;
  g.callouts.push({ text: `${perk.name} fitted!`, x: 640, y: 300, t: 0, color: RARITY_COLOR[perk.rarity], big: true });
  return true;
}
export function rerollDraft(g) {
  if (g.rerolls <= 0 || !g.draft) return false;
  g.rerolls--;
  rollDraft(g);
  return true;
}
export const draftDone = (g) => !!(g.draft && g.draft.picked);
