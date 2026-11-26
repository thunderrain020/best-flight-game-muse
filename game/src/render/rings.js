// CALDERA COURIER — render/rings.js
// Rings, runway and beacons in 3D: glowing hoops with a chevron gate,
// the striped cliff strip with approach lights, and lighthouse beams.
import { project } from './projection.js';
import { nextRing } from '../entities/rings.js';

function circle3d(ctx, cam, W, H, cx, cy, cz, r, color, width, facing) {
  ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i <= 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    const lx = Math.cos(a) * r, ly = Math.sin(a) * r;
    // Ring faces the flight direction (its plane is across z).
    const wx = cx + lx * Math.cos(facing) - 0;
    const wy = cy + ly;
    const wz = cz + lx * Math.sin(facing);
    const s = project(cam, W, H, wx, wy, wz);
    if (!s) { started = false; continue; }
    if (!started) { ctx.moveTo(s.x, s.y); started = true; }
    else ctx.lineTo(s.x, s.y);
  }
  ctx.stroke();
}

export function drawRings(ctx, W, H, g, cam) {
  const nxt = nextRing(g.rings);
  for (const ring of g.rings) {
    if (ring.passed) continue;
    // A ring being flown through wraps around the camera; hide it while
    // the plane is inside its plane so it never draws as dotted arcs.
    if (Math.abs(g.plane.z - ring.z) < 70) continue;
    const isNext = ring === nxt;
    const pulse = 1 + Math.sin(g.time * 4) * 0.06;
    const col = isNext ? '#ffd94d' : '#7ee0ff';
    circle3d(ctx, cam, W, H, ring.x, ring.y, ring.z, ring.r * pulse, col, isNext ? 7 : 4, g.plane.heading);
    circle3d(ctx, cam, W, H, ring.x, ring.y, ring.z, ring.r * 0.45, 'rgba(255,255,255,0.85)', 2, g.plane.heading);
    if (isNext) {
      const s = project(cam, W, H, ring.x, ring.y + ring.r + 14, ring.z);
      if (s) {
        ctx.fillStyle = '#ffd94d';
        ctx.font = 'bold 15px Georgia, serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('NEXT RING', s.x, s.y);
      }
    }
  }
}

export function drawRunway(ctx, W, H, g, cam) {
  const rw = g.runway;
  if (!rw) return;
  const corners = [
    [rw.x - rw.width / 2, rw.y, rw.z - rw.length / 2], [rw.x + rw.width / 2, rw.y, rw.z - rw.length / 2],
    [rw.x + rw.width / 2, rw.y, rw.z + rw.length / 2], [rw.x - rw.width / 2, rw.y, rw.z + rw.length / 2],
  ].map(([x, y, z]) => project(cam, W, H, x, y, z));
  if (corners.some((c) => !c)) return;
  ctx.fillStyle = rw.finale ? '#4a4a52' : '#5a5a60';
  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  for (const c of corners.slice(1)) ctx.lineTo(c.x, c.y);
  ctx.closePath(); ctx.fill();
  // Threshold stripes.
  ctx.fillStyle = '#f5f0dc';
  for (let i = -2; i <= 2; i++) {
    const a = project(cam, W, H, rw.x + i * 8 - 3, rw.y + 0.4, rw.z - rw.length / 2 + 12);
    const b = project(cam, W, H, rw.x + i * 8 + 3, rw.y + 0.4, rw.z - rw.length / 2 + 12);
    const c2 = project(cam, W, H, rw.x + i * 8 + 3, rw.y + 0.4, rw.z - rw.length / 2 + 34);
    const d = project(cam, W, H, rw.x + i * 8 - 3, rw.y + 0.4, rw.z - rw.length / 2 + 34);
    if (!a || !b || !c2 || !d) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c2.x, c2.y); ctx.lineTo(d.x, d.y);
    ctx.closePath(); ctx.fill();
  }
  // Approach lights: green near, red far, blinking.
  const blink = Math.sin(g.time * 5) > 0;
  for (const [dz, col] of [[-rw.length / 2 - 14, blink ? '#37ff8a' : '#1d8a4a'], [rw.length / 2 + 14, '#ff4d4d']]) {
    const s = project(cam, W, H, rw.x, rw.y + 3, rw.z + dz);
    if (!s) continue;
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(s.x, s.y, 5, 0, Math.PI * 2); ctx.fill();
  }
  // Lighthouse beacon beside the strip.
  const ls = project(cam, W, H, rw.x + 90, rw.y + 42, rw.z - 40);
  if (ls) {
    ctx.fillStyle = '#f5f0dc';
    ctx.fillRect(ls.x - 4, ls.y, 8, 42 * ls.s * 0.5 + 12);
    ctx.fillStyle = 'rgba(255,240,160,0.85)';
    ctx.beginPath(); ctx.arc(ls.x, ls.y - 2, 7, 0, Math.PI * 2); ctx.fill();
  }
}
