// CALDERA COURIER — render/sky.js
// One-style sky: gradient dome, sun with glint, drifting clouds, the
// volcano's smoke plume and the lighthouse beams. Palette comes from
// the leg's sky key so dawn, storm, ash and night read differently.
import { SKIES } from '../data/weather.js';
import { VOLCANO } from '../entities/terrain.js';

export function drawSky(ctx, W, H, g, cam) {
  const leg = g.legs[g.leg];
  const sky = SKIES[leg.sky] || SKIES.day;
  const grad = ctx.createLinearGradient(0, 0, 0, H * 0.62);
  grad.addColorStop(0, sky[0]);
  grad.addColorStop(1, sky[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H * 0.62);
  // Sun, placed by heading so it stays put as the plane turns.
  const sunA = g.seed * 0.13 + 0.6;
  const sx = W / 2 + Math.sin(sunA - cam.yaw) * W * 0.42;
  const sy = H * 0.16 + Math.cos(sunA - cam.yaw) * 20;
  const glow = ctx.createRadialGradient(sx, sy, 4, sx, sy, 130);
  glow.addColorStop(0, sky[2]);
  glow.addColorStop(0.25, 'rgba(255,220,150,0.55)');
  glow.addColorStop(1, 'rgba(255,220,150,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(sx - 130, sy - 130, 260, 260);
  ctx.fillStyle = sky[2];
  ctx.beginPath(); ctx.arc(sx, sy, 26, 0, Math.PI * 2); ctx.fill();
  // Clouds: soft ellipses drifting with the clock.
  ctx.fillStyle = leg.sky === 'night' ? 'rgba(120,140,200,0.25)' : 'rgba(255,255,255,0.5)';
  for (let i = 0; i < 7; i++) {
    const cx = ((i * 197 + g.time * (6 + i * 2)) % (W + 320)) - 160;
    const cy = 46 + i * 22 + Math.sin(i * 2.1) * 14;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 90 + i * 8, 16 + (i % 3) * 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Volcano smoke plume, rising over the caldera when it is in view.
  if (leg.sky === 'ash' || leg.sky === 'storm') {
    const px = W / 2 + Math.sin(0.4 - cam.yaw) * W * 0.3;
    ctx.fillStyle = 'rgba(70,60,58,0.55)';
    for (let i = 0; i < 5; i++) {
      const py = 120 - i * 26;
      ctx.beginPath();
      ctx.ellipse(px + Math.sin(g.time * 0.5 + i) * 18, py, 34 + i * 10, 16 + i * 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Haze band where sky meets sea.
  ctx.fillStyle = sky[3];
  ctx.fillRect(0, H * 0.5, W, H * 0.14);
  void VOLCANO;
}
