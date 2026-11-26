// CALDERA COURIER — core/shotsUtil.js
// Shared helpers for the staged screenshot states: a play-mode game
// on a chosen leg, with rings, runway, weather and contract already
// in place. Split out of core/shots.js so both stay under the cap.
import { createGame, makeGoals } from './state.js';
import { makeRings } from '../entities/rings.js';
import { makeRunway } from '../entities/runway.js';
import { rollWeather } from '../systems/weatherSys.js';
import { drawSortie } from '../systems/contractsSys.js';

/** A game in mid-flight on leg `legIdx`, frozen for the camera. */
export function base(legIdx, overrides = {}) {
  const g = createGame(4217);
  g.mode = 'play'; g.screen = 'play';
  g.leg = legIdx;
  g.best = 3120;
  g.saves = [
    { seed: 4217, leg: 2, score: 2840, perks: ['P01'], feats: ['F01'], difficulty: 'Standard', when: 0 },
    { seed: 1337, leg: 0, score: 950, perks: [], feats: [], difficulty: 'Calm', when: 0 },
    { seed: 9021, leg: 4, score: 5110, perks: ['P01', 'P07'], feats: ['F01', 'F02'], difficulty: 'Hard', when: 0 },
  ];
  startLegState(g);
  Object.assign(g, overrides);
  return g;
}

/** Fill a game with the leg's rings, runway, weather, contract, goals. */
export function startLegState(g) {
  const leg = g.legs[g.leg];
  g.rings = makeRings(g.seed, leg, g.plane.z);
  g.runway = makeRunway(g.leg, g.plane.z);
  rollWeather(g);
  drawSortie(g);
  g.goals = makeGoals(leg);
  g.legTime = 0; g.legScore = 0;
  g.plane.landed = false; g.plane.crashed = false;
}

/** Park the plane at an exact pose for the camera. */
export function posePlane(g, x, y, z, heading, pitch, roll, speed) {
  const p = g.plane;
  p.x = x; p.y = y; p.z = z;
  p.heading = heading; p.pitch = pitch; p.roll = roll;
  p.speed = speed; p.throttle = 0.9; p.boost = 0.7;
}
