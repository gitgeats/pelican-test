import { mkdirSync, writeFileSync } from 'node:fs';
import { open } from './browser.mjs';
import { args } from './args.mjs';
const o = args(); const times = String(o.t ?? '0').split(',').map(Number);
mkdirSync('out/shots', { recursive: true });
const b = await open();
for (const t of times) { writeFileSync('out/shots/t' + t.toFixed(2) + '.png', await b.grab(t)); console.log('shot', t); }
await b.close();
