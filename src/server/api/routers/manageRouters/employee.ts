import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createAuth0User,
  deleteAuth0User,
  updateAuth0User,
} from "~/server/auth0";

type UpdateOptions = {
  email: string;
  name: string;
  password?: string;
  app_metadata: { admin: boolean };
  connection: "Username-Password-Authentication";
};

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
        admin: true,
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
        password: z.string().optional(),
        admin: z.boolean(),
      }),
    )
    .mutation(async ({ input: { id, name, email, password, admin }, ctx }) => {
      const auth0Options: UpdateOptions = {
        email,
        name,
        app_metadata: { admin },
        connection: "Username-Password-Authentication",
      };

      if (password) auth0Options.password = password;

      await updateAuth0User(JSON.stringify(auth0Options), id);

      return await ctx.db.user.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          admin,
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
      await deleteAuth0User(id);

      await ctx.db.user.delete({
        where: {
          id,
        },
      });
    }),

  createEmployee: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(1),
        passwordVerifier: z.string().min(1),
        admin: z.boolean(),
      }),
    )
    .mutation(
      async ({
        input: { name, email, password, passwordVerifier, admin },
        ctx,
      }) => {
        if (password !== passwordVerifier) {
          throw new Error("The password needs to match the passwordVerifier");
        }

        const data = JSON.stringify({
          email,
          name,
          password,
          app_metadata: { admin },
          connection: "Username-Password-Authentication",
        });

        const authRes = await createAuth0User(data);

        if (authRes instanceof Error) throw new Error(authRes.message);
      },
    ),
});
