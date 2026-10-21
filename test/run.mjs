import assert from 'node:assert/strict';
import { TOTAL, INTRO, SCENE, T_OUTRO, OUTRO, locate, sceneStart } from '../src/beat/beat.js';
import { pose } from '../src/rig/rig.js';

assert.equal(TOTAL, 137); assert.equal(INTRO, 5); assert.equal(SCENE, 6); assert.equal(OUTRO, 12); assert.equal(T_OUTRO, 125);
assert.equal(locate(0).phase, 'intro');
assert.equal(locate(5).i, 0); assert.equal(locate(10.999).i, 0); assert.equal(locate(11).i, 1);
assert.equal(locate(124.99).i, 19); assert.equal(locate(125).phase, 'outro');
assert.equal(locate(7).bar, 1); assert.equal(locate(9).bar, 2);
assert.equal(sceneStart(19) + SCENE, T_OUTRO);

assert.deepEqual(pose(1.234), pose(1.234));
const p0 = pose(0), p1 = pose(1);
assert.ok(Math.abs(p0.pedA.x - p1.pedA.x) < 1e-9 && Math.abs(p0.pedA.y - p1.pedA.y) < 1e-9, 'one crank rev per 2 beats');
let worst = 0;
for (let t = 0; t < 4; t += 0.01) {
  const P = pose(t);
  for (const [h, k, f] of [[P.hip, P.kneeA, P.pedA], [P.hip, P.kneeB, P.pedB]]) {
    worst = Math.max(worst, Math.abs(Math.hypot(k.x - h.x, k.y - h.y) - 80), Math.abs(Math.hypot(f.x - k.x, f.y - k.y) - 85));
    assert.ok(k.x > h.x - 1e-6, 'knee points forward');
  }
}
assert.ok(worst < 1e-6, 'leg bone lengths preserved ' + worst);
console.log('all tests passed; max bone error', worst.toExponential(2));
