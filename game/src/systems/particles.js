// CALDERA COURIER — systems/particles.js
// Particles and floating callouts: ring shockwaves, boost plumes,
// wingtip contrails, touchdown puffs. Updated here, drawn in render/fx.js.
export function spawnRingBurst(g, ring) {
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    g.particles.push({
      x: ring.x + Math.cos(a) * ring.r, y: ring.y + Math.sin(a) * ring.r, z: ring.z,
      vx: Math.cos(a) * 30, vy: Math.sin(a) * 30, vz: 0, life: 0.9, kind: 'ring',
    });
  }
}
export function spawnContrail(g) {
  const p = g.plane;
  if (p.speed < 110) return;
  for (const side of [-1, 1]) {
    g.particles.push({
      x: p.x + side * 13, y: p.y + 1, z: p.z - 9,
      vx: 0, vy: 0, vz: -p.speed * 0.5, life: 1.4, kind: 'trail',
    });
  }
}
export function spawnBoost(g) {
  const p = g.plane;
  g.particles.push({
    x: p.x + (Math.random() - 0.5) * 2, y: p.y - 1, z: p.z - 8,
    vx: 0, vy: -4, vz: -90, life: 0.5, kind: 'boost',
  });
}
export function spawnPuff(g, x, y, z) {
  for (let i = 0; i < 14; i++) {
    g.particles.push({
      x, y: y + 1, z, vx: (Math.random() - 0.5) * 24, vy: Math.random() * 12,
      vz: (Math.random() - 0.5) * 24, life: 0.8, kind: 'puff',
    });
  }
}
export function tickParticles(g, dt) {
  for (const pt of g.particles) {
    pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.z += pt.vz * dt; pt.life -= dt;
  }
  g.particles = g.particles.filter((pt) => pt.life > 0);
  for (const c of g.callouts) c.t += dt;
  g.callouts = g.callouts.filter((c) => c.t < 1.6);
  if (g.shake > 0) g.shake = Math.max(0, g.shake - dt * 2);
}
export function addCallout(g, text, color, big) {
  g.callouts.push({ text, x: 640, y: 300, t: 0, color, big: !!big });
}
