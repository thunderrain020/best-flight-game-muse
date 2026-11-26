// CALDERA COURIER — render/cockpit.js
// The cockpit view: brass/riveted canopy struts framing the sky, and
// a lit amber/cyan analog instrument panel — artificial horizon,
// airspeed, altimeter, compass rose and boost gauge.
import { clamp } from '../core/util.js';

function gauge(ctx, x, y, r, label, value, min, max, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#14100a';
  ctx.strokeStyle = '#c9973f'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = color; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, r - 5, -Math.PI * 0.75, Math.PI * 0.75); ctx.stroke();
  const a = -Math.PI * 0.75 + ((clamp(value, min, max) - min) / (max - min)) * Math.PI * 1.5;
  ctx.strokeStyle = '#ffd94d'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(a - Math.PI / 2) * (r - 8), Math.sin(a - Math.PI / 2) * (r - 8));
  ctx.stroke();
  ctx.fillStyle = '#f5eeda';
  ctx.font = 'bold 11px Georgia, serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, 0, r - 13);
  ctx.restore();
}

export function drawCockpit(ctx, W, H, g) {
  const p = g.plane;
  // Canopy struts: brass frame with rivets.
  ctx.fillStyle = '#8a6420';
  ctx.fillRect(0, 0, 26, H);
  ctx.fillRect(W - 26, 0, 26, H);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(W * 0.32, 0); ctx.lineTo(W * 0.2, H * 0.16); ctx.lineTo(0, H * 0.12);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(W, 0); ctx.lineTo(W * 0.68, 0); ctx.lineTo(W * 0.8, H * 0.16); ctx.lineTo(W, H * 0.12);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#c9973f';
  for (let i = 0; i < 9; i++) {
    ctx.beginPath(); ctx.arc(13, 30 + i * 72, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W - 13, 30 + i * 72, 3, 0, Math.PI * 2); ctx.fill();
  }
  // Instrument panel: dark brass shelf across the bottom.
  const py = H - 118;
  ctx.fillStyle = 'rgba(20,14,8,0.94)';
  ctx.strokeStyle = '#c9973f'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(90, py, W - 180, 104, 12);
  ctx.fill(); ctx.stroke();
  // Artificial horizon (center-left), airspeed, altimeter, compass, boost.
  const cx = W / 2 - 260, cy = py + 52;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = '#2f6fb8'; ctx.fillRect(-40, -40 - p.pitch * 90, 80, 40 + p.pitch * 90);
  ctx.fillStyle = '#7a5a34'; ctx.fillRect(-40, -p.pitch * 90, 80, 40 + p.pitch * 90);
  ctx.rotate(-p.roll);
  ctx.strokeStyle = '#f5eeda'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(40, 0); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = '#c9973f'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#f5eeda';
  ctx.font = 'bold 11px Georgia, serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('ATTITUDE', cx, cy + 54);
  gauge(ctx, W / 2 - 130, cy, 34, 'AIRSPEED', p.speed, 0, 220, '#4dc9ff');
  gauge(ctx, W / 2, cy, 34, 'ALTITUDE', p.y, 0, 1200, '#ffb52e');
  gauge(ctx, W / 2 + 130, cy, 34, 'BOOST', p.boost * 100, 0, 100, '#ff5a3c');
  // Compass rose (right).
  const rx = W / 2 + 250;
  ctx.save();
  ctx.translate(rx, cy);
  ctx.fillStyle = '#14100a';
  ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c9973f'; ctx.stroke();
  ctx.fillStyle = '#4dc9ff';
  ctx.font = 'bold 13px Georgia, serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const hdg = Math.round(((p.heading * 180 / Math.PI) % 360 + 360) % 360);
  ctx.fillText(String(hdg).padStart(3, '0') + '°', 0, 0);
  ctx.fillStyle = '#f5eeda';
  ctx.font = 'bold 10px Georgia, serif';
  ctx.fillText('HDG', 0, 22);
  ctx.restore();
}
