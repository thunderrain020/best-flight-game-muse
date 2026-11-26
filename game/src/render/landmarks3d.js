// CALDERA COURIER — render/landmarks3d.js
// The coastal strip and its neighbourhood in 3D: paved runway with
// threshold stripes, centreline and glowing approach lights, hangar,
// control tower, striped lighthouse with a rotating beam, low-poly
// trees and hillside roofs. Rebuilt when the leg's runway changes.
import * as THREE from '../../vendor/three.module.min.js';

function stripeTexture() {
  const c = document.createElement('canvas');
  c.width = 32; c.height = 128;
  const x = c.getContext('2d');
  x.fillStyle = '#f5f0dc'; x.fillRect(0, 0, 32, 128);
  x.fillStyle = '#b83a2a';
  for (let i = 0; i < 4; i++) x.fillRect(0, i * 32 + 6, 32, 16);
  return new THREE.CanvasTexture(c);
}
function box(w, h, d, mat, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}
const asphalt = new THREE.MeshLambertMaterial({ color: 0x4a4a52 });
const white = new THREE.MeshLambertMaterial({ color: 0xf5f0dc });
const hangarMat = new THREE.MeshLambertMaterial({ color: 0x8a6420 });
const roofMat = new THREE.MeshLambertMaterial({ color: 0xb83a2a });
const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5a3a22 });
const leafMat = new THREE.MeshLambertMaterial({ color: 0x2f7d3c });

export function buildLandmarks(runway) {
  const g = new THREE.Group();
  const { x, y, z, width, length } = runway;
  // Paved strip.
  g.add(box(width, 1.2, length, asphalt, x, y - 0.4, z));
  // Threshold stripes (5) + centreline dashes (8).
  for (let i = -2; i <= 2; i++) g.add(box(5, 0.3, 20, white, x + i * 8, y + 0.4, z - length / 2 + 22));
  for (let i = 0; i < 8; i++) g.add(box(2, 0.3, 12, white, x, y + 0.4, z - length / 2 + 50 + i * 26));
  // Approach lights: green near, red far.
  const lights = [];
  for (const [dz, col] of [[-length / 2 - 16, 0x37ff8a], [length / 2 + 16, 0xff4d4d]]) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(2.2, 10, 10),
      new THREE.MeshBasicMaterial({ color: col }));
    m.position.set(x, y + 3, z + dz);
    g.add(m);
    lights.push(m);
  }
  // Hangar beside the strip + control tower.
  g.add(box(70, 26, 46, hangarMat, x - 90, y + 13, z - 60));
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(24, 24, 70, 3, 1), roofMat);
  roof.rotation.z = Math.PI / 2;
  roof.rotation.y = Math.PI / 2;
  roof.position.set(x - 90, y + 28, z - 60);
  roof.scale.set(1, 1, 0.7);
  g.add(roof);
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(5, 7, 52, 10),
    new THREE.MeshLambertMaterial({ color: 0xc9b98f }));
  tower.position.set(x + 80, y + 26, z - 80);
  g.add(tower);
  g.add(box(18, 12, 18, new THREE.MeshPhongMaterial({ color: 0x9fd8e8, shininess: 100 }), x + 80, y + 56, z - 80));
  // Striped lighthouse + rotating beam.
  const light = new THREE.Mesh(new THREE.CylinderGeometry(6, 8, 58, 12),
    new THREE.MeshLambertMaterial({ map: stripeTexture() }));
  light.position.set(x + 95, y + 29, z - 40);
  g.add(light);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(4, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xfff0a0 }));
  lamp.position.set(x + 95, y + 60, z - 40);
  g.add(lamp);
  const beam = new THREE.Mesh(new THREE.ConeGeometry(14, 190, 12, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false }));
  beam.rotation.z = Math.PI / 2;
  beam.position.set(x + 95, y + 60, z - 40);
  g.add(beam);
  // Low-poly trees and hillside roofs, deterministic scatter.
  for (let i = 0; i < 22; i++) {
    const tx = x + ((i * 137) % 520) - 260;
    const tz = z + ((i * 211) % 560) - 280;
    if (Math.abs(tx - x) < width / 2 + 12 && Math.abs(tz - z) < length / 2 + 12) continue;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 8, 6), trunkMat);
    trunk.position.set(tx, y + 4, tz);
    const top = new THREE.Mesh(new THREE.ConeGeometry(7, 18, 7), leafMat);
    top.position.set(tx, y + 16, tz);
    g.add(trunk); g.add(top);
  }
  for (let i = 0; i < 8; i++) {
    const rx = x + 160 + (i % 4) * 46;
    const rz = z - 180 + Math.floor(i / 4) * 90;
    g.add(box(20, 12, 16, new THREE.MeshLambertMaterial({ color: 0xd9c48f }), rx, y + 6, rz));
    const r = new THREE.Mesh(new THREE.ConeGeometry(14, 8, 4), roofMat);
    r.position.set(rx, y + 16, rz);
    r.rotation.y = Math.PI / 4;
    g.add(r);
  }
  return { group: g, beam, lights, lamp };
}

export function updateLandmarks(lm, g) {
  lm.beam.rotation.y = g.time * 0.7;
  const blink = Math.sin(g.time * 5) > 0 ? 1 : 0.35;
  if (lm.lights[0]) lm.lights[0].material.color.setHex(blink > 0.5 ? 0x37ff8a : 0x1d8a4a);
  if (lm.lamp) lm.lamp.material.color.setHex(blink > 0.5 ? 0xfff0a0 : 0xd8b25a);
}
