# ORUN

Premium iOS-first Turkish social club app (Expo/React Native + Express API).

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API server (Express 5, port from `$PORT`)
- `pnpm --filter @workspace/mobile run dev` — Expo dev server (mobile app)
- `pnpm --filter @workspace/mockup-sandbox run dev` — component preview / canvas iframe host
- `pnpm run typecheck` — full typecheck across all workspace packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Required environment / secrets

Set via Replit Secrets (never commit, never put in `.replit` / `app.json` / source):

- `DATABASE_URL` — Postgres connection string
- `JWT_SECRET` — min 32 chars, used to sign auth tokens (server only)
- `CORS_ORIGINS` — **required in production**, comma-separated list of allowed origins
- `AI_INTEGRATIONS_OPENAI_API_KEY` / `AI_INTEGRATIONS_OPENAI_BASE_URL` — AI moderator
- `EXPO_PUBLIC_RC_API_KEY_IOS` — RevenueCat public iOS SDK key (mobile only)
- `REVENUECAT_SECRET_KEY` — RevenueCat REST API key (server / scripts only — never ship to client)
- `APPLE_ID`, `APPLE_TEAM_ID`, `ASC_API_KEY_ID`, `ASC_API_KEY_ISSUER_ID`, `ASC_APP_ID` — App Store Connect (EAS submit)
- `GITHUB_PERSONAL_ACCESS_TOKEN` — used by `scripts/github-sync-watch.py` to mirror commits to `gokhanuzun111/orun-app`

### Secret rotation policy

If `JWT_SECRET` was ever displayed in chat, committed, or pasted outside of Replit Secrets, treat it as **compromised**: generate a new value (`openssl rand -hex 48`), update the Replit Secret, redeploy the API server, and invalidate all existing sessions (`UPDATE sessions SET is_revoked = true`).

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5, JWT auth (`jsonwebtoken`), `bcrypt` (12 rounds), `express-rate-limit`
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Mobile: Expo SDK 54, expo-router, RevenueCat (`react-native-purchases` + `react-native-purchases-ui`)
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — Drizzle tables (`usersTable`, `sessionsTable`, `moderation`, `token_usage`, …)
- `artifacts/api-server/src/routes/` — Express route modules
- `artifacts/api-server/src/lib/auth.ts` — `requireAuth`, `requireAdmin`, session creation/revocation
- `artifacts/api-server/src/lib/tokenLimits.ts` — per-tier AI token quotas (`allowedForLevel`)
- `artifacts/mobile/services/revenuecat.ts` — single source of truth for RC SDK
- `artifacts/mobile/context/AppContext.tsx` — auth + RC identify + entitlement → `membershipLevel` sync
- `artifacts/mobile/app/profile/membership.tsx` — per-tier paywall trigger + SEÇKİN gating
- `lib/api-spec/openapi.yaml` — OpenAPI source of truth; run codegen after edits

## Architecture decisions

- Membership tiers: `0=ADAY` (free) · `1=ÜYE` (₺299/ay) · `2=MÜDAVİM` (₺899/ay) · `3=SEÇKİN` (₺1.399/ay, requires MÜDAVİM first — hybrid paywall + future server-side reputation gate).
- RevenueCat is the only source of truth for paid entitlement state; the mobile client subscribes to `customerInfoUpdateListener` and writes the resulting `membershipLevel` back into `AppContext` (handles both upgrades and downgrades).
- `/api/ai/chat` is **protected**: `requireAuth` + per-user rate limit (10 req/min) + server-side monthly token quota enforced by `allowedForLevel(user.membershipLevel)` — client-side limits are not trusted.
- CORS is strict in production: `CORS_ORIGINS` env var must be set, no wildcard `*.replit.dev` fallback. In development the Replit/Expo preview domains are allowed automatically.
- GitHub mirror is one-way: `scripts/github-sync-watch.py` pushes Replit checkpoints to `github.com/gokhanuzun111/orun-app` via REST tree API. Rate-limited 5000/hr per token; back-off is automatic.

## Product

ORUN is an invitation-feel Turkish social club app. Users join themed clubs (e.g. ÇAY MASASI, KİTAP KULÜBÜ), chat with members, and get AI-moderator answers tuned to each club's persona. Subscription tiers unlock more clubs, higher AI token quotas, and SEÇKİN-only spaces.

## User preferences

- Turkish-first UI copy. Tone: warm but refined, no emoji spam.
- Imperial blue brand color: `#1B3A6B`. iOS-first design language.
- Owner is non-technical; explanations should describe what they can now do, not how it was built.
- Never display or echo secret values back to the chat.

## Gotchas

- `drizzle-zod@0.8` returns Zod v4 schemas — schema files must `import { z } from "zod/v4"`, not `"zod"`, or `z.infer<…>` will fail typecheck.
- The mobile expo dev workflow occasionally shows "failed" because Metro waits on an interactive Expo Go login prompt; the bundle itself still compiles. Production builds go through EAS, not this workflow.
- Always run `pnpm --filter @workspace/api-spec run codegen` after editing `lib/api-spec/openapi.yaml` — otherwise mobile hooks drift from the server.
- `REVENUECAT_SECRET_KEY` is REST-only — never import it into any `artifacts/mobile/**` file.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
