// CALDERA COURIER — render/aircraft3d.js
// The twin-boom mailplane as a composed Three.js model: tapered
// brass-and-ivory fuselage, cowling, spinning prop, swept wings with
// nav lights and moving ailerons, twin fins and booms, floats and
// struts, glowing exhausts, and lit gauges behind the glass canopy.
// Local space: nose +z, up +y, span x (same as entities/plane.js).
import * as THREE from '../../vendor/three.module.min.js';
import { PLANE_COLORS } from '../entities/plane.js';

const C = PLANE_COLORS;
const M = {
  brass: new THREE.MeshLambertMaterial({ color: C.brass }),
  brassDark: new THREE.MeshLambertMaterial({ color: C.brassDark }),
  canvas: new THREE.MeshLambertMaterial({ color: C.canvas }),
  shade: new THREE.MeshLambertMaterial({ color: C.canvasShade }),
  red: new THREE.MeshLambertMaterial({ color: C.red }),
  dark: new THREE.MeshLambertMaterial({ color: C.dark }),
  glass: new THREE.MeshPhongMaterial({ color: 0x9fd8e8, transparent: true, opacity: 0.55, shininess: 120 }),
  amber: new THREE.MeshBasicMaterial({ color: 0xffb52e }),
  cyan: new THREE.MeshBasicMaterial({ color: 0x4dc9ff }),
  exhaust: new THREE.MeshBasicMaterial({ color: 0xff7a30 }),
  prop: new THREE.MeshBasicMaterial({ color: 0xdce1e6, transparent: true, opacity: 0.15, side: THREE.DoubleSide }),
  navR: new THREE.MeshBasicMaterial({ color: 0xff2a2a }),
  navG: new THREE.MeshBasicMaterial({ color: 0x2aff5a }),
};

function box(w, h, d, mat, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}
function cyl(rt, rb, h, mat, x, y, z, seg = 10) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.position.set(x, y, z);
  return m;
}

export function buildAircraft() {
  const g = new THREE.Group();
  // Fuselage: tapered brass tube, nose cone, cowling ring.
  const fus = cyl(1.0, 1.7, 10.5, M.brass, 0, 0.2, 1.2, 12);
  fus.rotation.x = Math.PI / 2;
  g.add(fus);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(1.0, 2.4, 12), M.red);
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 0.2, 7.4);
  g.add(nose);
  const cowl = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.28, 8, 16), M.brassDark);
  cowl.position.set(0, 0.2, 5.6);
  g.add(cowl);
  // Glass canopy + dark dash + three lit gauge discs inside.
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(1.25, 14, 10), M.glass);
  canopy.scale.set(0.95, 0.75, 1.5);
  canopy.position.set(0, 1.15, 2.4);
  g.add(canopy);
  g.add(box(1.9, 0.7, 0.5, M.dark, 0, 0.95, 2.9));
  for (let i = -1; i <= 1; i++) {
    const d = new THREE.Mesh(new THREE.CircleGeometry(0.22, 12), i === 0 ? M.amber : M.cyan);
    d.position.set(i * 0.6, 1.05, 3.18);
    g.add(d);
  }
  // Swept wings, red tips, moving ailerons, nav lights.
  const ailerons = [];
  for (const s of [-1, 1]) {
    const wing = box(11.4, 0.45, 3.4, M.canvas, s * 7.2, 0.6, 0.6);
    wing.rotation.y = -s * 0.1;
    g.add(wing);
    g.add(box(1.6, 0.48, 3.4, M.red, s * 12.4, 0.6, 0.6));
    const ail = box(3.2, 0.3, 1.2, M.shade, s * 9.4, 0.5, -1.4);
    g.add(ail);
    ailerons.push({ mesh: ail, side: s });
    const nav = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), s < 0 ? M.navR : M.navG);
    nav.position.set(s * 13, 0.6, 0.6);
    g.add(nav);
  }
  // Twin booms, tailplane halves, twin fins, tail cone.
  for (const s of [-1, 1]) {
    const boom = cyl(0.42, 0.42, 7.6, M.brassDark, s * 1.9, 0.2, -4.6, 8);
    boom.rotation.x = Math.PI / 2;
    g.add(boom);
    g.add(box(4.6, 0.35, 1.8, M.shade, s * 4.2, 0.55, -7.6));
    const fin = box(0.3, 3.0, 1.6, M.red, s * 1.9, 1.9, -7.9);
    fin.rotation.x = -0.12;
    g.add(fin);
  }
  // Spinning prop: blur disc + two blades on a hub.
  const prop = new THREE.Group();
  prop.position.set(0, 0.2, 8.4);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(3.2, 24), M.prop);
  prop.add(disc);
  for (const a of [0, Math.PI / 2]) {
    const blade = box(0.5, 8.4, 0.18, M.dark, 0, 0, 0);
    blade.rotation.z = a;
    prop.add(blade);
  }
  g.add(prop);
  // Glowing twin exhausts under the cowling.
  const exhausts = [];
  for (const s of [-1, 1]) {
    const e = cyl(0.22, 0.3, 1.1, M.exhaust, s * 1.1, -0.6, 5.2, 8);
    e.rotation.x = Math.PI / 2;
    g.add(e);
    exhausts.push(e);
  }
  // Landing struts + floats.
  for (const s of [-1, 1]) {
    const strut = cyl(0.14, 0.14, 2.2, M.brassDark, s * 2.2, -1.0, 3.4, 6);
    strut.rotation.z = s * 0.3;
    g.add(strut);
    g.add(box(1.0, 0.8, 7.0, M.brass, s * 2.4, -2.0, 1.0));
  }
  return { group: g, prop, ailerons, exhausts, spin: 0 };
}

/** Pose the model on the live plane: position, heading, pitch, roll. */
export function updateAircraft(a, g) {
  const p = g.plane;
  a.group.position.set(p.x, p.y, p.z);
  a.group.rotation.order = 'YXZ';
  a.group.rotation.y = p.heading;
  a.group.rotation.x = -p.pitch;
  a.group.rotation.z = p.roll;
  a.spin += 0.35 + p.speed * 0.02;
  a.prop.rotation.z = a.spin;
  for (const al of a.ailerons) al.mesh.rotation.x = -al.side * p.roll * 0.55;
  const glow = 0.7 + p.throttle * 0.6 + (p.boost < 1 ? 0.9 : 0);
  for (const e of a.exhausts) e.material = M.exhaust;
  M.exhaust.color.setHSL(0.06, 1, Math.min(0.75, 0.35 + glow * 0.22));
}
