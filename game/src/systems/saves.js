// CALDERA COURIER — systems/saves.js
// 3 localStorage save slots: seed, leg, score, perks and feats.
// Guarded so the game still runs when storage is unavailable.
const KEY = 'caldera-courier-saves-v1';
export function loadSaves() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [null, null, null];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? [arr[0] || null, arr[1] || null, arr[2] || null] : [null, null, null];
  } catch { return [null, null, null]; }
}
export function writeSaves(slots) {
  try { localStorage.setItem(KEY, JSON.stringify(slots)); } catch { /* offline-safe */ }
}
export function saveSlot(g, idx) {
  const slots = loadSaves();
  slots[idx] = {
    seed: g.seed, leg: g.leg, score: g.score, perks: g.perks,
    feats: g.featsDone, difficulty: g.difficulty, when: Date.now(),
  };
  writeSaves(slots);
  return slots;
}
export function slotLabel(slot) {
  if (!slot) return 'EMPTY SLOT';
  return `SEED #${slot.seed} · LEG S${slot.leg + 1} · ${slot.score} PTS`;
}
