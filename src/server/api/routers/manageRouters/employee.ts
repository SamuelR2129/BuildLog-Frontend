import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const manageEmployeesRouter = createTRPCRouter({
  getEmployees: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return {
      employees: data,
    };
  }),

  updateEmployee: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async ({ input: { id, name, email }, ctx }) => {
      return await ctx.db.user.update({
        where: {
          id,
        },
        data: {
          name,
          email,
        },
      });
    }),

  deleteEmployee: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input: { id }, ctx }) => {
      await ctx.db.user.delete({
        where: {
          id,
        },
      });
    }),

  createEmployee: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async ({ input: { name, email }, ctx }) => {
      return await ctx.db.user.create({
        data: {
          name,
          email,
        },
      });
    }),
});
