// CALDERA COURIER — render/fx.js
// Screen-space effects over the 3D world: particles (ring shockwaves,
// contrails, boost plumes, rain/ash) projected through the 3D camera,
// floating callouts and the damage vignette. SLIPSTREAM callouts are
// drawn on the upper-right flank, never over the centre reticle or
// the target ring.
import { project3D } from './projection.js';

export function drawFx(ctx, W, H, g, cam) {
  for (const pt of g.particles) {
    const s = project3D(cam, W, H, pt.x, pt.y, pt.z);
    if (!s) continue;
    const a = Math.max(0, Math.min(1, pt.life));
    if (pt.kind === 'ring') {
      ctx.fillStyle = `rgba(255,217,77,${a})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, 4, 0, Math.PI * 2); ctx.fill();
    } else if (pt.kind === 'trail') {
      ctx.fillStyle = `rgba(255,255,255,${a * 0.5})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, 3, 0, Math.PI * 2); ctx.fill();
    } else if (pt.kind === 'boost') {
      ctx.fillStyle = `rgba(255,120,40,${a})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, 5, 0, Math.PI * 2); ctx.fill();
    } else if (pt.kind === 'rain') {
      ctx.strokeStyle = `rgba(180,210,240,${a * 0.7})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - 3, s.y + 16); ctx.stroke();
    } else if (pt.kind === 'ash') {
      ctx.fillStyle = `rgba(120,110,105,${a * 0.8})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = `rgba(230,220,200,${a * 0.7})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, 4, 0, Math.PI * 2); ctx.fill();
    }
  }
  for (const c of g.callouts) {
    const a = c.t < 1.2 ? 1 : 1 - (c.t - 1.2) / 0.4;
    ctx.globalAlpha = Math.max(0, a);
    ctx.font = c.big ? 'bold 34px Georgia, serif' : 'bold 22px Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(8,6,12,0.9)';
    // Slipstream streaks live on the upper-LEFT flank, clear of the
    // reticle, the ring and the top-right HUD card. The rest stay centred.
    const flank = c.text.startsWith('SLIPSTREAM');
    const cx = flank ? 250 : c.x;
    const cy = flank ? 150 : c.y - c.t * 34;
    ctx.strokeText(c.text, cx, cy);
    ctx.fillStyle = c.color;
    ctx.fillText(c.text, cx, cy);
    ctx.globalAlpha = 1;
  }
  const dmg = g.plane.damage / 100;
  if (dmg > 0.05) {
    const grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.75);
    grad.addColorStop(0, 'rgba(180,20,10,0)');
    grad.addColorStop(1, `rgba(180,20,10,${dmg * 0.55})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }
}
