# BP Diary

This is a simple and user-friendly hobby project designed to help you
keep tabs on your blood pressure without hassle.
<br />
<br />
Whether you're monitoring for health reasons or just staying
informed, this tool makes it easy to record your readings, view trends,
and gain insights into your cardiovascular health.
<br />
<br />
Stay on top of your wellness with effortless tracking and keep things in
check!
<br />
<br />

![BP Diary Dashboard](/images/dashboard.png)

## Tools & Techologies Used

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

BP Diary is built with the following technologies:

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [ShadCN](https://ui.shadcn.com)
- [Supabase](https://supabase.com)

## How to Run Project

1. Go to `bpdiary-web-next15` and create a `.env` with the following environment variables

```
BASE_URL="http://localhost:3000"

# Drizzle
DATABASE_URL_APP_RUNTIME="~~~"
DATABASE_URL_DB_BUILD="~~~"

# NextAuth
AUTH_TRUST_HOST="http://localhost:3000"
AUTH_SECRET="~~~"
GITHUB_CLIENT_ID="~~~"
GITHUB_CLIENT_SECRET="~~~"
DISCORD_CLIENT_ID="~~~"
DISCORD_CLIENT_SECRET="~~~"
```

2. Run `./start-database.sh` to startup local postgres db (make sure docker is running)
3. Run `npm run db:push` to push drizzle schemas to local postgres db
4. Run `npm run dev` to start local development server
5. Run `npm run db:seed` to seed database (optional)
