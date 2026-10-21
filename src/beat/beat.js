export const BPM = 120;
export const BEAT = 60 / BPM;
export const BAR = BEAT * 4;
export const INTRO = 5;
export const N = 20;
export const SCENE = BAR * 3;
export const OUTRO = BAR * 6;
export const T_OUTRO = INTRO + N * SCENE;
export const TOTAL = T_OUTRO + OUTRO;

export const sceneStart = (i) => INTRO + i * SCENE;
export const beatOf = (t) => t / BEAT;

export function locate(t) {
  t = Math.min(Math.max(t, 0), TOTAL - 1e-9);
  if (t < INTRO) return { phase: 'intro', t, local: t, u: t / INTRO };
  if (t >= T_OUTRO) return { phase: 'outro', t, local: t - T_OUTRO, u: (t - T_OUTRO) / OUTRO };
  const i = Math.floor((t - INTRO) / SCENE);
  const local = t - sceneStart(i);
  return { phase: 'scene', t, i, local, u: local / SCENE, bar: Math.floor(local / BAR), barPhase: (local % BAR) / BAR };
}

export function frameCrossings() {
  return Array.from({ length: N - 1 }, (_, k) => sceneStart(k + 1));
}

export function punch(t, center, width = 0.12) {
  const x = (t - center) / width;
  return Math.exp(-x * x);
}

export function beatPulse(t, decay = 0.18) {
  const ph = (t / BEAT) % 1;
  return Math.exp((-ph * BEAT) / decay);
}

/** Events the music stage (4) will lock to. Seconds. */
export const EVENTS = {
  introLine2: 4.0,
  frameCrossings: frameCrossings(),
  outroFlashes: [T_OUTRO + 4, T_OUTRO + 5, T_OUTRO + 6],
  bell: T_OUTRO + 11,
};
