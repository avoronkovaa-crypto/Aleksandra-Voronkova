# Fractal — clickable prototype

A high-fidelity, clickable web prototype of the Fractal Design e-commerce flow, built from the
Figma file [Fractal-Design](https://www.figma.com/design/gHL3sGjkJLIZNTvA85Ojlr/Fractal-Design?node-id=2137-35677)
and its [design system](https://www.figma.com/design/gHL3sGjkJLIZNTvA85Ojlr/Fractal-Design?node-id=569-5155).

## Run it

```bash
npm install
npm run fetch-assets   # one-off: downloads the photography from Figma (see below)
npm run dev            # http://localhost:5173
```

`npm run build` produces a static site in `dist/` (hash routing, so it works on any static host,
e.g. GitHub Pages).

### Images

Photography and product renders live in the Figma file. `npm run fetch-assets` pulls every image
fill the prototype uses (listed by Figma image hash in `scripts/figma-assets.json`) through the
Figma REST API, resizes them and saves them to `public/assets/<hash>.webp`:

```bash
FIGMA_TOKEN=<personal access token> npm run fetch-assets
```

Create a token in Figma → Settings → Security → Personal access tokens (read-only file content is
enough). Until the images are fetched every image slot shows a neutral placeholder, so the layout
and all interactions still work. Logos, icons and payment/carrier marks are exported vectors and
are already in the repo.

## Flow

Use **Prototype screens** (top-left of the black bar) to jump anywhere or reset the cart.

1. **All Categories** — hero, anchor links with scroll-spy, category carousels (arrows, progress bar, hover zoom).
2. **Header** — transparent over heroes → solid on scroll; *Products* mega-menu (category hover → sub-list + image
   cross-fade), *Community* menu, live search with results panel, language switcher, cart counter.
3. **Cases** → filter chips, grid/column toggle, sort dropdown, preview cards (render → lifestyle photo on hover).
4. **Pop Series** → tabbed blocks, product cards with colour swatches, compatible models.
5. **Cases Pop Air** → **Pop Air landing** (sticky section nav with scroll-spy, feature slides, benefits,
   reviews, spec accordions, related products).
6. **Product page** — sticky gallery (arrows, dots, drag), model + colour pickers, accordions, reviews,
   sticky *Add to cart* → opens the cart.
7. **Cart drawer** — quantity, remove → empty state, free-delivery badge, promocode
   (try `FRACTAL`; anything else shows the error state).
8. **Checkout** — Delivery (method, saved addresses, validated form with error / focused / filled states) →
   Payment (method, saved cards, card form with formatting + validation) → order confirmation.

## Design → code

| Figma | Code |
| --- | --- |
| Colours, spacing, radius, type scale | `src/styles/tokens.css`, `src/styles/global.css` |
| Buttons (Primary / Secondary / Tertiary / Link, hover + disabled) | `src/components/Button.tsx` |
| Input field (Placeholder / Focused / Filled / Destructive), radio, checkbox | `src/components/form/Field.tsx` |
| Header states, search bar, flag dropdown | `src/components/header/*` |
| Cards (product, preview, category) | `ProductCard`, `PreviewCard`, `CategoryRow` |
| Cart & checkout components | `src/components/cart/*`, `src/pages/checkout/*` |

Fonts: **Poppins** (body) is bundled. **Sofia Pro** (titles) is a commercial font — it is used when
installed locally, otherwise the prototype falls back to the closely matching **Figtree**.

Motion uses [Motion](https://motion.dev) with one easing curve (`cubic-bezier(0.22, 1, 0.36, 1)`) and
short durations (160–550 ms). `prefers-reduced-motion` is respected.
