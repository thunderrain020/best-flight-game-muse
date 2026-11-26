// CALDERA COURIER — data/weather.js
// Named weather / boss events. Each leg rolls one; it shapes wind,
// particles and the banner on HUD row 2.
export const WEATHER = [
  { id: 'CALM', name: 'CLEAR SKIES', desc: 'Smooth air, sun on the brass.', wind: 3, rain: 0, ash: 0 },
  { id: 'ASH', name: 'VOLCANIC ASH PLUME', desc: 'Grey snow over the caldera.', wind: 8, rain: 0, ash: 1 },
  { id: 'MONSOON', name: 'MONSOON SHEAR', desc: 'Rain bands and sideways gusts.', wind: 14, rain: 1, ash: 0 },
  { id: 'GALE', name: 'CROSSWIND GALE', desc: 'The tail never sits still.', wind: 18, rain: 0, ash: 0 },
  { id: 'NIGHT', name: 'NIGHT LIGHTHOUSE', desc: 'Beacons only. Trust the dials.', wind: 6, rain: 0, ash: 0 },
  { id: 'FINALE', name: 'FINAL CARRIER / CLIFF APPROACH', desc: 'Rim winds, one strip, no go-around.', wind: 12, rain: 0, ash: 1 },
];
export const weatherById = (id) => WEATHER.find((w) => w.id === id) || WEATHER[0];
/** The sky palette for each leg sky key: [top, horizon, sun, haze]. */
export const SKIES = {
  dawn: ['#2b3a6e', '#ff9e5e', '#ffd9a0', 'rgba(255,158,94,0.25)'],
  day: ['#2f6fb8', '#a8d8f0', '#fff3c4', 'rgba(168,216,240,0.18)'],
  storm: ['#232a3d', '#5a6b7d', '#e8eef2', 'rgba(90,107,125,0.35)'],
  ash: ['#3a2a33', '#c96b3a', '#ffb36b', 'rgba(201,107,58,0.3)'],
  night: ['#060a1e', '#1c2a55', '#dfe8ff', 'rgba(28,42,85,0.4)'],
};
