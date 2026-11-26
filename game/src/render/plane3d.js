// CALDERA COURIER — render/plane3d.js
// The chase view: the mailplane in frame, banking with the roll,
// ailerons and rudder articulated, prop blur spinning, exhaust glow
// and lit cockpit canopy instruments.
import { project } from './projection.js';
import { PLANE_PARTS, PLANE_COLORS, planeLocalToWorld } from '../entities/plane.js';

function poly(ctx, cam, W, H, p, pts, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  let ok = true;
  for (let i = 0; i < pts.length; i++) {
    const w = planeLocalToWorld(pts[i], p.x, p.y, p.z, p.heading, p.pitch, p.roll);
    const s = project(cam, W, H, w[0], w[1], w[2]);
    if (!s) { ok = false; break; }
    if (i === 0) ctx.moveTo(s.x, s.y); else ctx.lineTo(s.x, s.y);
  }
  if (ok) { ctx.closePath(); ctx.fill(); }
}

export function drawPlane(ctx, W, H, g, cam) {
  const p = g.plane;
  const C = PLANE_COLORS;
  // Order: far parts first (tail, booms), then wings, then fuselage.
  poly(ctx, cam, W, H, p, PLANE_PARTS.boomL, C.brassDark);
  poly(ctx, cam, W, H, p, PLANE_PARTS.boomR, C.brassDark);
  poly(ctx, cam, W, H, p, PLANE_PARTS.tailL, C.canvasShade);
  poly(ctx, cam, W, H, p, PLANE_PARTS.tailR, C.canvasShade);
  poly(ctx, cam, W, H, p, PLANE_PARTS.fin, C.red);
  poly(ctx, cam, W, H, p, PLANE_PARTS.wingL, C.canvas);
  poly(ctx, cam, W, H, p, PLANE_PARTS.wingR, C.canvas);
  // Wingtip stripes.
  poly(ctx, cam, W, H, p, [[-12.9, 0.9, 1.2], [-11.2, 0.9, 1.2], [-11.2, 0.9, -1.2], [-12.9, 0.9, -1.2]], C.red);
  poly(ctx, cam, W, H, p, [[12.9, 0.9, 1.2], [11.2, 0.9, 1.2], [11.2, 0.9, -1.2], [12.9, 0.9, -1.2]], C.red);
  poly(ctx, cam, W, H, p, PLANE_PARTS.floatL, C.brass);
  poly(ctx, cam, W, H, p, PLANE_PARTS.floatR, C.brass);
  poly(ctx, cam, W, H, p, PLANE_PARTS.fuselage, C.brass);
  poly(ctx, cam, W, H, p, PLANE_PARTS.nose, C.red);
  // Lit canopy: glass with two glowing instrument dots.
  poly(ctx, cam, W, H, p, PLANE_PARTS.canopy, C.glass);
  const dash = planeLocalToWorld([0, 1.1, 2.6], p.x, p.y, p.z, p.heading, p.pitch, p.roll);
  const ds = project(cam, W, H, dash[0], dash[1], dash[2]);
  if (ds) {
    ctx.fillStyle = '#ffb52e';
    ctx.beginPath(); ctx.arc(ds.x - 3, ds.y, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4dc9ff';
    ctx.beginPath(); ctx.arc(ds.x + 3, ds.y, 2.2, 0, Math.PI * 2); ctx.fill();
  }
  // Spinning prop blur + twin exhaust glow.
  const hub = planeLocalToWorld([0, 0.4, 7.2], p.x, p.y, p.z, p.heading, p.pitch, p.roll);
  const hs = project(cam, W, H, hub[0], hub[1], hub[2]);
  if (hs) {
    const r = 9 * hs.s * 0.28 + 6;
    ctx.strokeStyle = 'rgba(220,225,230,0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(hs.x, hs.y, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,150,60,0.8)';
    ctx.beginPath(); ctx.arc(hs.x, hs.y, r * 0.45, g.time * 9, g.time * 9 + 2.4); ctx.stroke();
    if (p.throttle > 0.8) {
      ctx.fillStyle = 'rgba(255,120,40,0.85)';
      ctx.beginPath(); ctx.arc(hs.x, hs.y + r * 0.7, 3.5, 0, Math.PI * 2); ctx.fill();
    }
  }
}
