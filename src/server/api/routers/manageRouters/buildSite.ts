import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

type BuildSiteRouterReturn = {
  buildSites: {
    id: string;
    buildSite: string;
    createdAt: Date;
  }[];
  nextCursor:
    | {
        id: string;
        createdAt: Date;
      }
    | undefined;
};

type BuildSite = {
  id: string;
  userId: string;
  createdAt: Date;
  buildSite: string;
};

export const buildSiteRouter = createTRPCRouter({
  getSites: protectedProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
        limit: z.number().optional(),
      }),
    )
    .query(
      async ({
        input: { cursor, limit },
        ctx,
      }): Promise<BuildSiteRouterReturn> => {
        const data = await ctx.db.buildSite.findMany({
          take: limit ? limit + 1 : undefined,
          cursor: cursor ? { createdAt_id: cursor } : undefined,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            buildSite: true,
            createdAt: true,
          },
        });

        let nextCursor: typeof cursor | undefined;

        if (limit && data.length > limit) {
          const nextItem = data.pop();
          if (nextItem) {
            nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
          }
        }

        return {
          buildSites: data,
          nextCursor,
        };
      },
    ),

  updateSite: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input: { id, content }, ctx }): Promise<BuildSite> => {
      return await ctx.db.buildSite.update({
        where: {
          id: id,
        },
        data: {
          buildSite: content,
        },
      });
    }),

  deleteSite: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input: { id }, ctx }) => {
      await ctx.db.buildSite.delete({
        where: {
          id: id,
        },
      });
    }),
});
