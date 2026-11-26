// CALDERA COURIER — ui/menu.js
// Title screen: the mailplane over the dawn lagoon, the game name in
// brass, and the keycap menu (CONTINUE / NEW SORTIE / ENDLESS / CODEX
// / FEATS / CONTROLS) with difficulty pills and the 3 save slots.
import { pill, label, B, R, keyPill } from './text.js';
import { slotLabel } from '../systems/saves.js';

export function drawMenu(ctx, W, H, g) {
  // Dawn sky + sea band + island silhouettes.
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#2b3a6e'); grad.addColorStop(0.55, '#ff9e5e'); grad.addColorStop(0.62, '#1d5f8a'); grad.addColorStop(1, '#123a5c');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ffd9a0';
  ctx.beginPath(); ctx.arc(W * 0.8, H * 0.2, 34, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2f7d3c';
  ctx.beginPath(); ctx.moveTo(0, H * 0.58);
  for (let x = 0; x <= W; x += 40) ctx.lineTo(x, H * 0.58 - Math.sin(x * 0.01) * 26 - 18);
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
  // The mailplane, side-on, banking gently.
  ctx.save();
  ctx.translate(W * 0.68, H * 0.36); ctx.rotate(-0.08);
  ctx.fillStyle = '#e8dcc0';
  ctx.beginPath(); ctx.ellipse(0, 0, 150, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#c9973f';
  ctx.beginPath(); ctx.ellipse(-20, -4, 90, 22, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#b83a2a';
  ctx.beginPath(); ctx.moveTo(120, -6); ctx.lineTo(168, -30); ctx.lineTo(168, 6); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(220,225,230,0.7)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(-118, -4, 26, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  // Title block.
  label(ctx, 'CALDERA COURIER', W / 2, 92, 'bold 58px Georgia, serif', '#ffd94d', 'center');
  label(ctx, 'A 1930s brass & canvas bush seaplane · air-mail & rescue across a volcanic archipelago',
    W / 2, 132, R(16), '#f5eeda', 'center');
  // Menu items.
  const items = [
    ['1', 'CONTINUE', g.saves.some((s) => s) ? '' : 'NO SAVE'],
    ['2', 'NEW SORTIE', ''],
    ['3', 'ENDLESS', g.endless ? '' : 'LOCKED'],
    ['4', 'AIRFRAME CODEX', ''],
    ['5', 'FEATS', ''],
    ['6', 'CONTROLS', ''],
  ];
  let y = 190;
  for (const [key, name, badge] of items) {
    const w = keyPill(ctx, W / 2 - 190, y, key, name);
    if (badge) {
      pill(ctx, W / 2 - 190 + w + 10, y, 84, 30, badge === 'LOCKED' ? 'rgba(90,20,16,0.9)' : 'rgba(40,60,40,0.9)');
      label(ctx, badge, W / 2 - 190 + w + 52, y + 15, B(12), '#f5eeda', 'center');
    }
    y += 42;
  }
  // Difficulty pills.
  label(ctx, 'DIFFICULTY', W / 2 - 190, y + 8, B(13), '#ffd94d');
  let dx = W / 2 - 90;
  for (const d of ['Calm', 'Standard', 'Hard']) {
    const sel = g.difficulty === d;
    pill(ctx, dx, y - 6, 96, 28, sel ? '#c9973f' : 'rgba(8,6,12,0.85)', sel ? '#ffd94d' : undefined);
    label(ctx, d.toUpperCase(), dx + 48, y + 8, B(12), sel ? '#1a1206' : '#f5eeda', 'center');
    dx += 106;
  }
  // Save slots.
  y += 46;
  label(ctx, `SAVED RUNS (${g.saves.filter(Boolean).length}/3)   SEED #${g.seed}`, W / 2, y, B(14), '#9fd8e8', 'center');
  y += 24;
  for (let i = 0; i < 3; i++) {
    pill(ctx, W / 2 - 260, y, 520, 26, 'rgba(8,6,12,0.8)');
    label(ctx, `SLOT ${i + 1}`, W / 2 - 248, y + 13, B(12), '#ffd94d');
    label(ctx, slotLabel(g.saves[i]), W / 2 - 170, y + 13, R(13), '#f5eeda');
    y += 32;
  }
  label(ctx, 'W/S pitch · A/D bank · SHIFT boost · SPACE brake / mail-drop · C camera · M mouse-aim',
    W / 2, H - 18, R(13), '#d8cdb4', 'center');
}
