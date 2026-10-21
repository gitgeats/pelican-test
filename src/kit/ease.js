export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const easeInOut = (x) => { x = clamp(x); return x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2; };
export const easeOut = (x) => 1 - (1 - clamp(x)) ** 3;
export const ramp = (t, a, b) => clamp((t - a) / (b - a));
