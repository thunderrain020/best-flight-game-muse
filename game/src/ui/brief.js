// CALDERA COURIER — ui/brief.js
// The hangar & flight briefing hub (prep shot): the seaplane parked in
// a warm brass-lit coastal hangar overlooking the runway and the
// volcano, the leg brief, contract + modifier, and the 7-tile feature
// strip along the bottom.
import { pill, label, B, R, keyPill } from './text.js';

export function drawBrief(ctx, W, H, g) {
  const leg = g.legs[g.leg];
  // Warm hangar interior.
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#3a2a16'); grad.addColorStop(0.6, '#6b4a22'); grad.addColorStop(1, '#2a1a0e');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  // Open hangar door: runway + volcano + sea beyond.
  ctx.fillStyle = '#ff9e5e';
  ctx.beginPath(); ctx.roundRect(W * 0.55, 60, W * 0.4, 300, 16); ctx.fill();
  ctx.fillStyle = '#1d5f8a';
  ctx.fillRect(W * 0.55, 250, W * 0.4, 110);
  ctx.fillStyle = '#5a3a34';
  ctx.beginPath();
  ctx.moveTo(W * 0.72, 250); ctx.lineTo(W * 0.8, 150); ctx.lineTo(W * 0.88, 250);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ff5a26';
  ctx.beginPath(); ctx.arc(W * 0.8, 152, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5a5a60';
  ctx.fillRect(W * 0.62, 330, W * 0.26, 14);
  // Parked seaplane, side view, brass-lit.
  ctx.save();
  ctx.translate(W * 0.28, 402);
  ctx.scale(0.85, 0.85);
  ctx.fillStyle = '#e8dcc0';
  ctx.beginPath(); ctx.ellipse(0, 0, 170, 16, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#c9973f';
  ctx.beginPath(); ctx.ellipse(-24, -6, 100, 24, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#9fd8e8';
  ctx.beginPath(); ctx.ellipse(30, -14, 34, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#b83a2a';
  ctx.beginPath(); ctx.moveTo(140, -8); ctx.lineTo(196, -36); ctx.lineTo(196, 6); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#8a6420'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(-150, 44); ctx.moveTo(60, 0); ctx.lineTo(60, 44); ctx.stroke();
  ctx.fillStyle = '#8a6420';
  ctx.fillRect(-170, 44, 40, 8); ctx.fillRect(40, 44, 40, 8);
  ctx.restore();
  // Brief panel.
  pill(ctx, 48, 60, 560, 330, 'rgba(8,6,12,0.92)');
  label(ctx, `${leg.id} — ${leg.name.toUpperCase()}`, 72, 96, B(26), '#ffd94d');
  label(ctx, leg.sub, 72, 128, R(16), '#f5eeda');
  label(ctx, `RINGS ${leg.rings} · PAR ${leg.par}s · WIND ${leg.wind} kts`, 72, 162, B(14), '#9fd8e8');
  if (g.contract) {
    label(ctx, `CONTRACT — ${g.contract.name}`, 72, 200, B(15), '#ffd94d');
    label(ctx, g.contract.goal, 72, 224, R(14), '#f5eeda');
    label(ctx, `PAY ${g.contract.pay} MAIL`, 72, 248, B(13), '#7ee0a0');
  }
  if (g.modifier) {
    label(ctx, `MODIFIER — ${g.modifier.label}`, 72, 286, B(14), '#ff9a3c');
    label(ctx, g.modifier.desc, 72, 310, R(13), '#f5eeda');
  }
  label(ctx, `SEED #${g.seed} · ${g.difficulty.toUpperCase()} · SCORE ${g.score}`, 72, 348, R(13), '#cfe3f0');
  // Keycap actions.
  let y = 430;
  keyPill(ctx, 48, y, 'ENTER', 'TAKE OFF');
  keyPill(ctx, 260, y, 'D', 'CHANGE DIFFICULTY');
  keyPill(ctx, 500, y, 'ESC', 'BACK TO MENU');
  // 7-tile feature strip along the bottom.
  const tiles = ['7 LEGS', '18 CONTRACTS', '18 PERKS', '3 SETS', '18 FEATS', '3 SAVE SLOTS', 'SEEDED RUNS'];
  const tw = (W - 96 - 6 * 10) / 7;
  tiles.forEach((t, i) => {
    const x = 48 + i * (tw + 10);
    pill(ctx, x, H - 84, tw, 56, 'rgba(8,6,12,0.88)');
    label(ctx, t, x + tw / 2, H - 56, B(13), '#ffd94d', 'center');
  });
  label(ctx, 'HANGAR & FLIGHT BRIEFING', W / 2, 34, B(15), '#ffd94d', 'center');
}
