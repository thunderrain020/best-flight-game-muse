// CALDERA COURIER — core/util.js
// Tiny shared math + formatting helpers. Every module imports from here
// so the numbers on the HUD, the flight model and the render agree.
export const TAU = Math.PI * 2;
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const deg = (r) => (r * 180) / Math.PI;
export const rad = (d) => (d * Math.PI) / 180;
/** Wrap an angle to [-PI, PI]. */
export const wrapAngle = (a) => {
  while (a > Math.PI) a -= TAU;
  while (a < -Math.PI) a += TAU;
  return a;
};
export const fmtInt = (n) => Math.round(n).toLocaleString('en-US');
/** Heading 0..359 as a zero-padded 3-digit string. */
export const fmtHdg = (h) => {
  const d = Math.round(((deg(h) % 360) + 360) % 360);
  return String(d).padStart(3, '0') + '°';
};
/** mm:ss timer. */
export const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
};
/** Deterministic 2D value noise in [-1, 1] from integer lattice coords. */
export function hash2(x, z) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
}
export function smoothNoise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z);
  const xf = x - xi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  const a = hash2(xi, zi), b = hash2(xi + 1, zi);
  const c = hash2(xi, zi + 1), d = hash2(xi + 1, zi + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}
