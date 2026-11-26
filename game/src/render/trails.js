// CALDERA COURIER — render/trails.js
// The aircraft's own exhaust and wake in 3D: an orange-cyan
// afterburner flame cone behind the tail that grows with boost, and
// twin white wingtip contrail ribbons streaming aft. Both ride as
// children of the aircraft group, so they bank and pitch with it.
import * as THREE from '../../vendor/three.module.min.js';

function ribbonTexture() {
  const c = document.createElement('canvas');
  c.width = 8; c.height = 128;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.4)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 8, 128);
  return new THREE.CanvasTexture(c);
}

export function buildTrails(group) {
  // Afterburner: a modest orange outer cone with a cyan inner core,
  // apex aft. Kept small — it should read as a flame, not a sail.
  const flame = new THREE.Group();
  const outer = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 3.4, 10),
    new THREE.MeshBasicMaterial({ color: 0xff7a30, transparent: true, opacity: 0.8 }),
  );
  outer.rotation.x = -Math.PI / 2;
  const inner = new THREE.Mesh(
    new THREE.ConeGeometry(0.4, 2.2, 10),
    new THREE.MeshBasicMaterial({ color: 0x4dc9ff, transparent: true, opacity: 0.9 }),
  );
  inner.rotation.x = -Math.PI / 2;
  inner.position.z = -0.3;
  flame.add(outer); flame.add(inner);
  flame.position.set(0, -0.4, -9.0);
  group.add(flame);
  // Contrail ribbons: gradient-faded planes trailing the wingtips.
  const tex = ribbonTexture();
  const ribbons = [];
  for (const s of [-1, 1]) {
    const r = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 22),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false }),
    );
    r.rotation.x = -Math.PI / 2;
    // Plane local +y (opaque end) maps to +z after the rotation, so
    // flip it: the bright end must sit at the wingtip, fading aft.
    r.rotation.z = Math.PI;
    r.position.set(s * 12.9, 0.55, -12);
    group.add(r);
    ribbons.push(r);
  }
  return { flame, outer, inner, ribbons };
}

/** Flame grows and flickers with boost; ribbons thicken with speed. */
export function updateTrails(t, g) {
  const p = g.plane;
  const boosting = p.boost < 0.98 || p.throttle > 0.85;
  t.flame.visible = boosting;
  if (boosting) {
    const flick = 1 + Math.sin(g.time * 31) * 0.16 + Math.sin(g.time * 47) * 0.08;
    const burn = 0.6 + (1 - p.boost) * 0.7 + p.throttle * 0.3;
    t.flame.scale.set(flick, flick, Math.min(1.4, burn * flick));
    t.outer.material.opacity = Math.min(0.85, 0.5 + burn * 0.25);
  }
  const rib = Math.min(0.55, 0.14 + p.speed * 0.0016);
  for (const r of t.ribbons) r.material.opacity = rib;
}
