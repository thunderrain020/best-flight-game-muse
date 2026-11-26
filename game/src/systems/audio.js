// CALDERA COURIER — systems/audio.js
// Tiny WebAudio synth: engine hum, ring chime, touchdown thud, UI
// clicks. No audio files, no network; starts on the first keypress.
let ctx = null;
function ac() {
  if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function tone(freq, dur, type, gain, slideTo) {
  const c = ac(); if (!c) return;
  const o = c.createOscillator(), gn = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, c.currentTime);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);
  gn.gain.setValueAtTime(gain, c.currentTime);
  gn.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
  o.connect(gn); gn.connect(c.destination);
  o.start(); o.stop(c.currentTime + dur);
}
export const sfx = {
  ring: () => { tone(880, 0.18, 'sine', 0.12); tone(1320, 0.25, 'sine', 0.08); },
  center: () => { tone(660, 0.12, 'triangle', 0.12); tone(990, 0.12, 'triangle', 0.12); tone(1320, 0.3, 'sine', 0.1); },
  land: () => { tone(120, 0.3, 'sine', 0.2, 60); },
  crash: () => { tone(220, 0.5, 'sawtooth', 0.15, 40); },
  click: () => tone(1200, 0.06, 'square', 0.05),
  draft: () => { tone(520, 0.15, 'triangle', 0.1); tone(780, 0.2, 'triangle', 0.1); },
  fanfare: () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.35, 'triangle', 0.12), i * 120)); },
};
