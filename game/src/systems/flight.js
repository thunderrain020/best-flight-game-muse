// CALDERA COURIER — systems/flight.js
// The flight model: throttle sets target speed, pitch trades speed for
// altitude, bank rolls into a coordinated turn, boost burns the meter,
// airbrake bleeds speed for the flare. Wind shoves the tail.
import { clamp, wrapAngle } from '../core/util.js';
import { groundHeight } from '../entities/terrain.js';

const MAX_SPEED = 210, STALL = 48;
export function stepFlight(g, input, dt) {
  const p = g.plane;
  if (p.grounded || p.crashed) return;
  const prevZ = p.z;
  const boost = input.keys.has('shift');
  const brake = input.keys.has(' ');
  // Pitch: W/S or arrows; mouse-aim steers pitch + roll from the cursor.
  let pitchIn = 0, rollIn = 0;
  if (input.keys.has('w') || input.keys.has('ArrowUp')) pitchIn += 1;
  if (input.keys.has('s') || input.keys.has('ArrowDown')) pitchIn -= 1;
  if (input.keys.has('a') || input.keys.has('ArrowLeft')) rollIn -= 1;
  if (input.keys.has('d') || input.keys.has('ArrowRight')) rollIn += 1;
  if (g.mouseAim) { rollIn += input.aimX * 1.4; pitchIn -= input.aimY * 1.2; }
  // Rudder trim nudges the heading directly.
  if (input.keys.has('q')) p.heading -= 0.25 * dt;
  if (input.keys.has('e')) p.heading += 0.25 * dt;
  p.roll = clamp(p.roll + rollIn * 1.9 * dt, -1.15, 1.15);
  p.roll *= Math.pow(0.55, dt); // roll settles when the stick centres
  p.pitch = clamp(p.pitch + pitchIn * 0.9 * dt, -0.55, 0.6);
  p.pitch *= Math.pow(0.8, dt);
  // Coordinated turn: bank turns the heading.
  p.heading = wrapAngle(p.heading + -p.roll * 0.55 * dt * (p.speed / 120));
  // Throttle: 1/2 nudge it, Shift boosts, Space brakes.
  if (input.keys.has('1')) p.throttle = clamp(p.throttle - 0.4 * dt, 0, 1);
  if (input.keys.has('2')) p.throttle = clamp(p.throttle + 0.4 * dt, 0, 1);
  const target = 55 + p.throttle * 120 + (boost && p.boost > 0 ? 55 : 0);
  const accel = brake ? 90 : 26;
  p.speed += clamp(target - p.speed, -accel * dt, accel * dt);
  if (brake) p.speed = Math.max(38, p.speed - 30 * dt);
  if (boost && p.boost > 0) p.boost = Math.max(0, p.boost - 0.22 * dt);
  else p.boost = Math.min(1, p.boost + 0.05 * dt);
  // Climb costs speed; diving gains it.
  p.speed -= Math.sin(p.pitch) * 22 * dt;
  p.speed = clamp(p.speed, 30, MAX_SPEED);
  // Wind shove, scaled by the leg's wind and the weather event.
  const wind = (g.legs[g.leg].wind + (g.weather ? g.weather.wind : 0)) * 0.5;
  p.x += Math.sin(p.heading) * p.speed * dt + Math.sin(g.time * 0.7) * wind * 0.12 * dt;
  p.z += Math.cos(p.heading) * p.speed * dt;
  p.y += Math.sin(p.pitch) * p.speed * dt;
  p.y = clamp(p.y, 10, 1400);
  // G load from bank + pitch rate; fragile cargo hates hard banks.
  p.g = 1 + Math.abs(p.roll) * 1.4 + Math.abs(pitchIn) * 0.4;
  // Terrain: clip the floor, crash on a hard hit.
  const ground = groundHeight(p.x, p.z);
  if (p.y <= ground + 3) {
    if (p.speed < 60 && Math.abs(p.pitch) < 0.2) { p.y = ground + 3; }
    else { p.crashed = true; p.damage = 100; }
  }
  if (p.speed < STALL && p.y > ground + 40) p.y -= (STALL - p.speed) * 0.35 * dt;
  g.prevZ = prevZ;
  // Stats.
  g.stats.maxAlt = Math.max(g.stats.maxAlt, p.y);
  g.stats.topSpeed = Math.max(g.stats.topSpeed, p.speed);
}
