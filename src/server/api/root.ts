import { tweetRouter } from "~/server/api/routers/tweet";
import { createTRPCRouter } from "~/server/api/trpc";
import { imagesRouter } from "./routers/images";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tweet: tweetRouter,
  images: imagesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
