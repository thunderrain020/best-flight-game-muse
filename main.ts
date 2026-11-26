// CALDERA COURIER — main.ts (second writing pass)
// The entry program for make.fun bounty best-flight-game-20261126-0057.
// Node 22, standard library only, no install, no network.
//
// What it does, in order:
//   1. Works out where it is (the repository root) and where the
//      grader wants the output (/output, or MAKEFUN_OUTPUT_DIR outside
//      the grader's container).
//   2. Copies the whole playable game (game/) and the four real
//      headless-Chrome renders (screenshots/) into the output dir.
//   3. Writes dossier.json with the vendored make.fun library
//      (vendor/makefun-game.ts, byte-identical to the kit), which the
//      scorer rebuilds and compares byte for byte.
//
// The game itself is plain static files: game/index.html opens in
// desktop Chrome and plays offline — a custom Canvas2D 3D projection
// engine, no libraries, no network requests. Serve it locally with
// `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

/** The repository root: the directory this file lives in. */
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
/** The grader's writable output; the env var stands in for it locally. */
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

/**
 * The caps from the bounty's gate.json. Only text_max_bytes shapes the
 * dossier's bytes; the rest make this program fail exactly where the
 * scorer would refuse the entry, so a bad hand-in never slips through:
 * at most 4 screenshots of 256 KiB each, at most 993 entries in game/
 * (game/ shares the platform's 1000-entry /output cap with
 * screenshots/ and dossier.json), 48 MiB of game files in all, and no
 * game path over 1000 bytes.
 */
const GATE_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

/** Copy a directory from the repo into the output, creating it first. */
function copyIntoOut(name) {
  const from = join(repoRoot, name);
  const to = join(outputDir, name);
  mkdirSync(to, { recursive: true });
  if (existsSync(from)) cpSync(from, to, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
copyIntoOut('game');
copyIntoOut('screenshots');

// The dossier is the judge's view of the entry: the game tree plus the
// source text, written by the same library the scorer runs. If the
// inputs are past a cap, buildDossier throws and the run fails loudly.
const dossier = buildDossier(outputDir, GATE_CAPS);
writeFileSync(join(outputDir, 'dossier.json'), dossier);
