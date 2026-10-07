// Rebuilds every generated section of the site from its own project.
// Each section lives in its own folder next to this repo and knows how to publish itself into it.
// To add a section, add a line to SECTIONS.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const SECTIONS = [
  // name, project folder (relative to this repo), npm script that writes into this repo
  { name: 'Darktale', dir: '../Darktale System', script: 'publish' },
];

const only = process.argv.slice(2).map((a) => a.toLowerCase());
let failed = 0;

for (const s of SECTIONS) {
  if (only.length && !only.includes(s.name.toLowerCase())) continue;
  const cwd = resolve(SITE, s.dir);
  if (!existsSync(resolve(cwd, 'package.json'))) {
    console.error(`✗ ${s.name}: no package.json in ${cwd}`);
    failed++;
    continue;
  }
  console.log(`→ ${s.name} (${cwd})`);
  const r = spawnSync('npm', ['run', s.script], { cwd, stdio: 'inherit', shell: true });
  if (r.status !== 0) {
    console.error(`✗ ${s.name} failed`);
    failed++;
  } else {
    console.log(`✓ ${s.name}`);
  }
}

if (failed) process.exit(1);
console.log('All sections rebuilt.');
