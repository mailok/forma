# Forma — Astro + Remix 3

Forma is an experimental project for trying out the **Remix 3 component model** inside **Astro**. It uses a fictional, English-language product catalog as a playground for component composition, shared context, server rendering and client-side interactivity. It is a learning demo, not a production-ready storefront.

Astro owns the document and API; a single `client:load` Remix island owns **all visible UI**. No Remix server/router is used.

The integration lives in `../astro-remix`. `@astrojs/remix` is a local, unofficial experimental package, not a published Astro integration.

## Run

Requires Node **24.3+**.

```sh
npm install
npm run dev -- --background
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

The committed `.npmrc` keeps the local integration as an installed package copy, not an external symlink that Vite would block. After changing the integration, rebuild it and refresh the installed copy.

```sh
npm --prefix ../astro-remix run build
rm -rf node_modules/@astrojs/remix # only this local integration copy
npm install --install-links ../astro-remix
```

For production, live endpoints require a server. The Node standalone adapter is configured:

```sh
npm run build
npm start
```

## Component composition and context

Component filenames use **kebab-case** (for example, `product-card.tsx`); component functions keep **PascalCase**.

```text
index.astro — document, metadata and initial server-side data loading
└── CatalogPage in src/routes/catalog/page.tsx (one hydrated Remix island)
    └── catalog.Context — Handle<CatalogContextProps, CatalogContext>
        ├── SiteHeader / CatalogHero
        ├── CategoryTabs
        ├── FilterSidebar
        │   └── FilterSection → FilterCheckbox (props)
        ├── CatalogResults
        │   ├── CatalogSearch / CatalogToolbar / ActiveFilters
        │   └── ProductCard (product + view props)
        └── DemoFooter
```

Context modules follow the Remix UI namespace pattern: `import * as catalog from "./components/catalog"` and `<catalog.Context>`. The module exports its internal provider as `Context`, preserving the provider function identity rather than wrapping it. The provider calls `handle.context.set(context)`. Descendants get its **typed context by provider identity**, with `handle.context.get(catalog.Context)`. State is ordinary JavaScript; changes explicitly call the provider's `handle.update()` to update descendants. There are no React hooks, global stores or prop drilling of filter state.

HTTP requests use **Wretch**, with typed `.json<SearchProductsResult>()` responses and the request's `AbortSignal` passed through `.options({ signal })`. HTTP errors retain a user-friendly message and retry action. Requests are debounced for text search and canceled on new filter changes or component disposal. A generation guard prevents stale responses from overwriting a newer selection. Initial data is rendered on the server using the same database client as the API, without an HTTP self-request. Filters are reflected in the URL and restored on a fresh request.

All catalog styling uses **Tailwind classes**, with a local DM Sans font. The old `src/components/counter.tsx` remains as an unused reference; its `css()` styles are not used by this page.

## Client organization

Client UI is colocated by route. Astro's `src/pages/index.astro` renders the catalog route's page at `/`; `src/routes/` contains Remix UI, not additional Astro URL entries.

```text
src/
├── components/                        # reusable across routes
│   ├── icon.tsx
│   ├── counter.tsx                    # unused legacy example
│   └── ui/                            # shared UI primitives
├── routes/catalog/
│   ├── page.tsx                       # route composition
│   ├── components/                    # UI owned by this route only
│   │   ├── catalog.tsx
│   │   ├── catalog-results.tsx
│   │   ├── filter-sidebar.tsx
│   │   ├── catalog-hero.tsx
│   │   ├── category-tabs.tsx
│   │   ├── site-header.tsx
│   │   ├── demo-footer.tsx
│   │   └── product-card/              # one multi-file component
│   │       ├── product-card.tsx
│   │       ├── product-media.tsx
│   │       ├── product-details.tsx
│   │       ├── product-metadata.tsx
│   │       ├── product-price.tsx
│   │       ├── product-colors.tsx
│   │       └── product-availability.tsx
│   ├── queries/search-products.ts     # Wretch product searches
│   ├── search-products-filters.ts     # route-only search URL/filter helpers
│   └── types.ts                       # route-only presentation types
├── db/
│   ├── types.ts                       # domain models and database query/result types
│   ├── catalog-options.ts             # valid categories and sort orders
│   └── default-search-products-filters.ts # pure shared search defaults
└── pages/api/_lib/             # colocated with API handlers; no routes generated
    └── parse-search-products-filters.ts # URL query parsing and validation
