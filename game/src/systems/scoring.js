// CALDERA COURIER — systems/scoring.js
// Score pays for rings (center pays double), landings, contract pay
// and leg bonuses. GOALS tick live; 2/3 done is the leg bonus.
import { goalsDone } from '../core/state.js';

export function addScore(g, pts, label) {
  g.score += pts; g.legScore += pts;
  if (label) g.callouts.push({ text: label, x: 640, y: 250, t: 0, color: '#ffd94d', big: true });
}
export function ringScore(g, center) {
  const base = center ? 350 : 150;
  const mult = g.momentum.mult;
  const pts = Math.round(base * mult);
  addScore(g, pts, center ? `CENTER RING! +${pts}` : `RING +${pts}`);
  g.stats.rings++;
  if (center) g.stats.center++;
  g.goals[0].progress = Math.min(g.goals[0].target, g.goals[0].progress + 1);
  if (g.goals[0].progress >= g.goals[0].target) g.goals[0].done = true;
}
export function landingScore(g, kind) {
  const pts = kind === 'perfect' ? 500 : 250;
  addScore(g, pts, kind === 'perfect' ? `TOUCHDOWN PERFECT! +${pts}` : `TOUCHDOWN +${pts}`);
  g.stats.landings++;
  if (kind === 'perfect') g.stats.perfect++;
  g.goals[1].done = true; g.goals[1].progress = 1;
}
export function legBonus(g) {
  const done = goalsDone(g);
  const timeBonus = Math.max(0, Math.round((g.legs[g.leg].par - g.legTime) * 4));
  const pts = done * 200 + timeBonus;
  addScore(g, pts, done >= 2 ? `LEG BONUS +${pts}` : `LEG DONE +${pts}`);
  return pts;
}
export function contractScore(g) {
  if (!g.contract) return 0;
  addScore(g, g.contract.pay, `CONTRACT DONE +${g.contract.pay}`);
  g.contractsDone++;
  return g.contract.pay;
}
