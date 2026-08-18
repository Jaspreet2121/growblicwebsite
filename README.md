# Growblic Website

The cinematic Growblic site: a scroll-driven hero film that plays as visitors
scroll, settling into the full company site. Next.js 16, no animation
libraries, shipped as a Docker container.

## Run it

Local development:

```bash
npm install
npm run dev
```

Production, in Docker:

```bash
docker compose up -d
```

The site serves on port 3000. Phones and reduced-motion visitors get a
designed still-image hero and never download the video.

## The contact form

Every submission is appended to `data/leads.jsonl` (a named Docker volume,
`growblic-leads`, in compose). Read them any time:

```bash
docker compose exec web cat /app/data/leads.jsonl
```

To also receive each enquiry by email, create a free API key at resend.com
and set it before starting:

```bash
RESEND_API_KEY=re_xxx docker compose up -d
```

See `.env.example` for `CONTACT_TO` and `CONTACT_FROM`. Without a key the
form still works and every lead is kept in the file.

## Going live later (documented, not yet done)

1. Point the server: any host that runs Docker works. `docker compose up -d`
   behind a reverse proxy (Caddy or nginx) terminating HTTPS for
   growblic.com.
2. Set `RESEND_API_KEY` (and verify the growblic.com domain in Resend so
   `CONTACT_FROM` can be a growblic.com address).
3. Confirm the live origin in `app/layout.tsx` (`metadataBase`, marked with
   a DEPLOY STEP comment). og tags, sitemap.xml, and robots.txt already point
   at https://www.growblic.com.
4. After DNS cutover, verify: page loads over HTTPS, `/assets/hero-scrub.mp4`
   serves, the browser console is clean, and the scroll film plays.

## Where things live

- `components/Hero.tsx` — the scroll-scrub engine (Blob loader, gated seeks,
  caption bands, the five static-hero gates duplicated in `app/globals.css`).
- `components/Mark.tsx` — the Growblic leaf mark, traced from the original
  logo as SVG.
- `app/globals.css` — the whole design system. Palette tokens at the top.
- `public/assets/` — the film (`hero-scrub.mp4`), poster and ending frames,
  section stills, and app artwork.
- `pipeline/` — the generative film pipeline (deterministic canvas renderer +
  headless Chrome driver + ffmpeg encode), the audit harness, and the design
  package the build follows. Re-rendering the film costs nothing but minutes.
