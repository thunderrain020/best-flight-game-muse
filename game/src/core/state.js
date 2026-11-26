// CALDERA COURIER — core/state.js
// One game object, built fresh per run. Every system reads and writes
// this shape; nothing else holds game state.
import { LEGS } from '../data/legs.js';
import { freshSeed } from './rng.js';

export function newPlane() {
  return {
    x: 0, y: 130, z: 0, heading: 0, pitch: 0, roll: 0,
    speed: 95, throttle: 0.65, boost: 1, fuel: 100, damage: 0,
    g: 1, grounded: false, landed: false, crashed: false,
  };
}

export function createGame(seed) {
  const s = seed || freshSeed();
  return {
    seed: s, time: 0, mode: 'menu', screen: 'menu',
    leg: 0, legs: LEGS, difficulty: 'Standard',
    score: 0, legScore: 0, best: 0, timer: 0, legTime: 0,
    plane: newPlane(), cam: 'chase', mouseAim: false,
    rings: [], ringIdx: 0, runway: null,
    contract: null, modifier: null, contractsDone: 0,
    perks: [], draft: null, rerolls: 1,
    feats: [], featsDone: [],
    goals: [], momentum: { level: 0, streak: 0, mult: 1, flareT: 0 },
    weather: null, callouts: [], particles: [], floats: [],
    shake: 0, saves: [null, null, null], endless: false,
    stats: { rings: 0, center: 0, perfect: 0, landings: 0, maxAlt: 0, topSpeed: 0, drops: 0 },
    debrief: null, shot: null, toast: null, event: null,
    paused: false, over: false, won: false,
  };
}

/** The 3 per-leg GOALS checklist (2/3 clears the leg bonus). */
export function makeGoals(leg) {
  return [
    { label: `Pass ${Math.max(3, leg.rings - 2)} rings`, done: false, progress: 0, target: Math.max(3, leg.rings - 2) },
    { label: 'Land on the strip', done: false, progress: 0, target: 1 },
    { label: `Beat par ${leg.par}s`, done: false, progress: 0, target: 1 },
  ];
}
export const goalsDone = (g) => g.goals.filter((x) => x.done).length;
