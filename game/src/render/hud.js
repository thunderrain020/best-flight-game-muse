// CALDERA COURIER — render/hud.js
// Top HUD diet: at most 2 clean rows (leg / timer / score / HDG tape;
// then contract + weather banner), ALT/SPD tapes, pitch ladder +
// bank reticle, throttle/boost bar, slim sets + GOALS corner card.
import { fmtInt, fmtTime, clamp } from '../core/util.js';
import { tierName } from '../systems/momentum.js';
import { setCounts, SETS } from '../data/perks.js';

function pill(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.strokeStyle = 'rgba(201,151,63,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.fill(); ctx.stroke();
}
function text(ctx, s, x, y, font, color, align) {
  ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}
const BOLD = (n) => `bold ${n}px Georgia, serif`;

export function drawHud(ctx, W, H, g) {
  const p = g.plane, leg = g.legs[g.leg];
  const y0 = 12, rh = 30;
  pill(ctx, 12, y0, 250, rh, 'rgba(8,6,12,0.85)');
  text(ctx, `${leg.id} ${leg.name.toUpperCase()}`, 24, y0 + rh / 2, BOLD(15), '#ffd94d');
  text(ctx, fmtTime(g.legTime), 208, y0 + rh / 2, BOLD(15), '#f5eeda');
  pill(ctx, 272, y0, 170, rh, 'rgba(8,6,12,0.85)');
  text(ctx, `SCORE ${fmtInt(g.score)}`, 284, y0 + rh / 2, BOLD(15), '#f5eeda');
  // Compass tape: scrolling heading strip, centre = current HDG.
  const tx = 452, tw = W - 452 - 250;
  pill(ctx, tx, y0, tw, rh, 'rgba(8,6,12,0.85)');
  const hdg = ((p.heading * 180 / Math.PI) % 360 + 360) % 360;
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  ctx.save();
  ctx.beginPath(); ctx.rect(tx, y0, tw, rh); ctx.clip();
  for (let d = -60; d <= 60; d += 15) {
    const norm = ((Math.round(hdg + d) % 360) + 360) % 360;
    const x = tx + tw / 2 + d * (tw / 150);
    const card = norm % 45 === 0 ? dirs[Math.round(norm / 45) % 8] : String(norm).padStart(3, '0');
    text(ctx, card, x, y0 + rh / 2, BOLD(12), norm % 45 === 0 ? '#ffd94d' : '#cfe3f0', 'center');
  }
  ctx.restore();
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath();
  ctx.moveTo(tx + tw / 2, y0 + rh - 2);
  ctx.lineTo(tx + tw / 2 - 6, y0 + rh - 10); ctx.lineTo(tx + tw / 2 + 6, y0 + rh - 10);
  ctx.closePath(); ctx.fill();
  // Row 2: contract + modifier, weather banner.
  const y1 = y0 + rh + 8;
  pill(ctx, 12, y1, 430, 26, 'rgba(8,6,12,0.8)');
  text(ctx, g.contract ? `✦ ${g.contract.name.toUpperCase()}` : '✦ NO CONTRACT', 24, y1 + 13, BOLD(13), '#9fd8e8');
  if (g.modifier) text(ctx, g.modifier.label, 310, y1 + 13, BOLD(12), '#ff9a3c');
  if (g.weather) {
    pill(ctx, W - 262, y1, 250, 26, 'rgba(8,6,12,0.8)');
    text(ctx, `⚠ ${g.weather.name}`, W - 250, y1 + 13, BOLD(13), '#ffb52e');
  }
  // ALT tape (left), SPD tape (right).
  const ay = 120, ah = 150;
  pill(ctx, 12, ay, 64, ah, 'rgba(8,6,12,0.8)');
  text(ctx, 'ALT', 44, ay + 14, BOLD(12), '#9fd8e8', 'center');
  text(ctx, `${Math.round(p.y)}`, 44, ay + 44, BOLD(20), '#f5eeda', 'center');
  text(ctx, 'FT', 44, ay + 68, BOLD(12), '#cfe3f0', 'center');
  ctx.fillStyle = '#4dc9ff';
  ctx.fillRect(20, ay + ah - 16, 48 * clamp(p.y / 1200, 0, 1), 6);
  pill(ctx, W - 76, ay, 64, ah, 'rgba(8,6,12,0.8)');
  text(ctx, 'SPD', W - 44, ay + 14, BOLD(12), '#9fd8e8', 'center');
  text(ctx, `${Math.round(p.speed)}`, W - 44, ay + 44, BOLD(20), '#f5eeda', 'center');
  text(ctx, 'KTS', W - 44, ay + 68, BOLD(12), '#cfe3f0', 'center');
  ctx.fillStyle = '#ffb52e';
  ctx.fillRect(W - 68, ay + ah - 16, 48 * clamp(p.speed / 220, 0, 1), 6);
  // Pitch ladder + bank reticle (centre).
  const cx = W / 2, cy = H * 0.46;
  ctx.save();
  ctx.translate(cx, cy); ctx.rotate(-p.roll * 0.4);
  ctx.strokeStyle = 'rgba(245,238,218,0.9)'; ctx.lineWidth = 2;
  for (const [dy, len] of [[-60, 90], [-30, 60], [0, 110], [30, 60], [60, 90]]) {
    ctx.beginPath(); ctx.moveTo(-len / 2, dy); ctx.lineTo(len / 2, dy); ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = '#ffd94d'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 26, cy); ctx.lineTo(cx - 16, cy);
  ctx.moveTo(cx + 16, cy); ctx.lineTo(cx + 26, cy); ctx.stroke();
  // Throttle / boost bar (bottom-left) + momentum tier.
  const bx = 12, by = H - 84;
  pill(ctx, bx, by, 260, 52, 'rgba(8,6,12,0.85)');
  text(ctx, 'THROTTLE', bx + 12, by + 13, BOLD(11), '#cfe3f0');
  ctx.fillStyle = '#2a3a4a'; ctx.fillRect(bx + 12, by + 24, 150, 8);
  ctx.fillStyle = '#4dc9ff'; ctx.fillRect(bx + 12, by + 24, 150 * p.throttle, 8);
  ctx.fillStyle = '#2a3a4a'; ctx.fillRect(bx + 12, by + 36, 150, 8);
  ctx.fillStyle = '#ff5a3c'; ctx.fillRect(bx + 12, by + 36, 150 * p.boost, 8);
  text(ctx, 'BOOST', bx + 172, by + 40, BOLD(11), '#ff9a7a');
  const tierCol = g.momentum.level === 2 ? '#ff5a3c' : g.momentum.level === 1 ? '#4dc9ff' : '#d8cdb4';
  text(ctx, tierName(g), bx + 172, by + 13, BOLD(12), tierCol);
  // Slim corner card: sets + GOALS.
  const counts = setCounts(g.perks);
  const gx = W - 252, gy = H - 168;
  pill(ctx, gx, gy, 240, 156, 'rgba(8,6,12,0.88)');
  text(ctx, 'AIRFRAME SETS', gx + 12, gy + 14, BOLD(12), '#ffd94d');
  let yy = gy + 32;
  for (const key of ['THERMAL', 'TURBO', 'NAVIGATOR']) {
    ctx.fillStyle = SETS[key].color;
    ctx.fillRect(gx + 12, yy - 4, 10, 10);
    text(ctx, `${key} ${counts[key]}/4`, gx + 30, yy, BOLD(12), '#f5eeda');
    yy += 16;
  }
  text(ctx, `GOALS ${g.goals.filter((x) => x.done).length}/${g.goals.length}`, gx + 12, yy + 4, BOLD(12), '#9fd8e8');
  for (const goal of g.goals) {
    yy += 16;
    text(ctx, `${goal.done ? '✓' : '○'} ${goal.label}`, gx + 12, yy, '12px Georgia, serif', goal.done ? '#7ee0a0' : '#cfe3f0');
  }
  // Bottom control strip: one single crisp line.
  ctx.fillStyle = 'rgba(8,6,12,0.85)';
  ctx.fillRect(0, H - 24, W, 24);
  text(ctx, '[W/S] PITCH  [A/D] BANK  [Q/E] RUDDER  [SHIFT] BOOST  [SPACE] BRAKE / DROP  [C] CAMERA  [M] MOUSE-AIM',
    W / 2, H - 12, BOLD(12), '#d8cdb4', 'center');
}
