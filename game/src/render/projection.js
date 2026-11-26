// CALDERA COURIER — render/projection.js
// The 3D camera for the Three.js world, in the game's own coordinates:
// forward is +z at heading 0, up is +y, distances are world units.
// The 2D overlay projects world points through this camera, so HUD
// effects, ring labels and particles sit exactly on the 3D scene.
import * as THREE from '../../vendor/three.module.min.js';

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
/** A static camera for the hangar-apron view on the briefing hub. */
export function setupApronCamera(g) {
  const cam = getCamera();
  const rw = g.runway;
  if (!rw) return setupCamera(g);
  // Past the far end of the strip and high up, looking back along it
  // with the view axis well left of the plane: the parked plane lands
  // near the window's centre-right and the hangar sits left of it.
  // The approach-side ridge hides the strip from a low camera, so
  // this side clears the terrain (verified against groundHeight).
  // The lookAt rides at runway level so the plane clears the
  // briefing card at the window's foot.
  cam.position.set(rw.x + 60, rw.y + 30, rw.z + 130);
  cam.up.set(0, 1, 0);
  cam.lookAt(rw.x - 86, rw.y + 0, rw.z + 9);
  cam.updateMatrixWorld(true);
  return cam;
}
/** Project a world point to screen pixels. Null when behind the camera. */
export function project3D(cam, W, H, x, y, z) {
  const v = new THREE.Vector3(x, y, z).project(cam);
  if (v.z > 1 || v.z < -1) return null;
  return { x: (v.x + 1) * 0.5 * W, y: (1 - v.y) * 0.5 * H, d: v.z };
}
