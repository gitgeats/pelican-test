import { BEAT } from '../beat/beat.js';

export const ROAD_SPEED = 300;
export const WHEEL_R = 75;
const CRANK = 32;
const THIGH = 80;
const SHIN = 85;
const BB = { x: 0, y: -62 };
const SEAT = { x: -40, y: -170 };

function ik(hip, target, l1, l2) {
  const dx = target.x - hip.x, dy = target.y - hip.y;
  const len = Math.hypot(dx, dy);
  const d = Math.min(len, l1 + l2 - 0.01);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const ux = dx / len, uy = dy / len;
  return { x: hip.x + ux * a + uy * h, y: hip.y + uy * a - ux * h };
}

/**
 * Pure skeleton for time t (seconds). Local coords: origin = ground below bike centre, +x forward, +y down.
 * One crank revolution = 2 beats.
 */
export function pose(t) {
  const theta = Math.PI * (t / BEAT);
  const bob = 4 * Math.sin(2 * theta);
  const wheelAngle = (t * ROAD_SPEED) / WHEEL_R;
  const pedA = { x: BB.x + CRANK * Math.cos(theta), y: BB.y + CRANK * Math.sin(theta) };
  const pedB = { x: BB.x - CRANK * Math.cos(theta), y: BB.y - CRANK * Math.sin(theta) };
  const hip = { x: SEAT.x, y: SEAT.y - 8 + bob };
  const chest = { x: hip.x + 40, y: hip.y - 62 };
  const neckMid = { x: chest.x + 28, y: chest.y - 52 + Math.sin(theta) * 2 };
  const head = { x: chest.x + 78, y: chest.y - 82 + bob * 0.5 };
  const beakBase = { x: head.x + 18, y: head.y + 4 };
  const beakTip = { x: head.x + 150, y: head.y + 26 };
  const handle = { x: 78, y: -192 };
  const wingRoot = { x: chest.x - 4, y: chest.y + 6 };
  const wingElbow = { x: (wingRoot.x + handle.x) / 2 - 6, y: (wingRoot.y + handle.y) / 2 + 18 };
  return {
    theta, wheelAngle, bob,
    rearHub: { x: -95, y: -WHEEL_R }, frontHub: { x: 95, y: -WHEEL_R },
    bb: BB, seat: SEAT, handle, hip, chest, neckMid, head, beakBase, beakTip,
    wingRoot, wingElbow, pedA, pedB,
    kneeA: ik(hip, pedA, THIGH, SHIN), kneeB: ik(hip, pedB, THIGH, SHIN),
    tail: { x: hip.x - 70, y: hip.y + 12 },
  };
}
