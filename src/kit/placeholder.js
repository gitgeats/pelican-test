import { drawStickRider, drawTitleCard } from './draw.js';
import { ramp } from './ease.js';

export function makePlaceholder(meta) {
  const [r, gg, b] = meta.color;
  const light = (r + gg + b) / 3 > 128;
  return {
    meta,
    /** g: 1000x1000 graphics. ctx: { t, local, u, bar, P, px } (px = pelican x in panel units) */
    draw(g, ctx) {
      g.background(r, gg, b);
      g.noStroke(); g.fill(light ? 0 : 255, 40); g.rect(0, 900, 1000, 100);
      g.fill(light ? 0 : 255, 22);
      g.textFont('sans-serif'); g.textAlign('center', 'center'); g.textSize(420); g.text(String(meta.n), 500, 520);
      g.push(); g.translate(ctx.px, 900);
      drawStickRider(g, ctx.P, light ? 20 : 240, 5);
      g.pop();
      drawTitleCard(g, meta, ramp(ctx.local, 0, 0.3) * (1 - ramp(ctx.local, 2.2, 2.6)), { fg: light ? 250 : 255, bg: light ? 30 : 10 });
    },
  };
}
