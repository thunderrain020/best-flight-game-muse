// CALDERA COURIER — ui/debrief.js
// The celebratory flight debrief (upgrades shot): S/A gold wings
// medallion, FEATS pill, 2-column flight stats, per-leg score /
// altitude bar chart, campaign chronicle strip, perks & set-bonus icon
// strip, BEST SORTIE pill and the PLAY AGAIN / NEW SEED / ENDLESS keys.
import { pill, label, B, R } from './text.js';
import { fmtInt, fmtTime } from '../core/util.js';
import { SETS, PERKS } from '../data/perks.js';

export function drawDebrief(ctx, W, H, g) {
  const d = g.debrief || { grade: 'S', score: g.score, legs: [], feats: [], best: g.score };
  // Celebration backdrop: dawn sky + confetti dots.
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
  // Gold wings medallion.
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath(); ctx.arc(190, 150, 52, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#8a6420'; ctx.lineWidth = 4; ctx.stroke();
  label(ctx, d.grade, 190, 152, 'bold 44px Georgia, serif', '#1a1206', 'center');
  label(ctx, 'GOLD WINGS', 190, 214, B(13), '#ffd94d', 'center');
  pill(ctx, 280, 126, 150, 34, 'rgba(8,6,12,0.9)', '#7ee0a0');
  label(ctx, `FEATS ${d.feats.length}`, 355, 143, B(14), '#7ee0a0', 'center');
  pill(ctx, 280, 170, 150, 34, 'rgba(8,6,12,0.9)', '#ffb52e');
  label(ctx, `BEST SORTIE ${fmtInt(d.best)}`, 355, 187, B(13), '#ffb52e', 'center');
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
    label(ctx, k, 470, 120 + i * 26, B(13), '#9fd8e8');
    label(ctx, v, 700, 120 + i * 26, B(14), '#f5eeda');
  });
  statsR.forEach(([k, v], i) => {
    label(ctx, k, 780, 120 + i * 26, B(13), '#9fd8e8');
    label(ctx, v, 1010, 120 + i * 26, B(14), '#f5eeda');
  });
  // Per-leg score / altitude bar chart.
  label(ctx, 'PER-LEG SCORE & ALTITUDE', 100, 250, B(15), '#ffd94d');
  const legs = d.legs.length ? d.legs : g.legs.map((l, i) => ({ id: l.id, score: 0, alt: 0 }));
  const bw = (W - 240) / 7;
  legs.forEach((lg, i) => {
    const x = 100 + i * bw;
    const sh = Math.min(120, (lg.score || 0) / 40);
    const ah = Math.min(120, (lg.alt || 0) / 8);
    ctx.fillStyle = '#4dc9ff'; ctx.fillRect(x + 8, 380 - sh, bw / 2 - 14, sh);
    ctx.fillStyle = '#ffb52e'; ctx.fillRect(x + bw / 2 + 4, 380 - ah, bw / 2 - 14, ah);
    label(ctx, lg.id, x + bw / 2, 398, B(12), '#f5eeda', 'center');
    label(ctx, fmtInt(lg.score || 0), x + bw / 2, 380 - Math.max(sh, ah) - 10, B(11), '#4dc9ff', 'center');
  });
  // Campaign chronicle strip.
  label(ctx, 'CAMPAIGN CHRONICLE', 100, 440, B(15), '#ffd94d');
  pill(ctx, 100, 456, W - 200, 44, 'rgba(245,238,218,0.08)', '#4dc9ff');
  label(ctx, 'WEATHER & FINALE CLEARED — DAWN LAGOON → VOLCANO RIM · ALL 7 LEGS FLOWN',
    W / 2, 478, B(14), '#f5eeda', 'center');
  // Perks & set-bonus icon strip.
  label(ctx, 'AIRFRAME — PERKS & SET BONUSES', 100, 530, B(15), '#ffd94d');
  let ix = 100;
  for (const id of g.perks.slice(0, 12)) {
    const perk = PERKS.find((p) => p.id === id);
    if (!perk) continue;
    ctx.fillStyle = SETS[perk.set].color;
    ctx.beginPath(); ctx.arc(ix + 14, 556, 14, 0, Math.PI * 2); ctx.fill();
    label(ctx, perk.set.slice(0, 1), ix + 14, 556, B(11), '#1a1206', 'center');
    ix += 36;
  }
  label(ctx, g.perks.map((id) => (PERKS.find((p) => p.id === id) || {}).name).filter(Boolean).join(' · ') || 'No perks fitted yet',
    100, 592, R(12), '#cfe3f0');
  // Buttons.
  const btns = [['ENTER', 'PLAY AGAIN'], ['N', 'NEW SEED'], ['E', 'ENDLESS']];
  let bx = W / 2 - 240;
  for (const [key, name] of btns) {
    pill(ctx, bx, 620, 150, 40, '#c9973f', '#ffd94d');
    label(ctx, `[${key}] ${name}`, bx + 75, 640, B(13), '#1a1206', 'center');
    bx += 165;
  }
}
