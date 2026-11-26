// CALDERA COURIER — render/terrain.js
// The heightfield, drawn far-to-near as projected quads: emerald
// terraced ridges, the glowing caldera, cobalt sea channels with
// sun-glint wakes, and the runway pad when it is in view.
import { project, horizonY } from './projection.js';
import { groundHeight, groundColor } from '../entities/terrain.js';

const ROWS = 14, COLS = 26, ROW_STEP = 110, COL_STEP = 46;
export function drawTerrain(ctx, W, H, g, cam) {
  const p = g.plane;
  // The sea always fills below the horizon line, so the lower screen is
  // never bare; the grid then lays the islands over it.
  const hy = horizonY(cam, W, H, W / 2);
  ctx.fillStyle = '#1d5f8a';
  ctx.fillRect(0, Math.max(0, hy - 10), W, H);
  const fwdX = Math.sin(p.heading), fwdZ = Math.cos(p.heading);
  const rgtX = Math.cos(p.heading), rgtZ = -Math.sin(p.heading);
  // Sample the grid ahead of the plane, far rows first. The grid starts
  // ahead of the aircraft so the near field never smears into streaks.
  const grid = [];
  for (let r = ROWS - 1; r >= 0; r--) {
    const d = 140 + r * ROW_STEP;
    const row = [];
    for (let c = 0; c <= COLS; c++) {
      const off = (c - COLS / 2) * COL_STEP;
      const x = p.x + fwdX * d + rgtX * off;
      const z = p.z + fwdZ * d + rgtZ * off;
      const h = groundHeight(x, z);
      row.push({ s: project(cam, W, H, x, h, z), h, x, z });
    }
    grid.push(row);
  }
  // Quads between adjacent rows, far to near.
  for (let r = 0; r < grid.length - 1; r++) {
    const a = grid[r], b = grid[r + 1];
    for (let c = 0; c < COLS; c++) {
      const p1 = a[c], p2 = a[c + 1], p3 = b[c + 1], p4 = b[c];
      if (!p1.s || !p2.s || !p3.s || !p4.s) continue;
      const h = (p1.h + p2.h + p3.h + p4.h) / 4;
      ctx.fillStyle = groundColor(p1.x, p1.z, h);
      ctx.beginPath();
      ctx.moveTo(p1.s.x, p1.s.y); ctx.lineTo(p2.s.x, p2.s.y);
      ctx.lineTo(p3.s.x, p3.s.y); ctx.lineTo(p4.s.x, p4.s.y);
      ctx.closePath(); ctx.fill();
    }
  }
  // Sun glint: a bright streak on the sea ahead.
  const glint = project(cam, W, H, p.x + fwdX * 300, 1, p.z + fwdZ * 300);
  if (glint) {
    ctx.fillStyle = 'rgba(255,240,190,0.35)';
    ctx.beginPath();
    ctx.ellipse(glint.x, glint.y, 130 * glint.s * 0.4 + 26, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}
