import { TOTAL, N, SCENE, T_OUTRO, sceneStart, locate, punch } from '../beat/beat.js';
import { pose, ROAD_SPEED } from '../rig/rig.js';
import { clamp, lerp, ramp, smooth, easeInOut, easeOut } from '../kit/ease.js';
import { mulberry32 } from '../kit/rng.js';
import { drawRoadStrip, drawSub, drawStickRider, FONT_SERIF } from '../kit/draw.js';
import { drawSeat } from '../kit/seat.js';
import { scenes } from '../scenes/index.js';

const W = 1920, H = 1080, PANEL = 1000;
const SCENE_NAMES = scenes.map((s) => s.meta.n + '. ' + s.meta.zh);
let p, gA, gB, gI, gSeat, paper;
const thumbs = [];

// Pelican screen x while riding in from the left (intro -> scene 1)
const pelX = (t) => (t >= 6 ? 960 : -200 + 1160 * easeOut((t - 4) / 2));

function makePaper() {
  const g = p.createGraphics(W, H); g.pixelDensity(1);
  g.background(238, 228, 206); g.noStroke();
  const r = mulberry32(7);
  for (let k = 0; k < 9000; k++) { g.fill(150, 120, 80, r() * 22); g.circle(r() * W, r() * H, 1 + r() * 2.5); }
  return g;
}

function renderScene(g, i, t) {
  const sc = scenes[i];
  const local = Math.max(0, t - sceneStart(i));
  const px = i === 0 ? pelX(t) - (W - PANEL) / 2 : 500;
  g.clear();
  sc.draw(g, { t, local, u: local / SCENE, bar: Math.floor(local / (SCENE / 3)), P: pose(t), px });
}

function blit(g, w, h, scale, alpha) {
  const ctx = p.drawingContext;
  ctx.globalAlpha = clamp(alpha);
  p.push(); p.translate(W / 2, H / 2); p.scale(scale); p.image(g, -w / 2, -h / 2, w, h); p.pop();
  ctx.globalAlpha = 1;
}

function framePanel(scale) {
  p.push(); p.translate(W / 2, H / 2); p.scale(scale); p.noFill();
  p.stroke(54, 36, 24); p.strokeWeight(16); p.rect(-PANEL / 2 - 8, -PANEL / 2 - 8, PANEL + 16, PANEL + 16, 4);
  p.stroke(190, 150, 90); p.strokeWeight(3); p.rect(-PANEL / 2 - 1, -PANEL / 2 - 1, PANEL + 2, PANEL + 2);
  p.pop();
}

function camBump(t) {
  let b = 0;
  for (let k = 0; k < N; k++) { const c = sceneStart(k); if (Math.abs(t - c) < 1) b = Math.max(b, punch(t, c)); }
  return 1 + 0.035 * b;
}

function drawIntro(g, t) {
  g.image(paper, 0, 0);
  g.noStroke(); g.fill(255, 250, 236); g.rect(1230, 110, 540, 430, 6);
  g.noFill(); g.stroke(90, 70, 50); g.strokeWeight(3); g.rect(1230, 110, 540, 430, 6);
  g.push(); g.translate(1500, 470); g.scale(0.95); drawStickRider(g, pose(0), [90, 66, 40], 4); g.pop();
  g.push(); g.textFont(FONT_SERIF); g.textAlign('center', 'center'); g.noStroke(); g.fill(70, 52, 36); g.textSize(28);
  g.text('图一  鹈鹕骑行图（摹本）', 1500, 575); g.pop();
  const a1 = ramp(t, 0.6, 1.0), a2 = ramp(t, 3.9, 4.1);
  const fadeOut = 1 - ramp(t, 4.4, 4.8);
  drawSub(g, '人类自古以来就痴迷于画鹈鹕骑自行车。', 640, 500, a1 * fadeOut, 58);
  drawSub(g, '——早在自行车被发明之前。', 640, 600, a2 * fadeOut, 58);
  drawSub(g, '——《鹈鹕骑行艺术通史》，卷一（虚构书名）', 640, 700, ramp(t, 1.4, 1.8) * fadeOut, 26, 90);
  drawRoadStrip(g, 0, W, 940, 60, t * ROAD_SPEED);
  const x = pelX(t);
  if (t >= 4 && x < 520) { g.push(); g.translate(x, 940); drawStickRider(g, pose(t), 30, 5); g.pop(); }
}

function cellRect(k) {
  const cw = 232, gap = (1728 - 7 * cw) / 6;
  return { x: 96 + (k % 7) * (cw + gap), y: 100 + Math.floor(k / 7) * (cw + gap), w: cw };
}

