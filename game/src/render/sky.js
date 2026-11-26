// CALDERA COURIER — render/sky.js
// Sky, sun and weather light for the Three.js world: one background
// colour + fog per leg sky, a warm directional sun, soft hemisphere
// fill, drifting cloud sprites and a glowing sun disc.
import * as THREE from '../../vendor/three.module.min.js';
import { SKIES } from '../data/weather.js';

function blobTexture() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 64;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 32, 4, 64, 32, 60);
  g.addColorStop(0, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 64);
  return new THREE.CanvasTexture(c);
}

export function makeSky(scene) {
  const hemi = new THREE.HemisphereLight(0xbfd9ff, 0x3a2a1a, 1.0);
  const sun = new THREE.DirectionalLight(0xffe9b0, 1.7);
  sun.position.set(500, 800, -600);
  scene.add(hemi); scene.add(sun);
  const tex = blobTexture();
  const sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex, color: 0xffd9a0, transparent: true, opacity: 0.95, depthWrite: false,
  }));
  sunSprite.scale.set(260, 260, 1);
  scene.add(sunSprite);
  const clouds = [];
  // 3D volumetric clouds: low-poly multi-puff clusters, each a group
  // of flat-shaded icosahedron puffs at its own altitude — real
  // geometry the camera can fly past, never a flat sprite.
  const puffGeo = new THREE.IcosahedronGeometry(1, 0);
  const puffMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.88 });
  for (let i = 0; i < 10; i++) {
    const cluster = new THREE.Group();
    const puffs = 4 + (i % 3);
    for (let k = 0; k < puffs; k++) {
      const p = new THREE.Mesh(puffGeo, puffMat);
      const s = 42 + ((i * 7 + k * 13) % 46);
      p.scale.set(s, s * 0.45, s * 0.7);
      p.position.set((k - puffs / 2) * 52 + ((i * 31 + k * 17) % 24) - 12, ((k * 29) % 26) - 10, ((i * 19 + k * 23) % 36) - 18);
      cluster.add(p);
    }
    cluster.userData.base = { x: (i * 397) % 1600 - 800, y: 420 + (i % 5) * 55, z: 500 + i * 620 };
    scene.add(cluster);
    clouds.push(cluster);
  }
  // Gradient sky dome (top colour -> horizon colour), so the sky is
  // a real gradient, not the flat scene background.
  const domeCanvas = document.createElement('canvas');
  domeCanvas.width = 4; domeCanvas.height = 256;
  const domeTex = new THREE.CanvasTexture(domeCanvas);
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(9000, 24, 16),
    new THREE.MeshBasicMaterial({ map: domeTex, side: THREE.BackSide, fog: false, depthWrite: false }),
  );
  dome.position.set(0, 0, 3200);
  scene.add(dome);
  return { hemi, sun, sunSprite, clouds, dome, domeCanvas, domeTex, lastSky: '' };
}

/** Per-leg sky: background, fog, sun position and cloud tint. */
export function updateSky(sky, scene, g) {
  const leg = g.legs[g.leg];
  const pal = SKIES[leg.sky] || SKIES.day;
  // Repaint the dome gradient when the leg's sky changes.
  if (sky.lastSky !== leg.sky) {
    sky.lastSky = leg.sky;
    const x = sky.domeCanvas.getContext('2d');
    const grad = x.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, pal[0]);
    grad.addColorStop(0.62, pal[1]);
    grad.addColorStop(1, pal[1]);
    x.fillStyle = grad;
    x.fillRect(0, 0, 4, 256);
    sky.domeTex.needsUpdate = true;
  }
  scene.background = null;
  scene.fog = new THREE.Fog(new THREE.Color(pal[1]), 900, 6500);
  const night = leg.sky === 'night';
  sky.hemi.intensity = night ? 0.35 : 1.0;
  sky.sun.intensity = night ? 0.4 : 1.7;
  sky.sun.color.set(night ? 0xdfe8ff : 0xffe9b0);
  const a = g.seed * 0.13 + 0.6;
  const sx = Math.sin(a) * 2600, sy = 1500, sz = -Math.cos(a) * 2600 + 3200;
  sky.sun.position.set(sx, sy, sz);
  sky.sunSprite.position.set(sx, sy, sz);
  sky.sunSprite.material.color.set(pal[2]);
  const drift = g.time * 8;
  for (const c of sky.clouds) {
    const b = c.userData.base;
    c.position.set(b.x + ((drift + b.z) % 800) - 400, b.y, b.z + g.plane.z * 0.02);
    c.children[0].material.opacity = night ? 0.5 : 0.88;
  }
}
