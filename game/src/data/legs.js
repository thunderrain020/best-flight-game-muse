// CALDERA COURIER — data/legs.js
// The 7-leg campaign: Dawn Lagoon to the Volcano Rim finale. Each leg
// names its sky, its ring count, its par time and its weather flavour.
export const LEGS = [
  { id: 'S1', name: 'Dawn Lagoon', sub: 'Calm water, first mail run', rings: 6, par: 150, sky: 'dawn', wind: 4, alt: 90 },
  { id: 'S2', name: 'Terraced Gorge', sub: 'Emerald ridges, low passes', rings: 7, par: 170, sky: 'day', wind: 7, alt: 120 },
  { id: 'S3', name: 'Monsoon Squall', sub: 'Rain bands and shear', rings: 8, par: 190, sky: 'storm', wind: 12, alt: 140 },
  { id: 'S4', name: 'Caldera Ridge', sub: 'Smoke over the lava rim', rings: 8, par: 200, sky: 'ash', wind: 10, alt: 180 },
  { id: 'S5', name: 'Night Lighthouse', sub: 'Beacons only, trust the dials', rings: 9, par: 210, sky: 'night', wind: 8, alt: 160 },
  { id: 'S6', name: 'Typhoon Crossing', sub: 'Crosswinds that shove the tail', rings: 9, par: 220, sky: 'storm', wind: 16, alt: 200 },
  { id: 'S7', name: 'Volcano Rim & Cliffside Runway', sub: 'The finale: rim, then the cliff strip', rings: 10, par: 240, sky: 'ash', wind: 14, alt: 220 },
];
export const LEG_COUNT = LEGS.length;
export const legById = (id) => LEGS.find((l) => l.id === id) || LEGS[0];
