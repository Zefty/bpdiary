import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { bloodPressureRouter } from "./routers/blood-pressure";
import { settingRouter } from "./routers/setting";
import { sessionRouter } from "./routers/session";
import { feedRouter } from "./routers/feed";
import { calendarRouter } from "./routers/calendar";
import { chartRouter } from "./routers/chart";
import { reminderRouter } from "./routers/reminder";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  bloodPressure: bloodPressureRouter,
  setting: settingRouter,
  session: sessionRouter,
  feed: feedRouter,
  calendar: calendarRouter,
  chart: chartRouter,
  reminder: reminderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
