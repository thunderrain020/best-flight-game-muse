// CALDERA COURIER — data/feats.js
// 18 pilot feats: career milestones the debrief stamps onto the wings.
export const FEATS = [
  { id: 'F01', name: 'First Flight', desc: 'Finish leg S1.' },
  { id: 'F02', name: 'Ring Rookie', desc: 'Pass 10 rings in one campaign.' },
  { id: 'F03', name: 'Ring Master', desc: 'Pass every ring in a leg.' },
  { id: 'F04', name: 'Center Ring', desc: 'Pass a ring dead-center.' },
  { id: 'F05', name: 'Slipstream Six', desc: 'Reach SLIPSTREAM ×6.' },
  { id: 'F06', name: 'Mach Flare', desc: 'Hold MACH FLARE for 8 s.' },
  { id: 'F07', name: 'Low Rider', desc: 'Fly under 200 ft for 10 s.' },
  { id: 'F08', name: 'Calm Hands', desc: 'Land with zero damage.' },
  { id: 'F09', name: 'Perfect Touchdown', desc: 'Land under 40 kts on the stripes.' },
  { id: 'F10', name: 'Storm Rider', desc: 'Finish a leg in a monsoon.' },
  { id: 'F11', name: 'Ash Runner', desc: 'Thread the ash plume gap.' },
  { id: 'F12', name: 'Night Owl', desc: 'Finish a night leg.' },
  { id: 'F13', name: 'Mail Hawk', desc: 'Complete 5 contracts.' },
  { id: 'F14', name: 'Full Set', desc: 'Own 4 pieces of one set.' },
  { id: 'F15', name: 'Mythic Airframe', desc: 'Own a Mythic perk.' },
  { id: 'F16', name: 'Courier Prime', desc: 'Score 5,000 in one leg.' },
  { id: 'F17', name: 'Volcano Rim', desc: 'Reach leg S7.' },
  { id: 'F18', name: 'Caldera Courier', desc: 'Finish the whole campaign.' },
];
export const featById = (id) => FEATS.find((f) => f.id === id) || FEATS[0];
