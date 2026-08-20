# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

For this portal prototype, the approved visual target is `exec-f9307f04-f917-46e1-a69f-76ba4e9c5da0.png`. Match its warm plaster architecture, carved narrow portals, blue/lavender/mint pastel planes, fine orange route line, and restrained editorial layout. The camera keyframes in `src/App.jsx` are approved and immutable; visual refinement must not alter the camera path, target interpolation, field of view, or scene-transition timing.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Before any production handoff, test the deployed public URL in a fresh unsigned-in browser session (incognito-equivalent), including the first uncached homepage load, every primary navigation route, newsroom detail links, CTAs, and mobile navigation. Never accept a blank or black loading frame; the branded static fallback must remain visible until the WebGL scene is ready.

## Expansion implementation source of truth

- This directory is the single codebase to extend for the expanded Odra website. Do not restart from `odra-3d-prototype` or `odra-venture-site`.
- Preserve the approved homepage camera path and portal storytelling sequence. Homepage visual direction is the approved pastel architectural world; internal pages should be content-rich and calmer.
- The global-facing public architecture, OV School frontend product, programs, investment, portfolio, events, insights, people, trust, and application requirements are consolidated in `../odra-redesign-research/odra-master-implementation-brief.md`.
- The confirmed portfolio roster is Agrento, Roviaza, Railixa, Ledgerza, Clarvec, Kilotrace, Linerv, Partvance, Maintgrid, and Phishexa. Cargiza and all legacy prototype portfolio companies are excluded unless the user explicitly re-approves them.
- Portfolio implementation must not wait for browser capture. Use the approved Odra editorial/architectural media system as the initial art direction and keep media, metadata, relationship labels, and program assignments data-driven so approved source assets can replace them later.
- Do not display invented funding totals, backed-since dates, program assignments, offices, testimonials, investment terms, or relationship claims. Demo-only values must remain clearly identified in source data and must not ship as public facts.

## Durable cinematic direction

- The user wants the entire site to feel like one immersive spatial journey, not a collection of static pages.
- Preserve the approved homepage camera exactly. For all other routes and sections, extend the same forward-moving architectural language with scroll-linked depth, portal/image transitions, and changing forward viewpoints.
- “Camera” means a real scroll-driven WebGL camera: approach a scene plane, zoom through it, and reveal the next section. A flat parallax or CSS-only background does not satisfy this direction.
- Do not spin, orbit, or introduce disorienting camera tilt. Keep navigation, section labels, progress cues, keyboard access, touch access, and reduced-motion alternatives clear even when the experience feels exploratory.
- Frontend only: use realistic local prototype states and validation, but do not add backend storage or transmit founder data.
