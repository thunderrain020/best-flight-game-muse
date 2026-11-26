// CALDERA COURIER — core/shots.js
// Deterministic staged states for the four screenshots. Each one
// builds a real game state through the same systems the player uses,
// then freezes the clock so the capture is stable. Nothing here draws
// placeholders: the render loop draws the staged state exactly as it
// draws live play.
import { base, posePlane } from './shotsUtil.js';
import { setupPrep, setupRush, setupUpgrades } from './shotsOverlays.js';
import { spawnContrail, spawnRingBurst } from '../systems/particles.js';

export function setupShot(name) {
  if (name === 'cover') {
    // Peak climax flight, chase view: banking over the caldera toward
    // a glowing ring and the cliff runway, afterburner lit, slipstream
    // ×6, contrails streaming, instruments crisp.
    const g = base(3);
    posePlane(g, 40, 210, 3900, 0.06, 0.08, 0.5, 178);
    g.plane.throttle = 0.95; g.plane.boost = 0.72;
    g.cam = 'chase';
    g.score = 2840; g.legScore = 1420; g.legTime = 96;
    g.momentum = { level: 2, streak: 6, mult: 2, flareT: 6 };
    g.goals[0].done = true; g.goals[0].progress = 6; g.goals[0].target = 6;
    g.goals[1].done = false;
    g.stats.rings = 4; g.stats.center = 1;
    // The next ring sits dead ahead, close enough to read.
    g.rings[4].x = 90; g.rings[4].y = 230; g.rings[4].z = 4250;
    g.rings.forEach((r, i) => { if (i < 4) r.passed = true; });
    g.callouts.push({ text: 'SLIPSTREAM ×6!', x: 640, y: 300, t: 0.3, color: '#4dc9ff', big: true });
    for (let i = 0; i < 10; i++) spawnContrail(g);
    spawnRingBurst(g, g.rings[4]);
    g.particles = g.particles.slice(0, 60);
    g.shot = 'cover';
    return g;
  }
  if (name === 'prep') return setupPrep();
  if (name === 'rush') return setupRush();
  if (name === 'upgrades') return setupUpgrades();
  return base(0);
}
