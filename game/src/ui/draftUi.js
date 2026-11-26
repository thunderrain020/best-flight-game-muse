// CALDERA COURIER — ui/draftUi.js
// The between-leg hangar draft (rush shot): dark-framed brass/ivory
// overlay, three perk cards with circular aviation badges, rarity
// pills, set-progress pips, a SET BONUSES threshold bar below REROLL,
// and the side contract / maneuver ledger.
import { pill, label, B, R } from './text.js';
import { SETS, RARITY_COLOR, setCounts, setBonusText } from '../data/perks.js';
import { drawCodexStrip } from './codex.js';

export function drawDraft(ctx, W, H, g) {
  ctx.fillStyle = 'rgba(8,6,12,0.72)';
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
    // Circular aviation badge.
    ctx.fillStyle = set.color;
    ctx.beginPath(); ctx.arc(x + cw / 2, y + 52, 40, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a1206'; ctx.lineWidth = 3; ctx.stroke();
    label(ctx, perk.set.slice(0, 2), x + cw / 2, y + 52, B(24), '#1a1206', 'center');
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
  // Side ledger: contract + maneuver log.
  label(ctx, 'CONTRACT LEDGER', px + 36, py + ph - 22, B(12), '#9fd8e8');
  label(ctx, g.contract ? `${g.contract.name} — ${g.contract.goal}` : 'No active contract',
    px + 190, py + ph - 22, R(12), '#f5eeda');
  drawCodexStrip(ctx, W, H, g);
}
