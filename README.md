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

Local Docker (**`compose.yaml` is local-only — production does NOT use it**;
it publishes 3000 on the host and uses a different volume):

```bash
docker compose up -d
```

The site serves on port 3000. Phones and reduced-motion visitors get a
designed still-image hero and never download the video. For production see
**Deploying to EC2** below.

## The contact form

Every submission is appended to `/app/data/leads.jsonl` (careers applications
to `applications.jsonl`) on a named Docker volume — `growblic-leads` locally,
**`growblic-site_leads` in production**. Read them any time:

```bash
docker compose exec web cat /app/data/leads.jsonl                 # local
docker exec growblic-site cat /app/data/leads.jsonl               # production
```

**Email is off in production today**: `RESEND_API_KEY` is empty, so leads are
saved to the volume but nobody is emailed. To turn it on, create a free API
key at resend.com, **verify the growblic.com domain there** (an unverified
`CONTACT_FROM` is rejected by Resend and the email silently never arrives),
and put the values in the box's env file — `~/growblic-site/.env`, next to
`docker-compose.selfhost.yml`. `.env.example` documents all three variables.
Then recreate the container (`up -d`, not `restart` — `restart` keeps the old
environment). **Never commit the real `.env`.**

## Deploying to EC2 (production)

Production is **`www.growblic.com`**, served by this repo's `main` from
`~/growblic-site` on the EC2 box, using **`docker-compose.selfhost.yml`** —
compose project `growblic-site`, service and container `growblic-site`,
volume `growblic-site_leads`, on the external network
`chat-platform-prod_chatnet` with **no host port**: the chat-platform stack's
Caddy proxies `growblic-site:3000`. The `-p growblic-site` flag is not
optional — it is what makes the volume name resolve to the one holding the
live leads.

The container is **renamed, not replaced in place**, so the old one is still
there to roll back to until every check passes:

```bash
cd ~/growblic-site
git pull --ff-only origin main && git log --oneline -1          # confirm the SHA

docker compose -p growblic-site -f docker-compose.selfhost.yml build growblic-site

docker rename growblic-site growblic-site-old && docker stop growblic-site-old
docker compose -p growblic-site -f docker-compose.selfhost.yml up -d growblic-site
sleep 15

# The leads volume must be the SAME one, or the form silently starts writing somewhere new:
docker inspect growblic-site --format '{{range .Mounts}}{{.Name}} -> {{.Destination}}{{"\n"}}{{end}}'
#   expect: growblic-site_leads -> /app/data

for p in "" delete-account privacy terms; do
  curl -s -o /dev/null -w "/$p %{http_code}\n" "https://www.growblic.com/$p"
done                                                              # all 200

docker rm growblic-site-old                                       # ONLY after every check above passes
```

**Rollback** (any check failed — the old container is still there, stopped):

```bash
docker rm -f growblic-site
docker rename growblic-site-old growblic-site && docker start growblic-site
for p in "" delete-account privacy terms; do
  curl -s -o /dev/null -w "/$p %{http_code}\n" "https://www.growblic.com/$p"
done
```

**Env changes only** (e.g. turning email on): edit `~/growblic-site/.env`,
then `up -d growblic-site` as above — no build, no rename needed, but still
`up -d`, never `restart`.

**Checking the OLD, unused volume** `growblic-site_growblic-leads` (from an
earlier deploy; nothing uses it now). Read-only — mounts it `:ro` into a
throwaway container, counts the entries and shows a 60-character preview of
the first and last one (enough to date them — it will include a name/email,
which is your own data), deletes nothing:

```bash
docker run --rm -v growblic-site_growblic-leads:/v:ro alpine sh -c '
  ls -la /v; echo
  for f in /v/leads.jsonl /v/applications.jsonl; do
    [ -f "$f" ] || { echo "$f: absent"; continue; }
    n=$(wc -l < "$f"); echo "$f: $n entries"
    [ "$n" -gt 0 ] && { echo "  first: $(head -1 "$f" | cut -c1-60)"; echo "  last:  $(tail -1 "$f" | cut -c1-60)"; }
  done'
```

If it holds entries the current volume does not, copy them across before
anything is removed; if it is empty, it can be dropped — but that is a
separate, deliberate step, not part of a deploy.

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