```

Components delegate HTTP requests to route queries rather than calling Wretch directly. `catalog.Context` owns request timing, cancellation and state updates; `queries/search-products.ts` owns the product search request, typed JSON parsing and HTTP error mapping. Queries import the shared default `api` client from `@/lib/api` instead of receiving an endpoint through component props. `src/lib/api.ts` configures Wretch with the `/api` base URL and JSON accept header, and is the central place for shared middleware and interceptors when needed. Each request derives its own immutable client options, keeping cancellation signals request-local. Write operations will use the same client in a route-local `mutations/` folder when needed; this read-only demo does not create one yet.

If a route component grows across several files, keep those files together in `components/<component-name>/`. A component belongs in the project-level `src/components/` only when it is reusable outside a single route.

## Shared UI primitives

Like shadcn's directory organization, reusable UI primitives live in `src/components/ui/`. These are Remix components, not React/shadcn components:

```text
src/components/ui/
├── button.tsx
└── select/
    ├── select.tsx
    ├── select-trigger.tsx
    ├── select-content.tsx
    └── types.ts
```

`Button` wraps a native button, forwards native attributes and Remix mixins, defaults to `type="button"`, and shares focus/disabled styles. Variants cover primary actions, outlined actions, ghost/icon buttons, links, filter chips and category pills.

Conditional Tailwind classes use `cn` from `@/lib/utils`, which re-exports the framework-independent `cn` package. It combines conditional inputs and resolves conflicting utilities without React dependencies. Shared primitives put caller-provided classes last so they can override defaults. The `@/*` alias maps to `src/*` through `tsconfig.json`; static classes remain plain strings.

`Select` composes the official `@remix-run/ui/select`, listbox and popover behavior. The separate `@remix-run/ui` package is unstable, independently versioned and pinned to `0.13.0`, compatible with this demo's `@remix-run/component` runtime. Its other available primitives include accordion, anchor, combobox, listbox, menu, popover, tabs, toggle and animation utilities. No Remix backend is used.

The application supplies all visuals with Tailwind: trigger, scrollable popup, option descriptions/counts, selection checkmarks, keyboard highlight and disabled states. The primitive supplies keyboard/typeahead behavior, Escape/outside-click dismissal, focus restoration and a hidden named input for forms. It relies on modern browser Popover APIs, not customizable native `<option>` styling. No `css()` is used.

The wrapper exposes `value` and `onValueChange` to the route. Since this primitive version exposes only `defaultValue`, the wrapper resets its internal context for external changes such as category tabs or clearing filters, without remounting the trigger after its own committed selection. Category and sort controls both use this shared component.

The folder is ready for future alerts, dialogs, accordions, sidebars, tabs and drawers; unused primitives are not scaffolded in advance.

## Server organization

HTTP handlers live directly in their corresponding Astro endpoint files. JSON access is encapsulated in a read-only database client:

```text
src/db/
├── products.json     — fake database
├── client.ts         — product/category queries, filtering and facet counts
├── types.ts          — domain models, search filters and search results
├── catalog-options.ts — valid categories and sort orders
└── default-search-products-filters.ts — shared search defaults

src/pages/api/
├── _lib/     — HTTP helpers excluded from Astro routing
│   └── parse-search-products-filters.ts
├── categories.ts     — category list handler
└── products/
    ├── index.ts      — product search handler, HTTP errors and demo latency
    └── [id].ts       — product detail handler and 404 response
```

Handlers use `db.categories.findMany()`, `db.products.search(filters)` and `db.products.findUnique(idOrSlug)` instead of importing the JSON. `db.products.filterValues(key, category)` exposes valid filter options for query validation. The client is server-only; it is not imported by the Remix component tree.

`src/pages/index.astro` loads initial data directly through the same database client, without an HTTP self-request, and redirects malformed queries to `/`. It still resets the initial product page to 1. API URLs and response contracts are unchanged.

Domain models, search filters and `SearchProductsResult` live in `src/db/types.ts`; pure search defaults and valid catalog options also belong to `src/db/`. Database modules do not import API or route UI modules. Browser code imports only the types and pure helpers, never the database client or JSON.

URL query parsing stays beside the handlers in `src/pages/api/_lib/`. The HTTP query and catalog UI import `SearchProductsResult` directly from `src/db/types.ts` because the API returns that result unchanged; no response alias or re-export file is needed. Astro excludes the underscore-prefixed `_lib` folder from routing, so these files do not create endpoints. `parseSearchProductsFilters()` receives the client's filter-value lookup to validate category-specific selections without importing the database client itself. URL serialization and active-filter helpers remain route-local in `src/routes/catalog/search-products-filters.ts`.

## Local API contract

The database is `src/db/products.json`: 20 fictional products, stable IDs, unique slugs, SKU, names, descriptive titles, price, currency, stock, ratings, local images and filter attributes. Descriptions and specifications are reserved for future detail screens. No detail UI, checkout, authentication or persistence is implemented.

### `GET /api/categories`

Returns `{ items: Category[] }`: category ID, label, description and total unfiltered count. `all` is a virtual aggregate category.

### `GET /api/products` — Search products

Returns `{ items, total, page, limit, hasMore, facets, filters }`. Items are product summaries, without full descriptions or specifications.

| Query parameter            | Values / default                                                                |
| -------------------------- | ------------------------------------------------------------------------------- |
| `q`                        | Trimmed text, max 120 characters; matches all words, ignores case/accents       |
| `category`                 | `all` (default), `electronics`, `clothing`, `home`, `outdoors`                  |
| `brand`, `type`, `feature` | Repeated values from the selected category's facet metadata                     |
| `price`                    | Repeated `under-50`, `50-150`, `150-plus` (boundaries: `<50`, `50–150`, `>150`) |
| `inStock`                  | `true` or `false` (default)                                                     |
| `sort`                     | `featured` (default), `price-asc`, `price-desc`, `name`                         |
| `page`                     | Positive integer, default 1, max 10000                                          |
| `limit`                    | Integer 1–24, default 9                                                         |

Within a facet group selections are **OR**; between groups, category, text and stock they are **AND**. Facet counts respect the other groups but exclude their own current selection. Changing category clears category-specific brand/type/feature selections, retaining search, price, stock and sort.

Malformed/unknown query values or parameters return **400** with `{ error: string }`. Responses have `Cache-Control: no-store`. A deliberate **220 ms** delay makes loading states visible; this is a demo, not a production latency recommendation.

Example:

```text
/api/products?category=electronics&feature=wireless&inStock=true&q=quiet
```

### `GET /api/products/:idOrSlug`

Returns `{ item: Product }`, including description and specifications. Unknown ID/slug returns **404** with `{ error: string }`. Prepared for a future detail view; product cards deliberately do not navigate anywhere yet.

## Formatting

Prettier is configured in `prettier.config.mjs` with the Astro plugin and the Tailwind sorting plugin loaded last. Tailwind v4 reads the real CSS entry point at `src/styles/global.css`, including the custom theme tokens. The `tailwindFunctions` option also enables class sorting inside `cn()` calls when formatting is requested.

```sh
npm run format        # format source and sort Tailwind classes
npm run format:check  # check formatting without modifying files
```

`.prettierignore` excludes dependencies, generated Astro/build output, lockfiles, downloaded product assets, local environment files, logs and editor metadata. Editable source files, including the fake product database, remain included.

## Linting

ESLint uses `eslint.config.mjs` with the recommended JavaScript, TypeScript and Astro rules. Remix TSX is parsed as TypeScript/JSX without React-specific rules. The basic rules catch unused variables, enforce strict equality, prefer `const`, require type-only imports where appropriate and prefer interfaces for object types.

```sh
npm run lint       # check code quality without modifying files
npm run lint:fix   # apply available automatic fixes
```

Generated output, dependencies and downloaded product assets are ignored. `eslint-config-prettier` disables conflicting formatting rules, leaving formatting and Tailwind class ordering to Prettier. Full type validation remains in `astro check`; this baseline does not enable type-aware linting or add test suites.

ESLint 10 is used with the Astro lint plugin's Node-24.3-compatible major, preserving the project's current Node baseline.

## Verification

Follow the Working Agreement in `AGENTS.md`: assume the user keeps the app running and manually tests changes. Do not start or stop the server, run verification commands, or create or modify tests by default. Verification is reserved for bug investigations, unusually risky changes, or explicit requests.

```sh
npm run check        # Astro + TypeScript
npm run lint         # JavaScript, TypeScript, Remix TSX and Astro linting
npm run build        # production build
```

## Photos and demo data

Product photos are illustrative, locally downloaded from Unsplash. The exact source image URLs are recorded in `public/products/sources.json`. Fictional product names, brands, stock, descriptions, ratings and prices are demo data and do not describe the photographed brands or real offers.
