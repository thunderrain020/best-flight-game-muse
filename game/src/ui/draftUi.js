// CALDERA COURIER — ui/draftUi.js
// The between-leg hangar draft (rush shot): a dark-framed brass/ivory
// overlay on a near-opaque backdrop, three perk cards with custom
// vector aviation emblems (never letter circles), rarity pills,
// set-progress pips, a SET BONUSES threshold bar below REROLL, and the
// contract / maneuver ledger inside the panel — so nothing bleeds
// over the HUD's GOALS card, which stays hidden while drafting.
import { pill, label, B, R } from './text.js';
import { SETS, RARITY_COLOR, setCounts, setBonusText } from '../data/perks.js';
import { drawSetEmblem } from './emblems.js';
import { drawLedger } from './codex.js';

export function drawDraft(ctx, W, H, g) {
  void H;
  ctx.fillStyle = 'rgba(8,6,12,0.94)';
  ctx.fillRect(0, 0, W, H);
  const px = 60, py = 90, pw = W - 120, ph = 480;
  pill(ctx, px, py, pw, ph, 'rgba(12,9,6,0.96)');
  label(ctx, 'HANGAR DRAFT — PICK 1 AIRFRAME PERK', px + pw / 2, py + 34, B(24), '#ffd94d', 'center');
  label(ctx, `LEG ${g.legs[g.leg].id} COMPLETE · REROLLS LEFT: ${g.rerolls}`, px + pw / 2, py + 62, R(14), '#cfe3f0', 'center');
  const counts = setCounts(g.perks);
  const cw = 250, gap = 24;
  const startX = px + 36;
  (g.draft ? g.draft.choices : []).forEach((perk, i) => {
    const x = startX + i * (cw + gap);
    const y = py + 92;
    const set = SETS[perk.set];
    pill(ctx, x, y, cw, 250, 'rgba(245,238,218,0.06)', set.color);
    // Custom vector aviation emblem for the perk's set.
    drawSetEmblem(ctx, perk.set, x + cw / 2, y + 52, 40);
    label(ctx, perk.name, x + cw / 2, y + 118, B(17), '#f5eeda', 'center');
    pill(ctx, x + cw / 2 - 44, y + 140, 88, 24, 'rgba(8,6,12,0.9)', RARITY_COLOR[perk.rarity]);
    label(ctx, perk.rarity.toUpperCase(), x + cw / 2, y + 152, B(11), RARITY_COLOR[perk.rarity], 'center');
    label(ctx, perk.desc, x + cw / 2, y + 190, R(13), '#d8cdb4', 'center');
    // Set-progress pips.
    for (let k = 0; k < 4; k++) {
      ctx.fillStyle = k < counts[perk.set] ? set.color : 'rgba(245,238,218,0.25)';
      ctx.beginPath(); ctx.arc(x + cw / 2 - 27 + k * 18, y + 214, 6, 0, Math.PI * 2); ctx.fill();
    }
    label(ctx, `[${i + 1}] TAKE THIS PERK`, x + cw / 2, y + 240, B(11), '#ffd94d', 'center');
    if (g.draft && g.draft.picked === perk.id) {
      label(ctx, '✓ FITTED', x + cw / 2, y + 14, B(13), '#7ee0a0', 'center');
    }
  });
  // REROLL + SET BONUSES threshold bar.
  const ry = py + 360;
  pill(ctx, px + 36, ry, 150, 34, g.rerolls > 0 ? '#c9973f' : 'rgba(8,6,12,0.9)', g.rerolls > 0 ? '#ffd94d' : undefined);
  label(ctx, '[R] REROLL', px + 111, ry + 17, B(13), g.rerolls > 0 ? '#1a1206' : '#8a8a8a', 'center');
  const bx = px + 210, bw = pw - 246;
  void bw;
  label(ctx, 'SET BONUSES', bx, ry + 8, B(12), '#ffd94d');
  let by = ry + 22;
  for (const key of ['THERMAL', 'TURBO', 'NAVIGATOR']) {
    ctx.fillStyle = '#2a3a4a'; ctx.fillRect(bx + 110, by - 5, 180, 8);
    ctx.fillStyle = SETS[key].color;
    ctx.fillRect(bx + 110, by - 5, 180 * (counts[key] / 4), 8);
    label(ctx, `${key} ${counts[key]}/4`, bx, by, R(12), '#f5eeda');
    label(ctx, setBonusText(key, counts[key]), bx + 310, by, R(12), '#9fd8e8');
    by += 16;
  }
  // Maneuver ledger, inside the panel's foot.
  drawLedger(ctx, px + 36, py + ph - 40, pw - 72, g);
}
