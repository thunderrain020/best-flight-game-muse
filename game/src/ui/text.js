// CALDERA COURIER — ui/text.js
// Shared canvas text kit: every pill, badge, keycap and button draws
// at pillY + pillH / 2 with textBaseline 'middle', so nothing overlaps
// and nothing drifts off-centre.
export function pill(ctx, x, y, w, h, fill, stroke, r) {
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke || 'rgba(201,151,63,0.95)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r ?? 8); ctx.fill(); ctx.stroke();
}
export function label(ctx, s, x, y, font, color, align) {
  ctx.font = font; ctx.fillStyle = color;
  ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}
export const B = (n) => `bold ${n}px Georgia, serif`;
export const R = (n) => `${n}px Georgia, serif`;
/** A [KEY] badge fused into a control pill. */
export function keyPill(ctx, x, y, key, text) {
  ctx.font = B(13);
  const kw = ctx.measureText(key).width + 18;
  ctx.font = R(13);
  const tw = ctx.measureText(text).width + 12;
  const w = kw + tw + 16;
  pill(ctx, x, y, w, 30, 'rgba(8,6,12,0.88)');
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath(); ctx.roundRect(x + 6, y + 5, kw, 20, 4); ctx.fill();
  label(ctx, key, x + 6 + kw / 2, y + 15, B(12), '#1a1206', 'center');
  label(ctx, text, x + 6 + kw + 8, y + 15, R(13), '#f5eeda');
  return w;
}
/** Centre a block of text lines on one x, each line 1.5x apart. */
export function centerLines(ctx, lines, x, y, font, color, gap) {
  ctx.font = font; ctx.fillStyle = color;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * (gap || 26)));
}
