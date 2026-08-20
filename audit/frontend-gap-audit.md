# Odra Venture frontend gap audit

Date: 20 August 2026  
Scope: Frontend only. Portfolio pages and portfolio-company websites are excluded.  
Reference: `ODRA-COMPLETE-NEW-CHAT-HANDOFF.md`

## Executive finding

The approved visual direction is present, but the site is not yet content-complete. The homepage, investment, founder-support, and application experiences provide a solid foundation. Most of the wider sitemap is either a shallow first draft, a placeholder, or a branded 404. Motion is also inconsistent: the homepage has a strong fixed-camera portal experience, while internal pages mainly rely on hover effects and a generic reveal utility instead of the intentional transitions specified in the handoff.

The next implementation milestone should therefore be **public-page content completion plus a shared internal-page motion system**. No backend is required.

## Route audit

| Step | Route or area | Health | Finding |
|---:|---|---|---|
| 1 | Homepage | Partial | The approved fixed camera and portal direction are strong. The page has eight sections, but the handoff calls for nine narrative chapters plus the utility footer. Dedicated Network Ecosystem and People/Stories/Proof chapters are missing or compressed, and visible copy is still too light. |
| 2 | Investment | Healthy content / weak motion | This is the most complete internal page: six sections and substantial copy. It needs intentional section transitions, image-mask reveals, and stronger movement between chapters. |
| 3 | Founder Support | Mostly healthy / weak motion | Four sections and useful content exist. Program pathways, founder outcomes, and proof can be expanded; motion is limited mainly to hover states. |
| 4 | Programs | Placeholder | Only a one-section introduction exists. The program comparison, eligibility, outcomes, timing, pathways, and calls to action are missing. |
| 5 | OV School public pages | Missing | `/programs/ov-school` and `/programs/ov-school/curriculum` return the branded 404. |
| 6 | Accelerator and Scale | Missing | `/programs/accelerator` and `/programs/scale` return the branded 404. |
| 7 | Apply | Partial | The application form is visually developed and frontend-only, but the required Program Matcher and recommendation states are missing. `/apply/guide` is also missing. |
| 8 | Insights | Placeholder | The hub is a one-section shell. Editorial categories, featured content, article cards, newsletter context, and `/insights/:slug` article layouts are missing. |
| 9 | Resources | Missing | `/resources` returns the branded 404. |
| 10 | Events | Shallow | A visual entry exists, but the directory needs filters, upcoming/past states, format and topic metadata, substantive cards, and `/events/:event` detail pages. |
| 11 | Network | Missing | `/network` returns the branded 404. The ecosystem chapter is also missing from the public-site story. |
| 12 | Team | Shallow | The page has a hero and limited content, but needs verified team cards, roles, biographies, and `/team/:person` profiles. |
| 13 | About | Placeholder | The page lacks the institutional story, operating principles, history, model, geographies, and evidence required by the handoff. |
| 14 | Contact and Trust | Placeholder | Both routes need complete content, contact pathways, response expectations, privacy/security explanations, and trust/legal links. |
| 15 | OV School product UI | Missing | Sign-in is a placeholder. Sign-up, password recovery, onboarding, dashboard, curriculum, lesson, exercise, progress, weekly update, company, events, calendar, notifications, settings, and help routes are absent. |

## Content missing from the homepage

- A distinct Network Ecosystem chapter.
- A distinct People, Stories, and Proof chapter.
- A fuller founder-support story with concrete outcomes and examples.
- A clearer investment-thesis bridge into the internal pages.
- A richer final application portal that explains the next step before starting.
- Complete footer navigation for privacy, terms, cookies, accessibility, conduct, and security/trust.
- Verified proof labels and source-status treatment where claims are not yet approved.

The homepage camera and visual direction should remain unchanged. These additions belong in the existing continuation chapters after the portal sequence.

## Motion and transition gaps

### What is working

- The homepage fixed-camera portal experience is intact.
- The portal transition establishes the approved cinematic direction.
- Hover transitions and reduced-motion CSS exist.

### What is missing

- Route enter/exit transitions between internal pages.
- Intentional internal-page hero choreography.
- Section-to-section narrative transitions.
- Image-mask and media reveals.
- Meaningful program-comparison and pathway motion.
- Animated state changes for the Program Matcher and multi-step application.
- Staggered editorial cards, event cards, team cards, and outcome metrics.
- Consistent focus-visible movement that matches hover behavior.

The current generic `.motion-reveal` treatment applies essentially the same fade-and-rise behavior across many elements. The handoff specifically calls for selective, hierarchy-led motion rather than a generic reveal on everything. Replace it with a small motion vocabulary:

1. Page transition: short cream/pastel portal wipe or masked crossfade.
2. Hero transition: eyebrow, heading, summary, then primary action.
3. Section transition: heading and key evidence reveal only when it clarifies hierarchy.
4. Media transition: directional mask or scale settle.
5. Interactive transition: card, button, filter, and matcher-state feedback.
6. Reduced-motion mode: immediate readable content with no pinned or large spatial movement.

## Recommended frontend implementation order

### Milestone A — shared motion foundation

- Replace the generic reveal helper with named motion variants.
- Add route transitions without modifying the homepage camera.
- Add internal hero, section, media-mask, card, and form-state motion.
- Verify keyboard focus and `prefers-reduced-motion` behavior.

### Milestone B — complete the public conversion journey

- Expand `/programs`.
- Build OV School, Curriculum, Accelerator, and Scale pages.
- Turn `/apply` into the Program Matcher entry point.
- Reuse the current application form as the next step after a recommendation.
- Build `/apply/guide`.

### Milestone C — complete the institutional site

- Build Insights, article detail, and Resources.
- Expand Events and create event detail.
- Build Network.
- Expand Team and create profile detail.
- Complete About, Contact, and Trust.
- Add the full footer and legal/trust navigation.

### Milestone D — build the OV School frontend product

- Implement all authentication, onboarding, dashboard, learning, progress, company, events, notifications, settings, and help views with mocked local data only.

## Accessibility and QA note

The existing reduced-motion rule and labelled application fields are positive. A screenshot audit cannot establish WCAG 2.2 AA compliance. The completed frontend still needs keyboard navigation, visible-focus, zoom/reflow, contrast, form-error, reduced-motion, and responsive testing.

## Audit evidence

- `contact-sheet-1.jpg`: homepage, investment, founder support, programs, insights.
- `contact-sheet-2.jpg`: events, team, about, apply, OV School sign-in.

