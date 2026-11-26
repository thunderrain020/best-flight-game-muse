// CALDERA COURIER — render/scene.js
// One draw call per frame, per mode: the 3D world (sky, terrain, rings,
// runway, plane or cockpit), then HUD, particles and the mode overlay.
// Screenshot staging reuses this exact path — no special-case drawing.
import { makeCamera } from './projection.js';
import { drawSky } from './sky.js';
import { drawTerrain } from './terrain.js';
import { drawRings, drawRunway } from './rings.js';
import { drawPlane } from './plane3d.js';
import { drawCockpit } from './cockpit.js';
import { drawHud } from './hud.js';
import { drawFx } from './fx.js';
import { drawMenu } from '../ui/menu.js';
import { drawBrief } from '../ui/brief.js';
import { drawDraft } from '../ui/draftUi.js';
import { drawDebrief } from '../ui/debrief.js';
import { drawOverlays } from '../ui/overlays.js';

export function drawScene(ctx, W, H, g) {
  ctx.textBaseline = 'middle';
  // Base fill so no region ever shows a stale frame.
  ctx.fillStyle = '#123a5c';
  ctx.fillRect(0, 0, W, H);
  if (g.mode === 'menu') { drawMenu(ctx, W, H, g); return; }
  if (g.mode === 'brief') { drawBrief(ctx, W, H, g); return; }
  if (g.mode === 'debrief') { drawDebrief(ctx, W, H, g); return; }
  const cam = makeCamera(g);
  const shakeX = g.shake ? (Math.random() - 0.5) * g.shake * 10 : 0;
  const shakeY = g.shake ? (Math.random() - 0.5) * g.shake * 10 : 0;
  ctx.save();
  ctx.translate(shakeX, shakeY);
  drawSky(ctx, W, H, g, cam);
  drawTerrain(ctx, W, H, g, cam);
  drawRunway(ctx, W, H, g, cam);
  drawRings(ctx, W, H, g, cam);
  if (g.cam === 'chase') drawPlane(ctx, W, H, g, cam);
  else drawCockpit(ctx, W, H, g);
  drawFx(ctx, W, H, g, cam);
  ctx.restore();
  drawHud(ctx, W, H, g);
  if (g.mode === 'draft') drawDraft(ctx, W, H, g);
  drawOverlays(ctx, W, H, g);
}
