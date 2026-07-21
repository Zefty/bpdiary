import { defineConfig } from "drizzle-kit";
import { serverEnv } from "@/server/lib/serverEnv";

export default defineConfig({
	dialect: "postgresql",
	dbCredentials: {
		url: serverEnv.DATABASE_URL_BUILDTIME,
	},
	schema: "./src/server/db/schema/index.ts",
	tablesFilter: ["bpdiary_*"],
	out: `./src/server/db/migrations/${serverEnv.DEPLOYMENT_ENV}`,
});
