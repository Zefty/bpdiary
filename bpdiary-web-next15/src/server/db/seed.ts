import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import { reset, seed } from "drizzle-seed";
import { bloodPressure, users } from "./schema";
import { startOfYear } from "date-fns";

console.log(env.DATABASE_URL);
const conn = postgres(env.DATABASE_URL);
const db = drizzle(conn);

const userIds = (await db.select().from(users)).map((user) => user.id);
console.log(userIds);

await reset(db, { bloodPressure });
await seed(db, { bloodPressure }, { count: 100 }).refine((funcs) => ({
  bloodPressure: {
    columns: {
      loggedByUserId: funcs.valuesFromArray({
        values: userIds,
      }),
      systolic: funcs.int({ minValue: 100, maxValue: 160 }),
      diastolic: funcs.int({ minValue: 70, maxValue: 90 }),
      pulse: funcs.int({ minValue: 60, maxValue: 100 }),
      measuredAt: funcs.date({
        maxDate: new Date(),
        minDate: startOfYear(new Date()),
      }),
    },
  },
}));

console.log("Done seeding!");
await conn.end();
