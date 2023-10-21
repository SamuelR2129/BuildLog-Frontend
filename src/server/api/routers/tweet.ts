import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      return await ctx.db.tweet.create({
        data: { content, userId: ctx.session.user.id },
      });
    }),

  // getLatest: protectedProcedure.query(({ ctx }) => {
  //   return ctx.db.tweet.findFirst({
  //     orderBy: { createdAt: "desc" },
  //     where: { createdBy: { id: ctx.session.user.id } },
  //   });
  // }),
});