function ensureThumbs() {
  if (thumbs.length) return;
  for (let i = 0; i < N; i++) {
    const g = p.createGraphics(512, 512); g.pixelDensity(1);
    renderScene(gA, i, sceneStart(i) + 3.5);
    g.image(gA, 0, 0, 512, 512);
    thumbs.push(g);
  }
}

function drawOutro(t) {
  ensureThumbs();
  const L = t - T_OUTRO;
  const target = cellRect(20);
  const fx0 = W / 2, fy0 = H / 2 - 60, fx1 = target.x + target.w / 2, fy1 = target.y + target.w / 2;
  const e = easeInOut(ramp(L, 2, 6));
  const S = lerp(1, 3.5, e);
  const fx = lerp(fx0, fx1, e), fy = lerp(fy0, fy1, e);
  p.background(22, 18, 24);
  p.push(); p.translate(W / 2, H / 2 - 40 * (1 - e)); p.scale(S); p.translate(-fx, -fy);
  for (let k = 0; k < 21; k++) {
    const c = cellRect(k);
    p.noStroke(); p.fill(54, 36, 24); p.rect(c.x - 6, c.y - 6, c.w + 12, c.w + 12, 3);
    if (k < N) p.image(thumbs[k], c.x, c.y, c.w, c.w);
    else {
      gSeat.clear();
      const pass = L >= 11 && L < 11.9 ? { x: lerp(1150, -250, ramp(L, 11, 11.9)) } : null;
      drawSeat(gSeat, pass, (g) => drawStickRider(g, pose(t), 235, 6));
      p.image(gSeat, c.x, c.y, c.w, c.w);
    }
  }
  p.pop();
  drawSub(p, '截至目前，人类共提交了 20 份答卷。', W / 2, 960, ramp(L, 0.2, 0.7) * (1 - ramp(L, 3.2, 3.8)), 52, 235);
  drawSub(p, '鹈鹕本人对此尚未发表评论。', W / 2, 960, ramp(L, 6.5, 7.0) * (1 - ramp(L, 10.2, 10.8)), 52, 235);
  for (const f of [4, 5, 6]) {
    if (L >= f) { const a = Math.exp(-(L - f) / 0.09); p.noStroke(); p.fill(255, 255, 255, a * 190); p.rect(0, 0, W, H); }
  }
}

export function renderAt(t) {
  t = clamp(t, 0, TOTAL - 1e-6);
  const loc = locate(t);
  if (loc.phase === 'outro') { drawOutro(t); return; }
  const cam = camBump(t);
  p.background(18, 16, 20);
  p.push(); p.translate(W / 2, H / 2); p.scale(cam); p.translate(-W / 2, -H / 2);
  drawRoadStrip(p, 0, W, 940, 60, t * ROAD_SPEED);
  let boundary = null;
  for (let k = 0; k < N; k++) { const b = sceneStart(k); if (t > b - 0.5 && t < b + 0.25) boundary = k; }
  if (boundary === null) {
    if (loc.phase === 'intro') { drawIntro(gI, t); p.image(gI, 0, 0); }
    else { renderScene(gA, loc.i, t); blit(gA, PANEL, PANEL, 1, 1); framePanel(1); }
  } else {
    const b = sceneStart(boundary);
    const e = easeInOut(ramp(t, b - 0.5, b + 0.25));
    renderScene(gB, boundary, t);
    blit(gB, PANEL, PANEL, lerp(0.88, 1, e), 1); framePanel(lerp(0.88, 1, e));
    if (boundary === 0) { drawIntro(gI, t); blit(gI, W, H, lerp(1, 1.45, e), 1 - smooth(e)); }
    else {
      renderScene(gA, boundary - 1, t);
      blit(gA, PANEL, PANEL, lerp(1, 1.45, e), 1 - smooth(e)); framePanel(lerp(1, 1.45, e));
    }
  }
  p.pop();
}

export function labelAt(t) {
  const l = locate(t);
  return l.phase === 'intro' ? 'Intro' : l.phase === 'outro' ? 'Outro 新闻发布会' : SCENE_NAMES[l.i];
}

export function init() {
  return new Promise((resolve) => {
    new window.p5((sk) => {
      sk.setup = () => {
        p = sk;
        sk.pixelDensity(1);
        const c = sk.createCanvas(W, H); c.parent('stage');
        sk.noLoop();
        gA = sk.createGraphics(PANEL, PANEL); gB = sk.createGraphics(PANEL, PANEL);
        gI = sk.createGraphics(W, H); gSeat = sk.createGraphics(PANEL, PANEL);
        for (const g of [gA, gB, gI, gSeat]) g.pixelDensity(1);
        paper = makePaper();
        window.TOTAL = TOTAL; window.renderAt = renderAt; window.labelAt = labelAt;
        window.__ready = true;
        renderAt(0);
        resolve();
      };
    });
  });
}
