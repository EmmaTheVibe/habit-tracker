# Habit Tracker PWA

**Live:** https://habit-tracker-hng.vercel.app/
**Repo:** https://github.com/EmmaTheVibe/habit-tracker

A mobile-first Progressive Web App for tracking daily habits, built with Next.js 16, React 19, TypeScript, and Tailwind CSS. All data is persisted locally via `localStorage`.

---

## Setup

```bash
git clone https://github.com/EmmaTheVibe/habit-tracker
cd habit-tracker
npm install
npx playwright install chromium
```

---

## Running the App

```bash
npm run dev
npm run build
npm run start
```

---

## Running Tests

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test
```

Coverage report is generated to `./coverage/` after `npm run test:unit`. Open `coverage/lcov-report/index.html` in a browser for the full visual breakdown.

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

## Coverage

```
All files      |   90.62 |    86.66 |     100 |   94.73 |
 auth.ts       |     100 |      100 |     100 |     100 |
 habits.ts     |     100 |      100 |     100 |     100 |
 slug.ts       |     100 |      100 |     100 |     100 |
 storage.ts    |   73.91 |       75 |     100 |      85 |
 streaks.ts    |     100 |    83.33 |     100 |     100 |
 validators.ts |     100 |      100 |     100 |     100 |
```

Full report: `coverage/lcov-report/index.html`

---

## Local Persistence

All state lives in `localStorage` under three keys:

| Key                     | Shape             | Purpose                     |
| ----------------------- | ----------------- | --------------------------- |
| `habit-tracker-users`   | `User[]`          | All registered accounts     |
| `habit-tracker-session` | `Session \| null` | Currently logged-in user    |
| `habit-tracker-habits`  | `Habit[]`         | All habits across all users |

Habits are filtered by `userId` so each user only sees their own. Completions are stored as `YYYY-MM-DD` strings.

---

## PWA

- **`public/manifest.json`** — name, short_name, start_url, display: standalone, theme/background color, icons
- **`public/sw.js`** — network-first service worker, caches static assets and app shell routes at runtime for offline support
- **`src/components/shared/ServiceWorkerRegistration.tsx`** — registers SW after mount via `useEffect`

To test offline: run `npm run build && npm run start`, visit all routes once, then DevTools → Application → Service Workers → Offline → reload.

---

## Project Structure

```
habit-tracker/
├── src/
│   ├── app/                          # Next.js App Router (server components)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
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
│   │   │   ├── HabitList.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── DeleteHabitModal.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardClient.tsx
│   │   │   └── DashboardWrapper.tsx
│   │   └── shared/
│   │       ├── SplashScreen.tsx
│   │       ├── SplashClient.tsx
│   │       ├── ProtectedRoute.tsx
│   │       ├── HillsBackground.tsx
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
│   ├── integration/
│   └── e2e/
├── vitest.config.js
├── vitest.integration.config.js
└── playwright.config.js
```

---

## TRD Mapping

| Section             | Implementation                                                      |
| ------------------- | ------------------------------------------------------------------- |
| §4 Routes           | `src/app/` — page.tsx, login, signup, dashboard                     |
| §5 Persistence      | `src/lib/storage.ts` — exact key names via `constants.ts`           |
| §6 Folder Structure | Matches spec; extra files added per "you may add more files" clause |
| §8 Types            | `src/types/auth.ts`, `src/types/habit.ts`                           |
| §9 Utilities        | `src/lib/` — exact exported function signatures                     |
| §10 UI Contract     | All `data-testid` attributes on correct elements                    |
| §11 Auth Behavior   | "User already exists" / "Invalid email or password"                 |
| §12 Habit Behavior  | Full CRUD with immutability, delete confirmation modal              |
| §13 PWA             | manifest.json, sw.js, icons, SW registration                        |
| §16 Tests           | All required describe blocks and exact test titles                  |
| §17 Coverage        | src/lib/\*\* ≥80% lines                                             |
| §18 Scripts         | dev, build, start, test:unit, test:integration, test:e2e, test      |

---

## Trade-offs

- **No password hashing** — plain text in localStorage, front-end only per spec
- **localStorage only** — no cross-device sync, clearing storage removes all data
- **Frequency always daily** — spec requires daily only, select is rendered but disabled
- **SSR + localStorage** — dashboard uses `next/dynamic` with `ssr: false` to avoid hydration mismatches
- **Offline in dev** — SW caching only works reliably on production build
