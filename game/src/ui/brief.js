// CALDERA COURIER — ui/brief.js
// The hangar & flight briefing hub (prep shot): a 2-column title hub.
// Left: the CALDERA COURIER title, keycap menu, difficulty pills and
// the 3 save slots. Right: a live 3D hangar-apron view (the parked
// mailplane on the strip, volcano behind) with a compact S1 briefing
// card. Bottom: a 7-tile feature strip, every tile with a bold title
// and a 2-line descriptive sublabel.
import { pill, label, B, R, keyPill } from './text.js';
import { slotLabel } from '../systems/saves.js';

export function drawBrief(ctx, W, H, g) {
  const leg = g.legs[g.leg];
  // Warm hangar wash over the left column and the frame strips only;
  // the right column stays clear so the live 3D apron shows through.
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#3a2a16'); grad.addColorStop(0.6, '#6b4a22'); grad.addColorStop(1, '#2a1a0e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 692, H);
  ctx.fillRect(692, 0, W - 692, 52);
  ctx.fillRect(692, 596, W - 692, H - 596);
  // Right-column window frame.
  ctx.strokeStyle = '#c9973f'; ctx.lineWidth = 3;
  ctx.strokeRect(700, 60, 532, 532);
  ctx.fillStyle = 'rgba(8,6,12,0.85)';
  ctx.fillRect(700, 60, 532, 26);
  label(ctx, 'LIVE 3D — HANGAR APRON', 964, 73, B(12), '#ffd94d', 'center');
  // Left column: title + subtitle.
  label(ctx, 'CALDERA', 48, 88, 'bold 52px Georgia, serif', '#ffd94d');
  label(ctx, 'COURIER', 48, 138, 'bold 52px Georgia, serif', '#f5eeda');
  label(ctx, 'A 1930s brass & canvas bush seaplane · air-mail & rescue across a volcanic archipelago',
    48, 172, R(14), '#f5eeda');
  // Keycap menu.
  const items = [
    ['ENTER', 'CONTINUE', g.saves.some((s) => s) ? '' : 'NO SAVE'],
    ['N', 'NEW SORTIE', ''],
    ['E', 'ENDLESS', g.endless ? '' : 'LOCKED'],
    ['C', 'AIRFRAME CODEX', ''],
    ['F', 'FEATS', ''],
    ['H', 'CONTROLS', ''],
  ];
  let y = 200;
  for (const [key, name, badge] of items) {
    const w = keyPill(ctx, 48, y, key, name);
    if (badge) {
      pill(ctx, 48 + w + 10, y, 84, 30, badge === 'LOCKED' ? 'rgba(90,20,16,0.9)' : 'rgba(40,60,40,0.9)');
      label(ctx, badge, 48 + w + 52, y + 15, B(12), '#f5eeda', 'center');
    }
    y += 40;
  }
  // Difficulty pills.
  label(ctx, 'DIFFICULTY', 48, y + 8, B(13), '#ffd94d');
  let dx = 168;
  for (const d of ['Calm', 'Standard', 'Hard']) {
    const sel = g.difficulty === d;
    pill(ctx, dx, y - 6, 96, 28, sel ? '#c9973f' : 'rgba(8,6,12,0.85)', sel ? '#ffd94d' : undefined);
    label(ctx, d.toUpperCase(), dx + 48, y + 8, B(12), sel ? '#1a1206' : '#f5eeda', 'center');
    dx += 106;
  }
  // Save slots.
  y += 46;
  label(ctx, `SAVED RUNS (${g.saves.filter(Boolean).length}/3)   SEED #${g.seed}`, 48, y, B(14), '#9fd8e8');
  y += 22;
  for (let i = 0; i < 3; i++) {
    pill(ctx, 48, y, 560, 24, 'rgba(8,6,12,0.8)');
    label(ctx, `SLOT ${i + 1}`, 60, y + 12, B(12), '#ffd94d');
    label(ctx, slotLabel(g.saves[i]), 140, y + 12, R(13), '#f5eeda');
    y += 30;
  }
  // Right column: compact S1 briefing card at the window's foot.
  pill(ctx, 716, 452, 500, 124, 'rgba(8,6,12,0.92)');
  label(ctx, `${leg.id} — ${leg.name.toUpperCase()}`, 736, 478, B(20), '#ffd94d');
  label(ctx, leg.sub, 736, 502, R(14), '#f5eeda');
  label(ctx, `RINGS ${leg.rings} · PAR ${leg.par}s · WIND ${leg.wind} kts`, 736, 528, B(13), '#9fd8e8');
  if (g.contract) label(ctx, `✦ ${g.contract.name} — ${g.contract.goal}`, 736, 552, R(13), '#cfe3f0');
  // 7-tile feature strip: bold title + 2-line sublabel on every tile.
  const tiles = [
    ['7 LEGS', 'Dawn Lagoon to Volcano Rim', '7 escalating airspace legs'],
    ['18 CONTRACTS', 'Air-mail & rescue jobs', 'with per-sortie modifiers'],
    ['18 PERKS', 'THERMAL · TURBO', 'NAVIGATOR · 3 sets'],
    ['3 SETS', 'Live 2-piece set bonuses', '4 pieces = full set power'],
    ['18 FEATS', 'Pilot milestones', 'stamped onto your wings'],
    ['3 SAVE SLOTS', 'Keep three campaigns', 'plus seeded runs'],
    ['SEEDED RUNS', 'Every run has a seed', 'share it and race it'],
  ];
  const tw = (W - 96 - 6 * 10) / 7, ty = H - 96;
  tiles.forEach(([t, s1, s2], i) => {
    const x = 48 + i * (tw + 10);
    pill(ctx, x, ty, tw, 76, 'rgba(8,6,12,0.88)');
    label(ctx, t, x + tw / 2, ty + 14, B(13), '#ffd94d', 'center');
    label(ctx, s1, x + tw / 2, ty + 36, R(11), '#d8cdb4', 'center');
    label(ctx, s2, x + tw / 2, ty + 54, R(11), '#d8cdb4', 'center');
  });
}
