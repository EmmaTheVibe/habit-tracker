# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits, built with Next.js 16, React 19, TypeScript, and Tailwind CSS. All data is persisted locally via `localStorage` — no backend required.

---

## Project Overview

Users can sign up, log in, create and manage daily habits, mark habits complete, view streaks, and install the app on their device. All state is local and deterministic — no server, no database.

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

# Production build
npm run build
npm run start
```

---

## Running Tests

```bash
# Unit tests with coverage report
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
| `tests/integration/auth-flow.test.tsx`  | `auth flow`              | Signup creates session, duplicate email error, login stores session, invalid credentials error                                         |
| `tests/integration/habit-form.test.tsx` | `habit form`             | Empty-name validation, create renders card, edit preserves immutable fields, delete requires confirmation, toggle updates streak       |
| `tests/e2e/app.spec.ts`                 | `Habit Tracker app`      | Full user journeys: splash redirect, auth guard, signup, login, habit CRUD, streak toggle, persistence on reload, logout, PWA manifest |

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
- **`public/sw.js`** — service worker using a network-first strategy. Caches static assets (`manifest.json`, icons) on install. Falls back to cache when offline.
- **`src/components/shared/ServiceWorkerRegistration.tsx`** — a `'use client'` component that registers the SW via `useEffect` after mount, placed in the root layout.

### Offline Behavior

The service worker caches static assets on install. After the first load, the app shell is available offline. Dynamic data (habits, session) lives in `localStorage` which is always available client-side.

For full offline testing, use the production build:

```bash
npm run build && npm run start
```

Then in Chrome DevTools → Application → Service Workers → tick Offline → reload.

---

## Project Structure

```
habit-tracker/
├── src/
│   ├── app/                          # Next.js App Router pages (server components)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Splash + redirect
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── dashboard/page.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── habits/
│   │   │   ├── HabitCard.tsx
│   │   │   ├── HabitForm.tsx
│   │   │   └── HabitList.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardClient.tsx
│   │   │   └── DashboardWrapper.tsx
│   │   └── shared/
│   │       ├── SplashScreen.tsx
│   │       ├── SplashClient.tsx
│   │       ├── ProtectedRoute.tsx
│   │       └── ServiceWorkerRegistration.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── constants.ts
│   │   ├── habits.ts
│   │   ├── slug.ts
│   │   ├── storage.ts
│   │   ├── streaks.ts
│   │   └── validators.ts
│   └── types/
│       ├── auth.ts
│       └── habit.ts
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── tests/
│   ├── setup.ts
│   ├── unit/
│   │   ├── slug.test.ts
│   │   ├── validators.test.ts
│   │   ├── streaks.test.ts
│   │   └── habits.test.ts
│   ├── integration/
│   │   ├── auth-flow.test.tsx
│   │   └── habit-form.test.tsx
│   └── e2e/
│       └── app.spec.ts
├── vitest.config.js
├── vitest.integration.config.js
└── playwright.config.js
```

---

## Implementation Notes

### How This Maps to the TRD

| TRD Section             | Implementation                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------- |
| §4 Route Contract       | `src/app/page.tsx`, `login/page.tsx`, `signup/page.tsx`, `dashboard/page.tsx`          |
| §5 Persistence Contract | `src/lib/storage.ts` — exact key names via `src/lib/constants.ts`                      |
| §6 Folder Structure     | Matches spec exactly; additional files added per "you may add more files" clause       |
| §8 Type Contracts       | `src/types/auth.ts`, `src/types/habit.ts` — exact exported shapes                      |
| §9 Utility Contracts    | `src/lib/slug.ts`, `validators.ts`, `streaks.ts`, `habits.ts` — exact signatures       |
| §10 UI Contract         | All `data-testid` attributes on correct elements                                       |
| §11 Auth Behavior       | Duplicate email → "User already exists"; bad credentials → "Invalid email or password" |
| §12 Habit Behavior      | Create/edit/delete/toggle all implemented with immutability and confirmation           |
| §13 PWA Contract        | `manifest.json`, `sw.js`, icons, SW registered in layout                               |
| §16 Test Suite          | All required describe blocks and exact test titles present                             |
| §17 Coverage            | `src/lib/**` covered at ≥80% lines                                                     |
| §18 Package Scripts     | All required script names present and working                                          |

---

## Trade-offs and Limitations

- **No password hashing** — passwords stored in plain text in `localStorage`. Front-end only per spec. Do not use in production.
- **localStorage only** — data does not sync across devices or browsers. Clearing browser storage removes all accounts and habits.
- **Frequency is always `daily`** — only daily frequency is required for Stage 3. The frequency select is rendered but disabled.
- **Offline in dev** — Turbopack dev server does not support service worker caching reliably. Test offline behavior against the production build.
- **SSR + localStorage** — dashboard uses `next/dynamic` with `ssr: false` to avoid hydration mismatches when reading localStorage on the client.
