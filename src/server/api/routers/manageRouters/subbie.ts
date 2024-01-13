import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

type SubbieRouterReturn = {
  subbies: {
    id: string;
    subbieName: string;
    createdAt: Date;
  }[];
  nextCursor:
    | {
        id: string;
        createdAt: Date;
      }
    | undefined;
};

type Subbie = {
  id: string;
  userId: string;
  createdAt: Date;
  subbieName: string;
};

export const manageSubbieRouter = createTRPCRouter({
  getSubbies: protectedProcedure
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
      }): Promise<SubbieRouterReturn> => {
        const data = await ctx.db.subbie.findMany({
          take: limit ? limit + 1 : undefined,
          cursor: cursor ? { createdAt_id: cursor } : undefined,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            subbieName: true,
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
          subbies: data,
          nextCursor,
        };
      },
    ),

  updateSubbie: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input: { id, content }, ctx }): Promise<Subbie> => {
      return await ctx.db.subbie.update({
        where: {
          id: id,
        },
        data: {
          subbieName: content,
        },
      });
    }),

  deleteSubbie: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input: { id }, ctx }) => {
      await ctx.db.subbie.delete({
        where: {
          id: id,
        },
      });
    }),

  createSubbie: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      }),
    )
    .mutation(async ({ input: { content }, ctx }) => {
      return await ctx.db.subbie.create({
        data: {
          subbieName: content,
          userId: ctx.session.user.id,
        },
      });
    }),
});
