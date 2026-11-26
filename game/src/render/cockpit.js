// CALDERA COURIER — render/cockpit.js
// The cockpit view frame: brass/riveted canopy struts over the 3D
// world. The lit dials live in the HUD's bottom gauge row, so this
// frame stays clean and never covers an instrument.
export function drawCockpit(ctx, W, H, g) {
  void g;
  ctx.fillStyle = '#8a6420';
  ctx.fillRect(0, 0, 26, H);
  ctx.fillRect(W - 26, 0, 26, H);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(W * 0.32, 0); ctx.lineTo(W * 0.2, H * 0.16); ctx.lineTo(0, H * 0.12);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(W, 0); ctx.lineTo(W * 0.68, 0); ctx.lineTo(W * 0.8, H * 0.16); ctx.lineTo(W, H * 0.12);
  ctx.closePath(); ctx.fill();
  // Centre pillar between the windscreen halves.
  ctx.fillRect(W / 2 - 9, 0, 18, H * 0.13);
  ctx.fillStyle = '#c9973f';
  for (let i = 0; i < 9; i++) {
    ctx.beginPath(); ctx.arc(13, 30 + i * 72, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W - 13, 30 + i * 72, 3, 0, Math.PI * 2); ctx.fill();
  }
  // Bottom canopy rail, low enough to clear the HUD gauges.
  ctx.fillStyle = '#8a6420';
  ctx.fillRect(0, H - 26, W, 26);
  ctx.fillStyle = '#c9973f';
  for (let i = 0; i < 24; i++) {
    ctx.beginPath(); ctx.arc(24 + i * 54, H - 13, 2.5, 0, Math.PI * 2); ctx.fill();
  }
}
