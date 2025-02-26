import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import { reset, seed } from "drizzle-seed";
import { bloodPressure } from "./schema";
import { startOfWeek, startOfYear, subYears } from "date-fns";

console.log(env.DATABASE_URL);
const conn = postgres(env.DATABASE_URL);
const db = drizzle(conn);

await reset(db, { bloodPressure });
await seed(db, { bloodPressure }, { count: 100 }).refine((funcs) => ({
  bloodPressure: {
    columns: {
      loggedByUserId: funcs.valuesFromArray({
        values: ["d928f34a-de46-470d-8c95-369cd5490840"],
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
conn.end();
