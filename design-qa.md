# Design QA — Odra Picture Motion Site

Reference: `/Users/prajaktagaikwad/.codex/generated_images/019fff17-9a65-7670-829c-b466638b26c2/exec-f9307f04-f917-46e1-a69f-76ba4e9c5da0.png`

Approved live reference: https://odra-picture-motion.vercel.app/#entry

Local preview: http://127.0.0.1:4178/#entry

## Locked visual states

- 01 Entry: approved photographic warm-plaster architecture, sphere and pedestal, carved portal, and orange route.
- 02 Hero: approved photographic 50/50 editorial split with cream copy field, blue-and-ivory architecture, orange portal, and lavender diagonal plane.
- 03 Global ambition: approved photographic world-map environment, pastel portal doors, and orange connection route.

These three source images, their typography, the portal transitions, camera path, camera targets, field of view, and transition timing remain unchanged.

## Completed continuation

- 04 Founder support: pastel architectural cards using the established portal language.
- 05 Proof and ecosystem: restrained metric composition and scroll-triggered counters.
- 06 Investment thesis: same pastel editorial system and compact architectural reveals.
- 07 Portfolio preview: structured company rows with a supporting photographic architectural panel.
- 08 Apply and connect: concluding portal scene, clear calls to action, and legal footer.
- Internal pages: Team, Partners, Thesis, Newsroom, Events, and FAQ use the same visual system, content language, navigation, footer, and restrained motion behavior.

## Verification

- Camera trajectory, camera angles, and all camera keyframes remain unchanged.
- Palette, material language, photography, architectural forms, and composition follow the approved Option 3 reference.
- The entry, hero, and global photographic plates remain aligned with the existing zoom-through camera targets.
- Header and content remain readable throughout the scroll journey.
- Portal-based scroll interaction is preserved.
- Desktop homepage review passed at 1280 × 720 with no missing images or horizontal overflow.
- Mobile homepage review passed at 390 × 844 with no missing images or horizontal overflow.
- Mobile route checks passed for Team, Partners, Thesis, Newsroom, Events, and FAQ.
- Desktop Team page review passed with the internal hero at the intended 680px height.
- Footer social icons, legal information, and navigation were visually checked.
- Production build passed; Sites packaging passed; all 4 project tests passed.

## Evidence

- Approved live entry: `qa/reference-entry-live.png`
- Local implementation entry: `qa/implementation-entry-latest.png`
- Reference design: `/Users/prajaktagaikwad/.codex/generated_images/019fff17-9a65-7670-829c-b466638b26c2/exec-f9307f04-f917-46e1-a69f-76ba4e9c5da0.png`

## Application gateway QA — 2026-08-20

### Source visual truth

- Primary form anatomy: `/Users/prajaktagaikwad/Desktop/Screenshot 2026-08-20 at 09.05.12.png`
- Supporting hero/form inspiration: `/Users/prajaktagaikwad/Desktop/Screenshot 2026-08-20 at 09.05.29.png`
- Source pixels: 2880 × 1800. The source includes browser chrome and a third-party preview overlay, so it was normalized to 1440 × 900 for structural comparison rather than treated as an exact brand target.

### Implementation evidence

- Hero viewport: `qa/apply-desktop-viewport.png` — 1440 × 1000 CSS px, device density 1.
- Focused form viewport: `qa/apply-form-viewport.png` — 1440 × 1000 CSS px, device density 1.
- Mobile viewport: `qa/apply-mobile-viewport.png` — 390 × 844 CSS px, device density 1.
- Combined comparison: `qa/apply-comparison.png` — 2880 × 1000 px.
- Route/state: `/apply`, step 1 “Pathway”; focused comparison uses the form workspace after the hero.

### Full-view comparison evidence

- The source’s focused white form surface, strong title hierarchy, generous field spacing, clear required markers, and decisive footer actions are carried into the Odra flow.
- The implementation intentionally replaces the source modal overlay and generic registration language with an in-site Odra page, persistent Odra navigation, pathway progress, and approved cream/lavender/mint/blue tokens.
- The desktop composition has no clipped persistent controls. The mobile layout measured `scrollWidth: 390` and `clientWidth: 390`, with no horizontal overflow.

### Focused region comparison evidence

- The combined comparison verifies form-frame proportions, title-to-control rhythm, label hierarchy, border treatment, action prominence, and information density.
- Pathway selection is the required first state, so cards replace the reference’s text fields in the focused comparison. Founder details on step 2 use the reference’s two-column grouping and collapse to one column on mobile.

### Required fidelity surfaces

- Fonts and typography: Manrope remains consistent with the approved Odra implementation; weight, line height, wrapping, and small-label hierarchy are legible at desktop and mobile sizes.
- Spacing and layout rhythm: the focused form card, step rail, 58px inputs, grouped fields, and action row preserve the reference’s generous density while matching Odra’s editorial grid.
- Colors and tokens: only established Odra cream, paper, ink, orange, lavender, mint, and blue treatments are used. Validation red is reserved for errors.
- Image quality and assets: the existing approved Odra logo and founder-collaboration asset are reused. No placeholder art, handcrafted SVG, or approximate brand mark was introduced.
- Copy and content: fields cover pathway, founder, company, stage, sector, product, evidence, fundraising status, desired support, review, consent, and accurate program/investment disclosures.

### Findings

- No actionable P0, P1, or P2 visual differences remain.
- P3: the source uses softer input shadows, while the implementation uses flatter borders to stay consistent with the approved Odra editorial direction. This is an intentional brand adaptation.

### Interaction and technical verification

- Empty pathway validation passed.
- Founder and company field completion passed using safe mock data.
- Company context selects and text areas passed.
- Consent validation and the frontend-only completion state passed.
- Desktop and mobile console checks returned no warnings or errors.
- Production build passed; Sites packaging passed; all 4 hosting tests passed.
- The approved homepage camera keyframes and scene direction were not edited.

### Comparison history

- Initial browser capture showed the previous placeholder because the earlier development process was stale. The preview server was restarted, the `/apply` route was reloaded, and post-fix DOM and screenshot evidence confirmed the implemented application gateway.
- No post-render P0/P1/P2 visual finding required a design iteration.

final result: passed
