// CALDERA COURIER — data/perks.js
// 18 airframe perks in 3 named sets. Owning 2+ pieces of a set lights
// its live set bonus; 4 pieces is the full set. Drafted 1-of-3 in the
// hangar between legs, with a reroll economy.
export const SETS = {
  THERMAL: { name: 'THERMAL', color: '#ff9a3c', bonus2: 'Thermals lift +40%', bonus4: 'Ash never slows you' },
  TURBO: { name: 'TURBO', color: '#ff5a5a', bonus2: 'Boost lasts +50%', bonus4: 'Afterburner is free' },
  NAVIGATOR: { name: 'NAVIGATOR', color: '#4dc9ff', bonus2: 'Rings pay +25%', bonus4: 'Next ring always marked' },
};
export const PERKS = [
  { id: 'P01', name: 'Canvas Sails', set: 'THERMAL', rarity: 'Common', desc: 'Thermals lift you a little higher.' },
  { id: 'P02', name: 'Brass Cowl', set: 'THERMAL', rarity: 'Common', desc: 'Engine runs cooler in ash.' },
  { id: 'P03', name: 'Updraft Keel', set: 'THERMAL', rarity: 'Rare', desc: 'Climb rate +20% in thermals.' },
  { id: 'P04', name: 'Smoke Filter', set: 'THERMAL', rarity: 'Rare', desc: 'Ash plumes cost no speed.' },
  { id: 'P05', name: 'Phoenix Plating', set: 'THERMAL', rarity: 'Mythic', desc: 'Lava glow heals 1 damage / s.' },
  { id: 'P06', name: 'Ember Prop', set: 'THERMAL', rarity: 'Mythic', desc: 'Prop wash melts headwind.' },
  { id: 'P07', name: 'Twin Supercharger', set: 'TURBO', rarity: 'Common', desc: 'Top speed +8 kts.' },
  { id: 'P08', name: 'Boost Tank', set: 'TURBO', rarity: 'Common', desc: 'Boost meter +25%.' },
  { id: 'P09', name: 'Afterburner Nozzles', set: 'TURBO', rarity: 'Rare', desc: 'Boost acceleration +35%.' },
  { id: 'P10', name: 'Slipstream Fins', set: 'TURBO', rarity: 'Rare', desc: 'Slipstream builds twice as fast.' },
  { id: 'P11', name: 'Mach Needle', set: 'TURBO', rarity: 'Mythic', desc: 'MACH FLARE pays double.' },
  { id: 'P12', name: 'Rocket Assist', set: 'TURBO', rarity: 'Mythic', desc: 'One free rocket climb per leg.' },
  { id: 'P13', name: 'Brass Compass', set: 'NAVIGATOR', rarity: 'Common', desc: 'Compass tape never drifts.' },
  { id: 'P14', name: 'Ring Finder', set: 'NAVIGATOR', rarity: 'Common', desc: 'Rings glow 20% brighter.' },
  { id: 'P15', name: 'Altimeter Glass', set: 'NAVIGATOR', rarity: 'Rare', desc: 'Altitude tape reads to the foot.' },
  { id: 'P16', name: 'Chart Table', set: 'NAVIGATOR', rarity: 'Rare', desc: 'Landing strip marked from takeoff.' },
  { id: 'P17', name: 'Star Sextant', set: 'NAVIGATOR', rarity: 'Mythic', desc: 'Night legs fly like day.' },
  { id: 'P18', name: 'Mail Hawk', set: 'NAVIGATOR', rarity: 'Mythic', desc: 'Contracts pay +50 mail.' },
];
export const RARITY_COLOR = { Common: '#d8cdb4', Rare: '#4dc9ff', Mythic: '#ffb52e' };
/** Live set counts from owned perk ids, e.g. { THERMAL: 2 }. */
export function setCounts(ownedIds) {
  const counts = { THERMAL: 0, TURBO: 0, NAVIGATOR: 0 };
  for (const id of ownedIds) {
    const p = PERKS.find((x) => x.id === id);
    if (p) counts[p.set]++;
  }
  return counts;
}
export function setBonusText(setName, count) {
  const s = SETS[setName];
  if (count >= 4) return s.bonus4;
  if (count >= 2) return s.bonus2;
  return 'Need 2 pieces';
}
