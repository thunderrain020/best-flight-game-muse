// CALDERA COURIER — render/scene.js
// One draw call per frame, per mode. The Three.js world renders into
// the WebGL canvas behind the 2D canvas; the 2D canvas is cleared
// transparent each frame, so the HUD, cockpit frame, particles and
// mode overlays float over real 3D. Screenshot staging reuses this
// exact path — no special-case drawing.
import * as THREE from '../../vendor/three.module.min.js';
import { getCamera, setupCamera, setupApronCamera } from './projection.js';
import { makeWorld, updateWorld } from './world3d.js';
import { makeSky, updateSky } from './sky.js';
import { buildAircraft, updateAircraft } from './aircraft3d.js';
import { buildLandmarks, updateLandmarks } from './landmarks3d.js';
import { buildRings, updateRings, drawRingLabels } from './rings.js';
import { drawCockpit } from './cockpit.js';
import { drawFx } from './fx.js';
import { drawHud } from './hud.js';
import { drawMenu } from '../ui/menu.js';
import { drawBrief } from '../ui/brief.js';
import { drawDraft } from '../ui/draftUi.js';
import { drawDebrief } from '../ui/debrief.js';
import { drawOverlays } from '../ui/overlays.js';

let S = null;
function ensureThree() {
  if (S) return S;
  S = { ok: false };
  try {
    const canvas = document.getElementById('gl');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(1280, 720, false);
    renderer.setPixelRatio(1);
    const scene = new THREE.Scene();
    const world = makeWorld(scene);
    const sky = makeSky(scene);
    const aircraft = buildAircraft();
    scene.add(aircraft.group);
    const parked = buildAircraft();
    scene.add(parked.group);
    S = { ok: true, renderer, scene, world, sky, aircraft, parked, landmarks: null, rings: null, lastRunway: null, lastRings: null };
    window.__caldera3d = { webgl: true };
  } catch (e) {
    window.__caldera3d = { webgl: false, error: String(e && e.message || e) };
  }
  return S;
}

function syncWorld(g) {
  if (g.runway !== S.lastRunway) {
    if (S.landmarks) S.scene.remove(S.landmarks.group);
    S.landmarks = g.runway ? buildLandmarks(g.runway) : null;
    if (S.landmarks) S.scene.add(S.landmarks.group);
    S.lastRunway = g.runway;
  }
  if (g.rings !== S.lastRings) {
    if (S.rings) S.scene.remove(S.rings.group);
    S.rings = g.rings && g.rings.length ? buildRings(g.rings) : null;
    if (S.rings) S.scene.add(S.rings.group);
    S.lastRings = g.rings;
  }
}

function renderFlight3D(g) {
  syncWorld(g);
  updateWorld(S.world, g);
  updateSky(S.sky, S.scene, g);
  updateAircraft(S.aircraft, g);
  S.aircraft.group.visible = true;
  S.parked.group.visible = false;
  if (S.landmarks) updateLandmarks(S.landmarks, g);
  if (S.rings) updateRings(S.rings, g);
  setupCamera(g);
  S.renderer.render(S.scene, getCamera());
}

function renderBrief3D(g) {
  syncWorld(g);
  updateWorld(S.world, g);
  updateSky(S.sky, S.scene, g);
  S.aircraft.group.visible = false;
  const rw = g.runway;
  if (rw) {
    // Parked on the strip centre, where the pad is flat — the strip's
    // near end is buried in the hillside, so the plane must not sit there.
    S.parked.group.visible = true;
    S.parked.group.position.set(rw.x, rw.y + 2.5, rw.z);
    S.parked.group.rotation.order = 'YXZ';
    S.parked.group.rotation.y = -0.45;
    S.parked.group.rotation.x = 0;
    S.parked.group.rotation.z = 0;
    S.parked.spin = 0;
  } else {
    S.parked.group.visible = false;
  }
  if (S.landmarks) updateLandmarks(S.landmarks, g);
  setupApronCamera(g);
  S.renderer.render(S.scene, getCamera());
}

export function drawScene(ctx, W, H, g) {
  ctx.textBaseline = 'middle';
  if (g.mode === 'menu') { drawMenu(ctx, W, H, g); return; }
  if (g.mode === 'debrief') { drawDebrief(ctx, W, H, g); return; }
  // Transparent 2D canvas: the WebGL world shows through; clearRect
  // keeps stale pixels from the previous frame out of the overlays.
  ctx.clearRect(0, 0, W, H);
  const three = ensureThree();
  if (three.ok) {
    if (g.mode === 'brief') renderBrief3D(g);
    else renderFlight3D(g);
  } else {
    ctx.fillStyle = '#1d5f8a';
    ctx.fillRect(0, 0, W, H);
  }
  if (g.mode === 'brief') { drawBrief(ctx, W, H, g); return; }
  const cam = getCamera();
  if (g.cam === 'cockpit') drawCockpit(ctx, W, H, g);
  drawRingLabels(ctx, W, H, g, cam);
  drawFx(ctx, W, H, g, cam);
  drawHud(ctx, W, H, g);
  if (g.mode === 'draft') drawDraft(ctx, W, H, g);
  drawOverlays(ctx, W, H, g);
}
