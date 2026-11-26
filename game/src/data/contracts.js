// CALDERA COURIER — data/contracts.js
// 18 air-mail contracts & maneuver challenges. Each sortie draws one
// active contract plus a per-sortie modifier; finishing it pays bonus
// mail and feeds the GOALS checklist.
export const MODIFIERS = [
  { id: 'LOW-ALT', label: 'LOW-ALTITUDE < 400ft', desc: 'Stay under 400 ft for the whole leg.' },
  { id: 'FRAGILE', label: 'FRAGILE CARGO: MAX 2.5G', desc: 'No hard banks over 2.5G or the cargo breaks.' },
  { id: 'XWIND', label: 'CROSSWIND LANDING', desc: 'Land with a crosswind shoving the tail.' },
  { id: 'CHAIN', label: 'RING CHAIN', desc: 'Pass 4 rings in a row without missing one.' },
  { id: 'NIGHT', label: 'NO LIGHTS', desc: 'Fly the leg on instruments alone.' },
  { id: 'SPEED', label: 'EXPRESS MAIL', desc: 'Beat par time by 15 seconds or more.' },
];
export const CONTRACTS = [
  { id: 'C01', name: 'Dawn Post Run', goal: 'Deliver the dawn mail', pay: 150, kind: 'mail' },
  { id: 'C02', name: 'Island Hop', goal: 'Land on 2 island strips', pay: 200, kind: 'mail' },
  { id: 'C03', name: 'Lighthouse Keeper', goal: 'Circle the lighthouse twice', pay: 180, kind: 'tour' },
  { id: 'C04', name: 'Volcano Watch', goal: 'Photograph the lava rim', pay: 260, kind: 'photo' },
  { id: 'C05', name: 'Rescue Call', goal: 'Pick up the stranded climber', pay: 320, kind: 'rescue' },
  { id: 'C06', name: 'Ring Master', goal: 'Pass every ring in the leg', pay: 240, kind: 'rings' },
  { id: 'C07', name: 'Storm Courier', goal: 'Deliver through the squall', pay: 280, kind: 'mail' },
  { id: 'C08', name: 'Night Owl', goal: 'Land by beacon light only', pay: 300, kind: 'mail' },
  { id: 'C09', name: 'Barrel Roll', goal: 'Roll 360° through a ring', pay: 220, kind: 'stunt' },
  { id: 'C10', name: 'Low Pass', goal: 'Skim under 200 ft for 10 s', pay: 190, kind: 'stunt' },
  { id: 'C11', name: 'Thermal Rider', goal: 'Ride 3 thermals to 800 ft', pay: 210, kind: 'soar' },
  { id: 'C12', name: 'Smoke Runner', goal: 'Thread the ash plume gap', pay: 270, kind: 'stunt' },
  { id: 'C13', name: 'Double Delivery', goal: 'Two drops, one sortie', pay: 340, kind: 'mail' },
  { id: 'C14', name: 'Perfect Touchdown', goal: 'Land under 40 kts, on the stripes', pay: 250, kind: 'land' },
  { id: 'C15', name: 'Slipstream Ace', goal: 'Hold MACH FLARE for 8 s', pay: 290, kind: 'speed' },
  { id: 'C16', name: 'Mail Drop', goal: 'Drop the bag in the target circle', pay: 200, kind: 'drop' },
  { id: 'C17', name: 'Caldera Survey', goal: 'Map all 3 rim beacons', pay: 310, kind: 'photo' },
  { id: 'C18', name: 'Final Courier', goal: 'Carry the last letter home', pay: 400, kind: 'mail' },
];
export const contractById = (id) => CONTRACTS.find((c) => c.id === id) || CONTRACTS[0];
