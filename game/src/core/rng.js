// CALDERA COURIER — core/rng.js
// Seeded RNG (mulberry32) so every run with the same SEED # plays the
// same sky: same islands, same rings, same weather roll.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Pick a SEED # in 1000..9999 from the clock when the player starts fresh. */
export function freshSeed() {
  return 1000 + Math.floor(Math.random() * 9000);
}
export function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}
export function shuffle(rng, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
