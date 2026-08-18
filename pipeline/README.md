# Film pipeline

The hero film and section stills are rendered deterministically, no AI
credits, no stock footage:

1. `render.html` draws any frame of the 6-second film on a canvas
   (`renderFrame(i, 360)`).
2. `drive.js` walks it through headless Chrome: `node drive.js all`
   renders `frames/f0000.png ... f0359.png` (needs `npm i puppeteer-core`
   here and Google Chrome installed).
3. Encode for scrubbing (the short keyframe interval is what makes
   scroll-seeking smooth):

   ffmpeg -framerate 60 -i frames/f%04d.png -c:v libx264 -crf 12 -preset fast -pix_fmt yuv420p raw.mp4
   ffmpeg -i raw.mp4 -c:v libx264 -crf 18 -preset slow -g 8 -keyint_min 8 -pix_fmt yuv420p -movflags +faststart -an ../public/assets/hero-scrub.mp4

4. Poster and ending frames come from the encoded file; `stills.html` +
   `drive-stills.js` render the section art the same way.
5. `verify.js` and `audit.js` are the test harness: scrub verification,
   flick test, static-hero gates, reduced motion, legibility audit.

`design-package.md` is the design document the whole site follows.
