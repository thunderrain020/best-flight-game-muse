// CALDERA COURIER — render/projection.js
// The 3D camera for the Three.js world, in the game's own coordinates:
// forward is +z at heading 0, up is +y, distances are world units.
// The 2D overlay projects world points through this camera, so HUD
// effects, ring labels and particles sit exactly on the 3D scene.
import * as THREE from '../../vendor/three.module.min.js';
import { VOLCANO } from '../entities/terrain.js';

let camera = null;
/** The shared perspective camera (created once, reused every frame). */
export function getCamera() {
  if (!camera) {
    camera = new THREE.PerspectiveCamera(62, 1280 / 720, 0.5, 14000);
  }
  return camera;
}
/** Chase (default) and cockpit camera poses, matching the V1 framing. */
export function setupCamera(g) {
  const cam = getCamera();
  if (cam.fov !== 62) { cam.fov = 62; cam.updateProjectionMatrix(); }
  const p = g.plane;
  const fx = Math.sin(p.heading), fz = Math.cos(p.heading);
  if (g.cam === 'cockpit') {
    cam.position.set(p.x + fx * 1.5, p.y + 1.4, p.z + fz * 1.5);
    const phi = p.pitch;
    const dir = new THREE.Vector3(fx * Math.cos(phi), Math.sin(phi), fz * Math.cos(phi));
    cam.up.set(-fz * Math.sin(p.roll * 0.35), Math.cos(p.roll * 0.35), fx * Math.sin(p.roll * 0.35));
    cam.lookAt(cam.position.clone().add(dir.multiplyScalar(120)));
  } else {
    // Chase: behind, above and a touch to the side, so the mailplane
    // shows its flank as well as its tail; looking along the heading
    // with a slight downward bias so the sea fills the lower screen.
    const back = 38, up = 11, side = 10;
    cam.position.set(p.x - fx * back + fz * side, p.y + up, p.z - fz * back - fx * side);
    const phi = p.pitch * 0.5 - 0.18;
    const dir = new THREE.Vector3(fx * Math.cos(phi), Math.sin(phi), fz * Math.cos(phi));
    cam.up.set(-fz * Math.sin(p.roll * 0.25), Math.cos(p.roll * 0.25), fx * Math.sin(p.roll * 0.25));
    cam.lookAt(cam.position.clone().add(dir.multiplyScalar(160)));
  }
  cam.updateMatrixWorld(true);
  return cam;
}
/** A static camera for the hangar-apron view on the briefing hub.
 * 2.5x closer than V2 and low, on the parked-plane -> volcano line:
 * the camera sits ~66 m off the plane's nose quarter, looking back
 * along the strip toward the smoking volcano, so the brass-and-ivory
 * aircraft, the control tower, the lighthouse beam and the volcano
 * all fill the right panel. A wider 70 deg field of view holds them
 * together. Verified against groundHeight + projection probes. */
export function setupApronCamera(g) {
  const cam = getCamera();
  const rw = g.runway;
  if (!rw) return setupCamera(g);
  const px = rw.x, py = rw.y + 4, pz = rw.z;
  const dx = VOLCANO.x - px, dy = 310 - py, dz = VOLCANO.z - pz;
  const len = Math.hypot(dx, dy, dz);
  const ux = dx / len, uy = dy / len, uz = dz / len;
  if (cam.fov !== 70) { cam.fov = 70; cam.updateProjectionMatrix(); }
  cam.position.set(px - ux * 66, py - uy * 66 + 14, pz - uz * 66);
  cam.up.set(0, 1, 0);
  cam.lookAt(px + ux * 130 - 60, py + uy * 130 - 15, pz + uz * 130);
  cam.updateMatrixWorld(true);
  return cam;
}
/** Project a world point to screen pixels. Null when behind the camera. */
export function project3D(cam, W, H, x, y, z) {
  const v = new THREE.Vector3(x, y, z).project(cam);
  if (v.z > 1 || v.z < -1) return null;
  return { x: (v.x + 1) * 0.5 * W, y: (1 - v.y) * 0.5 * H, d: v.z };
}
