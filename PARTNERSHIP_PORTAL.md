# Xaragne Lô — Brand Intelligence & Sponsorship Portal

A reusable module (`src/portal/`) that adds three things to The Legend without changing the museum experience:

| Part | Where | Who sees it |
|---|---|---|
| Public **Partenariats** section | Home page, `#partenariats` | Everyone |
| **Executive dashboard** preview | `#/espace-direction` | Management (demo gate only — see Security) |
| **Media kit** with PDF export | `#/media-kit` | Shared with prospective partners |

**Status: demonstration.** No social account, analytics tool or CRM is connected. Every figure is labelled with its provenance, and nothing simulated is presented as a real measurement.

---

## 1. Data integrity rules

Every number is a `Metric` (`src/portal/model.ts`) with:

- `provenance` — one of:
  - `verified`: from an authorised source (platform API, analytics export), checked.
  - `screenshot`: read off a screenshot. Approximate and usually undated.
  - `manual`: supplied by management, not yet cross-checked.
  - `demo`: illustrative data. Shown as **Données de démonstration / Demo data**.
  - `unavailable`: no data. Shows what has to be connected.
- `source` (label + optional URL), `period`, `asOf` (date the value describes), `updatedAt` (date entered).

The dashboard's **Ressources → Registre des données** lists every figure with these fields, and **Registre des indicateurs (CSV)** exports it.

### Current figures and their sources

| Figure | Value | Provenance | Source |
|---|---|---|---|
| Instagram followers | ≈ 265,000 | Screenshot | Reference screenshot supplied to Dalal Technologies; screenshot date unknown |
| Facebook followers | ≈ 82,000 | Screenshot | Same |
| YouTube subscribers | — | Unavailable | Official channel not yet verified |
| Engagement rate, video views, website visitors, sessions | various | Demo | Generated for the demo |
| Inquiries, qualified leads, campaigns, reach, referrals, conversions | various | Demo | Generated for the demo |
| Audience geography, age and gender, visitor countries | — | Unavailable | Requires authorised analytics |
| Newsletter, community opt-ins, shop conversions | — | Unavailable | Requires form delivery / shop |
| Pipeline rows ("Organisation exemple A–F") | — | Demo | Fictional; no real company named |

Career facts in the public section and the media kit come only from `src/content/facts.ts`, where each fact cites a press source (checked 2 Nov 2026). The official career record, sponsorship rates and management contact are **not** published.

**Never** add age groups, geography, engagement, revenue, ROI, impressions or sponsor relationships without an authorised source.

---

## 2. Data adapters

`src/portal/adapter.ts` defines a `MetricsAdapter` interface. The demo uses `fixtureAdapter` (bundled data). Ready to extend:

- `manualUploadAdapter(rows)` — management supplies figures (e.g. a JSON export from Meta Business Suite). Rows become `manual` until checked.
- Future server-side adapters (one per source), each returning labelled metrics:

| Source | API / export | Permission needed from management |
|---|---|---|
| Instagram | Instagram Graph API (insights) | Instagram Professional (Business/Creator) account linked to a Facebook Page; app review for `instagram_basic`, `instagram_manage_insights` |
| Facebook Page | Facebook Graph API, Page Insights | Page admin access; `pages_read_engagement`, `read_insights` |
| YouTube | YouTube Data API + YouTube Analytics API | Owner OAuth consent on the verified channel |
| Website | Netlify Analytics, or GA4 / Plausible with consent | Account access; cookie consent if GA4 |
| Inquiries | Netlify Forms → CRM (e.g. HubSpot, Airtable) | Form delivery turned on; CRM workspace |
| Newsletter | Email tool (e.g. Brevo, Mailchimp) | Account + double opt-in |

Exact API scopes and review requirements must be confirmed with each platform at setup; they change over time.

---

## 3. Security and privacy (required before any live use)

The demo gate at `#/espace-direction` is **not** authentication. It only prevents the preview being mistaken for a live system. Before private data is shown:

1. **Authentication:** named accounts for management (e.g. Netlify Identity, Auth0, Clerk or Supabase Auth), with multi-factor sign-in.
2. **Server-side authorisation:** dashboard data served only by protected backend functions (e.g. Netlify Functions) that check the user's role on every request. Never ship private figures in the public JavaScript bundle; never rely on a hidden URL or a client-side password.
3. **Secrets:** platform tokens stored as server-side environment variables, refreshed by a scheduled function, never sent to the browser.
4. **Data minimisation:** aggregated audience statistics only; no individual fan data in the dashboard.
5. **Leads:** inquiry data access-restricted, retention period defined, deletion on request. Privacy notice already shown under the form.
6. **Law:** check Senegal's Law 2008-12 on personal data and GDPR for European diaspora visitors.

---

## 4. Inquiry form

`#demande-partenariat` (public section), Netlify form name `partenariat`.

- Required: company, contact person, work email, partnership type, proposed collaboration, preferred dates, message, consent.
- Optional: budget range, company website.
- Validation with accessible error messages, honeypot field, minimum fill time, privacy notice.
- `VITE_FORMS_MODE=demo` (default): validates but never transmits, and says so. Set to `netlify` to deliver to Netlify Forms; the static definition in `index.html` already lists every field.

## 5. Media kit

`#/media-kit` renders four A4 pages (cover, biography and verified highlights, audience and media exposure, opportunities, deliverables and contact). **Exporter en PDF** opens the browser print dialog; print CSS lays out one page per sheet. A server-side PDF renderer can replace this later without changing the content. Every page carries the "unofficial demo" notice until management approves the document.

## 6. Reusing the portal for another client

1. Copy `src/portal/`.
2. Replace `data.ts` with the new athlete's `PortalDataset`.
3. Adjust copy in `strings.ts` (French and English).
4. Point the media kit's photo keys and facts at the new client's content files.
