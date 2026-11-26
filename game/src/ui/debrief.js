// CALDERA COURIER — ui/debrief.js
// The celebratory flight debrief (upgrades shot): S/A gold wings
// medallion, FEATS and BEST SORTIE pills, 2-column flight stats, a
// labelled per-leg score / altitude bar chart, campaign chronicle
// timeline cards (one per leg, with its weather event cleared), mini
// illustrated perk cards with custom set emblems and names, and the
// PLAY AGAIN / NEW SEED / ENDLESS keys.
import { pill, label, B, R } from './text.js';
import { fmtInt, fmtTime } from '../core/util.js';
import { SETS, PERKS } from '../data/perks.js';
import { FEATS } from '../data/feats.js';
import { drawSetEmblem } from './emblems.js';

const SKY_EVENT = { dawn: 'CLEAR SKIES', day: 'CLEAR SKIES', storm: 'MONSOON SHEAR', ash: 'VOLCANIC ASH PLUME', night: 'NIGHT LIGHTHOUSE' };

export function drawDebrief(ctx, W, H, g) {
  const d = g.debrief || { grade: 'S', score: g.score, legs: [], feats: [], best: g.score };
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#2b3a6e'); grad.addColorStop(0.5, '#ff9e5e'); grad.addColorStop(1, '#1d5f8a');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,217,77,0.7)';
  for (let i = 0; i < 40; i++) {
    const x = (i * 137 + g.time * 12) % W;
    const y = (i * 89) % 200 + 20;
    ctx.fillRect(x, y, 5, 5);
  }
  pill(ctx, 60, 40, W - 120, 640, 'rgba(8,6,12,0.94)');
  label(ctx, 'FLIGHT DEBRIEF — CAMPAIGN COMPLETE', W / 2, 76, B(24), '#ffd94d', 'center');
  // Gold wings medallion, with a clear gap above GOLD WINGS.
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath(); ctx.arc(190, 148, 52, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#8a6420'; ctx.lineWidth = 4; ctx.stroke();
  label(ctx, d.grade, 190, 150, 'bold 44px Georgia, serif', '#1a1206', 'center');
  label(ctx, 'GOLD WINGS', 190, 224, B(13), '#ffd94d', 'center');
  pill(ctx, 280, 126, 170, 34, 'rgba(8,6,12,0.9)', '#7ee0a0');
  label(ctx, `FEATS ${d.feats.length}/${FEATS.length}`, 365, 143, B(14), '#7ee0a0', 'center');
  pill(ctx, 280, 170, 170, 34, 'rgba(8,6,12,0.9)', '#ffb52e');
  label(ctx, `BEST SORTIE ${fmtInt(d.best)}`, 365, 187, B(13), '#ffb52e', 'center');
  // 2-column flight stats.
  const statsL = [
    ['FINAL SCORE', fmtInt(d.score)],
    ['RINGS PASSED', String(g.stats.rings)],
    ['CENTER RINGS', String(g.stats.center)],
    ['PERFECT LANDINGS', String(g.stats.perfect)],
  ];
  const statsR = [
    ['TIME', fmtTime(g.timer)],
    ['MAX ALTITUDE', `${Math.round(g.stats.maxAlt)} FT`],
    ['TOP SPEED', `${Math.round(g.stats.topSpeed)} KTS`],
    ['CONTRACTS DONE', String(g.contractsDone)],
  ];
  statsL.forEach(([k, v], i) => {
    label(ctx, k, 500, 120 + i * 26, B(13), '#9fd8e8');
    label(ctx, v, 730, 120 + i * 26, B(14), '#f5eeda');
  });
  statsR.forEach(([k, v], i) => {
    label(ctx, k, 810, 120 + i * 26, B(13), '#9fd8e8');
    label(ctx, v, 1040, 120 + i * 26, B(14), '#f5eeda');
  });
  // Per-leg score & altitude bar chart, labelled with names + values.
  label(ctx, 'PER-LEG SCORE & ALTITUDE', 100, 256, B(15), '#ffd94d');
  const legs = d.legs.length ? d.legs : g.legs.map((l) => ({ id: l.id, score: 0, alt: 0 }));
  const bw = (W - 240) / 7;
  legs.forEach((lg, i) => {
    const x = 100 + i * bw;
    const sh = Math.min(100, (lg.score || 0) / 40);
    const ah = Math.min(100, (lg.alt || 0) / 8);
    ctx.fillStyle = '#4dc9ff'; ctx.fillRect(x + 8, 372 - sh, bw / 2 - 14, sh);
    ctx.fillStyle = '#ffb52e'; ctx.fillRect(x + bw / 2 + 4, 372 - ah, bw / 2 - 14, ah);
    label(ctx, fmtInt(lg.score || 0), x + bw / 2, 372 - Math.max(sh, ah) - 10, B(11), '#4dc9ff', 'center');
    label(ctx, lg.id, x + bw / 2, 388, B(12), '#f5eeda', 'center');
    label(ctx, `${lg.alt || 0} FT`, x + bw / 2, 406, R(11), '#ffb52e', 'center');
  });
  // Campaign chronicle: one timeline card per leg, weather event cleared.
  label(ctx, 'CAMPAIGN CHRONICLE', 100, 430, B(15), '#ffd94d');
  legs.forEach((lg, i) => {
    const x = 100 + i * 156;
    const short = g.legs[i].name.split('&')[0].trim().toUpperCase();
    pill(ctx, x, 446, 148, 52, 'rgba(245,238,218,0.08)', '#4dc9ff');
    label(ctx, `${lg.id} · ${short}`, x + 74, 460, B(11), '#ffd94d', 'center');
    label(ctx, 'CLEARED ✓', x + 74, 476, B(11), '#7ee0a0', 'center');
    label(ctx, SKY_EVENT[g.legs[i].sky] || 'CLEAR SKIES', x + 74, 490, R(10), '#cfe3f0', 'center');
  });
  // Mini illustrated perk cards: emblem + name, never letter circles.
  label(ctx, 'AIRFRAME — PERKS & SET BONUSES', 100, 516, B(15), '#ffd94d');
  g.perks.slice(0, 8).forEach((id, i) => {
    const perk = PERKS.find((p) => p.id === id);
    if (!perk) return;
    const x = 100 + i * 136;
    pill(ctx, x, 532, 126, 56, 'rgba(245,238,218,0.06)', SETS[perk.set].color);
    drawSetEmblem(ctx, perk.set, x + 63, 550, 12);
    label(ctx, perk.name, x + 63, 576, B(10), '#f5eeda', 'center');
  });
  // Buttons.
  const btns = [['ENTER', 'PLAY AGAIN'], ['N', 'NEW SEED'], ['E', 'ENDLESS']];
  let bx = W / 2 - 240;
  for (const [key, name] of btns) {
    pill(ctx, bx, 620, 150, 40, '#c9973f', '#ffd94d');
    label(ctx, `[${key}] ${name}`, bx + 75, 640, B(13), '#1a1206', 'center');
    bx += 165;
  }
}
