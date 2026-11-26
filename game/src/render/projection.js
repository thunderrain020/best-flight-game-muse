// CALDERA COURIER — render/projection.js
// The custom 3D perspective engine on Canvas2D: a pinhole camera with
// true pitch/roll/yaw. World points -> screen points; nothing here
// needs WebGL, so headless renders never come up blank.
export function makeCamera(g) {
  const p = g.plane;
  if (g.cam === 'cockpit') {
    return { x: p.x, y: p.y + 1.2, z: p.z + 1, yaw: p.heading, pitch: p.pitch, roll: p.roll * 0.35 };
  }
  // Chase: behind and above the tail, looking along the heading, with a
  // slight downward bias so the sea and islands fill the lower screen.
  const back = 34, up = 9;
  return {
    x: p.x - Math.sin(p.heading) * back, y: p.y + up, z: p.z - Math.cos(p.heading) * back,
    yaw: p.heading, pitch: p.pitch * 0.5 - 0.18, roll: p.roll * 0.25,
  };
}
/** Project a world point. Returns null when behind the camera. */
export function project(cam, W, H, px, py, pz) {
  const dx = px - cam.x, dy = py - cam.y, dz = pz - cam.z;
  const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw);
  // Yaw: forward is +z when heading is 0.
  let x1 = dx * cy - dz * sy;
  let z1 = dx * sy + dz * cy;
  let y1 = dy;
  const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  const y2 = y1 * cp - z1 * sp;
  const z2 = y1 * sp + z1 * cp;
  const cr = Math.cos(cam.roll), sr = Math.sin(cam.roll);
  const x2 = x1 * cr - y2 * sr;
  const y3 = x1 * sr + y2 * cr;
  if (z2 < 2) return null;
  const f = H * 0.95;
  return { x: W / 2 + (x2 / z2) * f, y: H * 0.52 - (y3 / z2) * f, d: z2, s: f / z2 };
}
/** Horizon line (screen y at screen x) for the pitch ladder. */
export function horizonY(cam, W, H, x) {
  const f = H * 0.95;
  const pitch = cam.pitch + cam.roll * ((x - W / 2) / W);
  return H * 0.52 - Math.tan(pitch) * f;
}
