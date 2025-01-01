import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import { reset } from "drizzle-seed";
import { users, bloodPressure } from "./schema";
import { pgTable, integer, text } from "drizzle-orm/pg-core";
import prand from 'pure-rand';
import { InferSelectModel } from "drizzle-orm";
import { subMonths } from "date-fns";

const seed = 42;
type BloodPressure = InferSelectModel<typeof bloodPressure>

console.log(env.DATABASE_URL)
const conn = postgres(env.DATABASE_URL);
const db = drizzle(conn);

await reset(db, { bloodPressure });

const generateRandomBloodPressureReadings = () => {
    const rng = prand.xoroshiro128plus(seed);
    const readings: BloodPressure[] = [];
    
    for (let i = 0; i < 100; i++) {
        const now = new Date();
        const randDate = new Date(prand.unsafeUniformIntDistribution(subMonths(now, 2).getTime(), now.getTime(), rng))
        readings.push({
            loggedByUserId: "a989cf00-ff8e-4824-b71a-5ef3a7befdf0",
            systolic: prand.unsafeUniformIntDistribution(100, 140, rng),
            diastolic: prand.unsafeUniformIntDistribution(70, 90, rng),
            pulse: prand.unsafeUniformIntDistribution(50, 90, rng),
            createdAt: randDate,
            updatedAt: randDate, 
            measuredAt: randDate
        } as BloodPressure);
    }

    return readings;
}
await db.insert(bloodPressure).values(generateRandomBloodPressureReadings())

console.log("Done seeding!")