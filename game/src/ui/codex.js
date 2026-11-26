// CALDERA COURIER — ui/codex.js
// The contract / maneuver ledger: a compact strip listing the active
// contract, the modifier and the perks already fitted. Drawn inside
// the draft panel, so it never overlaps the HUD's GOALS card.
import { pill, label, B, R } from './text.js';

export function drawLedger(ctx, x, y, w, g) {
  pill(ctx, x, y, w, 26, 'rgba(8,6,12,0.88)');
  label(ctx, 'CONTRACT LEDGER', x + 12, y + 13, B(12), '#9fd8e8');
  label(ctx, g.contract ? `${g.contract.name} — ${g.contract.goal}` : 'No active contract',
    x + 170, y + 13, R(12), '#f5eeda');
  label(ctx, `Rings ${g.stats.rings} · Center ${g.stats.center} · Landings ${g.stats.landings} · Perks ${g.perks.length}`,
    x + w - 12, y + 13, R(12), '#cfe3f0', 'right');
}
