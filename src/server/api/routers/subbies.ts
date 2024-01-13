import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const subbieRouter = createTRPCRouter({
  createEntry: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        costs: z.string(),
        hours: z.string(),
      }),
    )
    .mutation(async ({ input: { name, costs, hours }, ctx }) => {
      return await ctx.db.subbieEntry.create({
        data: {
          name,
          costs,
          hours,
          userId: ctx.session.user.id,
        },
      });
    }),
});
