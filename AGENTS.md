## Working Agreement

- Keep communication with the user in Spanish.
- Assume the user keeps the development application running and manually tests every change.
- Do not start or stop the development server unless the user asks or it is required to investigate a bug.
- Do not run builds, linters, typechecks, tests, or browser verification by default. Run them only when investigating a bug, when the user asks, or when a change is unusually risky, such as moving many files or changing a shared state shape.
- When refactoring pure logic, compare the old and new outputs instead of trusting the rewrite.
- Do not create or modify tests, test suites, or Playwright unless explicitly requested.

## Writing Code

Write code that reads like a description of what it does. Optimize for the next reader.

- Name things by meaning: `normalizeForSearch`, `listFilterValues`, `findProduct(idOrSlug)`. Avoid abbreviations and single-letter names outside short inline callbacks.
- Put a module's public surface first (the exported component, the `db` object), followed by its subcomponents and helpers.
- Keep pure helpers at module scope. Declare helpers inside a component only when they need `handle` or context.
- Give magic numbers and literal lists a name and a single home. Enumerations (`filterKeys`, `categoryIds`) and limits shared by browser and server (`searchQueryMaxLength`) live in `src/db/catalog-options.ts`; do not repeat the literal elsewhere.
- Prefer objects with named properties over tuples or positional arrays: `{ label, description }`, not `[string, string]`.
- Replace boolean or positional parameters with an options object: `requestProductSearch({ append: true })`, not `requestProductSearch(true, 0)`.
- Model mutually exclusive states as one union (`status: "idle" | "loading" | "loading-more"`), not several booleans that can contradict each other.
- Prefer lookup tables over branching on a key: `sortComparators[filters.sort]`, `stockStyles[stockLevel(stock)]`. Derive a named level once instead of repeating comparisons.
- Split compound conditions into named predicates and compose them: `inCategory(...) && matchesQuery(...) && matchesFilterGroups(...)`.
- When several actions repeat the same state transition, extract it once (for example, `applyFilters(patch)` resets the page and starts the search).
- Keep data together with the rules attached to it (each price range declares its `value`, `label`, and `includes(price)`). Group lookup tables by domain key (`filterOptionLabels[key][value]`) instead of one flat map.
- Remove redundant mechanisms instead of layering safeguards. For example, one `AbortController` per request already discards stale responses, so do not add a generation counter.
- Comment only constraints the code cannot show, such as why hash links trigger `popstate` or why facet counts are disjunctive. Do not narrate what the next line does.

## TypeScript Types

- Default to `interface` for object shapes: props, API models, domain models, and configuration entries such as `BadgeStyle`. Do not use inline object types for props or `Record` values.
- Use `type` for unions, `Omit`/intersection compositions, generics, function types, inferred aliases, and primitives.
- Name derived domain types once in `src/db/types.ts` (`ProductBadge`, `ProductCategoryId`) instead of repeating `NonNullable<...>` or `Exclude<...>` where they are used.
- Use `Props` for the props of the only component in a file. In multi-component files, use component-prefixed names (`CategoryTabProps`).
- Name API types by role, for example `LoginResponse` or `CreateContextPayload`.
- Name filtered queries as search operations (`searchProducts`, `SearchProductsFilters`, `SearchProductsResult`). Reserve get/find naming for single-item lookups.

## Components

### Declaration

- Use kebab-case filenames (`user-profile.tsx`) and PascalCase `function` declarations, never `const`. Omit the `handle` parameter when the component does not use it.
- Declare component-scope handlers and helpers as named functions. Use arrow functions for callbacks passed directly to APIs or JSX, and extract complex or reused callbacks into named functions.
- Follow the Remix UI namespace pattern for context providers: keep a named provider function internally, export it as `Context`, and consume the module with a lowercase namespace import (for example, `import * as catalog from "./catalog"`, `<catalog.Context>`, and `handle.context.get(catalog.Context)`). Export the original provider function, not a wrapper, so context identity and type inference are preserved.

### Composition

- A main component reads as a table of contents. Its render lists named parts with a single responsibility each; long Tailwind chains live inside those parts:

  ```tsx
  export function CatalogResults() {
    return () => (
      <section class="min-w-0" aria-label="Product selection">
        <CatalogSearch />
        <CatalogToolbar />
        <ActiveFilters />
        <ResultsError />
        <ProductResults />
        <ResultsPagination />
      </section>
    );
  }
  ```

