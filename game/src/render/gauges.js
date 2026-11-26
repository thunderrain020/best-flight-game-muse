// CALDERA COURIER — render/gauges.js
// Real analog aviation dials for the HUD's bottom row: a round face,
// brass ring, tick ring, coloured arcs and a needle, plus a digital
// readout. All angles use the dial convention: 0 at top (-90°), sweep
// clockwise from 135° to 405° (a 270° dial).
import { clamp } from '../core/util.js';

export function dialFace(ctx, x, y, r, label) {
  ctx.fillStyle = 'rgba(10,8,6,0.92)';
  ctx.strokeStyle = '#c9973f'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(201,151,63,0.5)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(x, y, r - 7, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#9fd8e8';
  ctx.font = 'bold 11px Georgia, serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y + r - 13);
}
function needle(ctx, x, y, r, frac, color) {
  const a = (0.75 + frac * 1.5) * Math.PI;
  ctx.strokeStyle = color; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(a) * (r - 12), y + Math.sin(a) * (r - 12));
  ctx.stroke();
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
}
function ticks(ctx, x, y, r, major, minor, fmt) {
  ctx.fillStyle = '#f5eeda';
  ctx.font = 'bold 10px Georgia, serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let v = 0; v <= major; v += minor) {
    const frac = v / major;
    const a = (0.75 + frac * 1.5) * Math.PI;
    const big = v % (minor * 5) === 0;
    const r1 = r - 8, r2 = r - (big ? 18 : 13);
    ctx.strokeStyle = '#f5eeda'; ctx.lineWidth = big ? 2.5 : 1;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
    ctx.lineTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2);
    ctx.stroke();
    if (big && fmt) ctx.fillText(fmt(v), x + Math.cos(a) * (r - 28), y + Math.sin(a) * (r - 28));
  }
}
function arc(ctx, x, y, r, from, to, color, width) {
  const a0 = (0.75 + from * 1.5) * Math.PI;
  const a1 = (0.75 + to * 1.5) * Math.PI;
  ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke();
}

/** Airspeed: KTS dial, green/amber/red arcs, digital readout. */
export function drawAirspeed(ctx, x, y, r, speed) {
  dialFace(ctx, x, y, r, 'AIRSPEED · KTS');
  arc(ctx, x, y, r - 10, 0, 120 / 220, '#37b06a', 7);
  arc(ctx, x, y, r - 10, 120 / 220, 170 / 220, '#ffb52e', 7);
  arc(ctx, x, y, r - 10, 170 / 220, 1, '#ff4d4d', 7);
  ticks(ctx, x, y, r, 220, 20, (v) => String(v));
  needle(ctx, x, y, r, clamp(speed, 0, 220) / 220, '#ffd94d');
  ctx.fillStyle = '#f5eeda';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(Math.round(speed)), x, y + r * 0.42);
}

/** Altimeter: FT dial, digital FT + vertical speed in fpm. */
export function drawAltimeter(ctx, x, y, r, alt, vsFpm) {
  dialFace(ctx, x, y, r, 'ALTIMETER · FT');
  ticks(ctx, x, y, r, 1500, 100, (v) => (v % 500 === 0 ? String(v / 100) : ''));
  needle(ctx, x, y, r, clamp(alt, 0, 1500) / 1500, '#ffd94d');
  ctx.fillStyle = '#f5eeda';
  ctx.font = 'bold 16px Georgia, serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`${Math.round(alt)}`, x, y + r * 0.30);
  // Vertical speed rides below the dial, clear of the face label.
  ctx.font = 'bold 11px Georgia, serif';
  ctx.fillStyle = vsFpm >= 0 ? '#7ee0a0' : '#ff8a7a';
  ctx.fillText(`${vsFpm >= 0 ? '+' : ''}${Math.round(vsFpm)} FPM`, x, y + r + 12);
}

/** Attitude ball: sky/earth split tilting with pitch and bank. */
export function drawAttitude(ctx, x, y, r, pitch, roll) {
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
  ctx.translate(x, y);
  ctx.rotate(-roll);
  const off = clamp(pitch, -0.6, 0.6) * r * 1.6;
  ctx.fillStyle = '#2f6fb8';
  ctx.fillRect(-r - 2, -r - 2 - off, 2 * r + 4, r + 2 + off);
  ctx.fillStyle = '#7a5a34';
  ctx.fillRect(-r - 2, -off, 2 * r + 4, r + 2 + off);
  ctx.strokeStyle = '#f5eeda'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-r, -off); ctx.lineTo(r, -off); ctx.stroke();
  ctx.strokeStyle = 'rgba(245,238,218,0.6)'; ctx.lineWidth = 1.5;
  for (const dy of [-30, 30]) {
    ctx.beginPath(); ctx.moveTo(-r * 0.45, -off + dy); ctx.lineTo(r * 0.45, -off + dy); ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = '#c9973f'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  // Fixed wings marker (the aircraft symbol, unmoving).
  ctx.strokeStyle = '#ffd94d'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - r * 0.55, y); ctx.lineTo(x - r * 0.15, y);
  ctx.moveTo(x + r * 0.15, y); ctx.lineTo(x + r * 0.55, y);
  ctx.stroke();
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  // Bank angle ticks around the top.
  for (let i = -3; i <= 3; i++) {
    const a = -Math.PI / 2 + i * 0.35;
    ctx.strokeStyle = '#f5eeda'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (r - 2), y + Math.sin(a) * (r - 2));
    ctx.lineTo(x + Math.cos(a) * (r - 9), y + Math.sin(a) * (r - 9));
    ctx.stroke();
  }
  ctx.fillStyle = '#9fd8e8';
  ctx.font = 'bold 11px Georgia, serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('ATTITUDE', x, y + r + 12);
}
