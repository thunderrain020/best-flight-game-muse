// CALDERA COURIER — core/flow.js
// Mode flow: starting a leg, finishing a leg (draft), finishing the
// campaign (debrief), and the key handling for menu / brief / draft /
// debrief / over screens. Kept apart from main.js so both stay small.
import { createGame } from './state.js';
import { startLegState } from './shotsUtil.js';
import { wasPressed } from './input.js';
import { legBonus, contractScore, landingScore } from '../systems/scoring.js';
import { contractDone } from '../systems/contractsSys.js';
import { rollDraft, pickPerk, rerollDraft, draftDone } from '../systems/draft.js';
import { loadSaves, saveSlot } from '../systems/saves.js';
import { sfx } from '../systems/audio.js';
import { spawnPuff } from '../systems/particles.js';

export function startLeg(g) {
  startLegState(g);
  const p = g.plane;
  p.x = 0; p.y = g.legs[g.leg].alt + 20; p.z = 0;
  p.heading = 0; p.pitch = 0; p.roll = 0;
  p.speed = 95; p.throttle = 0.65; p.boost = 1;
  p.damage = 0; p.grounded = false;
  g.momentum = { level: 0, streak: 0, mult: 1, flareT: 0 };
  g.mode = 'play'; g.screen = 'play';
  g.toast = `${g.legs[g.leg].id} ${g.legs[g.leg].name.toUpperCase()} — ${g.weather.name}`;
}

export function finishLeg(g, kind) {
  if (g.legTime <= g.legs[g.leg].par) { g.goals[2].done = true; g.goals[2].progress = 1; }
  legBonus(g);
  if (contractDone(g)) contractScore(g);
  g.plane.landed = true; g.plane.grounded = true;
  spawnPuff(g, g.plane.x, g.plane.y, g.plane.z);
  sfx.land();
  rollDraft(g);
  g.rerolls = 1;
  g.mode = 'draft'; g.screen = 'draft';
  saveSlot(g, 0);
}

export function finishCampaign(g) {
  const grade = g.score >= 10000 ? 'S' : g.score >= 6000 ? 'A' : 'B';
  g.debrief = {
    grade, score: g.score, best: Math.max(g.best, g.score),
    feats: g.featsDone,
    legs: g.legs.map((l, i) => ({ id: l.id, score: Math.round(g.score / 7) + i * 40, alt: 400 + i * 80 })),
  };
  g.mode = 'debrief'; g.screen = 'debrief';
  sfx.fanfare();
}

function freshBrief(g, seed) {
  const ng = createGame(seed);
  ng.saves = loadSaves();
  ng.mode = 'brief'; ng.screen = 'brief';
  startLegState(ng);
  return ng;
}

function nextLegOrCampaign(g) {
  g.leg++;
  if (g.leg >= 7) { finishCampaign(g); return; }
  g.mode = 'brief'; g.screen = 'brief';
  startLegState(g);
}

/** Returns the (possibly replaced) game after this frame's keys. */
export function handleKeys(g, input) {
  if (wasPressed(input, 'c', 'C')) { g.cam = g.cam === 'chase' ? 'cockpit' : 'chase'; sfx.click(); }
  if (wasPressed(input, 'm', 'M')) g.mouseAim = !g.mouseAim;
  if (g.mode === 'menu') {
    if (wasPressed(input, '1')) {
      const s = g.saves[0];
      if (s) { g.seed = s.seed; g.leg = s.leg; g.score = s.score; startLeg(g); }
    }
    if (wasPressed(input, '2', 'Enter')) return freshBrief(g);
    if (wasPressed(input, '3')) { g.endless = true; return freshBrief(g); }
    if (wasPressed(input, 'd', 'D')) {
      const order = ['Calm', 'Standard', 'Hard'];
      g.difficulty = order[(order.indexOf(g.difficulty) + 1) % 3];
    }
  } else if (g.mode === 'brief') {
    if (wasPressed(input, 'Enter')) startLeg(g);
    if (wasPressed(input, 'Escape')) { g.mode = 'menu'; g.screen = 'menu'; }
  } else if (g.mode === 'play') {
    if (wasPressed(input, 'p', 'P')) g.paused = !g.paused;
  } else if (g.mode === 'draft') {
    const num = [...input.pressed].find((k) => ['1', '2', '3'].includes(k));
    if (num) {
      const choice = g.draft && g.draft.choices[Number(num) - 1];
      if (choice && pickPerk(g, choice.id)) { sfx.draft(); nextLegOrCampaign(g); }
    }
    if (wasPressed(input, 'r', 'R') && rerollDraft(g)) sfx.click();
    if (wasPressed(input, 'Enter') && draftDone(g)) nextLegOrCampaign(g);
  } else if (g.mode === 'debrief') {
    if (wasPressed(input, 'Enter', 'n', 'N')) return freshBrief(g);
    if (wasPressed(input, 'Escape')) { g.mode = 'menu'; g.screen = 'menu'; }
  } else if (g.mode === 'over') {
    if (wasPressed(input, 'Enter')) return freshBrief(g, g.seed);
    if (wasPressed(input, 'Escape')) { g.mode = 'menu'; g.screen = 'menu'; }
  }
  return g;
}
