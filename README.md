# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits, built with Next.js 16, React 19, TypeScript, and Tailwind CSS. All data is persisted locally via `localStorage` — no backend required.

---

## Setup

```bash
# Clone the repo
git clone <your-repo-url>
cd habit-tracker

# Install dependencies
npm install

# Install Playwright browsers (for e2e tests)
npx playwright install chromium
```

---

## Running the App

```bash
# Development server
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm run start
```

---

## Running Tests

```bash
# Unit tests (lib/) with coverage report
npm run test:unit

# Integration / component tests
npm run test:integration

# End-to-end tests (requires dev server running)
npm run test:e2e

# Run all tests
npm run test
```

Coverage report is written to `./coverage/` after `npm run test:unit`.

---

## Test File Map

| File                                    | Describe block           | What it verifies                                                                                                                       |
| --------------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/unit/slug.test.ts`               | `getHabitSlug`           | Slug generation: lowercase, hyphenation, trimming, special-char removal, consecutive hyphen collapse                                   |
| `tests/unit/validators.test.ts`         | `validateHabitName`      | Empty input, >60 char rejection, valid trimmed value                                                                                   |
| `tests/unit/streaks.test.ts`            | `calculateCurrentStreak` | Empty completions, today-not-complete, consecutive days, duplicates, broken streaks                                                    |
| `tests/unit/habits.test.ts`             | `toggleHabitCompletion`  | Add date, remove date, no mutation, no duplicates                                                                                      |
| `tests/unit/storage.test.ts`            | `storage`                | localStorage round-trips for users, session, habits; clearSession                                                                      |
| `tests/unit/auth.test.ts`               | `auth`                   | signUp creates user+session, duplicate email error, logIn success, invalid credentials error, logOut clears session                    |
| `tests/integration/auth-flow.test.tsx`  | `auth flow`              | Signup creates session, duplicate email error, login stores session, invalid-credentials error                                         |
| `tests/integration/habit-form.test.tsx` | `habit form`             | Empty-name validation, create renders card, edit preserves immutable fields, delete requires confirmation, toggle updates streak       |
| `tests/e2e/app.spec.ts`                 | `Habit Tracker app`      | Full user journeys: splash redirect, auth guard, signup, login, habit CRUD, streak toggle, persistence on reload, logout, PWA manifest |

---

## Coverage Results

```
All files      |   90.62 |    86.66 |     100 |   94.73 |
 auth.ts       |     100 |      100 |     100 |     100 |
 habits.ts     |     100 |      100 |     100 |     100 |
 slug.ts       |     100 |      100 |     100 |     100 |
 storage.ts    |   73.91 |       75 |     100 |      85 |
 streaks.ts    |     100 |    83.33 |     100 |     100 |
 validators.ts |     100 |      100 |     100 |     100 |
```

---

## Local Persistence Structure

All state lives in `localStorage` under three keys:

| Key                     | Shape             | Purpose                      |
| ----------------------- | ----------------- | ---------------------------- |
| `habit-tracker-users`   | `User[]`          | All registered user accounts |
| `habit-tracker-session` | `Session \| null` | The currently logged-in user |
| `habit-tracker-habits`  | `Habit[]`         | All habits across all users  |

**User:** `{ id, email, password, createdAt }`
**Session:** `{ userId, email }`
**Habit:** `{ id, userId, name, description, frequency, createdAt, completions: string[] }`

Habits are filtered by `userId` on the dashboard so each user only sees their own. Completions are stored as `YYYY-MM-DD` ISO date strings.

---

## PWA Implementation

- **`public/manifest.json`** — declares `name`, `short_name`, `start_url`, `display: standalone`, `theme_color`, `background_color`, and icons for 192×192 and 512×512.
- **`public/sw.js`** — service worker using a network-first strategy. Only caches static assets (`manifest.json`, icons) to avoid caching Next.js server-rendered routes which cannot be `addAll`'d.
- **`components/shared/ServiceWorkerRegistration.tsx`** — a `'use client'` component that registers the SW via `useEffect` after mount, avoiding the React script tag warning.

### Note on Offline Testing

Offline simulation via Playwright's `setOffline` blocks all network including localhost, making it incompatible with a dev server. The offline e2e test instead verifies:

1. `serviceWorker` API is available in the browser
2. The PWA manifest link is correctly injected in the HTML

For true offline testing, build the app (`npm run build && npm run start`) and test against the production server.

---

## Project Structure

```
habit-tracker/
├── app/                        # Next.js App Router pages (server components)
│   ├── layout.tsx
│   ├── page.tsx                # Splash + redirect
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── dashboard/page.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx       # 'use client'
│   │   └── SignupForm.tsx      # 'use client'
│   ├── habits/
│   │   ├── HabitCard.tsx       # 'use client'
│   │   ├── HabitForm.tsx       # 'use client'
│   │   └── HabitList.tsx       # 'use client'
│   ├── dashboard/
│   │   ├── DashboardWrapper.tsx # 'use client' — holds dynamic import
│   │   └── DashboardClient.tsx  # 'use client' — all dashboard logic
│   └── shared/
│       ├── SplashScreen.tsx
│       ├── SplashClient.tsx    # 'use client'
│       └── ServiceWorkerRegistration.tsx # 'use client'
├── lib/                        # Pure utility functions (fully tested)
│   ├── auth.ts
│   ├── habits.ts
│   ├── slug.ts
│   ├── storage.ts
│   ├── streaks.ts
│   └── validators.ts
├── types/
│   ├── auth.ts
│   └── habit.ts
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
├── tests/
│   ├── setup.ts
│   ├── unit/                   # vitest — lib functions
│   ├── integration/            # vitest + RTL — components
│   └── e2e/                    # Playwright — full app
├── vitest.config.js
├── vitest.integration.config.js
└── playwright.config.js
```

---

## Trade-offs and Limitations

- **No password hashing** — passwords stored in plain text in `localStorage`. Front-end only per spec. Do not use in production.
- **localStorage only** — data does not sync across devices or browsers.
- **Frequency is always `daily`** — only daily frequency required for Stage 3. The select is rendered but disabled.
- **Offline in dev** — SW caching works fully in production build. Dev server (Turbopack) does not support SW caching reliably.