- Layouts own placement and outer spacing. A component does not set its own outer margins or page-level anchors; its parent layout does, so the component can be replaced without breaking the page. Give layout components `children` and named `RemixNode` slots such as `hero`, `navigation`, and `sidebar`.
- Extract layout-only components when structural classes repeat or hide the composition. Put project-wide ones in `src/components/layout/` (`Container`, `PageShell`) and route-local ones with the route (`CatalogLayout`, `ToolbarGroup`). Name them by role; do not wrap a single one-off class.
- Separate connected and presentational components. Containers read context and pass data down. Leaf components receive data plus `onX` callback props (`onSelect`, `onRemove`, `onLoadMore`) and never read context, so they can be reused or swapped.
- Render repeated controls from typed, module-level option lists (`sortOptions`, `viewOptions`).
- Turn repeated form controls into primitives in `src/components/ui/` with Remix-style APIs (`checked` plus `onCheckedChange`), built on an `@remix-run/ui` primitive when one exists (`Switch` uses `toggle`).
- Colocate small subcomponents in the main component's file. A component split across multiple files gets its own folder containing the main component and its parts.

### Styling

- Keep static Tailwind classes as strings. Use `cn` from `@/lib/utils` to combine base classes, variants, conditional classes, and caller-provided overrides; put overrides last and keep complete class names statically discoverable by Tailwind.
- Express variants as `Record<Variant, string>` or `Record<Variant, StyleInterface>` maps instead of nested ternaries or conditional class objects.
- Share a typography or visual treatment used by sibling components through a small component or module-level class constant (`FilterLabel`, `FilterLegend`).

## Project Structure

- Keep code, UI copy, comments, API messages, demo data, and documentation in English.
- Use the TypeScript `@/*` alias (`@/` maps to `src/`) for imports across directories. Keep `./` imports for colocated files; do not use parent-directory (`../`) imports.
- Organize client UI by route under `src/routes/<route>/`: the route's page and all route-exclusive code live together, with local UI in `components/`.
- Use `src/components/` for project-wide reusable components, `src/components/layout/` for shared layout components, and `src/components/ui/` for shadcn-style UI primitives without React. Use Remix headless primitives when available and style them with Tailwind; multi-file primitives get their own folder.
- Put route-specific backend reads in `queries/` and writes in `mutations/`, using Wretch. Add `mutations/` only when writes exist. Components never perform HTTP requests directly.
- Queries and mutations import the shared Wretch client from `@/lib/api`; they do not accept endpoints as arguments or create their own clients. Keep the API base URL, shared headers, middleware, and interceptors in `src/lib/api.ts`, and pass only operation inputs and request-specific options such as cancellation signals.
- Keep HTTP handlers in their endpoint files under `src/pages/api/`. Colocate endpoint-specific HTTP contracts and URL query parsing under `src/pages/api/_lib/`; Astro ignores underscore-prefixed folders when generating routes.
- `src/db/` holds domain models and query/result types (`types.ts`), browser-safe options and defaults (`catalog-options.ts`, `default-search-products-filters.ts`), labels and pure rules (`catalog-labels.ts`, `price-ranges.ts`), and the JSON data with its server-only client (`client.ts`).
- Database modules must not depend on API or route UI modules. Browser code may import database types, options, defaults, labels, and pure rules, never the client or the JSON. Handlers and Astro frontmatter access data only through the client.
- Reuse database result types directly when HTTP responses have the same shape; do not add alias-only or re-export-only files.

## Tooling

- When formatting is requested, use `npm run format`. When verification is warranted, `npm run format:check` checks formatting.
- When verification is warranted, use `npm run check` for types and `npm run lint` for code quality. Use `npm run lint:fix` only when automatic fixes are requested or necessary.
- Keep formatting in Prettier and do not apply React-specific lint rules to Remix components. Keep `prettier-plugin-tailwindcss` last in the Prettier plugins list, pointed at `src/styles/global.css`, with `cn` in `tailwindFunctions`.

## Development

Only when starting the dev server is authorized under the Working Agreement, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

### Remix

- Before working with Remix, consult `node_modules/remix/INDEX.md`. Search the index by task, export, or description, then read only the relevant linked guide sections and package READMEs. Do not load the entire guide collection.
- Prefer documentation and source matching the installed package versions over examples from newer releases.
- For component composition, props, context, and styling, consult the relevant sections of `node_modules/remix/guides/04-rendering-ui.md` and the component README linked from the index. For events, hydration, and cancellation, consult the relevant sections of `node_modules/remix/guides/05-interactivity.md`.
- For headless UI primitives, consult the installed `node_modules/@remix-run/ui/src/<primitive>/README.md` and its referenced APIs as needed.
- This project uses only the Remix component model. Astro owns routing, endpoints, and server behavior; do not introduce the Remix backend unless explicitly requested.

### Astro

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
