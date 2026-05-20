# VJ Piles UG

A serverless movie/series/animation streaming platform powered entirely by Firebase — no backend server.

## Run & Operate

- `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/omnisave run dev` — run the Vue frontend (port 5000)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Vue 3 + Vue Router + Vite
- Styling: Tailwind CSS v4
- Backend: **Firebase only** (Auth + Realtime Database + Storage)
- **No Express server. No PostgreSQL. Fully serverless.**

## Where things live

- `artifacts/omnisave/` — the Vue 3 frontend (the entire app)
- `artifacts/omnisave/src/lib/firebase.ts` — Firebase initialization (hardcoded config)
- `artifacts/omnisave/src/store/db.ts` — all Firebase Realtime Database listeners & CRUD
- `artifacts/omnisave/src/store/auth.ts` — Firebase Auth (email/password + Google)
- `artifacts/omnisave/src/views/` — page views (Home, Movies, Series, Animation, Admin)
- `artifacts/omnisave/src/views/admin/` — admin dashboard tabs

## Firebase data paths

- `/movies` — movie catalog
- `/series` — TV series with nested episodes
- `/animation` — animation content
- `/carousel` — homepage hero carousel slides
- `/users` — user profiles (name/displayName, email, joinedAt, lastLogin)
- `/subscriptions` — active user subscription plans
- `/paymentLogs` — payment transaction history

## Architecture decisions

- **Firebase Realtime Database only** — no Firestore, no PostgreSQL, no backend API
- **Serverless** — the Vue app runs in the browser and talks directly to Firebase
- **Firebase config hardcoded** in `firebase.ts` (client-side keys, safe by design)
- `db.ts` uses `onValue` for real-time listeners; exports reactive Vue `ref`s consumed by all views
- Transactions tab merges `/paymentLogs` + `/subscriptions` to show all payment activity
- Status normalization: Firebase may store `completed`/`success`/`successful` — all normalized to `Successful`

## Admin access

- Admin check: `currentUser.email === 'okotstephen57@gmail.com'`
- Route: `/admin`

## User preferences

- Firebase config must remain hardcoded (not env vars) — Vite does not expose env vars correctly at runtime in this setup
- No backend server — keep everything serverless/Firebase-only
