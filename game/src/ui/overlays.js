// CALDERA COURIER — ui/overlays.js
// Small overlays over the 3D scene: the runway-distance ribbon (top,
// clear of the bottom gauge row), pause, crash / game-over, leg
// complete, and toasts. Drawn last so they sit above the HUD.
import { pill, label, B, R } from './text.js';
import { fmtInt } from '../core/util.js';
import { runwayDist } from '../entities/runway.js';

export function drawOverlays(ctx, W, H, g) {
  const p = g.plane;
  if (g.mode === 'play' && g.runway && !p.landed) {
    const d = runwayDist(p, g.runway);
    if (d > 0 && d < 9000) {
      pill(ctx, W / 2 - 130, 84, 260, 26, 'rgba(8,6,12,0.8)');
      label(ctx, `RUNWAY ${Math.round(d)} M AHEAD`, W / 2, 97, B(13), '#7ee0a0', 'center');
    }
  }
  if (g.paused) {
    ctx.fillStyle = 'rgba(8,6,12,0.72)';
    ctx.fillRect(0, 0, W, H);
    pill(ctx, W / 2 - 220, H / 2 - 90, 440, 180, 'rgba(12,9,6,0.96)');
    label(ctx, 'PAUSED', W / 2, H / 2 - 46, B(30), '#ffd94d', 'center');
    label(ctx, '[P] RESUME · [R] RESTART LEG · [ESC] QUIT TO MENU', W / 2, H / 2 + 6, R(14), '#f5eeda', 'center');
    label(ctx, `SCORE ${fmtInt(g.score)} · LEG ${g.legs[g.leg].id}`, W / 2, H / 2 + 40, R(13), '#cfe3f0', 'center');
  }
  if (g.mode === 'over') {
    ctx.fillStyle = 'rgba(8,6,12,0.6)';
    ctx.fillRect(0, 0, W, H);
    pill(ctx, W / 2 - 260, H / 2 - 110, 520, 220, 'rgba(12,9,6,0.96)');
    label(ctx, g.won ? 'COURIER PRIME!' : 'AIRCRAFT DOWN', W / 2, H / 2 - 62, B(32), g.won ? '#ffd94d' : '#ff5a3c', 'center');
    label(ctx, g.won ? 'The last letter is home. The archipelago remembers.'
      : 'The mailplane went down in the caldera. The mail survives — try again.',
      W / 2, H / 2 - 16, R(15), '#f5eeda', 'center');
    label(ctx, `SCORE ${fmtInt(g.score)} · RINGS ${g.stats.rings} · LEG ${g.legs[g.leg].id}`, W / 2, H / 2 + 18, R(14), '#cfe3f0', 'center');
    label(ctx, '[ENTER] FLY AGAIN · [ESC] MENU', W / 2, H / 2 + 58, B(14), '#ffd94d', 'center');
  }
  if (g.toast) {
    pill(ctx, W / 2 - 200, 120, 400, 30, 'rgba(8,6,12,0.85)');
    label(ctx, g.toast, W / 2, 135, B(13), '#ffd94d', 'center');
  }
}
