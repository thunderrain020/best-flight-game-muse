// CALDERA COURIER — systems/momentum.js
// The 3-tier slipstream meter: CRUISE -> SLIPSTREAM -> MACH FLARE.
// Clean ring chains and low-altitude speed build the streak; missing
// a ring or scraping terrain breaks it. The tier multiplies ring pay.
export const TIERS = [
  { name: 'CRUISE', mult: 1, color: '#d8cdb4' },
  { name: 'SLIPSTREAM', mult: 1.5, color: '#4dc9ff' },
  { name: 'MACH FLARE', mult: 2, color: '#ff5a3c' },
];
export function momentumTick(g, dt, ringEvent) {
  const m = g.momentum;
  if (ringEvent) {
    m.streak++;
    if (m.streak >= 6 && m.level < 2) {
      m.level = 2; m.flareT = 8;
      g.callouts.push({ text: 'MACH FLARE!', x: 640, y: 300, t: 0, color: '#ff5a3c', big: true });
    } else if (m.streak >= 3 && m.level < 1) {
      m.level = 1;
      g.callouts.push({ text: `SLIPSTREAM ×${m.streak}!`, x: 640, y: 300, t: 0, color: '#4dc9ff', big: true });
    } else if (m.streak >= 3) {
      g.callouts.push({ text: `SLIPSTREAM ×${m.streak}!`, x: 640, y: 300, t: 0, color: '#4dc9ff', big: false });
    }
  }
  if (m.level === 2) {
    m.flareT -= dt;
    if (m.flareT <= 0) { m.level = 1; m.streak = 3; }
  }
  // Low, fast and clean builds the streak slowly on its own.
  const p = g.plane;
  if (p.speed > 150 && p.y < 400 && !ringEvent) m.streak += dt * 0.15;
  m.mult = TIERS[m.level].mult;
}
export function breakStreak(g, why) {
  const m = g.momentum;
  if (m.streak >= 3) g.callouts.push({ text: why, x: 640, y: 300, t: 0, color: '#ff8a7a', big: false });
  m.streak = 0; m.level = 0; m.mult = 1; m.flareT = 0;
}
export const tierName = (g) => TIERS[g.momentum.level].name;
