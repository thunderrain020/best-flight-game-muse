// CALDERA COURIER — src/main.js
// Boot + game loop. The canvas is a fixed 1280×720 stage, scaled by
// CSS to the window. `?shot=cover|prep|rush|upgrades` freezes a staged
// screenshot state and draws it once; otherwise the loop runs live:
// menu -> brief -> play -> draft -> next leg -> debrief / over.
import { createGame } from './core/state.js';
import { createInput, attachInput, endFrame } from './core/input.js';
import { setupShot } from './core/shots.js';
import { handleKeys, finishLeg, finishCampaign } from './core/flow.js';
import { stepFlight } from './systems/flight.js';
import { ringScore, landingScore } from './systems/scoring.js';
import { momentumTick, breakStreak } from './systems/momentum.js';
import { weatherTick } from './systems/weatherSys.js';
import { modifierViolated } from './systems/contractsSys.js';
import { loadSaves } from './systems/saves.js';
import { sfx } from './systems/audio.js';
import { tickParticles, spawnRingBurst, spawnContrail, spawnBoost } from './systems/particles.js';
import { ringPassed, nextRing } from './entities/rings.js';
import { landingCheck } from './entities/runway.js';
import { drawScene } from './render/scene.js';

const W = 1280, H = 720;
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const params = new URLSearchParams(location.search);
const shotName = params.get('shot');
const seedParam = Number(params.get('seed')) || undefined;

let g = createGame(seedParam);
g.saves = loadSaves();
g.best = Math.max(0, ...g.saves.filter(Boolean).map((s) => s.score));
const input = createInput();
attachInput(input, canvas);

function stepPlay(dt) {
  const p = g.plane;
  stepFlight(g, input, dt);
  weatherTick(g, dt);
  g.timer += dt; g.legTime += dt; g.time += dt;
  const prevZ = g.prevZ ?? p.z;
  for (const ring of g.rings) {
    const res = ringPassed(p, prevZ, ring);
    if (res) {
      ringScore(g, res === 'center');
      momentumTick(g, dt, true);
      spawnRingBurst(g, ring);
      sfx.ring();
      if (res === 'center') sfx.center();
    }
  }
  const nxt = nextRing(g.rings);
  if (nxt && p.z > nxt.z + 80 && !nxt.passed) {
    nxt.passed = true;
    breakStreak(g, 'RING MISSED');
  }
  if (modifierViolated(g)) breakStreak(g, 'MODIFIER BROKEN');
  momentumTick(g, dt, false);
  if (input.keys.has('shift') && p.boost > 0) spawnBoost(g);
  spawnContrail(g);
  if (g.runway) {
    const res = landingCheck(p, g.runway);
    if (res === 'perfect' || res === 'landed') {
      landingScore(g, res);
      if (g.leg >= 6) finishCampaign(g);
      else finishLeg(g, res);
    } else if (res === 'hard') {
      p.damage += 30; p.crashed = true; g.shake = 1;
      sfx.crash();
    }
  }
  if (p.crashed) { g.mode = 'over'; g.screen = 'over'; g.over = true; }
  tickParticles(g, dt);
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  g = handleKeys(g, input);
  if (g.mode === 'play' && !g.paused) stepPlay(dt);
  drawScene(ctx, W, H, g);
  endFrame(input);
  requestAnimationFrame(frame);
}

if (shotName) {
  // Screenshot mode: stage the state, freeze the clock, draw once.
  g = setupShot(shotName);
  g.saves = loadSaves();
  g.shot = shotName;
  g.time = 2.4;
  drawScene(ctx, W, H, g);
  document.title = `CALDERA COURIER — shot ${shotName}`;
} else {
  requestAnimationFrame(frame);
}
