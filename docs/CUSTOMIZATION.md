# Make Relay yours

Relay is the SaaS entry in a series of standalone landing templates. Its story is a team getting its time back by connecting everyday tasks. Keep that story coherent when replacing the sample brand.

## The content map

| Change                                                   | File                                                   |
| -------------------------------------------------------- | ------------------------------------------------------ |
| Brand, metadata, navigation, features, integrations, FAQ | `app/data/site.ts`                                     |
| Hero, process explanation, closing message, structure    | `app/pages/index.vue`                                  |
| Scenarios, step details, approval checkpoints            | `app/data/workflows.ts`                                |
| Prices, capacity, extra capacity rates, feature lists    | `app/data/plans.ts`                                    |
| Pricing rules and USD formatting                         | `app/domain/pricing.ts`                                |
| Palette and font families                                | `app/assets/css/main.css`                              |
| Local font files, faces, and preloads                    | `app/composables/useLocalFonts.ts`                     |
| Error-page copy and recovery                             | `app/error.vue`                                        |
| Logo and wordmark                                        | `app/components/BrandMark.vue`                         |
| Browser icon and share artwork                           | `public/favicon.svg`, `public/og.svg`, `public/og.png` |
| Canonical origin                                         | `NUXT_PUBLIC_SITE_URL`                                 |

The visible language is English. The Latin subsets of Manrope and DM Mono are self-hosted; `useLocalFonts.ts` emits their font faces and preloads in the initial document head for both the landing and the error page. This keeps the font faces stable when Vite replaces the main stylesheet during development hydration. The site does not request a font CDN. Both faces use `font-display: optional`, so a font that arrives late does not replace already painted text. On a slow first visit, the fallback font stays for that navigation. If you change fonts or add other writing systems, update the font imports, face definitions, and theme families together; the preloads reuse the imported URLs.

## Replace the brand

1. Update the name, title, description, and navigation in `site.ts`.
2. Update the wordmark in `BrandMark.vue`, the copy in `index.vue`, and the product name in the export in `PricingSection.vue`.
3. Change the color tokens in the CSS `@theme` block.
4. Replace the favicon and share artwork. `og.svg` is the editable source; `og.png` is the 1200 × 630 social image. Rasterize the SVG after changing it.
5. The origin defaults to `https://nuxt-saas-launch.vercel.app`; Vercel builds use `VERCEL_PROJECT_PRODUCTION_URL` when available. Set `NUXT_PUBLIC_SITE_URL` before generating if you need to override it. Regenerate when the origin changes.

## Add a workflow

Each scenario needs a unique ID, a tab label, a short title and description, and a step array. Steps have a tool, label, detail, and color. Set `approval: true` to pause at a human decision.

The demo processes steps in order, waits 650 ms for each automated step, pauses on approval, and stops when a request is sent back. Changing scenarios or resetting cancels the pending timer. Keep headings and descriptions brief enough for the reserved header area.

`savedMinutes` is illustrative, not an observed product metric. The demo does not execute integrations, send messages, or alter external accounts.

## Change pricing carefully

Amounts are integer USD cents. Each plan specifies a monthly base, included people and runs, an extra-person rate, and a rate for each additional block of 1,000 runs.

```text
subtotal = base + max(0, people − includedPeople) × extraPersonRate
                + ceil(max(0, runs − includedRuns) / 1000) × extraRunBlockRate
```

Annual mode applies a 20% discount to the whole subtotal, rounds the monthly equivalent to cents, and bills twelve times that amount. Taxes are excluded. Recommendations compare cost, not feature requirements.

The calculator supports 1–100 people and 0–50,000 runs. If those ranges change, update domain validation and slider controls together. Tests cover capacity boundaries, additional charges, annual totals, and recommendations.

## Connect a real service

The plan dialog downloads an estimate locally. Replace it with a real signup or checkout flow when one exists, and align all displayed prices with the server-side calculation.

Real integrations need authentication, credentials, APIs, and an execution service. The statically deployed template has no runtime server endpoints. Files under `server/routes` emit `robots.txt` and `sitemap.xml` during generation.

## Before release

- Replace fictional branding, sample customers, connections, pricing, and concept-preview labels with accurate product information.
- Verify the public URL, canonical metadata, generated sitemap, and social image.
- Run formatting checks, pricing tests, type checking, static generation, and `npm run test:e2e`.
- Preview keyboard navigation, mobile navigation, approval decisions, billing changes, and downloads.
- Open a missing URL and check HTTP 404, the recovery link, and the page with JavaScript disabled.
- Review dependency updates before exposing development tooling to untrusted users.

## Error pages and previews

`app/error.vue` uses separate copy for 404 and other errors, shares Relay's local fonts, and marks error pages `noindex`. Its home links have real `href` values so they work without JavaScript. Runtime Nuxt errors use `clearError` to reset the error state before returning home. The generated static 404 keeps its rendered HTML, styles, and font preloads, and omits the Nuxt scripts; its native links work immediately and the visitor's missing URL stays intact. Avoid displaying raw server errors or stack traces in the page copy.

Nuxt 4.5 normally generates a client-only 404 fallback. The prerender hooks in `nuxt.config.ts` render the actual error screen into `404.html` and fail generation if that render fails. [Vercel serves this file for missing static paths](https://vercel.com/kb/guide/custom-404-page); keep the deployment free of a catch-all rewrite to `index.html`.

Documentation screenshots can be regenerated with `npm run preview:images` while the static preview is running. The script uses fresh pages, reduced motion, and an adequately sized viewport for the full pricing section. Keep **Skip to content** in the product: it is a keyboard navigation link that appears on focus, not a permanent call to action.
