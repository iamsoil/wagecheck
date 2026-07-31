# AI Rules for wagecheck

## Tech Stack

- **Framework**: Astro (static site generation with island architecture)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Language**: TypeScript (type-safe JavaScript)
- **Build Tool**: Vite (fast development and building)
- **Package Manager**: npm (Node package manager)
- **Deployment**: Static hosting (Netlify, Vercel, Cloudflare Pages, etc.)
- **Icons**: Lucide React (or SVG icons)
- **Forms**: Native HTML forms with Astro actions or client-side validation
- **Calculations**: Pure TypeScript functions (no external math libraries needed)
- **Testing**: Vitest (unit/integration testing)

## Library Usage Rules

### Styling & UI
- **ALWAYS** use Tailwind CSS for all styling - no custom CSS files unless absolutely necessary
- Use Tailwind's built-in design system (colors, spacing, typography, breakpoints)
- For complex UI patterns, create reusable Astro components with Tailwind classes
- Avoid CSS-in-JS solutions (styled-components, emotion, etc.)

### Components
- **Astro Components** (`.astro`): Default choice for static content, layouts, and server-rendered components
- **React Components** (`.tsx`): Only for interactive islands that need client-side state (calculators, forms with validation)
- **Svelte/Vue Components**: Not used in this project - stick to Astro + React islands

### State Management
- **NO** global state libraries (Redux, Zustand, Jotai, etc.)
- Use React's built-in `useState`/`useReducer` for island interactivity
- Use Astro's `Astro.props` and slots for component composition
- URL search params for shareable calculator states

### Calculations & Business Logic
- **Pure TypeScript functions** in `src/lib/calculations/` - no external dependencies
- Keep calculations testable and framework-agnostic
- Export types alongside functions for type safety
- Validate inputs with Zod schemas where needed

### Forms & Validation
- **Zod** for schema validation (both client and server)
- Native HTML form elements with progressive enhancement
- Astro Actions for server-side form handling if needed
- Client-side validation only for UX (not security)

### Data Fetching
- **NO** external API calls at build time (all calculations are local)
- Static JSON/YAML files in `src/data/` for tax bands, rates, constants
- Use Astro's `getCollection()` if using content collections for blog/docs

### Icons
- **Lucide React** for React islands
- **Inline SVG** or **Astro Icon** for static Astro components
- Avoid icon fonts (FontAwesome, etc.)

### Utilities
- **date-fns** only if date manipulation is needed (prefer native `Intl` API)
- **clsx** or **tailwind-merge** for conditional Tailwind classes
- No lodash/underscore - use native JS/TS methods

### Testing
- **Vitest** for unit tests (calculation functions)
- **Playwright** for E2E tests (critical user flows)
- Test calculation logic thoroughly - it's the core value prop

### Performance
- **NO** heavy client-side bundles - keep islands minimal
- Use `client:visible` or `client:idle` for React islands
- Prefer static generation over SSR
- Optimize images with Astro's built-in `<Image />` component

### Accessibility
- Semantic HTML first
- Proper heading hierarchy
- ARIA labels only when native HTML isn't sufficient
- Test with keyboard navigation and screen readers

### Code Organization
```
src/
├── components/       # Astro components (layouts, UI pieces)
├── components/react/ # React islands (interactive calculators)
├── lib/
│   ├── calculations/ # Pure TS calculation functions
│   ├── schemas/      # Zod validation schemas
│   └── utils/        # Helper functions (clsx, formatters)
├── data/             # Static data (tax rates, constants)
├── pages/            # Astro pages (routes)
├── layouts/          # Page layouts
├── styles/           # Global styles (minimal, mostly Tailwind)
└── types/            # Shared TypeScript types
```

## Forbidden Patterns
- ❌ No `npm install` for UI component libraries (shadcn, Radix, Headless UI, etc.) - build with Tailwind
- ❌ No CSS frameworks besides Tailwind
- ❌ No client-side routing libraries (React Router, etc.) - use Astro's file-based routing
- ❌ No state management libraries
- ❌ No animation libraries (Framer Motion, etc.) - use Tailwind CSS transitions
- ❌ No date libraries unless absolutely necessary
- ❌ No heavy charting libraries - simple SVG/Canvas if needed