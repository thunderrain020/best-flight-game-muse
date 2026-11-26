// CALDERA COURIER — entities/plane.js
// The twin-boom mailplane: brass & canvas, built from projected 3D
// parts (fuselage, wings, booms, tail, prop, floats). Parts are lists
// of local-space points; render/plane3d.js projects them.
export const PLANE_COLORS = {
  brass: '#c9973f', brassDark: '#8a6420', canvas: '#e8dcc0',
  canvasShade: '#cbb98f', red: '#b83a2a', dark: '#2a2118', glass: '#9fd8e8',
};
/** Local-space skeleton of the aircraft (nose +z, up +y, span x). */
export const PLANE_PARTS = {
  fuselage: [[-1.6, 0, 6.5], [1.6, 0, 6.5], [1.9, 0.4, 2], [1.9, 0.4, -4], [-1.9, 0.4, -4], [-1.9, 0.4, 2]],
  nose: [[-1.2, 0.2, 6.5], [1.2, 0.2, 6.5], [0, 1.0, 5.2]],
  wingL: [[-1.8, 0.5, 2.5], [-13, 0.9, 1.2], [-13, 0.9, -1.2], [-1.8, 0.5, -1.0]],
  wingR: [[1.8, 0.5, 2.5], [13, 0.9, 1.2], [13, 0.9, -1.2], [1.8, 0.5, -1.0]],
  tailL: [[-1.8, 0.3, -4.5], [-6.5, 0.6, -6.5], [-6.5, 0.6, -8.2], [-1.8, 0.3, -7.6]],
  tailR: [[1.8, 0.3, -4.5], [6.5, 0.6, -6.5], [6.5, 0.6, -8.2], [1.8, 0.3, -7.6]],
  boomL: [[-2.2, 0.2, -1], [-2.2, 0.2, -8.5], [-1.4, 0.2, -8.5], [-1.4, 0.2, -1]],
  boomR: [[2.2, 0.2, -1], [2.2, 0.2, -8.5], [1.4, 0.2, -8.5], [1.4, 0.2, -1]],
  fin: [[-0.2, 0.4, -7.6], [-0.2, 3.4, -8.4], [0.2, 3.4, -8.4], [0.2, 0.4, -7.6]],
  canopy: [[-1.1, 0.6, 3.4], [1.1, 0.6, 3.4], [0.9, 1.7, 1.2], [-0.9, 1.7, 1.2]],
  floatL: [[-2.6, -1.8, 4.5], [-2.6, -1.8, -2.5], [-1.8, -1.8, -2.5], [-1.8, -1.8, 4.5]],
  floatR: [[2.6, -1.8, 4.5], [2.6, -1.8, -2.5], [1.8, -1.8, -2.5], [1.8, -1.8, 4.5]],
};
/** A point in plane-local space -> world space, by heading/pitch/roll. */
export function planeLocalToWorld(p, x, y, z, heading, pitch, roll) {
  const ch = Math.cos(heading), sh = Math.sin(heading);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const cr = Math.cos(roll), sr = Math.sin(roll);
  // roll (x-axis), then pitch, then yaw
  let [lx, ly, lz] = p;
  let ty = ly * cr - lz * sr, tz = ly * sr + lz * cr; ly = ty;
  let tx = lx * cp + tz * sp; tz = -lx * sp + tz * cp; lx = tx;
  tx = lx * ch + tz * sh; tz = -lx * sh + tz * ch;
  return [x + tx, y + ly, z + tz];
}
