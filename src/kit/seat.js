import { FONT_SERIF } from './draw.js';

/** Empty press-conference seat in a 1000x1000 space. Fictional; no real media marks. */
export function drawSeat(g, passBy = null, drawRider = null) {
  g.noStroke();
  g.background(34, 30, 40);
  g.fill(26, 38, 78); g.rect(0, 0, 1000, 560);
  g.fill(255, 255, 255, 14);
  for (let x = -200; x < 1100; x += 120) g.quad(x, 0, x + 50, 0, x - 90, 560, x - 140, 560);
  g.fill(20, 18, 24); g.rect(0, 560, 1000, 440);
  if (passBy && drawRider) {
    g.push(); g.translate(passBy.x, 790); g.scale(-0.9, 0.9); drawRider(g); g.pop();
  }
  g.fill(60, 40, 40); g.rect(410, 330, 180, 260, 30);
  g.fill(76, 52, 50); g.rect(400, 560, 200, 40, 10);
  g.fill(40, 28, 28); g.rect(430, 600, 14, 120); g.rect(556, 600, 14, 120);
  g.fill(110, 74, 48); g.rect(90, 640, 820, 60, 8);
  g.fill(80, 52, 34); g.rect(90, 700, 820, 190);
  for (let k = 0; k < 5; k++) {
    const x = 190 + k * 155;
    if (Math.abs(x - 500) < 40) continue;
    g.fill(18); g.rect(x - 6, 590, 12, 52); g.rect(x - 28, 632, 56, 10, 4);
    g.fill(40); g.ellipse(x, 578, 30, 36); g.fill(90); g.ellipse(x, 574, 20, 14);
  }
  g.fill(244, 240, 228); g.rect(375, 648, 250, 78, 6);
  g.fill(30); g.textFont(FONT_SERIF); g.textAlign('center', 'center'); g.textSize(46);
  g.text('鹈鹕（本人）', 500, 688);
}
