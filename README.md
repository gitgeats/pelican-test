# The Pelican Test (鹈鹕测试)

~2:17 code-animated short, stage 1 = silent skeleton.

```
npm run setup      # npm install + copy p5 to vendor/
npm run dev        # http://localhost:5173 preview with scrubber
npm test           # beat / rig tests, no browser
npm run shot -- --t 12.5
npm run contact    # out/contact.png
npm run render -- --fps 30 --from 0 --to 137
```
Needs Node 20+, Chrome (CHROME_PATH), ffmpeg.

Layout: src/beat, src/rig, src/kit, src/scenes (one file per panel), src/main, tools, briefs, audio.

Rules: renderAt(t) is a pure function of t (no millis(), frameCount or unseeded random). Each scene draws into a 1000x1000 graphics; ground y=900.
Timeline: intro 0-5s, scene i starts at 5+6i, outro 125-137s.
