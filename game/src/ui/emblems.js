// CALDERA COURIER — ui/emblems.js
// Custom-drawn vector aviation emblems for the three airframe sets —
// no letter circles. THERMAL is a flame, TURBO is twin turbines,
// NAVIGATOR is a brass compass. Drawn on a set-coloured disc with a
// dark brass ring, so they read at any size.
import { SETS } from '../data/perks.js';

/** Draw one set emblem centred at (cx, cy) with radius r. */
export function drawSetEmblem(ctx, setKey, cx, cy, r) {
  const set = SETS[setKey];
  const col = set ? set.color : '#d8cdb4';
  ctx.fillStyle = col;
  ctx.strokeStyle = '#1a1206'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#1a1206';
  ctx.strokeStyle = '#1a1206';
  if (setKey === 'THERMAL') {
    // Flame: outer teardrop, inner gold tongue.
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.72);
    ctx.bezierCurveTo(cx + r * 0.55, cy - r * 0.2, cx + r * 0.5, cy + r * 0.45, cx, cy + r * 0.62);
    ctx.bezierCurveTo(cx - r * 0.5, cy + r * 0.45, cx - r * 0.55, cy - r * 0.2, cx, cy - r * 0.72);
    ctx.fill();
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.2);
    ctx.bezierCurveTo(cx + r * 0.28, cy + r * 0.1, cx + r * 0.22, cy + r * 0.45, cx, cy + r * 0.5);
    ctx.bezierCurveTo(cx - r * 0.22, cy + r * 0.45, cx - r * 0.28, cy + r * 0.1, cx, cy - r * 0.2);
    ctx.fill();
  } else if (setKey === 'TURBO') {
    // Twin turbines: two small fans, three blades each.
    for (const dx of [-r * 0.38, r * 0.38]) {
      ctx.beginPath(); ctx.arc(cx + dx, cy, r * 0.34, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2 + 0.5;
        ctx.beginPath();
        ctx.moveTo(cx + dx, cy);
        ctx.lineTo(cx + dx + Math.cos(a) * r * 0.3, cy + Math.sin(a) * r * 0.3);
        ctx.stroke();
      }
    }
  } else {
    // Brass compass: ring, cardinal ticks, needle diamond.
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r * 0.62, cy + Math.sin(a) * r * 0.62);
      ctx.lineTo(cx + Math.cos(a) * r * 0.42, cy + Math.sin(a) * r * 0.42);
      ctx.stroke();
    }
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.5); ctx.lineTo(cx + r * 0.16, cy); ctx.lineTo(cx, cy + r * 0.5); ctx.lineTo(cx - r * 0.16, cy);
    ctx.closePath(); ctx.fill();
  }
}
