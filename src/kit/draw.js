import { clamp } from './ease.js';
import { WHEEL_R } from '../rig/rig.js';

export const FONT_SERIF = '"Noto Serif CJK TC","Noto Serif TC","Source Han Serif TC","Songti TC","PMingLiU",serif';
export const FONT_SANS = '"Noto Sans CJK TC","Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif';

const line = (g, a, b) => g.line(a.x, a.y, b.x, b.y);

/** Neutral stick-figure pelican + bike (placeholder style). col: gray number or [r,g,b]. */
export function drawStickRider(g, P, col = 30, sw = 5) {
  const c = Array.isArray(col) ? col : [col, col, col];
  g.push();
  g.noFill(); g.stroke(...c); g.strokeWeight(sw); g.strokeCap('round');
  for (const hub of [P.rearHub, P.frontHub]) {
    g.circle(hub.x, hub.y, WHEEL_R * 2);
    for (let k = 0; k < 4; k++) {
      const a = P.wheelAngle + (k * Math.PI) / 4;
      g.line(hub.x - Math.cos(a) * WHEEL_R, hub.y - Math.sin(a) * WHEEL_R, hub.x + Math.cos(a) * WHEEL_R, hub.y + Math.sin(a) * WHEEL_R);
    }
  }
  line(g, P.rearHub, P.bb); line(g, P.bb, P.seat); line(g, P.seat, P.handle);
  line(g, P.bb, P.handle); line(g, P.handle, P.frontHub); line(g, P.rearHub, P.seat);
  line(g, P.bb, P.pedA); line(g, P.bb, P.pedB);
  line(g, P.hip, P.kneeB); line(g, P.kneeB, P.pedB);
  line(g, P.hip, P.kneeA); line(g, P.kneeA, P.pedA);
  g.strokeWeight(sw * 1.4);
  line(g, P.hip, P.chest); line(g, P.chest, P.neckMid); line(g, P.neckMid, P.head);
  line(g, P.hip, P.tail);
  line(g, P.wingRoot, P.wingElbow); line(g, P.wingElbow, P.handle);
  g.fill(...c); g.circle(P.head.x, P.head.y, 26);
  g.noFill(); g.strokeWeight(sw);
  g.beginShape(); g.vertex(P.beakBase.x, P.beakBase.y - 6); g.vertex(P.beakTip.x, P.beakTip.y);
  g.vertex(P.beakBase.x + 20, P.beakBase.y + 34); g.endShape('close');
  g.pop();
}

export function drawTitleCard(g, meta, a = 1, opts = {}) {
  const { fg = 255, bg = 20, x = 500, y = 90, font = FONT_SERIF } = opts;
  a = clamp(a);
  if (a <= 0) return;
  g.push();
  g.textAlign('center', 'center');
  g.textFont(font);
  g.noStroke();
  g.fill(bg, 0.78 * a * 255); g.rect(x - 330, y - 62, 660, 140, 14);
  g.fill(fg, a * 255);
  g.textSize(64); g.text(meta.zh, x, y - 14);
  g.textSize(28); g.text(meta.en + '  ·  ' + meta.year, x, y + 40);
  g.pop();
}

export function drawRoadStrip(p, x0, x1, y, h, scroll, col = [58, 54, 50]) {
  p.noStroke(); p.fill(...col); p.rect(x0, y, x1 - x0, h);
  p.fill(230, 220, 190);
  const period = 90, dash = 46;
  const off = ((scroll % period) + period) % period;
  for (let x = x0 - off; x < x1; x += period) {
    const a = Math.max(x, x0), b = Math.min(x + dash, x1);
    if (b > a) p.rect(a, y + h / 2 - 3, b - a, 6);
  }
}

export function drawSub(p, text, x, y, a, size = 54, col = 40) {
  if (a <= 0) return;
  p.push(); p.textFont(FONT_SERIF); p.textAlign('center', 'center');
  p.noStroke(); p.fill(col, col, col, clamp(a) * 255); p.textSize(size); p.text(text, x, y); p.pop();
}
