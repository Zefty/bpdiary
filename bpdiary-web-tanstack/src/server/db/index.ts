import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { serverEnv } from "../lib/serverEnv.ts";

const pool = new Pool({
	connectionString: serverEnv.DATABASE_URL_RUNTIME,
});
export const db = drizzle({ client: pool });
