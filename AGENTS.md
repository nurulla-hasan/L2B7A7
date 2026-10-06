<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- Design Rules -->
# 📚 Documentation & Knowledge Rules
1. DO NOT rely on your pre-trained outdated knowledge.
2. ALWAYS search and read the latest official documentation for React, Tailwind CSS, and Shadcn UI before generating or modifying code.

# 🎨 Shadcn UI Rules
1. Shadcn components are pre-designed. Prefer built-in props like `variant` and `size` over ad-hoc styling.
2. NEVER use `className` on a shadcn component to mutate its internal appearance such as height, padding, colors, or typography.
3. **Layout & Width Exception (`w-full` is allowed):**
   - Classes controlling container-level width (e.g. `w-full`, `w-auto`) are completely permitted directly on components (e.g., `<Button className="w-full">`), because layout stretching adapts the component to its parent container without breaking its internal tokens, paddings, or border-radius.
   - For margins and outer spacing, prefer wrapping the component in parent layout containers (grid/flex gaps) rather than applying outer margins directly.
4. If you need a new appearance (height, padding, typography, custom variants), EXTEND the component's `variant` or `size` in its source file with `cva()`. Add only what you actually need.
5. The same rule applies to any custom component that already uses `cva()` — extend variants, do not override with `className`.

✅ Allowed (Layout width stretching to parent form/container):
```tsx
<Button className="w-full" size="lg">Sign In</Button>
```

✅ Correct (Extending appearance via cva):
```tsx
// button.tsx — add new size
size: { xl: "h-12 gap-2 px-5 text-base" }

// usage
<Button size="xl">Book now</Button>
```

❌ Wrong (Ad-hoc appearance overrides via className):
```tsx
<Button className="h-12 px-5 text-base bg-blue-600">Book now</Button>
```

# 🎨 Color System Rules
1. NEVER use hardcoded color values (e.g., `text-amber-500`, `bg-[#123456]`, `border-blue-300`, custom hex/rgb/oklch) directly on any component.
2. ALWAYS use CSS variable-based colors: `text-primary`, `bg-muted`, `border-border`, etc. All colors must be defined in `globals.css`.
3. Every color variable MUST have BOTH `:root` (light mode) and `.dark` (dark mode) definitions in `globals.css`, plus an `@theme inline` entry for Tailwind v4.
4. If a color you need doesn't exist in `globals.css`, add it first — in all three places: `@theme inline` block, `:root` section, and `.dark` section. Never skip dark mode.
5. For opacity variants, use the slash syntax with CSS variables: `text-primary/80`, `bg-primary/10`, `border-border/50`. Do NOT hardcode separate opacity colors.

# Responsive Design Rule
1. ALWAYS follow a mobile-first approach. Use base Tailwind utility classes for mobile screens and apply breakpoints (sm:, md:, lg:) for larger screens.

# TypeScript Error Handling Rule
1. ALWAYS use `error: unknown` in `catch` blocks instead of `error: any` to satisfy strict linting rules.
2. When extracting error messages, safely check the error type using `error instanceof Error ? error.message : "Fallback message"`.

# 💡 Proactive Advisory & Best Practice Rules
1. NEVER blindly execute user instructions if an approach violates clean architecture, introduces anti-patterns, or degrades code quality.
2. ALWAYS critically evaluate user prompts: If a solution can be implemented better using industry standards or official best practices, explicitly advise the user, explain why, and suggest the best-practice alternative.
3. Naming & Code Conventions:
   - Utility functions, helpers, and handlers MUST use `camelCase` (e.g., `addToast`, `formatDate`, `getInitials`). NEVER use `PascalCase` for regular functions, as `PascalCase` is strictly reserved for React Components, Types, and Classes.
   - UI utilities and global singletons should follow established ecosystem conventions (e.g., `toast.add()` or `addToast()`).

<!-- End: Design rules -->

