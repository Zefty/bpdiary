import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import { seed } from "drizzle-seed";
import { bloodPressure } from "./schema";
import { pgTable, integer, text } from "drizzle-orm/pg-core";

console.log(env.DATABASE_URL)
const conn = postgres(env.DATABASE_URL);
const db = drizzle(conn);
await seed(db, { bloodPressure }).refine((s) => ({
    bloodPressure: {
        count: 100,
        columns: {
            id: s.intPrimaryKey(),
            systolic: s.int({
                minValue: 100,
                maxValue: 140,
                isUnique: true,
            }),
            diastolic: s.int({
                minValue: 70,
                maxValue: 90,
                isUnique: true,
            }),
            pulse: s.int({
                minValue: 60,
                maxValue: 90,
                isUnique: true,
            }),
            loggedByUserId: s.default({defaultValue: "af61f135-b3e7-4fd6-9038-fef05abeb34f"})
        }
    }
}));