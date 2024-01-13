import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  type WeeklyMappedData,
  mapTableData,
  subtractDaysFromWeek,
  getAustralianDateMidnight,
  getAustraliaDate,
} from "../utils/tableUtils";

type TableRouterReturn = {
  weeklyMappedData: WeeklyMappedData[];
  pastDate: {
    previousTwoMondays: Date;
    previousMonday: Date;
  };
  nextCursor:
    | {
        id: string;
        createdAt: Date;
      }
    | undefined;
};

export const tableRouter = createTRPCRouter({
  tableData: protectedProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
        limit: z.number().optional(),
      }),
    )
    .query(
      async ({ input: { cursor, limit }, ctx }): Promise<TableRouterReturn> => {
        const currentDay = getAustraliaDate(new Date());
        const pastDate = subtractDaysFromWeek(currentDay);

        const data = await ctx.db.tweet.findMany({
          take: limit ? limit + 1 : undefined,
          cursor: cursor ? { createdAt_id: cursor } : undefined,
          where: {
            AND: [
              { costs: { not: null ?? "" } },
              { hours: { not: null ?? "" } },
              {
                createdAt: {
                  lte: currentDay,
                  gte: pastDate.previousTwoMondays,
                },
              },
            ],
          },
          select: {
            id: true,
            costs: true,
            createdAt: true,
            hours: true,
            user: {
              select: { name: true, id: true },
            },
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
          weeklyMappedData: mapTableData(data, pastDate.previousMonday),
          pastDate,
          nextCursor,
        };
      },
    ),

  subbieData: protectedProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
        limit: z.number().optional(),
      }),
    )
    .query(
      async ({ input: { cursor, limit }, ctx }): Promise<TableRouterReturn> => {
        const currentDay = getAustraliaDate(new Date());
        const pastDate = subtractDaysFromWeek(currentDay);

        const data = await ctx.db.subbieEntry.findMany({
          take: limit ? limit + 1 : undefined,
          cursor: cursor ? { createdAt_id: cursor } : undefined,
          where: {
            createdAt: {
              lte: currentDay,
              gte: pastDate.previousTwoMondays,
            },
          },
          select: {
            id: true,
            costs: true,
            createdAt: true,
            hours: true,
            name: true,
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
          weeklyMappedData: mapTableData(data, pastDate.previousMonday),
          pastDate,
          nextCursor,
        };
      },
    ),
});
