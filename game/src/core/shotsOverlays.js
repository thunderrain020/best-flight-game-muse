// CALDERA COURIER — core/shotsOverlays.js
// The staged overlay shots: the hangar briefing hub (prep), the
// between-leg hangar draft (rush) and the victory debrief (upgrades).
// Each builds a real game state through the same systems the player
// uses, then freezes it — the render loop draws the staged state
// exactly as it draws live play.
import { base } from './shotsUtil.js';
import { rollDraft } from '../systems/draft.js';
import { PERKS } from '../data/perks.js';

/** 2-prep-timing: hangar & flight briefing hub, leg S1, saves full. */
export function setupPrep() {
  const g = base(0);
  g.mode = 'brief'; g.screen = 'brief';
  g.difficulty = 'Standard';
  g.score = 0;
  // Demo save slots, so the hub shows SAVED RUNS (3/3).
  g.saves = [
    { seed: 4217, leg: 2, score: 6840, perks: [], feats: [], difficulty: 'Standard', when: 0 },
    { seed: 1337, leg: 4, score: 9420, perks: [], feats: [], difficulty: 'Hard', when: 0 },
    { seed: 9021, leg: 6, score: 12840, perks: [], feats: [], difficulty: 'Standard', when: 0 },
  ];
  return g;
}

/** 3-rush-combo: hangar draft after leg S3, 3 perks on offer. */
export function setupRush() {
  const g = base(2);
  g.mode = 'draft'; g.screen = 'draft';
  g.legScore = 3120; g.score = 6840;
  g.legTime = 178;
  g.goals[0].done = true; g.goals[0].progress = g.goals[0].target;
  g.goals[1].done = true; g.goals[1].progress = 1;
  g.perks = ['P01', 'P07', 'P13', 'P02'];
  g.rerolls = 1;
  g.stats.rings = 21; g.stats.center = 4; g.stats.perfect = 2; g.stats.landings = 3;
  g.contractsDone = 3;
  rollDraft(g);
  // A fixed, handsome trio on offer: Mythic, Rare and Mythic.
  g.draft.choices = ['P05', 'P10', 'P17'].map((id) => PERKS.find((p) => p.id === id));
  return g;
}

/** 4-upgrades-recipes: victory debrief, grade S, full campaign. */
export function setupUpgrades() {
  const g = base(6);
  g.mode = 'debrief'; g.screen = 'debrief';
  g.score = 12840; g.timer = 1240;
  g.stats.rings = 57; g.stats.center = 11; g.stats.perfect = 5;
  g.stats.landings = 7; g.stats.maxAlt = 980; g.stats.topSpeed = 208;
  g.contractsDone = 6;
  g.perks = ['P01', 'P02', 'P05', 'P07', 'P09', 'P11', 'P13', 'P16'];
  g.featsDone = ['F01', 'F02', 'F03', 'F05', 'F06', 'F08', 'F10', 'F18'];
  g.debrief = {
    grade: 'S', score: 12840, best: 12840,
    feats: g.featsDone,
    legs: [
      { id: 'S1', score: 1420, alt: 420 }, { id: 'S2', score: 1680, alt: 560 },
      { id: 'S3', score: 1540, alt: 610 }, { id: 'S4', score: 1960, alt: 780 },
      { id: 'S5', score: 1830, alt: 700 }, { id: 'S6', score: 2010, alt: 880 },
      { id: 'S7', score: 2400, alt: 980 },
    ],
  };
  return g;
}
