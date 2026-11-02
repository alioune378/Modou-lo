# Content & rights checklist: before any public or commercial launch

The demo is private (noindex, robots disallow). Clear **every** item below before removing `noindex` or showing the site publicly.

## 1. Permissions and approvals

- [ ] Written agreement from Modou Lô or his authorised representatives covering his **name, nickname "Xaragne Lô", likeness and image rights**.
- [ ] Approval of the "XARAGNE LÔ" wordmark and of any merchandise use. Check for existing trademarks.
- [ ] Decide whether the site will become official. If not, keep the independent-concept disclaimer.
- [ ] Rock Énergie (stable): approval for its name to be mentioned in a commercial context.

## 2. Photographs: all 18 supplied images are provisional

For each image, record the **photographer or agency, licence type and scope, territory, duration, and credit line**.

| File | Specific issue |
|---|---|
| 01_champion_studio_portrait | Contains a third-party **broadcaster's promotional text and branding**. Needs that broadcaster's permission, or a clean original. Not used on the site. |
| 07_fight_record_poster | A **sports outlet's poster with a visible watermark**. Its printed statistics are **unverified**. Not displayed. |
| 11_crowned_victory_poster | A **third-party poster with logos and text**. Shown only as a small archive thumbnail. Needs a licence, or remove it. |
| 13_stadium_wrestling, 16_traditional_arena_attire, 18_arena_arms_crossed | Arena and event photography. Identify the photographer or agency. Crowd members are visible. |
| 02_training_arrival, 12_red_hoodie_casual, 14_senegal_jersey | Other identifiable people are visible. Check publicity rights. 14 shows a team kit and a sponsor sign. |
| 04, 10 | Event backdrops and a broadcaster microphone flag are visible. Check whether brand marks may appear. |
| 03, 05, 06, 08, 09, 15, 17 | Identify the photographer and the licence. |

- [ ] Supply a **photograph of Parcelles Assainies**. The Origins section currently shows a placeholder.
- [ ] Supply **dated event photography** for each fight. Cards currently show illustrative photos.

## 3. Facts: verify with an official source

Facts currently used, each with a press source (checked 2 Nov 2026; see `src/content/facts.ts`):

- [ ] First bout: 4 Feb 2006, vs Pape Sène 2. *Result not stated in the source.*
- [ ] Became Roi des arènes on 28 Jul 2019 by beating Eumeu Sène.
- [ ] Title defences: Ama Baldé (5 Nov 2023), Boy Niang 2 (1 Jan 2024), Siteu (24 Nov 2024).
- [ ] Lost the title to Sa Thiès on 5 Apr 2026 ("in under two minutes", per Le Soleil).
- [ ] Rock Énergie was founded in May 2002 in Parcelles Assainies by the late Demba Dia. Nickname "Roc des Parcelles".
- [ ] **Still missing:** official career record (wins/losses/draws), venues for each fight, a complete list of opponents, his birth date (if desired), and his business and community activities.

Do not publish totals from promotional posters until they are confirmed.

## 4. Video and social

- [ ] Documentary or film for the hero "Voir le film" button. Rights cleared for web embedding.
- [ ] Approved YouTube IDs for Xaragne TV and fight highlights. Check broadcaster rights.
- [ ] Verified official social accounts, to add to `socialLinks`.

## 5. Copy and translation

- [ ] Approve all editorial copy, including the motto "On peut perdre une couronne. On ne perd jamais sa légende." It is original copy and is not attributed to him.
- [ ] Get an approved personal statement or interview for "L'homme derrière la légende".
- [ ] Have a **native speaker write and review the Wolof translation** (`src/i18n/wo.ts`).
- [ ] Proofread the English.

## 6. Operations

- [ ] Choose a form destination: switch `VITE_FORMS_MODE` to `netlify` and configure notifications.
- [ ] Write a privacy policy and data-handling notice for the forms and newsletter. Check the applicable data-protection law, such as Senegal's Law 2008-12 and GDPR for diaspora visitors.
- [ ] Moderation process and owner for the supporter wall.
- [ ] Media kit PDF.
- [ ] Youth programmes: create a real organisation before enabling applications, donations or payments.
- [ ] Merchandise: brand licence and an e-commerce provider (e.g. Shopify or Snipcart) before any sale.
- [ ] Domain, canonical URL (replace `example.netlify.app` in `index.html` and `public/sitemap.xml`), analytics with consent.
- [ ] Remove `noindex` (in `index.html`, `netlify.toml` and `robots.txt`) **only after everything above is approved.**
