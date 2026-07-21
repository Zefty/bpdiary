# BP Diary — TanStack Start

The modern TanStack Start rewrite of BP Diary. This sibling application is designed to run alongside `bpdiary-web-next15` while the migration is verified.

## What is included

- TanStack Start and file-based TanStack Router routes
- TanStack Query SSR integration
- Better Auth with email/password and optional Google OAuth
- Drizzle ORM with deployment-specific PostgreSQL schemas
- Blood pressure measurement create, edit, delete, history, trend chart, and CSV export
- Measurement and medication reminders
- Profile, timezone, and appearance settings
- Responsive desktop and mobile application shells

## Local setup

1. Copy `.env.example` to `.env` and set `BETTER_AUTH_SECRET`.
2. Start PostgreSQL with `docker compose up -d`.
3. Install dependencies with `pnpm install`.
4. Apply the development migration with `pnpm db:migrate`.
5. Run the app with `pnpm dev`.

The database objects are isolated in a `bpdiary_<environment>` PostgreSQL schema, so this app does not overwrite the existing Next.js tables during migration.

## Useful checks

```sh
pnpm check
pnpm test
pnpm build
```

BP Diary is a personal record-keeping tool and is not a medical device or a replacement for professional care.
