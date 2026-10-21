import { execSync } from 'node:child_process';
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
execSync('npm install --no-audit --no-fund', { stdio: 'inherit' });
mkdirSync('vendor', { recursive: true });
const src = ['node_modules/p5/lib/p5.min.js', 'node_modules/p5/dist/p5.min.js'].find(existsSync);
if (!src) throw new Error('p5.min.js not found in node_modules/p5; check the installed p5 layout');
copyFileSync(src, 'vendor/p5.min.js');
console.log('vendored', src);
