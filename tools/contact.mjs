import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { open } from './browser.mjs';
import { args } from './args.mjs';
const o = args();
const times = o.t ? String(o.t).split(',').map(Number)
  : [2, 4.6, ...Array.from({ length: 20 }, (_, i) => 5 + 6 * i + 3), 126, 130.5, 135, 136.4];
mkdirSync('out/contact', { recursive: true });
const b = await open();
for (let i = 0; i < times.length; i++) writeFileSync('out/contact/c' + String(i).padStart(3, '0') + '.png', await b.grab(times[i]));
await b.close();
const cols = 6, rows = Math.ceil(times.length / cols);
execFileSync('ffmpeg', ['-y', '-framerate', '1', '-i', 'out/contact/c%03d.png', '-vf', 'scale=480:-1,tile=' + cols + 'x' + rows + ':padding=6:color=black', '-frames:v', '1', 'out/contact.png'], { stdio: 'inherit' });
console.log('out/contact.png');
