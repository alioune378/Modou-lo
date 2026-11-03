# MODOU LÔ — XARAGNE LÔ | The Legend

**An independent, private digital concept by Dalal Technologies.**
This is not an official website. Modou Lô, his management, his stable, and his partners did not commission or approve it.

A cinematic black-and-gold "digital museum" experience, built with **React 18, Vite 5 and TypeScript**, ready to deploy on **Netlify**.

---

## What's included

| Experience | Section id / route | Notes |
|---|---|---|
| 01 Cinematic entrance | hero | Portrait plus arena photo, airborne-sand particles, letter-by-letter gold title, scroll parallax (desktop only), and a "Film à venir" modal. The modal has no fake player. |
| 02 Champion's legacy | `#heritage` | Six "inscriptions". Each one links to its source. The full career record is shown as *À confirmer*. |
| 03 Origins | `#origines` | Two-column documentary layout, keyboard-navigable chapter tabs, and a placeholder for a Parcelles Assainies photo. |
| 04 Hall of glory | `#combats` → `#/combats/<id>` | Data-driven fight cards that scroll horizontally on mobile. Clicking one opens an immersive detail view with previous/next and Esc, plus sources. |
| Timeline | `#chronologie` | Category filters, animated image reveals and gold markers. With `prefers-reduced-motion` it becomes a static list. |
| 05 People's champion | `#peuple` | Supporter wall (empty until moderated), memory submission form with moderation notice, and newsletter signup. |
| 06 Xaragne TV | `#xaragne-tv` | Category filters and YouTube-nocookie embeds. It shows honest "À venir" slots while no approved videos exist. |
| 07 The man | `#homme` | Six editorial chapters, all marked *Contenu à valider*, plus a reserved slot for an exclusive interview. |
| 08 Next generation | `#heritage-continue` | Programmes are labelled as **concepts**. Applications are disabled. |
| 09 Xaragne Official | `#boutique` | Concept collection. There is no cart or checkout, and "Être informé" goes to the newsletter. |
| 10 Partnerships | `#partenariats` | "Une légende. Une audience. Des opportunités.": verified career facts, labelled audience figures, press references, partnership formats, and a partnership inquiry form (plus appearance and press tabs). |
| Executive dashboard | `#/espace-direction` | Demo preview of the brand-intelligence and sponsorship portal. See `PARTNERSHIP_PORTAL.md`. |
| Media kit | `#/media-kit` | Four A4 pages with PDF export through the browser's print dialog. |
| Biography page | `#/histoire` | Long-form story built from sourced chapters, plus the timeline. |
| Concept & rights page | `#/concept` | The disclaimer, the fact sources, and the image-clearance list. |

Languages: **French** (primary) and **English**, per the Dalal Technologies standard. Switching language keeps the current page (`?lang=` plus the hash route).

---

## Local development

Requires Node 18 or later (Node 20 recommended).

```bash
npm install
npm run dev         # http://localhost:5173
npm run build       # production build in dist/
npm run preview     # serve dist/ locally
npm run typecheck   # optional strict TypeScript check
```

## Deploying to Netlify

Use either option:

1. **Git:** push this folder to a repository. In Netlify, choose *Add new site → Import from Git*. Build settings are read from `netlify.toml`: `npm run build`, publishing `dist/`, on Node 20.
2. **CLI:** run `npm i -g netlify-cli && netlify deploy --build`, then `netlify deploy --build --prod`.

`netlify.toml` already sets:

- `X-Robots-Tag: noindex` on every URL. `index.html` also carries `<meta name="robots" content="noindex">`, and `robots.txt` disallows all crawling.
- Long-lived caching for `/media/*` and `/assets/*`.
- An SPA fallback.

For extra privacy, enable **Site protection → password** in Netlify.

### Instant preview (no install)

`prebuilt-preview/` is a ready-made static build of the site, in demo form mode, refreshed on 3 Nov 2026. Drag that folder onto **app.netlify.com/drop** to get a private preview URL in seconds, or serve it locally with `npx serve prebuilt-preview`. For real deployments, use the source build above.

### Forms

Forms are controlled by `VITE_FORMS_MODE`, which you can set in `netlify.toml` or with Netlify environment variables:

- `demo` (default): every field is validated, but **nothing is transmitted**. The interface says so explicitly.
- `netlify`: submissions go to **Netlify Forms**. The hidden form definitions in `index.html` let Netlify detect them. You can view them in *Netlify → Forms* and set email notifications there.

All forms have a honeypot field, a minimum fill-time check, accessible error messages, and consent checkboxes. Supporter memories are **never auto-published**. Moderate them in the Netlify Forms dashboard first.

---

## Editing content (no layout changes needed)

| What | File |
|---|---|
| Achievement strip, fights, timeline, origin chapters, **sources** | `src/content/facts.ts` |
| Videos, social links, "man" chapters, next-gen concepts, products, partner categories | `src/content/editorial.ts` |
| Photos (crop focus, alt text, rights notes) | `src/content/media.ts` (see `MEDIA.md`) |
| Interface text | `src/i18n/fr.ts`, `en.ts` |
| Partnership portal data, copy and metrics | `src/portal/data.ts`, `strings.ts` (see `PARTNERSHIP_PORTAL.md`) |
| Colours, fonts, spacing | `src/styles/tokens.css` |

**To add a fight**, append an object to `fights` in `facts.ts`. If you leave out `venue` or `result`, the site shows "À confirmer" for that field. **To add a video**, add `{ id, category, title, youtubeId, poster }` to `videos` in `editorial.ts`. The gallery switches from placeholder slots to real cards automatically.

**Fact policy:** every factual claim must reference an entry in `sources`. Do not add fight totals, records or results without a reliable source.

---

## Project structure

```
index.html                  meta, noindex, Open Graph, JSON-LD, Netlify form definitions
netlify.toml                build, headers, redirects
public/media/               processed photos (WebP 480/960/1600 + JPEG fallback)
public/og-image.jpg         social preview (1200×630)
scripts/process-images.py   regenerate responsive images from JPGs
src/
  main.tsx, App.tsx         entry + hash router
  i18n/                     dictionaries + provider
  content/                  facts, editorial, media registry
  components/               Header/Footer, Form, Img, Modal, Wordmark, SandParticles
  sections/                 Hero, Legacy+Origins, Glory, Timeline, Community, Business
  pages/                    Home, Story, Concept
  styles/                   tokens.css, base.css, sections.css
```

## Performance and accessibility notes

- The hero portrait is preloaded with `fetchpriority=high`. The arena backdrop is only rendered on wide screens, so phones never download it. All other images are lazy-loaded and served as WebP `srcset` with explicit dimensions, which prevents layout shift.
- No animation library is used. Reveals rely on IntersectionObserver plus CSS, and the particle canvas pauses when it is off-screen. Parallax runs only on desktop with a fine pointer.
- `prefers-reduced-motion` disables the particles, parallax and transitions, and switches the timeline to a static layout.
- The site includes a skip link, visible focus rings, a focus-trapped modal, keyboard tabs and fight navigation (← → Esc), labelled form errors, and 16px inputs so iOS does not zoom.
- Fonts (Anton, Cormorant Garamond, Inter) load from Google Fonts with `display=swap`. The hero title automatically scales to fit its line while fonts load. For maximum performance, you can self-host them later with `@fontsource`.

**Before relying on a Lighthouse score**, run it on the deployed Netlify URL with mobile emulation.

---

Concept & Digital Experience — **Dalal Technologies**
*"Every organization has a story. Your website should tell it."*
