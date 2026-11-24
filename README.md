# Anant Singh — personal website

A dependency-free, single-page editorial website designed for GitHub Pages.

## Files

- `site.config.json` — single source of truth for the canonical URL, contact details, portrait path, CV path and social/profile URLs.
- `index.template.html` — editable semantic HTML and content. It contains commented template guidance for future media and talk entries.
- `index.html` — generated, published page. Rebuild after changing the template or config.
- `styles.css` — responsive visual system, typography, themes and layout.
- `script.js` — theme toggle, mobile navigation, copy-to-clipboard and restrained reveal effects.
- `build.mjs` — generates `index.html`, `sitemap.xml`, `robots.txt` and `llms.txt` from the configuration.
- `assets/og-image.png` — social preview image; it is not a substitute for a personal portrait.

## Build locally

Requires Node.js 18 or newer. There are no npm dependencies.

```bash
npm run build
npm run preview
```

Open `http://localhost:8000`.

## Personalise before launch

1. Add your portrait as `assets/anant-singh-portrait.webp` (recommended: well-lit, high-resolution, vertical crop).
2. In `site.config.json`, set `portraitImage` to `/assets/anant-singh-portrait.webp` and update `portraitAlt` if needed. Rebuild. The image is inserted into the hero automatically and added to the structured Person schema.
3. Add the exact ORCID and Google Scholar profile URLs to `socials.orcid` and `socials.googleScholar` only after verifying that they belong to you. They will then appear automatically in the footer and `sameAs` data.
4. Add your CV PDF to `assets/` and set `cvPdf` in `site.config.json` (for example `/assets/Anant-Singh-CV.pdf`). The download button appears automatically.
5. Verify the exact title and article URL for any additional press coverage before adding it.

The current public links intentionally omit a Google Scholar URL and ORCID because a reliable identifier was not confirmed for this build. The SMARTS-UP Scholar distinction is included in the academic record; Caltech is presented as a 2023 SURF fellowship, not as a degree-granting alumni affiliation.

## Central URL and custom domain migration

The canonical URL is stored only in `site.config.json` under `siteUrl`. When you move to a custom domain, change that one value, update the GitHub Pages custom-domain setting, add the required DNS records and a `CNAME` file containing the domain, then run `npm run build`. The canonical tag, Open Graph URLs, JSON-LD identifiers, sitemap and `llms.txt` are regenerated from the same setting.

Do not keep the old GitHub Pages canonical URL after the custom-domain launch.

## Deploy to GitHub Pages

1. Create a public GitHub repository named exactly `anantsingh.github.io`.
2. Upload the contents of this folder to the repository root (not the enclosing folder).
3. Commit and push to the `main` branch.
4. In GitHub, open **Settings → Pages** and select **Deploy from a branch**, branch `main`, folder `/ (root)`.
5. Wait for GitHub Pages to publish, then visit `https://anantsingh.github.io`.
6. Check the page on a phone and desktop. Confirm the theme toggle, mobile menu, email copy and press-bio copy actions.

Because the site is plain HTML/CSS/JS, no build pipeline is required on GitHub Pages. Run the local build whenever you change configuration or regenerate SEO files, then commit the generated files too.

## Search Console

1. Add `https://anantsingh.github.io/` as a URL-prefix property in Google Search Console.
2. Verify ownership using the HTML file or meta-tag method Google provides. If using a meta tag, place it in `index.template.html`, then rebuild and redeploy.
3. Submit `https://anantsingh.github.io/sitemap.xml`.
4. Inspect the homepage URL after deployment and request indexing.
5. Validate JSON-LD with Schema.org Validator and Google's Rich Results Test. A Person schema does not guarantee a Knowledge Panel.

## Adding media coverage

In `index.template.html`, find the `<!-- TEMPLATE: COPY THIS ARTICLE BLOCK TO ADD NEW MEDIA COVERAGE -->` comment. Duplicate the `<a class="press-item">` block and change the publication, date, headline, short description and verified article URL. Do not invent a publisher image; use an image only when you have permission or an appropriate licence.

For another talk, copy the `<!-- TEMPLATE: COPY THIS TALK BLOCK TO ADD A SPEAKING ENGAGEMENT -->` article. Keep date, official title, event and role accurate.

## Design notes

The supplied IYPL reference uses a clear publication-led grid with image-first story cards. This site uses the same quick recognition cues—publication name, date, headline and direct link—but in a calmer editorial composition: one featured story with a typographic cover and a compact press rail. This avoids fabricated thumbnails and keeps the visual hierarchy consistent with the rest of the profile. Add licensed or personally owned event photographs as they become available.

The portrait frame is intentionally a placeholder. The profile schema omits `Person.image` until you add your actual portrait. The social preview graphic is a separate branded Open Graph image.
