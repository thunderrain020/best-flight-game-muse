// CALDERA COURIER — render/world3d.js
// The volcanic archipelago as a real heightfield: a 120x160-segment
// mesh coloured in smooth elevation bands (sandy shoals, terraced
// emerald hills, basalt ridges, glowing lava caldera), an animated
// sun-glint ocean, and the volcano's rising smoke.
import * as THREE from '../../vendor/three.module.min.js';
import { groundHeight, VOLCANO } from '../entities/terrain.js';

/** Numeric elevation colour, mirroring entities/terrain groundColor. */
function bandColor(x, z, h) {
  const dx = x - VOLCANO.x, dz = z - VOLCANO.z;
  const dv = Math.sqrt(dx * dx + dz * dz);
  if (h <= 2) return [0.11, 0.37, 0.54];
  if (h <= 8) return [0.85, 0.77, 0.56];
  if (dv < 260 && h > 180) return [1.0, 0.35, 0.15];
  if (dv < 420 && h > 120) return [0.35, 0.23, 0.20];
  if (h > 150) return [0.42, 0.35, 0.29];
  const band = Math.floor(h / 34) % 2 === 0;
  return band ? [0.25, 0.62, 0.30] : [0.18, 0.49, 0.24];
}

export function makeWorld(scene) {
  // Heightfield: x in [-900, 900], z in [-500, 6900], centred at z 3200.
  const geo = new THREE.PlaneGeometry(1800, 7400, 120, 160);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i) + 3200;
    const h = groundHeight(x, z);
    pos.setY(i, h);
    const c = bandColor(x, z, h);
    colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2];
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const terrain = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
  terrain.position.set(0, 0, 3200);
  scene.add(terrain);
  // Ocean: a glossy sheet just above sea level, under the islands.
  const ocean = new THREE.Mesh(
    new THREE.PlaneGeometry(5200, 9000),
    new THREE.MeshPhongMaterial({ color: 0x1d5f8a, specular: 0xffe9a8, shininess: 140, transparent: true, opacity: 0.92 }),
  );
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.set(0, 1.2, 3200);
  scene.add(ocean);
  // Sun glint: a bright streak on the water that slides with the clock.
  const glint = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 1600),
    new THREE.MeshBasicMaterial({ color: 0xfff0be, transparent: true, opacity: 0.28, depthWrite: false }),
  );
  glint.rotation.x = -Math.PI / 2;
  glint.position.set(0, 2, 3200);
  scene.add(glint);
  // Lava: a glowing disc in the caldera mouth + a hot rim ring. The
  // summit sits near y 306, so the disc rides just above it.
  const lava = new THREE.Mesh(
    new THREE.CircleGeometry(120, 28),
    new THREE.MeshBasicMaterial({ color: 0xff5a26 }),
  );
  lava.rotation.x = -Math.PI / 2;
  lava.position.set(VOLCANO.x, 305, VOLCANO.z);
  scene.add(lava);
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(150, 14, 8, 32),
    new THREE.MeshBasicMaterial({ color: 0xff7a30 }),
  );
  rim.rotation.x = -Math.PI / 2;
  rim.position.set(VOLCANO.x, 298, VOLCANO.z);
  scene.add(rim);
  const lavaLight = new THREE.PointLight(0xff5a26, 2.2, 1600);
  lavaLight.position.set(VOLCANO.x, 340, VOLCANO.z);
  scene.add(lavaLight);
  // Smoke: soft grey puffs rising over the caldera, looped by the clock.
  // Round soft sprites (not the default square points).
  const puffCanvas = document.createElement('canvas');
  puffCanvas.width = 64; puffCanvas.height = 64;
  const px = puffCanvas.getContext('2d');
  const pg = px.createRadialGradient(32, 32, 2, 32, 32, 30);
  pg.addColorStop(0, 'rgba(255,255,255,0.9)');
  pg.addColorStop(0.6, 'rgba(255,255,255,0.35)');
  pg.addColorStop(1, 'rgba(255,255,255,0)');
  px.fillStyle = pg; px.fillRect(0, 0, 64, 64);
  const smokeGeo = new THREE.BufferGeometry();
  const N = 42;
  smokeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  const smoke = new THREE.Points(smokeGeo, new THREE.PointsMaterial({
    color: 0x6b5a52, size: 44, map: new THREE.CanvasTexture(puffCanvas),
    transparent: true, opacity: 0.55, depthWrite: false,
  }));
  scene.add(smoke);
  return { ocean, glint, lava, rim, lavaLight, smoke, smokeN: N };
}

export function updateWorld(w, g) {
  const t = g.time;
  w.glint.position.x = Math.sin(t * 0.08) * 260;
  w.glint.material.opacity = 0.22 + Math.sin(t * 0.6) * 0.08;
  w.lava.material.color.setHSL(0.05 + Math.sin(t * 1.4) * 0.015, 1, 0.55 + Math.sin(t * 2.1) * 0.05);
  w.lavaLight.intensity = 2 + Math.sin(t * 1.7) * 0.5;
  const pos = w.smoke.geometry.attributes.position;
  for (let i = 0; i < w.smokeN; i++) {
    const ph = (t * 0.05 + i / w.smokeN) % 1;
    pos.setXYZ(i,
      VOLCANO.x + Math.sin(i * 2.7 + t * 0.2) * (30 + ph * 130) + ph * 90,
      300 + ph * 260,
      VOLCANO.z + Math.cos(i * 1.9 + t * 0.15) * (30 + ph * 110));
  }
  pos.needsUpdate = true;
}
