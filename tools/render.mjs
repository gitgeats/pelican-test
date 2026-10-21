import { mkdirSync, writeFileSync } from 'node:fs';
import { open } from './browser.mjs';
import { args } from './args.mjs';
const o = args(); const fps = Number(o.fps ?? 30);
const b = await open();
const total = await b.page.evaluate('window.TOTAL');
const from = Number(o.from ?? 0), to = Math.min(Number(o.to ?? total), total);
mkdirSync('out/frames', { recursive: true });
const n0 = Math.round(from * fps), n1 = Math.round(to * fps);
for (let n = n0; n < n1; n++) {
  writeFileSync('out/frames/f' + String(n).padStart(6, '0') + '.png', await b.grab(n / fps));
  if (n % fps === 0) console.log('t =', (n / fps).toFixed(0), 's');
}
await b.close();
console.log('mux later: ffmpeg -framerate ' + fps + ' -i out/frames/f%06d.png -i audio.wav -c:v libx264 -pix_fmt yuv420p -c:a aac out/pelican.mp4');
