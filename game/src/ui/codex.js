// CALDERA COURIER — ui/codex.js
// The contract / maneuver ledger strip: a compact side panel listing
// the active contract, the modifier and the perks already fitted.
import { pill, label, B, R } from './text.js';
import { SETS } from '../data/perks.js';
import { PERKS } from '../data/perks.js';

export function drawCodexStrip(ctx, W, H, g) {
  const x = W - 300, y = H - 150, w = 288, h = 138;
  pill(ctx, x, y, w, h, 'rgba(8,6,12,0.88)');
  label(ctx, 'MANEUVER LEDGER', x + 12, y + 14, B(12), '#ffd94d');
  const lines = [
    `Rings passed: ${g.stats.rings}  ·  Center: ${g.stats.center}`,
    `Contracts done: ${g.contractsDone}  ·  Landings: ${g.stats.landings}`,
    `Perks fitted: ${g.perks.length}  ·  Feats: ${g.featsDone.length}`,
  ];
  lines.forEach((line, i) => label(ctx, line, x + 12, y + 38 + i * 18, R(12), '#cfe3f0'));
  // Perks & set-bonus icon strip.
  let ix = x + 12;
  for (const id of g.perks.slice(0, 8)) {
    const perk = PERKS.find((p) => p.id === id);
    if (!perk) continue;
    ctx.fillStyle = SETS[perk.set].color;
    ctx.beginPath(); ctx.arc(ix + 10, y + 112, 10, 0, Math.PI * 2); ctx.fill();
    label(ctx, perk.set.slice(0, 1), ix + 10, y + 112, B(10), '#1a1206', 'center');
    ix += 26;
  }
}
