# Contributing to NMAC

Thank you for your interest in contributing! This document covers everything you need to get your development environment set up, understand the codebase conventions, and submit quality pull requests.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Conventions](#project-conventions)
- [Convex Backend Guidelines](#convex-backend-guidelines)
- [Frontend Guidelines](#frontend-guidelines)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

Be respectful and constructive. Harassment, trolling, or personal attacks of any kind will not be tolerated.

---

## Getting Started

### Prerequisites

| Tool                                           | Version                           |
| ---------------------------------------------- | --------------------------------- |
| [Bun](https://bun.sh)                          | 1.2+                              |
| [Node.js](https://nodejs.org)                  | 20+ (for Convex CLI)              |
| [Git](https://git-scm.com)                     | Any recent version                |
| A [Convex](https://convex.dev) account         | Free tier is sufficient           |
| An [ElevenLabs](https://elevenlabs.io) account | Conversational AI access required |

### Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/<your-username>/nmac.git
cd nmac
bun install
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

Initialize Convex (this links a project and generates `convex/_generated/`):

```bash
npx convex dev
```

Set the required backend secret:

```bash
npx convex env set SECRET_KEY "your-local-dev-secret"
```

Start the development servers:

```bash
bun dev
```

The app runs at `http://localhost:3000`. Both the Vite frontend and Convex backend hot-reload on file changes.

---

## Development Workflow

### Branches

Use descriptive, kebab-case branch names prefixed by type:

```
feat/client-subscription-ui
fix/webhook-signature-validation
chore/upgrade-elevenlabs-sdk
docs/update-env-vars
```

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org):

```
feat: add credit deduction preview on client dashboard
fix: correctly cancel scheduled functions on unsubscribe
chore: update biome to 2.4.15
docs: document subscription tier credit values
refactor: extract getClient helper into utils.ts
test: add unit tests for encrypt/decrypt utilities
```

Keep commits atomic — one logical change per commit. Avoid mixing formatting changes with feature work.

### Running Checks Before Pushing

```bash
# Lint and format
bun lint

# Type check
tsc --noEmit

# Tests
bun test
```

Husky pre-commit hooks will run `biome check` automatically, but running the above manually before pushing avoids CI surprises.

---

## Project Conventions

### TypeScript

- Strict mode is enabled (`tsconfig.json`). Do not use `any` unless absolutely necessary — if you must, add a `// biome-ignore` comment explaining why.
- Prefer explicit return types on exported functions.
- Use Zod schemas for all form validation.

### File & Folder Naming

- Folders and files: `kebab-case`
- React components: `PascalCase` (filename matches component name)
- Convex mutation/query files: `camelCase` matching the entity they serve (e.g. `agents.ts`, `subscriptions.ts`)

### Styling

- Tailwind CSS v4 utility classes only — no inline styles, no CSS modules.
- Use the existing `cn()` utility (`src/lib/utils.ts`) for conditional class merging.
- Dark mode is handled by `next-themes` via the `dark:` variant.
- Follow the existing shadcn/ui component patterns when adding new UI primitives.

### State Management

- **Server state** (anything from Convex or ElevenLabs): TanStack Query + the custom `useQuery` cache layer in `src/cache/`.
- **Client/UI state**: `useState` / `useReducer` in the relevant component.
- Do not use external global state libraries (Zustand, Redux, etc.) unless discussed and agreed upon first.

### Forms

Use React Hook Form with Zod resolvers for all forms. Wrap inputs in the existing `FormField` / `FormItem` shadcn components.

---

## Convex Backend Guidelines

### Mutations vs Queries

- `query` — read-only, reactive, cached by Convex. Use for any data that the UI needs to display.
- `mutation` — write operations. All business logic that changes data lives here.
- `internalMutation` / `internalQuery` — for functions that should only be called from other Convex functions (not the client). Examples: `deduct`, `resetCredits`, `cleanSchedules`.

### Schema Changes

When adding or modifying tables in `convex/schema.ts`:

1. Add the new table/field definition.
2. Run `npx convex dev` — Convex will push the schema and regenerate `_generated/`.
3. Update relevant query/mutation files and types.
4. Never manually edit anything inside `convex/_generated/`.

### Password Handling

All passwords **must** be encrypted before storing using the `encrypt(value, secretKey)` helper in `convex/utils.ts`. Never store plaintext passwords. Always decrypt with `decrypt()` for comparison — never compare ciphertext directly.

### Scheduled Functions

When writing new scheduled logic, follow the pattern in `subscriptions.ts`:

- Use `ctx.scheduler.runAt(date, internal.module.fn, args)` for one-off jobs.
- Always implement a corresponding cancellation path (see `unSubscribeTier`).
- Make sure the `cleanSchedules` cron can identify and cancel orphaned jobs.

### HTTP Actions

The `/webhook` route in `convex/http.ts` is the only public HTTP endpoint. If adding new HTTP actions:

- Validate all incoming headers and bodies before processing.
- Return appropriate HTTP status codes.
- Keep handlers thin — delegate logic to internal mutations.

---

## Frontend Guidelines

### Routing

Routes live in `src/routes/` and follow [TanStack Router's file-based convention](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing). Route files export a `Route` constant. Never import routes by path string — use the generated `routeTree.gen.ts`.

### Authentication

Auth state comes from `src/context/auth-context.tsx`. The `useAuth()` hook returns the current user or client. Use the HOC wrappers in `src/hoc/` to guard routes — do not duplicate auth checks in individual components.

### ElevenLabs API Calls

All ElevenLabs API interactions go through TanStack Query options defined in `src/api/`. Use `useElevenLabsClient()` to get an initialized client using the authenticated user's API key. Mutation hooks live in `src/hooks/`.

### Adding a New Page

1. Create a file under the appropriate `src/routes/` directory.
2. Export a `Route` using `createFileRoute` or `createLazyFileRoute`.
3. Run `bun dev` — TanStack Router will regenerate `routeTree.gen.ts` automatically.
4. Add navigation links if needed in the sidebar component.

### Component Guidelines

- Keep components focused and small. Extract reusable pieces into `src/components/`.
- Use Radix UI primitives (already installed) for accessible interactive components.
- Animations should use Framer Motion — avoid raw CSS transitions for complex animations.
- Toast notifications use `sonner` — call `toast.success()`, `toast.error()`, etc.

---

## Submitting a Pull Request

1. Ensure your branch is up to date with `main`:

   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. Run all checks locally:

   ```bash
   bun lint && bun test
   ```

3. Push your branch and open a PR against `main`.

4. Fill in the PR template:

   - **What** — what does this change do?
   - **Why** — what problem does it solve or what feature does it add?
   - **How** — brief description of the approach taken.
   - **Testing** — how was this tested?
   - **Screenshots** — include UI screenshots or recordings for visual changes.

5. Request a review. Address feedback promptly and push fixup commits — do not force-push a branch that's already under review.

6. Once approved, squash-merge into `main` with a clean conventional commit message.

---

## Reporting Issues

Use [GitHub Issues](https://github.com/ihtesham510/nmac/issues). Please include:

- A clear, descriptive title.
- Steps to reproduce (for bugs).
- Expected vs actual behaviour.
- Relevant logs or screenshots.
- Your environment: OS, Bun version, browser (if UI-related).

For security vulnerabilities, do **not** open a public issue — contact the maintainer directly.
